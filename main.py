import os
import uvicorn
from fastapi import FastAPI
from routes import products, db_connection, users

HOST = os.getenv("VM_SERVER_IP", "0.0.0.0")
print(HOST)

app = FastAPI(title="Hiraoka SISOP", version="0.0.1")

# app.include_router(users.router, prefix="/api/v1")
# app.include_router(products.router, prefix="/api/v1") 
app.include_router(db_connection.router, prefix="/api/v1")


@app.get("/")
def hello():
    return{ "message": "Hello World!"}
