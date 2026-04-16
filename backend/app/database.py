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