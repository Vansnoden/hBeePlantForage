# -*- coding: utf-8 -*-

from datetime import timedelta, timezone, datetime
import math
import os, json, time
from pathlib import Path
from typing import Annotated, List, Optional
from fastapi import Depends, FastAPI, HTTPException, status, File, UploadFile, Body
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
import numpy as np
from numpy.linalg import norm
import ast

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
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:8000",
    "http://212.56.40.148",
    "http://212.56.40.148:3000",
    "http://212.56.40.148:8000"
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


@app.post("/data/upload_bee")
def upload_bee_data_file( 
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
                res = crud.upload_bee_data_from_file(csv_path, db)
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
    db: Session = Depends(get_db),
    fname: str = ""):
    res = {}
    if user:
        query_total_plants = text(QUERY_TOTAL_PLANT_SPECIES)
        query_total_sites= text(QUERY_TOTAL_SITES)
        query_total_plants_recs = db.execute(query_total_plants)
        query_total_sites_recs = db.execute(query_total_sites)
        for rec in query_total_plants_recs:
            res["total_plants"] = rec[0]
        for rec in query_total_sites_recs:
            res["total_sites"] = rec[0]
        return res  
    else:
        raise HTTPException(status_code=403, detail="Unauthorized access")


def levenshtein_distance(s, t):
    m, n = len(s), len(t)
    if m < n:
        s, t = t, s
        m, n = n, m
    d = [list(range(n + 1))] + [[i] + [0] * n for i in range(1, m + 1)]
    for j in range(1, n + 1):
        for i in range(1, m + 1):
            if s[i - 1] == t[j - 1]:
                d[i][j] = d[i - 1][j - 1]
            else:
                d[i][j] = min(d[i - 1][j], d[i][j - 1], d[i - 1][j - 1]) + 1
    return d[m][n]


def compute_similarity(input_string, reference_string):
    distance = levenshtein_distance(input_string, reference_string)
    max_length = max(len(input_string), len(reference_string))
    similarity = 1 - (distance / max_length)
    return similarity


def get_country_code(country_name):
    for k,v in COUNTRIES.items():
        similarity = compute_similarity(country_name, k)
        # logger.debug(f"SIMILARITY {country_name} --- {k} :   {similarity}")
        if similarity > 0.65:
            return v


def get_country_geo_json(country_name):
    country_code = get_country_code(country_name)
    country_code = country_code.upper() if country_code else "AFG"
    data = {}
    with open(f"world.geo.json-master/countries/{country_code}.geo.json", 'r') as f:
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
            country = rec[1]
            count = rec[0]
            base_geojson = get_country_geo_json(country)
            base_geojson["features"][0]["properties"]["count"] = count
            if not res:
                res = base_geojson # adding initial country
            else:
                res["features"].append(base_geojson["features"][0]) # adding other countries as features
        return res
    else:
        raise HTTPException(status_code=403, detail="Unauthorized access")


@app.get("/data/family/search")
def get_family_search_data( 
    user: Annotated[User, Depends(get_current_active_user)],
    db: Session = Depends(get_db), search_filter:str=""):
    res = []
    if user:
        query_families = text(QUERY_FAMILIES.format(search=search_filter))
        families_data = db.execute(query_families)
        for rec in families_data:
            name = rec[0]
            res.append(name)
        return res
    else:
        raise HTTPException(status_code=403, detail="Unauthorized access")


@app.get("/data/family/max")
def get_family_data_max_observations( 
    user: Annotated[User, Depends(get_current_active_user)],
    db: Session = Depends(get_db),
    fname: str = ""):
    res = 0
    if user:
        query_family_distro = text(QUERY_MAX_OBS_PER_FAMILY_PER_COUNTRY.format(family_name=fname))
        family_distro_data = db.execute(query_family_distro)
        for rec in family_distro_data:
            max = rec[0]
            if not res:
                res = max # adding initial country
        return res
    else:
        raise HTTPException(status_code=403, detail="Unauthorized access")


