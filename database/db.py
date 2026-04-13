from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os
load_dotenv()
Database_url=os.getenv("DATABASE_URL", "sqlite:///./deepfake.db")
def database_engine():
    return create_engine(Database_url)

def get_db():
    db = sessionmaker(bind=database_engine(),autocommit=False,autoflush=False)
    session = db()
    try:
        yield session
    finally:
        session.close()

Base = declarative_base()

