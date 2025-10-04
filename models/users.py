from database import Base
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, Enum, TIMESTAMP

class Usuarios(Base):
    __tablename__ = "Usuarios"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    apellidos = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    telefono = Column(String(20))
    fecha_nacimiento = Column(TIMESTAMP)
    genero = Column(Enum("M", "F", "otro"))
    estado = Column(Enum("activo", "inactivo", "suspendido"), default="activo")
    fecha_registro = Column(TIMESTAMP, server_default=func.now())
    ultimo_acceso = Column(TIMESTAMP)
    email_verificado = Column(Integer, default=0)  # 0 = no verificado, 1 = verificado

    pedidos = relationship("Pedidos", back_populates="usuarios")
    direcciones = relationship("Direcciones", back_populates="usuarios")