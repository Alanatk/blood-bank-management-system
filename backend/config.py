# config.py
import os
from dotenv import load_dotenv

load_dotenv()

DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", "pass"),
    "database": os.getenv("DB_NAME", "bloodbank"),
    "port": int(os.getenv("DB_PORT", 3306)),
    "autocommit": False
}

SECRET_KEY = os.getenv("SECRET_KEY", "bloodbank-secret-key-2026")
