# -*- coding: utf-8 -*-

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# SQLALCHEMY_DATABASE_URL = "sqlite:///./bppd.db" --- goes with  connect_args={"check_same_thread": False}
SQLALCHEMY_DATABASE_URL = "postgresql://postgres_db:5432/bppd_db?user=postgres&password=admin"
#---in container
# SQLALCHEMY_DATABASE_URL = "postgresql://localhost:3001/bppd_db?user=postgres&password=admin"


engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()