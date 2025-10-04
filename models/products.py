import enum
from database import Base
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, Text, DECIMAL, ForeignKey, Enum, TIMESTAMP


class EstadoProducto(enum.Enum):
    activo = "activo"
    inactivo = "inactivo"
    descontinuado = "descontinuado"
    

class Categoria(Base):
    __tablename__ = "Categorias"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    descripcion = Column(Text)
    imagen_url = Column(String(255))
    estado = Column(Enum("activo", "inactivo"), default="activo")
    fecha_creacion = Column(TIMESTAMP, server_default=func.now())

    productos = relationship("Producto", back_populates="categoria")


class Producto(Base):
    __tablename__ = "Productos"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(200), nullable=False)
    descripcion = Column(Text)
    precio_original = Column(DECIMAL(10,2), nullable=False)
    precio_oferta = Column(DECIMAL(10,2))
    stock = Column(Integer, default=0)
    sku = Column(String(50), unique=True)
    id_categoria = Column(Integer, ForeignKey("Categorias.id"))

    estado = Column(Enum(EstadoProducto), default=EstadoProducto.activo)
    fecha_creacion = Column(TIMESTAMP, server_default=func.now())
    fecha_actualizacion = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    categoria = relationship("Categoria", back_populates="productos")
    imagenes = relationship("ImagenProducto", back_populates="producto")


class ImagenProducto(Base):
    __tablename__ = "Imagenes_productos"
    id = Column(Integer, primary_key=True, index=True)
    id_producto = Column(Integer, ForeignKey("Productos.id"))
    url_imagen = Column(String(255), nullable=False)
    alt_text = Column(String(255))
    es_principal = Column(Integer, default=0)
    orden_visualizacion = Column(Integer, default=0)

    producto = relationship("Producto", back_populates="imagenes")
