# Plan: Portfolio-Ready Bookstore Application

Transform this bookstore app from a proof-of-concept into a production-quality showcase that demonstrates full-stack development skills. Address critical bugs, implement proper database integration, add security best practices, complete missing features, and prepare for deployment. This 4-phase approach prioritizes functionality, security, completeness, then polish.

## Phase 1: Make It Work (Critical - Week 1)

### 1. Fix requirements.txt
Add all Python dependencies: `fastapi`, `uvicorn[standard]`, `sqlalchemy`, `pydantic`, `python-jose[cryptography]`, `passlib[bcrypt]`, `python-multipart`, `python-dotenv`

**Files:** [backend/requirements.txt](backend/requirements.txt)

### 2. Create environment configuration
Add [backend/.env.example](backend/.env.example) and [frontend/.env.example](frontend/.env.example) with `DATABASE_URL`, `SECRET_KEY`, `ADMIN_EMAIL`, `API_URL` templates

**Files:** Create backend/.env.example, frontend/.env.example

### 3. Connect real database
Replace in-memory `users_db` and `books_db` dictionaries in [main.py](backend/app/main.py) with actual SQLAlchemy session queries using models from [models.py](backend/app/models.py) and [database.py](backend/app/database.py)

**Files:** [backend/app/main.py](backend/app/main.py), [backend/app/database.py](backend/app/database.py)

### 4. Add database initialization
Create [backend/app/init_db.py](backend/app/init_db.py) script to create tables and seed initial admin user and sample books

**Files:** Create backend/app/init_db.py

### 5. Fix BookCard.jsx
Add missing `return` statement before the JSX (the component currently has no return)

**Files:** [frontend/src/BookCard.jsx](frontend/src/BookCard.jsx)

### 6. Fix API protocol in App.jsx
Change `https://localhost:8000` to `http://localhost:8000`

**Files:** [frontend/src/App.jsx](frontend/src/App.jsx)

### 7. Fix authentication format mismatch
Update [login.jsx](frontend/src/pages/login.jsx) to send `FormData` with `username` and `password` fields matching OAuth2PasswordBearer requirements, or change backend to accept JSON

**Files:** [frontend/src/pages/login.jsx](frontend/src/pages/login.jsx)

### 8. Implement token persistence
Store JWT token in `localStorage` after successful login in [login.jsx](frontend/src/pages/login.jsx) and create axios interceptor to include token in all requests

**Files:** [frontend/src/pages/login.jsx](frontend/src/pages/login.jsx), [frontend/src/App.jsx](frontend/src/App.jsx) or create new axios config file

### 9. Add Alembic for migrations
Initialize Alembic in backend, create initial migration for User and Book models

**Files:** Backend root directory (alembic init), create migration files

### 10. Verify end-to-end flow
Test complete flow: register → login → view books → add book → logout

**Type:** Testing/Verification

---

## Phase 2: Make It Secure (Week 1-2)

### 11. Remove hardcoded secrets
Move `SECRET_KEY` from [utils.py](backend/app/utils.py) and admin email from [main.py](backend/app/main.py) to environment variables

**Files:** [backend/app/utils.py](backend/app/utils.py), [backend/app/main.py](backend/app/main.py)

### 12. Delete debug endpoint
Remove `/debug/users` endpoint from [main.py](backend/app/main.py) entirely

**Files:** [backend/app/main.py](backend/app/main.py)

### 13. Restrict CORS
Change `allow_origins=["*"]` in [main.py](backend/app/main.py) to specific frontend URL from environment variable

**Files:** [backend/app/main.py](backend/app/main.py)

### 14. Add password validation
Implement minimum 8 characters, at least one number and special character in [schemas.py](backend/app/schemas.py) `UserCreate` schema

**Files:** [backend/app/schemas.py](backend/app/schemas.py)

### 15. Add rate limiting
Install `slowapi` and add rate limits to `/signup` and `/login` endpoints (5 attempts per 15 minutes)

**Files:** [backend/requirements.txt](backend/requirements.txt), [backend/app/main.py](backend/app/main.py)

### 16. Fix admin logic bug
Correct inverted logic in [main.py](backend/app/main.py) where admin check returns 403 when email matches admin

**Files:** [backend/app/main.py](backend/app/main.py)

### 17. Enforce schema validation
Replace generic `dict` parameters with proper Pydantic schemas (`BookCreate`, `BookUpdate`) in all book endpoints

**Files:** [backend/app/main.py](backend/app/main.py), [backend/app/schemas.py](backend/app/schemas.py)

### 18. Add request validation
Sanitize inputs to prevent XSS attacks, add length limits to all string fields

**Files:** [backend/app/schemas.py](backend/app/schemas.py)

---

## Phase 3: Make It Complete (Week 2)

### 19. Create protected route component
Build [frontend/src/components/PrivateRoute.jsx](frontend/src/components/PrivateRoute.jsx) that checks for valid token and redirects to login

**Files:** Create frontend/src/components/PrivateRoute.jsx

### 20. Build admin dashboard
Create [frontend/src/pages/AdminDashboard.jsx](frontend/src/pages/AdminDashboard.jsx) with full CRUD interface for books (list, create, edit, delete)

**Files:** Create frontend/src/pages/AdminDashboard.jsx

### 21. Integrate BookList.jsx
Add route for `/books` in [App.jsx](frontend/src/App.jsx) and use proper state management for book data