@app.get("/data/monthly/distro")
def get_obs_monthly_distro(
    user: Annotated[User, Depends(get_current_active_user)],
    db: Session = Depends(get_db),
    cname: str = ""):
    res = {}
    if user:
        obs_montly_distro_labels = []
        obs_montly_distro_values = []
        query_obs_montly_distro = text(QUERY_MONTHLY_OBS_DISTRO.format(continent=cname))
        obs_montly_distro_data = db.execute(query_obs_montly_distro)
        for rec in obs_montly_distro_data:
            obs_montly_distro_labels.append(rec[1])
            obs_montly_distro_values.append(rec[0])
        obsmbgColor, obsmborderColor = generate_colors(len(obs_montly_distro_values))
        res["obs_montly_distro"] = {
                "labels": obs_montly_distro_labels,
                "datasets": [
                    {
                        "label": f'Monthly distribution of observations {cname}',
                        "data": obs_montly_distro_values,
                        "backgroundColor": obsmbgColor,
                        "borderColor": obsmborderColor,
                        "borderWidth": 1,
                    },
                ],
            }
        return res
    else:
        raise HTTPException(status_code=403, detail="Unauthorized access")
    

@app.get("/data/region/distro")
def get_obs_region_distribution( 
    user: Annotated[User, Depends(get_current_active_user)],
    db: Session = Depends(get_db),
    cname: str = "",
    fname: str = "",
    year_start: int = 2015,
    year_end: int = 2025):

    res = {}
    new_res = {'data':[]}
    if user:
        labels = []
        values = []
        if cname and not fname:
            query = text(QUERY_GROUP_OBS_BY_CONTINENT_REGIONS.format(continent=cname, year_start=year_start, year_end=year_end))
        elif fname:
            query = text(QUERY_GROUP_OBS_BY_CONTINENT_REGIONS_FAMILY.format(continent=cname, family_name=fname, year_start=year_start, year_end=year_end))
        else:
            query = text(QUERY_GROUP_OBS_BY_CONTINENT_REGIONS.format(continent=cname, year_start=year_start, year_end=year_end))
        data = db.execute(query)
        for rec in data:
            labels.append(rec[1])
            values.append(rec[0])
            new_res["data"].append({
                "label": rec[1], "value": rec[0]
            })
        spcbgColor, spcborderColor = generate_colors(len(values))
        continent_family_label = f"{fname + ': '} observations distribution in {cname} regions for the last {year_end - year_start} years"
        default_label = f"observations distribution in {cname} regions for the last {year_end - year_start} years"
        res["data"] = {
                "labels": labels,
                "datasets": [
                    {
                        "label": continent_family_label if fname else default_label,
                        "data": values,
                        "backgroundColor": spcbgColor,
                        "borderColor": spcborderColor,
                        "borderWidth": 1,
                    },
                ],
            }
        return res
    else:
        raise HTTPException(status_code=403, detail="Unauthorized access")
    

@app.get("/data/yearly/distro")
def get_last_x_years_distro(
    user: Annotated[User, Depends(get_current_active_user)],
    db: Session = Depends(get_db),
    cname: str = "", 
    fname: str = "",
    year_start: int = 2015,
    year_end: int = 2025):
    res = {}
    assert year_end > year_start, "Start Year should be inferiour to end year"
    if user:
        labels = []
        values = []
        if cname and not fname:
            query = text(QUERY_OBS_YEARLY_OVERVIEW_CONTINENT.format(continent=cname, year_start=year_start, year_end=year_end))
        elif fname:
            query = text(QUERY_OBS_YEARLY_OVERVIEW_CONTINENT_FAMILY.format(continent=cname, family_name=fname, year_start=year_start, year_end=year_end))
        else:
            query = text(QUERY_OBS_YEARLY_OVERVIEW.format(year_start=year_start, year_end=year_end))
        data = db.execute(query)
        for rec in data:
            labels.append(rec[1])
            values.append(rec[0])
        obs_10bgColor, obs_10borderColor = generate_colors(len(values))
        continent_family_label = f"{fname + ': '} {cname} last {year_end - year_start} years observations overview"
        default_label = f"{cname} last {year_end - year_start} years observations overview"
        res["data"] = {
                "labels": labels,
                "datasets": [
                    {
                        "label": continent_family_label if fname else default_label,
                        "data": values,
                        "backgroundColor": obs_10bgColor,
                        "borderColor": obs_10borderColor,
                        "borderWidth": 1,
                    },
                ],
            }
        return res
    else:
        raise HTTPException(status_code=403, detail="Unauthorized access")



