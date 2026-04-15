from fastapi import FastAPI, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from . import models, schemas, utils
from .schemas import UserOut, UserCreate, BookCreate, BookRead, BookUpdate
from .database import SessionLocal, engine, Base, get_db
from sqlalchemy.orm import Session
from app.utils import (
    get_password_hash,
    create_access_token,
    verify_password
)
from typing import List
from jose import JWTError, jwt
from .models import User, Book
from dotenv import load_dotenv
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import os
import uvicorn

load_dotenv()

app = FastAPI(title="Bookstore API", description="API for managing bookstore inventory")
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

Base.metadata.create_all(bind=engine)

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "https://luis-e-dev.github.io/bookstore-app/portfolio/index.html")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    try:
        payload = jwt.decode(token, utils.SECRET_KEY, algorithms=[utils.ALGORITHM])
        email = payload.get("sub")
        if not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials"
            )
        user = db.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        return user
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )

# Create users
@app.post('/signup', response_model=UserOut)
@limiter.limit("5/15minutes")
async def create_user(request: Request, data: UserCreate, db: Session = Depends(get_db)):
    # querying database to check if user already exists
    existing = db.query(User).filter(User.email == data.email).first()
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    user = {
        'email': data.email,
        'hashed_password': utils.get_password_hash(data.password),
        'user_role': 'user'
    }
    new_user = User(**user)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post('/login', summary="Create access and refresh tokens for user", response_model=dict)
@limiter.limit("5/15minutes")
async def login(request: Request, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )

    return {
        "access_token": utils.create_access_token({"sub": user.email, "role": user.user_role}),
        "token_type": "bearer"
    }

# Public endpoint: get all books
@app.get("/books/", response_model=List[BookRead])
def get_books(db: Session = Depends(get_db)):
    return db.query(Book).all()

# Public endpoint: get a single book by ID
@app.get("/books/{book_id}", response_model=BookRead)
def get_book(book_id: int, db: Session = Depends(get_db)):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(
            status_code=404,
            detail={
                "message":"Book not found",
                "book_id": book_id
            })
    return book

# Protected endpoint: add a new book (only for admin)
@app.post("/books/", response_model=BookRead, status_code=201)
def add_books(book: BookCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.user_role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to add books"
        )
    new_book = Book(**book.dict(), added_by=current_user.id)
    db.add(new_book)
    db.commit()
    db.refresh(new_book)
    return new_book

# Protected endpoint: delete a book from library
@app.delete("/books/{book_id}", status_code=200)
def delete_book(book_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.user_role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete books"
        )
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(
            status_code=404,
            detail={"message": "Book not found"}
        )
    db.delete(book)
    db.commit()
    return {"message": "Book deleted successfully"}

# Protected endpoint: update a book in library
@app.put("/books/{book_id}", response_model=BookRead)
def update_book(book_id: int, book_update: BookUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.user_role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update books"
        )
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(
            status_code=404,
            detail={"message": "Book not found"}
        )
    for key, value in book_update.dict(exclude_unset=True).items():
        setattr(book, key, value)
    db.commit()
    db.refresh(book)
    return book

# Private: Exclusively for Admins to fetch email and passwords
@app.get("/users/", response_model=List[UserOut])
def get_users(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, utils.SECRET_KEY, algorithms=[utils.ALGORITHM])
        email = payload.get("sub") or payload.get("email")
        if email == ADMIN_EMAIL:
            return [ { "id": user.id, "email": user.email } for user in db.query(User).all() ]
        else:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to access this resource"
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials"
        )

@app.get("/")
def read_root():
    return {"message": "Welcome to the Bookstore API"}

if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)