# -*- coding: utf-8 -*-

from datetime import datetime
from pydantic import BaseModel


class UserBase(BaseModel):
    username: str
    fullname: str
    email: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True


class FileBase(BaseModel):
    file_path: str


class Kingdom(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class Taxon(BaseModel):
    id: int
    name: str
    
    class Config:
        from_attributes = True


class Family(BaseModel):
    id: int
    name: str
    
    class Config:
        from_attributes = True


class PlantSpecie(BaseModel):
    id: int
    name: str
    scientific_name: str
    kingdom_id: int
    taxon_id: int
    family_id: int

    class Config:
        from_attributes = True


class Site(BaseModel):
    id: int
    name: str
    lat: float
    lon: float
    country: str
    region: str
    continent: str

    class Config:
        from_attributes = True


class Observation(BaseModel):
    id: int
    site_id: int
    plant_specie_id: int
    source: str
    date: str
    year: int
    month: int