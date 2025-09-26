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


if __name__ == "__main__":
    uvicorn.run("main:app", host=HOST, port=8000, log_level="info", reload=True)