@app.get("/data/yearly/aggregate")
def get_last_x_years_aggregate(
    user: Annotated[User, Depends(get_current_active_user)],
    db: Session = Depends(get_db),
    cname: str = "", 
    fname: str = "",
    year_start: int = 2015,
    year_end: int = 2025):
    res = {
        "name": "data",
        "children":[]
    }
    assert year_end > year_start, "Start Year should be inferiour to end year"
    if user:
        labels = []
        values = []
        if cname and not fname:
            query = text(QUERY_AGGREGATE_SUMMARY_DATA_CONTINENT.format(continent=cname, year_start=year_start, year_end=year_end))
        elif fname:
            query = text(QUERY_AGGREGATE_SUMMARY_DATA_CONTINENT_FAMILY.format(continent=cname, family_name=fname, year_start=year_start, year_end=year_end))
        else:
            query = text(QUERY_AGGREGATE_SUMMARY_DATA.format(year_start=year_start, year_end=year_end))
        data = db.execute(query)
        
        continents = {}
        regions = {}
        countries = {}
        families = {}
        species = {}

        for rec in data:
            specie_child = {
                "name": rec[4],
                "value": rec[5]
            },
            family_child = {
                "name": rec[3],
                "children": [specie_child]
            }
            country_child = {
                "name": rec[2],
                "children": [family_child]
            }
            region_child = {
                "name": rec[1],
                "children": [country_child]
            }
            continent_child = {
                "name": rec[0],
                "children": [region_child]
            }
            res["children"].append(continent_child)

        return res
    else:
        raise HTTPException(status_code=403, detail="Unauthorized access")




@app.get("/data/plants/top")
def get_top_x_of_plants( 
    user: Annotated[User, Depends(get_current_active_user)],
    db: Session = Depends(get_db),
    fname: str = "",
    top: int = 20):
    res = {}
    if user:
        labels = []
        values = []
        if fname:
            query = text(QUERY_TOP_X_MOST_REPORTED_PLANTS_FOR_FAMILY.format(family_name=fname, x=top))
        else:
            query = text(QUERY_TOP_X_MOST_REPORTED_PLANTS.format(x=top))
        data = db.execute(query)
        for rec in data:
            label = rec[1] if rec[1] else ""
            labels.append(label)
            values.append(rec[0])
        top20bgColor, top20borderColor = generate_colors(len(values))
        res["data"] = {
                "labels": labels,
                "datasets": [
                    {
                        "label": f'{fname} top {top} most observed plants',
                        "data": values,
                        "backgroundColor": top20bgColor,
                        "borderColor": top20borderColor,
                        "borderWidth": 1,
                    },
                ],
            }
        return res
    else:
        raise HTTPException(status_code=403, detail="Unauthorized access")
    


@app.post("/map/obs")
def get_observation_data(
    user: Annotated[User, Depends(get_current_active_user)],
    db: Session = Depends(get_db), body: Optional[dict] = Body(None)):
    data = []
    oids = body["oids"]
    if user and oids:
        # ids = ast.literal_eval(oids.replace(" ",""))
        ids = [str(x) for x in oids]
        str_ids = "("+",".join(ids)+")"
        # "("
        # for i in ids:
        #     str_ids += str(i) + ","
        # str_ids += ")"
        logger.debug(f"S_IDS: {str_ids}")
        query = text(QUERY_SITE_INFO.format(oids=str_ids))
        dataDb = db.execute(query)
        for row in dataDb:
            obj = {
                "id":row[0],
                "site": row[1],
                "country": row[2], 
                "specie_name": row[3], 
                "family": row[4], 
                "class": 'yes' if row[5] else 'no',
                "year": row[6]
            }
            data.append(obj)
        return data
    else:
        raise HTTPException(status_code=403, detail="Unauthorized access")
    


