from .database import engine, Base, SessionLocal
from . import models
from .models import User, Book
from .utils import get_password_hash
from dotenv import load_dotenv
import os

load_dotenv()

def create_tables():
    Base.metadata.create_all(bind=engine)

def seed_admin(db):
    admin_email = os.getenv("ADMIN_EMAIL")
    admin_password = os.getenv("ADMIN_PASSWORD")
    if not admin_email or not admin_password:
        print("Skipping admin seed: ADMIN_EMAIL or ADMIN_PASSWORD not set in .env")
        return
    existing = db.query(User).filter(User.email == admin_email).first()
    if existing:
        print(f"Admin user already exists: {admin_email}")
        return
    admin = User(
        email=admin_email,
        hashed_password=get_password_hash(admin_password),
        user_role="admin"
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)
    print(f"Admin user created: {admin_email}")
    return admin

def seed_books(db, added_by_id):
    if db.query(Book).count() > 0:
        print("Books already seeded, skipping.")
        return
    sample_books = [
        Book(title="The Pragmatic Programmer", author="Andrew Hunt", desc="A guide to software craftsmanship.", category="Programming", added_by=added_by_id, read_more_url="https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/"),
        Book(title="Clean Code", author="Robert C. Martin", desc="How to write readable, maintainable code.", category="Programming", added_by=added_by_id, read_more_url="https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882"),
        Book(title="Design Patterns", author="Gang of Four", desc="Classic software design patterns.", category="Architecture", added_by=added_by_id, read_more_url="https://www.amazon.com/Design-Patterns-Elements-Reusable-Object-Oriented/dp/0201633612"),
        Book(title="You Don't Know JS", author="Kyle Simpson", desc="Deep dive into JavaScript.", category="JavaScript", added_by=added_by_id, read_more_url="https://github.com/getify/You-Dont-Know-JS"),
        Book(title="The Lean Startup", author="Eric Ries", desc="Build products customers want.", category="Business", added_by=added_by_id, read_more_url="https://www.amazon.com/Lean-Startup-Entrepreneurs-Continuous-Innovation/dp/0307887898"),
    ]
    db.add_all(sample_books)
    db.commit()
    print(f"{len(sample_books)} sample books seeded.")

if __name__ == "__main__":
    print("Creating tables...")
    create_tables()
    db = SessionLocal()
    try:
        admin = seed_admin(db)
        admin_id = admin.id if admin else db.query(User).filter(User.user_role == "admin").first().id
        seed_books(db, added_by_id=admin_id)
        print("Database initialization complete.")
    finally:
        db.close()