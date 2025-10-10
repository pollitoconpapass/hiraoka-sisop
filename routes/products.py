from typing import List
from database import get_db
from sqlalchemy.orm import Session
from models.products import Producto
from fastapi import APIRouter, Depends, HTTPException
from schemas.products import ProductoCreate, ProductoUpdate, ProductoOut


router = APIRouter(prefix="/productos", tags=["Productos"])

MENSAJE_NO_ENCONTRADO = "Producto no encontrado"

# Create a new product
@router.post("/", response_model=ProductoOut)
def crear_producto(producto: ProductoCreate, db: Session = Depends(get_db)):
    nuevo_producto = Producto(**producto.dict())
    db.add(nuevo_producto)
    db.commit()
    db.refresh(nuevo_producto)
    return nuevo_producto

# Get all products
@router.get("/", response_model=List[ProductoOut])
def listar_productos(skip: int = 0, limit: int = 30, db: Session = Depends(get_db)):
    return db.query(Producto).offset(skip).limit(limit).all()


# Get product by ID
@router.get("/{producto_id}", response_model=ProductoOut)
def obtener_producto(producto_id: int, db: Session = Depends(get_db)):
    producto = db.query(Producto).filter(Producto.id == producto_id).first()
    if not producto:
        raise HTTPException(status_code=404, detail=MENSAJE_NO_ENCONTRADO)
    return producto

# Update product
@router.put("/{producto_id}", response_model=ProductoOut)
def actualizar_producto(producto_id: int, datos: ProductoUpdate, db: Session = Depends(get_db)):
    producto = db.query(Producto).filter(Producto.id == producto_id).first()
    if not producto:
        raise HTTPException(status_code=404, detail=MENSAJE_NO_ENCONTRADO)
    for key, value in datos.dict(exclude_unset=True).items():
        setattr(producto, key, value)
    db.commit()
    db.refresh(producto)
    return producto


# Delete product
@router.delete("/{producto_id}")
def eliminar_producto(producto_id: int, db: Session = Depends(get_db)):
    producto = db.query(Producto).filter(Producto.id == producto_id).first()
    if not producto:
        raise HTTPException(status_code=404, detail=MENSAJE_NO_ENCONTRADO)
    db.delete(producto)
    db.commit()
    return {"message": "Producto eliminado correctamente"}
