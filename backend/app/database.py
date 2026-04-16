from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .models import Base
import os

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL environment variable is not set. "
        "Please set it to a valid PostgreSQL connection string "
        "(e.g., postgresql://user:password@host/dbname)."
    )

# Render provides PostgreSQL URLs starting with "postgres://" but SQLAlchemy
# requires "postgresql://" — fix it automatically if needed
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# SQLite needs check_same_thread=False; PostgreSQL does not
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()