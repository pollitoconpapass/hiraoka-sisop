import os
from fastapi import APIRouter, HTTPException
from sqlalchemy import create_engine, text

router = APIRouter(prefix="/db-connection", tags=["users"])


MYSQL_USER = os.getenv("MYSQL_USER")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD")
MYSQL_HOST = os.getenv("MYSQL_HOST")
MYSQL_PORT = 3306
MYSQL_DB = os.getenv("MYSQL_DB")

DATABASE_URL = f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"
engine = create_engine(DATABASE_URL, echo=True)


@router.get("/test-db")
def test_db_connection():
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            data = [tuple(row) for row in result]
            return {"status": "success", "result": data}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@router.get("/tables")
def get_all_tables():
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SHOW TABLES"))
            tables = [row[0] for row in result]
            return {
                "status": "success", 
                "database": MYSQL_DB,
                "total_tables": len(tables),
                "tables": tables
            }
    except Exception as e:
        return {"status": "error", "message": str(e)}