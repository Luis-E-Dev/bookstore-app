# Bookstore App
Full-stack bookstore inventory app built with FastAPI + React.

## Features
- JWT authentication with role-based access (admin/user)
- Admin dashboard with full CRUD for books
- Secure password hashing, rate limiting, CORS protection

## Tech Stack
Backend: Python, FastAPI, SQLAlchemy, SQLite, JWT
Frontend: React, React Router, Axios, Context API

## Setup
### Backend
cd backend
pip install -r requirements.txt
python -m app.init_db
uvicorn app.main:app --reload

### Frontend
cd frontend
npm install
npm start