**Files:** [frontend/src/App.jsx](frontend/src/App.jsx), [frontend/src/BookList.jsx](frontend/src/BookList.jsx)

### 22. Add authentication context
Create [frontend/src/context/AuthContext.jsx](frontend/src/context/AuthContext.jsx) to manage auth state globally (current user, token, login/logout methods)

**Files:** Create frontend/src/context/AuthContext.jsx, update App.jsx to wrap with provider

### 23. Implement error handling
Add try-catch blocks in all API calls with user-friendly error messages via toast notifications (install `react-toastify`)

**Files:** [frontend/package.json](frontend/package.json), all component files with API calls

### 24. Add loading states
Show spinners during API calls, add skeleton loaders for book lists

**Files:** All components with API calls

### 25. Create API documentation
Configure FastAPI automatic docs at `/docs` and `/redoc`, add response models and examples to all endpoints

**Files:** [backend/app/main.py](backend/app/main.py) (add response_model and examples to endpoints)

### 26. Write tests
Add backend tests for auth endpoints, book CRUD, and admin logic using `pytest`; add frontend tests for Login, Register, and BookList components using React Testing Library

**Files:** Create backend/tests/ directory with test files, update frontend test files

### 27. Improve README
Add architecture diagram, setup instructions, environment variables guide, API endpoint documentation, and screenshots

**Files:** [README.md](README.md)

### 28. Add proper logging
Replace `print()` statements in [main.py](backend/app/main.py) with Python `logging` module, log to file and console

**Files:** [backend/app/main.py](backend/app/main.py), create logging configuration

---

## Phase 4: Make It Impressive (Week 3)

### 29. Add search and filters
Implement `/books/search` endpoint with query parameters for title, author, price range; add search bar and filter UI in frontend

**Files:** [backend/app/main.py](backend/app/main.py), frontend components

### 30. Implement pagination
Add `skip` and `limit` parameters to GET `/books` endpoint, create pagination controls in frontend

**Files:** [backend/app/main.py](backend/app/main.py), frontend components

### 31. Create book detail page
Build [frontend/src/pages/BookDetail.jsx](frontend/src/pages/BookDetail.jsx) with full book information and edit functionality for admins

**Files:** Create frontend/src/pages/BookDetail.jsx

### 32. Add book images
Update Book model in [models.py](backend/app/models.py) with `image_url` field, add image upload capability or use placeholder URLs

**Files:** [backend/app/models.py](backend/app/models.py), [backend/app/schemas.py](backend/app/schemas.py)

### 33. Style with component library
Install Material-UI or Tailwind CSS, redesign all pages with consistent professional styling and responsive layout

**Files:** [frontend/package.json](frontend/package.json), all frontend component files

### 34. Create Docker setup
Add Dockerfile for backend, Dockerfile for frontend, and docker-compose.yml at root for one-command startup

**Files:** Create backend/Dockerfile, frontend/Dockerfile, docker-compose.yml

### 35. Set up CI/CD
Create .github/workflows/ci.yml to run tests on every push and PR

**Files:** Create .github/workflows/ci.yml

### 36. Deploy application
Deploy backend to Render/Railway, frontend to Vercel/Netlify, database to PostgreSQL on Supabase or ElephantSQL

**Type:** Deployment task

### 37. Add performance optimization
Implement caching for book list endpoint, lazy load images, code split React routes

**Files:** Backend and frontend optimization changes

### 38. Create demo data
Seed database with 50-100 realistic books for impressive demo

**Files:** Update database initialization script or create separate seed script

---

## Verification Checklist

After completion, verify:

- [ ] Run `docker-compose up` starts entire application successfully
- [ ] Register new user → login → see books list → search/filter works → pagination works
- [ ] Login as admin → access admin dashboard → create/edit/delete books successfully
- [ ] Run `pytest` in backend shows all tests passing
- [ ] Run `npm test` in frontend shows all tests passing
- [ ] Visit deployed URL shows live application
- [ ] Check FastAPI docs at `/docs` shows complete API reference
- [ ] README instructions allow someone to clone and run project in under 10 minutes
- [ ] No console errors in browser developer tools
- [ ] Lighthouse audit scores >80 for performance, accessibility, best practices

---

## Technical Decisions

- **Database**: Use PostgreSQL (industry standard, better than SQLite for portfolio) with SQLAlchemy ORM
- **Authentication storage**: LocalStorage for simplicity (acceptable for portfolio; note in README that production would use httpOnly cookies)
- **Styling approach**: Material-UI or Tailwind CSS (choose based on preference, both are portfolio-appropriate)
- **Deployment**: Separate hosting (Render/Railway for backend, Vercel for frontend) demonstrates understanding of modern deployment patterns
- **Testing scope**: Focus on critical path tests (auth flow, CRUD operations) over 100% coverage
- **Admin identification**: Environment variable approach is acceptable (mention that production would use proper role-based system with database flags)

---

## Recommended Starting Sequence

**Priority Order:**

1. **Fix requirements.txt FIRST** ⚡ *[15 minutes]* - Blocking everything
2. **Create .env files** ⚡ *[20 minutes]* - Foundation for configuration
3. **Fix frontend errors** ⚡ *[10 minutes]* - BookCard.jsx and App.jsx
4. **Quick verification** ⚡ *[15 minutes]* - Verify both servers start
5. **Database integration** - Steps 3-4 from Phase 1

**Time to working (incomplete) app:** ~1 hour
