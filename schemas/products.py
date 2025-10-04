from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel

class ImagenProductoBase(BaseModel):
    url_imagen: str
    alt_text: Optional[str]
    es_principal: Optional[int] = 0
    orden_visualizacion: Optional[int] = 0

class ImagenProductoOut(ImagenProductoBase):
    id: int

    class Config:
        from_attributes = True

class ProductoBase(BaseModel):
    nombre: str
    descripcion: Optional[str]
    precio_original: float
    precio_oferta: Optional[float] = None
    stock: int = 0
    sku: Optional[str]
    id_categoria: Optional[int]

class ProductoCreate(ProductoBase):
    pass

class ProductoUpdate(ProductoBase):
    pass

class ProductoOut(ProductoBase):
    id: int
    estado: str
    fecha_creacion: datetime
    fecha_actualizacion: datetime
    imagenes: List[ImagenProductoOut] = []

    class Config:
        from_attributes = True
