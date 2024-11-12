# -*- coding: utf-8 -*-

import json
import os
import shutil
from sqlalchemy import and_
from sqlalchemy.orm import Session

from database.utils import get_float_val
from . import models, schemas
from passlib.context import CryptContext
from pathlib import Path
import datetime
from enum import Enum
from pprint import pprint
import re, os
import shutil
import pandas as pd
import openpyxl , csv

from tqdm import tqdm
import traceback
import warnings
import uuid
import geopandas as gpd
from shapely.geometry import Point
from geoalchemy2 import Geometry
import logging

logger = logging.getLogger('uvicorn.error')
logger.setLevel(logging.DEBUG)

DELIMITER = ","

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()


def get_users(db: Session, skip: int = 0, limit: int = 0):
    if skip and limit:
        return db.query(models.User).offset(skip).limit(limit).all()
    else:
        return db.query(models.User).all()


def create_user(db: Session, user: schemas.UserCreate):
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    db_user = models.User(
        username=user.username,
        email=user.email, 
        fullname=user.fullname,
        is_active=True,
        hashed_password=pwd_context.hash(user.password))
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def delete_user(db: Session, user_id: int):
    res = db.query(models.User).filter(models.User.id == user_id).delete()
    db.commit()
    return res


def upload_data_from_file(filepath, db:Session) -> bool:
    """filepath is more likely the path to a csv file"""
    try:
        with open(filepath) as file_obj: 
            reader_obj = csv.DictReader(file_obj, delimiter=DELIMITER) 
            for row in tqdm(list(reader_obj), unit =" rows", desc="Uploading Data ... "): 
                kingdom_id = load_kingdom_data(db, row)
                taxon_id = load_taxon_data(db, row)
                family_id = load_family_data(db, row)
                plant_specie_id = load_plant_specie_data(db, row, kingdom_id=kingdom_id, taxon_id=taxon_id, family_id=family_id)
                site_id = load_site_data(db, row)
                observation_id = load_observation_data(db, row, site_id, plant_specie_id)
            return True
    except Exception as e:
        logger.debug("ERROR: ", traceback.format_exc())
        return False
    

def load_kingdom_data(db:Session, row:dict) -> int:
    """create or retrieved kingdom row"""
    fetch_kingdom = db.query(models.Kingdom).filter(models.Kingdom.name == row["kingdom"]).first()
    if not fetch_kingdom and row["kingdom"]: # a
        db_kingdom = models.Kingdom(
            name=row["kingdom"],
        )
        db.add(db_kingdom)
        db.commit()
        db.refresh(db_kingdom)
        fetch_kingdom = db_kingdom
        return fetch_kingdom.id
    return 0


def load_family_data(db:Session, row:dict) -> int:
    """create or retrieved family row"""
    fetch_family = db.query(models.Family).filter(models.Family.name == row["file_name"]).first()
    if not fetch_family and row["file_name"]: # a
        db_family = models.Family(
            name=row["file_name"],
        )
        db.add(db_family)
        db.commit()
        db.refresh(db_family)
        fetch_family = db_family
        return fetch_family.id
    return 0


def load_taxon_data(db:Session, row:dict) -> int:
    fetch_taxon = db.query(models.Taxon).filter(models.Taxon.name == row["taxon"]).first()
    if not fetch_taxon and row["taxon"]:
        db_taxon = models.Taxon(
            name=row["taxon"],
        )
        db.add(db_taxon)
        db.commit()
        db.refresh(db_taxon)
        fetch_taxon = db_taxon
        return fetch_taxon.id
    return 0


def load_plant_specie_data(db:Session, row:dict, kingdom_id=0, taxon_id=0, family_id=0) -> int:
    if kingdom_id and taxon_id:
        fetch_plant = db.query(models.PlantSpecie).filter(models.PlantSpecie.name == row["species"]).first()
        if not fetch_plant and row["species"]:
            db_plant = models.PlantSpecie(
                name=row["species"],
                scientific_name=row["scientific_name"],
                kingdom_id=kingdom_id,
                taxon_id=taxon_id,
                family_id=family_id
            )
            db.add(db_plant)
            db.commit()
            db.refresh(db_plant)
            fetch_plant = db_plant
            return fetch_plant.id
    return 0


def load_site_data(db:Session, row:dict) -> int:
    if row["latitude"] and row["longitude"]:
        fetch_site = db.query(models.Site).filter(
            models.Site.lat == get_float_val(str(row["latitude"])), 
            models.Site.lon == get_float_val(str(row["longitude"]))).first()
        if not fetch_site:
            db_site = models.Site(
                name=row["location_name"],
                country=row["country"],
                region=row["region"],
                continent=row["continent"],
                lat=row["latitude"],
                lon=row["longitude"]
            )
            db_site.geom = f"POINT({get_float_val(str(row["longitude"]))} {get_float_val(str(row["latitude"]))})"
            db.add(db_site)
            db.commit()
            db.refresh(db_site)
            fetch_site = db_site
        return fetch_site.id
    else: 
        return 0


def load_observation_data(db:Session, row:dict, site_id, plant_id) -> int:
    if site_id and plant_id:
        db_obs = models.Observation(
            site_id=site_id,
            plant_specie_id=plant_id,
            source=row["repository_name"],
            date=row["observation_date"],
        )
        db.add(db_obs)
        db.commit()
        db.refresh(db_obs)
        return db_obs.id
    else:
        return 0