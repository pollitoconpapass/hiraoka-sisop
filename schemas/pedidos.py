from pydantic import BaseModel
from typing import List, Optional, Literal
from datetime import datetime

class PedidoItem(BaseModel):
    id_producto: int
    cantidad: int
    precio_unitario: float

class PedidoCreate(BaseModel):
    id_usuario: int
    id_direccion_envio: int
    id_direccion_facturacion: int
    metodo_pago: Literal['tarjeta_credito', 'tarjeta_debito', 'transferencia', 'paypal', 'contra_entrega']
    items: List[PedidoItem]

class PedidoOut(BaseModel):
    id: int
    numero_pedido: str
    id_usuario: int
    subtotal: float
    total: float
    estado: str
    metodo_pago: str
    fecha_pedido: datetime

    class Config:
        from_attributes = True
