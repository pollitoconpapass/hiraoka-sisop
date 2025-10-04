from database import Base
from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, ForeignKey


class Direcciones(Base):
    __tablename__ = "Direcciones"

    id = Column(Integer, primary_key=True, index=True)
    id_usuario = Column(Integer, ForeignKey("Usuarios.id"))
    calle = Column(String(255), nullable=False)
    ciudad = Column(String(100), nullable=False)
    estado = Column(String(100), nullable=False)
    pais = Column(String(100), nullable=False)
    codigo_postal = Column(String(20), nullable=False)

    usuarios = relationship("Usuarios", back_populates="direcciones")
    pedidos_envio = relationship("Pedidos", foreign_keys="[Pedidos.id_direccion_envio]", back_populates="direccion_envio")
    pedidos_facturacion = relationship("Pedidos", foreign_keys="[Pedidos.id_direccion_facturacion]", back_populates="direccion_facturacion")


