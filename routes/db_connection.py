import os
from typing import Dict, Any, List
from fastapi import APIRouter, HTTPException
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError

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

@router.get("/tables/all/data")
def get_all_tables_data(limit: int = 10) -> Dict[str, Any]:
    try:
        with engine.connect() as connection:
            tables_result = connection.execute(
                text("SELECT table_name FROM information_schema.tables WHERE table_schema = :db"),
                {"db": MYSQL_DB}
            )
            tables = [row[0] for row in tables_result]

            if limit > 100:
                limit = 100

            all_data = {}
            for table in tables:
                result = connection.execute(text(f"SELECT * FROM {table} LIMIT :limit"), {"limit": limit})
                data = [dict(row._mapping) for row in result]

                count_result = connection.execute(text(f"SELECT COUNT(*) FROM {table}"))
                total_rows = count_result.scalar()

                all_data[table] = {
                    "total_rows": total_rows,
                    "returned_rows": len(data),
                    "limit": limit,
                    "data": data
                }

            return {
                "status": "success",
                "tables": all_data
            }

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener datos de las tablas: {str(e)}"
        )



@router.get("/table/{table_name}/data")
def get_table_data(table_name: str, limit: int = 10) -> Dict[str, Any]:
    try:
        with engine.connect() as connection:
            table_check = connection.execute(
                text("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = :db AND table_name = :table"),
                {"db": MYSQL_DB, "table": table_name}
            )
            
            if table_check.scalar() == 0:
                raise HTTPException(status_code=404, detail=f"La tabla '{table_name}' no existe")
            
            if limit > 100:  
                limit = 100
                
            result = connection.execute(text(f"SELECT * FROM {table_name} LIMIT :limit"), {"limit": limit})
            
            data = [dict(row._mapping) for row in result]
            
            count_result = connection.execute(text(f"SELECT COUNT(*) FROM {table_name}"))
            total_rows = count_result.scalar()
            
            return {
                "status": "success",
                "table": table_name,
                "total_rows": total_rows,
                "returned_rows": len(data),
                "limit": limit,
                "data": data
            }
            
    except HTTPException:
        raise
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error al obtener datos de la tabla: {str(e)}"
        )