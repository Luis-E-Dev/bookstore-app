from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import RedirectResponse
from . import models, schemas, utils
from .schemas import UserOut, UserCreate
from .database import SessionLocal, engine, Base
from replit import db
from app.utils import (
    get_password_hash,
    create_access_token,
    verify_password
)
from uuid import uuid4
from typing import List
import uvicorn

app = FastAPI(title="Bookstore API", description="API for managing bookstore inventory")

# Temporary in-memory database
books = [
    {"id": 1, "title": "The Pragmatic Programmer", "author": "Andrew Hunt"},
    {"id": 2, "title": "Clean Code", "author": "Robert C. Martin"}
]

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Create users
@app.post('/signup', summary="Create a new user", response_model=UserOut)
async def create_user(data: UserCreate):
    # querying database to check if user already exists
    user = db.get(data.email, None)
    if user is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    user = {
        'email': data.email,
        'hashed_password': utils.get_password_hash(data.password),
        'id': str(uuid4())
    }
    db[data.email] = user #saving user in database
    return user

@app.post('/login', summary="Create access and refresh tokens for user", response_model=dict)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = db.get(form_data.username, None)
    if user is None:
        raise HTTPException (
            status_code=status.HTTP_400_BAD_REQUEST,
            detail= "Incorrect email or password"
        )

    hashed_pass = user['hashed_password']
    if not utils.verify_password(form_data.password, hashed_pass):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )

    return {
        "access_token": utils.create_access_token(user['email']),
        "token_type": "bearer"
    }

# Public endpoint: get all books
@app.get("/books/", response_model=List[dict])
def get_books():
    return books

# Public endpoint: get a single book by ID
@app.get("/books/{book_id}", response_model=dict)
def get_book(book_id: int):
    for book in books:
        if book["id"] == book_id:
            return book
    raise HTTPException(
        status_code=404,
        detail={
            "message":"Book not found",
            "book_id": book_id
        })

# Protected endpoint: add a new book (only for admin)
@app.post("/books/", response_model=dict, status_code=201)
def add_books(book: dict, token: str = Depends(oauth2_scheme)):
    # TODO: Validate admin role & book schema
    book["id"] = len(books) + 1
    books.append(book)
    return book

# Protected endpoint: delete a book from library
@app.delete("/books/{book_id}", status_code=201)
def delete_book(book_id: int, token: str = Depends(oauth2_scheme)):
    # TODO: Validate admin role
    for book in books:
        if book["id"] == book_id:
            books.remove(book)
            return {"message": "Book deleted successfully"}
    raise HTTPException(
        status_code=404,
        detail={"message": "Book not found"})

# Protected endpoint: update a book in library
@app.put("/books/{book_id}", response_model=dict)
def update_book(book_id: int, book: dict, token: str = Depends(oauth2_scheme)):
    # TODO: Validate admin role
    for book in books:
        if book["id"] == book_id:
            book.update(book)
            return book
    raise HTTPException(
        status_code=404,
        detail={"message": "Book not found"})

if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)