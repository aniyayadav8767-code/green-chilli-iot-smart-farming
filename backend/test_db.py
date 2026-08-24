import sys
import psycopg2
from app.config import settings
print(f"Connecting to: {settings.database_url}")
try:
    conn = psycopg2.connect(settings.database_url)
    print("Success")
    conn.close()
except Exception as e:
    print(f"Error: {e}")
