from fastapi import FastAPI
from sqlalchemy import create_engine, text


app = FastAPI()

MYSQL_USER = "administrador"
MYSQL_PASSWORD = "administrador"
MYSQL_HOST = "4.174.128.233"
MYSQL_PORT = "3306"   
MYSQL_DB = "hiraoka"

DATABASE_URL = f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"
engine = create_engine(DATABASE_URL, echo=True)


@app.get("/test-db")
def test_db_connection():
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            return {"status": "success", "result": [row for row in result]}
    except Exception as e:
        return {"status": "error", "message": str(e)}