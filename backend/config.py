# config.py
import os
from dotenv import load_dotenv

load_dotenv()

DB_CONFIG = {
    "host": os.getenv("DB_HOST") or os.getenv("DATABASE_HOST") or "localhost",
    "user": os.getenv("DB_USER") or os.getenv("DATABASE_USER") or "root",
    "password": os.getenv("DB_PASSWORD") or os.getenv("DATABASE_PASSWORD") or "pass",
    "database": os.getenv("DB_NAME") or os.getenv("DATABASE_NAME") or "bloodbank",
    "port": int(os.getenv("DB_PORT") or os.getenv("DATABASE_PORT") or 3306),
    "autocommit": False
}

SECRET_KEY = os.getenv("SECRET_KEY", "bloodbank-secret-key-2026")

