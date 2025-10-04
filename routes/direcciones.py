from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.direcciones import Direcciones
from schemas.direcciones import DireccionCreate, DireccionResponse

router = APIRouter(prefix="/direcciones", tags=["Direcciones"])


@router.post("/", response_model=DireccionResponse)
def crear_direccion(direccion: DireccionCreate, db: Session = Depends(get_db)):
    nueva_direccion = Direcciones(**direccion.dict())
    db.add(nueva_direccion)
    db.commit()
    db.refresh(nueva_direccion)
    return nueva_direccion


@router.get("/{id_usuario}", response_model=list[DireccionResponse])
def listar_direcciones(id_usuario: int, db: Session = Depends(get_db)):
    return db.query(Direcciones).filter(Direcciones.id_usuario == id_usuario).all()
