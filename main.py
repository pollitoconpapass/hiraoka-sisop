from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import products, db_connection, users, pedidos, direcciones


app = FastAPI(title="Hiraoka SISOP", version="0.0.1")

origins = [
    "http://40.82.176.100",
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:3000",
    "http://68.154.52.110",
    "http://127.0.0.1:5500",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

PREFIX_API_VERSION = "/api/v1"

app.include_router(users.router, prefix=PREFIX_API_VERSION)
app.include_router(products.router, prefix=PREFIX_API_VERSION) 
app.include_router(db_connection.router, prefix=PREFIX_API_VERSION)
app.include_router(pedidos.router, prefix=PREFIX_API_VERSION)
app.include_router(direcciones.router, prefix=PREFIX_API_VERSION)


@app.get(f"{PREFIX_API_VERSION}/hello")
def hello():
    return{ "message": "Hello World!"}
