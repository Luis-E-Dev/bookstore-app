from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from typing import List
import uvicorn

app = FastAPI(title="Bookstore API", description="API for managing bookstore inventory")

# Temporary in-memory database
books = [
    {"id": 1, "title": "The Pragmatic Programmer", "author": "Andrew Hunt"},
    {"id": 2, "title": "Clean Code", "author": "Robert C. Martin"}
]

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

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
            message:"Book not found",
            "book_id": book_id
        })

# Protected endpoint: add a new book (only for admin)
@app.post("/books/", response_model=dict)
def add_books(book: dict, token: str = Depends(oauth2_scheme)):
    # TODO: Validate admin role & book schema
    book["id"] = len(books) + 1
    books.append(book)
    return book

if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)