import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from pymongo import MongoClient

# SQL Database (Postgres/SQLite)
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./gym.db")

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False} if "sqlite" in SQLALCHEMY_DATABASE_URL else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# MongoDB Connection
MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://db_user:password@test.g3pyyfm.mongodb.net/?appName=test")
mongo_client = MongoClient(MONGO_URI)
mongo_db = mongo_client.get_database("gym_logs")

def get_mongo_db():
    return mongo_db
