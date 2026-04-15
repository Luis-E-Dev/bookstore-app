from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    user_role = Column(String, default="user", nullable=False)

class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    author = Column(String, index=True, nullable=False)
    desc = Column(String, nullable=True)
    category = Column(String, nullable=True)
    added_by = Column(Integer, nullable=False)
    image_url = Column(String, nullable=True)
    read_more_url = Column(String, nullable=False)