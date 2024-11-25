# -*- coding: utf-8 -*-

from pydantic import BaseModel
from sqlalchemy import Boolean, Column, Date, ForeignKey, Integer, String, DateTime, Float
from sqlalchemy.orm import relationship
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from .database import Base
import datetime
from geoalchemy2 import Geometry


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    fullname = Column(String)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)



class Kingdom(Base):
    __tablename__ = "kingdoms"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)


class Taxon(Base):
    __tablename__ = "taxons"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)


class Family(Base):
    __tablename__ = "family"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)


class PlantSpecie(Base):
    __tablename__ = "plant_species"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    scientific_name = Column(String, nullable=True)
    family_id = Column(Integer, ForeignKey("family.id"), nullable=True)
    kingdom_id = Column(Integer, ForeignKey("kingdoms.id"), nullable=True)
    taxon_id = Column(Integer, ForeignKey("taxons.id"), nullable=True)


class Site(Base):
    __tablename__ = "sites"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    lat = Column(Float, nullable=False)
    lon = Column(Float, nullable=False)
    geom = Column(Geometry('POINT'), nullable=False)
    country = Column(String, nullable=True)
    region = Column(String, nullable=True)
    continent = Column(String, nullable=True)


class Observation(Base):
    __tablename__ = "observations"

    id = Column(Integer, primary_key=True)
    site_id = Column(Integer, ForeignKey("sites.id"), nullable=False)
    plant_specie_id = Column(Integer, ForeignKey("plant_species.id"), nullable=False)
    source = Column(String, nullable=True)
    date = Column(String, nullable=True)
    year = Column(Integer, nullable=True)