from pydantic import BaseModel, field_validator
import re

class UserCreate(BaseModel):
    email: str
    password: str

    @field_validator("password")
    @classmethod
    def password_strength(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at leaste 8 characters")
        if not re.search(r"\d", v):
            raise ValueError("Password must contain at least one number")
        if not re.search(r"[!@#$%^&*]", v):
            raise ValueError("Password must contain at least one special character")
        return v

class UserOut(BaseModel):
    id: int
    email: str

    class Config:
        from_attributes = True

class BookCreate(BaseModel):
    title: str
    author: str
    desc: str | None = None
    category: str | None = None
    image_url: str | None = None
    read_more_url: str

class BookRead(BaseModel):
    id: int
    title: str
    author: str
    desc: str | None = None
    category: str | None = None
    added_by: int
    image_url: str | None = None
    read_more_url: str
    class Config:
        from_attributes = True

class BookUpdate(BaseModel):
    title: str | None = None
    author: str | None = None
    desc: str | None = None
    category: str | None = None
    image_url: str | None = None
    read_more_url: str | None = None


    class Config:
        from_attributes = True