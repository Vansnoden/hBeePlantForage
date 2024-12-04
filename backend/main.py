# -*- coding: utf-8 -*-

from datetime import timedelta, timezone, datetime
import math
import os, json, time
from pathlib import Path
from typing import Annotated, List
from fastapi import Depends, FastAPI, HTTPException, status, File, UploadFile
from fastapi.security import OAuth2PasswordBearer
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from database.utils import excel_to_csv, get_uuid
from database.schemas import User, FileBase
from passlib.context import CryptContext
from jose import JWTError, jwt
from fastapi.middleware.cors import CORSMiddleware
from database import crud, models, schemas
from database.database import SessionLocal, engine
from sqlalchemy.orm import Session
from fastapi.responses import FileResponse, JSONResponse
from fastapi.encoders import jsonable_encoder
from slugify import slugify
import logging
import sys
import random
from random import randrange
from sqlalchemy.sql import text
from queries import *

logger = logging.getLogger('uvicorn.error')
logger.setLevel(logging.DEBUG)
if sys.version_info[0] >= 3:
    unicode = str


SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30 * 3600 * 24
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))

ITEMS_PER_PAGE = 10

app = FastAPI()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

origins = [
    "localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class UserInDB(User):
    hashed_password: str


class TokenData(BaseModel):
    username: str | None = None


class Token(BaseModel):
    access_token: str
    token_type: str


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def authenticate_user(db, username: str, password: str):
    user = crud.get_user_by_username(db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = crud.get_user_by_username(db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)]
):
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


def validate_user(user: User):
    if user.username and user.email and user.password:
        return True
    else:
        return False


