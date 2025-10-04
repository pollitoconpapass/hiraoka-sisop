from database import Base
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, Text, DECIMAL, ForeignKey, Enum, TIMESTAMP

class Pedidos(Base):
    __tablename__ = "Pedidos"
    id = Column(Integer, primary_key=True, index=True)
    numero_pedido = Column(String(50), unique=True, nullable=False)
    id_usuario = Column(Integer, ForeignKey("Usuarios.id"))
    id_direccion_envio = Column(Integer, ForeignKey("Direcciones.id"))
    id_direccion_facturacion = Column(Integer, ForeignKey("Direcciones.id"))
    subtotal = Column(DECIMAL(10,2), nullable=False)
    total = Column(DECIMAL(10,2), nullable=False)
    estado = Column(Enum('pendiente', 'confirmado', 'procesando', 'enviado', 'entregado', 'cancelado', 'devuelto'), default='pendiente')
    metodo_pago = Column(Enum('tarjeta_credito', 'tarjeta_debito', 'transferencia', 'paypal', 'contra_entrega'), nullable=False)
    fecha_pedido = Column(TIMESTAMP, server_default=func.now())
    fecha_envio = Column(TIMESTAMP)
    fecha_entrega = Column(TIMESTAMP)
    notas_especiales = Column(Text)

    detalles = relationship("DetallesPedido", back_populates="pedido")
    direccion_envio = relationship("Direcciones", foreign_keys=[id_direccion_envio], back_populates="pedidos_envio")
    direccion_facturacion = relationship("Direcciones", foreign_keys=[id_direccion_facturacion], back_populates="pedidos_facturacion")
    usuarios = relationship("Usuarios", back_populates="pedidos")


class DetallesPedido(Base):
    __tablename__ = "Pedido_detalles"
    id = Column(Integer, primary_key=True, index=True)
    id_pedido = Column(Integer, ForeignKey("Pedidos.id", ondelete="CASCADE"))
    id_producto = Column(Integer, ForeignKey("Productos.id"))
    cantidad = Column(Integer, nullable=False)
    precio_unitario = Column(DECIMAL(10,2), nullable=False)
    subtotal = Column(DECIMAL(10,2), nullable=False)

    pedido = relationship("Pedidos", back_populates="detalles")
