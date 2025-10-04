from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.pedidos import Pedidos, DetallesPedido
from models.products import Producto
from schemas.pedidos import PedidoCreate, PedidoOut
from typing import List
import uuid

router = APIRouter(prefix="/pedidos", tags=["Pedidos"])

# List all the orders
@router.get("/", response_model=List[PedidoOut])
def listar_pedidos(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return db.query(Pedidos).offset(skip).limit(limit).all()


# Create a new order
@router.post("/", response_model=PedidoOut)
def crear_pedido(pedido_data: PedidoCreate, db: Session = Depends(get_db)):
    subtotal = 0
    for item in pedido_data.items:
        producto = db.query(Producto).filter(Producto.id == item.id_producto).first()
        if not producto or producto.stock < item.cantidad:
            raise HTTPException(status_code=400, detail=f"Producto {item.id_producto} no disponible")
        subtotal += item.cantidad * item.precio_unitario

    nuevo_pedido = Pedidos(
        numero_pedido=str(uuid.uuid4())[:8].upper(),
        id_usuario=pedido_data.id_usuario,
        id_direccion_envio=pedido_data.id_direccion_envio,
        id_direccion_facturacion=pedido_data.id_direccion_facturacion,
        subtotal=subtotal,
        total=subtotal, # -> no taxes no shipping
        metodo_pago=pedido_data.metodo_pago
    )

    db.add(nuevo_pedido)
    db.commit()
    db.refresh(nuevo_pedido)

    # Insert into the db
    for item in pedido_data.items:
        detalle = DetallesPedido(
            id_pedido=nuevo_pedido.id,
            id_producto=item.id_producto,
            cantidad=item.cantidad,
            precio_unitario=item.precio_unitario,
            subtotal=item.cantidad * item.precio_unitario
        )
        db.add(detalle)
        # Deduct stock
        producto = db.query(Producto).filter(Producto.id == item.id_producto).first()
        producto.stock -= item.cantidad

    db.commit()
    return nuevo_pedido


# List orders for a specific user
@router.get("/usuario/{usuario_id}", response_model=List[PedidoOut])
def listar_pedidos_usuario(usuario_id: int, db: Session = Depends(get_db)):
    pedidos = db.query(Pedidos).filter(Pedidos.id_usuario == usuario_id).all()
    if not pedidos:
        raise HTTPException(status_code=404, detail="El usuario no tiene pedidos")
    return pedidos


# Get a specific order for a user
@router.get("/usuario/{usuario_id}/{pedido_id}", response_model=PedidoOut)
def obtener_pedido_usuario(usuario_id: int, pedido_id: int, db: Session = Depends(get_db)):
    pedido = db.query(Pedidos).filter(
        Pedidos.id == pedido_id,
        Pedidos.id_usuario == usuario_id
    ).first()
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido no encontrado para este usuario")
    return pedido