# users
@app.post("/users", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    if validate_user(user):
        return crud.create_user(db=db, user=user)


@app.get("/users/", response_model=list[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users


@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@app.post("/token")
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: Session = Depends(get_db)
) -> Token:
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")


@app.get("/users/details/me")
async def read_users_me(current_user: Annotated[User, Depends(get_current_active_user)]):
    return current_user


@app.post("/users/delete/{user_id}")
async def delete_user(user: Annotated[User, Depends(get_current_active_user)], db: Session = Depends(get_db)):
    if user:
        response = crud.delete_user(db, user_id=user.id)
        if response is None:
            raise HTTPException(status_code=404, detail="User not found")
        return response
    else:
        raise HTTPException(status_code=403, detail="Unauthorized action")


# upload data
@app.post("/data/upload")
def upload_data_file( 
    user: Annotated[User, Depends(get_current_active_user)],
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db)):
    res = False
    if user:
        for file in files:
            try:
                contents = file.file.read().decode(encoding='utf-8')
                # logger.debug(f'#### DEBUG + {contents}')
                extension = os.path.basename(file.filename).split('.')[1]
                computed_filename = os.path.join(ROOT_DIR, f"uploads/{get_uuid()}.{extension}")
                csv_path = ""
                with open(computed_filename, "w", encoding='utf-8', errors='replace') as f:
                    f.write(contents)
                if extension == "xlsx":
                    basename = os.path.basename(computed_filename).split('.')[0]
                    csv_path = os.path.join(ROOT_DIR, f"temp/{basename}.csv")
                    excel_to_csv(computed_filename, target=csv_path)
                else:
                   csv_path = computed_filename
                res = crud.upload_data_from_file(csv_path, db)
            except Exception as e:
                return {"message": f"There was an error uploading the file(s) \n ---- {e}"}
            finally:
                file.file.close()
        return {"message": f"Successfuly uploaded {[file.filename for file in files]}" if res else "Failure uploading Files"}   
    else:
        raise HTTPException(status_code=403, detail="Unauthorized access")


@app.get("/data/get")
def get_data_file( 
    user: Annotated[User, Depends(get_current_active_user)],
    db: Session = Depends(get_db), query="", page=1, limit=100000):
    res = {
        "total_pages": 0,
        "page":page,
        "data":[]
    }
    offset = (int(page) - 1) * int(ITEMS_PER_PAGE)

    if user:
        plant_summary_data_query = text(QUERY_PLANT_SUMMARY_DATA.format(items_per_page=ITEMS_PER_PAGE, offset=offset))
        plant_summary_data_count_query = text( QUERY_COUNT_PLANT_SUMMARY_DATA.format(limit=limit))
        if query:
            plant_summary_data_query = text(QUERY_PLANT_SUMMARY_DATA_FILTERED.format(query=query, items_per_page=ITEMS_PER_PAGE, offset=offset))
            plant_summary_data_count_query = text(QUERY_COUNT_PLANT_SUMMARY_DATA_FILTERED.format(query=query, limit=limit))
        datarows = db.execute(plant_summary_data_query)
        for row in datarows:
            res["data"].append(dict(row._mapping))
        datarows_count = db.execute(plant_summary_data_count_query)
        for row in datarows_count:
            res["total_pages"] = math.floor((dict(row._mapping)["count"]) / ITEMS_PER_PAGE)
        return res
    else:
        raise HTTPException(status_code=403, detail="Unauthorized access")


def generate_colors(limit=0):
    bgcolor = []
    border_color = []
    for i in list(range(limit)):
        red = randrange(255)
        green = randrange(255)
        blue = randrange(255)
        bgcolor.append(
            f"rgba({red}, {green}, {blue}, 0.2)"
        )
        border_color.append(
            f"rgba({red}, {green}, {blue}, 1)"
        )
    return bgcolor, border_color



# get dashboard data
@app.get("/data/dashboard")
def get_dashboard_data( 
    user: Annotated[User, Depends(get_current_active_user)],
    db: Session = Depends(get_db)):
    res = {}
    if user:
        res["total_plants"] = db.query(models.PlantSpecie).count()
        res["total_sites"] = db.query(models.Site).count()
        # top 10 most reorted species
        top_10_plants_labels = []
        top_10_plants_values = []
        query_top_10 = text(QUERY_TOP_10_MOST_REPORTED_PLANTS)
        top_10_data = db.execute(query_top_10)
        for rec in top_10_data:
            top_10_plants_labels.append(rec[2])
            top_10_plants_values.append(rec[0])
        top10bgColor, top10borderColor = generate_colors(len(top_10_plants_values))
        res["top_10_plants"] = {
                "labels": top_10_plants_labels,
                "datasets": [
                    {
                        "label": 'Top 10 Most Observed Plants',
                        "data": top_10_plants_values,
                        "backgroundColor": top10bgColor,
                        "borderColor": top10borderColor,
                        "borderWidth": 1,
                    },
                ],
            }
        
        # monthly distro of observations
        obs_montly_distro_labels = []
        obs_montly_distro_values = []
        query_obs_montly_distro = text(QUERY_MONTHLY_OBS_DISTRO)
        obs_montly_distro_data = db.execute(query_obs_montly_distro)
        for rec in obs_montly_distro_data:
            obs_montly_distro_labels.append(rec[1])
            obs_montly_distro_values.append(rec[0])
        obsmbgColor, obsmborderColor = generate_colors(len(obs_montly_distro_values))
        res["obs_montly_distro"] = {
                "labels": obs_montly_distro_labels,
                "datasets": [
                    {
                        "label": 'Monthly Distribution of Observations',
                        "data": obs_montly_distro_values,
                        "backgroundColor": obsmbgColor,
                        "borderColor": obsmborderColor,
                        "borderWidth": 1,
                    },
                ],
            }
        # 10 years span observations
        obs_10_year_overview_labels = []
        obs_10_year_overview_values = []
        query_obs_10_year_overview = text(QUERY_OBS_YEARLY_OVERVIEW.format(year_start="2015", year_end="2025"))
        obs_10_year_overview_data = db.execute(query_obs_10_year_overview)
        for rec in obs_10_year_overview_data:
            obs_10_year_overview_labels.append(rec[1])
            obs_10_year_overview_values.append(rec[0])
        obs_10bgColor, obs_10borderColor = generate_colors(len(obs_10_year_overview_values))
        res["obs_10_year_overview"] = {
                "labels": obs_10_year_overview_labels,
                "datasets": [
                    {
                        "label": 'Last 10 Years Observations Overview',
                        "data": obs_10_year_overview_values,
                        "backgroundColor": obs_10bgColor,
                        "borderColor": obs_10borderColor,
                        "borderWidth": 1,
                    },
                ],
            }
        # total sites per country
        sites_per_country_labels = []
        sites_per_country_values = []
        query_site_per_country = text("""select count(id), country from sites where country != '' group by country""")
        sites_per_country = db.execute(query_site_per_country)
        for rec in sites_per_country:
            sites_per_country_labels.append(rec[1])
            sites_per_country_values.append(rec[0])
        spcbgColor, spcborderColor = generate_colors(len(sites_per_country_values))
        res["sites_per_country"] = {
                "labels": sites_per_country_labels,
                "datasets": [
                    {
                        "label": 'Observation sites per country',
                        "data": sites_per_country_values,
                        "backgroundColor": spcbgColor,
                        "borderColor": spcborderColor,
                        "borderWidth": 1,
                    },
                ],
            }
        return res  
    else:
        raise HTTPException(status_code=403, detail="Unauthorized access")


def get_country_geo_json(country_name):
    random_file=random.choice(os.listdir("world.geo.json-master/countries"))
    data = {}
    with open(f"world.geo.json-master/countries/{random_file}", 'r') as f:
        data = json.load(f)
    return data


@app.get("/data/family")
def get_family_data( 
    user: Annotated[User, Depends(get_current_active_user)],
    db: Session = Depends(get_db),
    fname: str = ""):
    res = []
    if user:
        query_family_distro = text(QUERY_OBS_PER_FAMILY_PER_COUNTRY.format(family_name=fname))
        family_distro_data = db.execute(query_family_distro)
        for rec in family_distro_data:
            country = rec[5]
            count = rec[0]
            base_geojson = get_country_geo_json(country)
            base_geojson["features"][0]["properties"]["count"] = count
            res.append(base_geojson)
        return res
    else:
        raise HTTPException(status_code=403, detail="Unauthorized access")