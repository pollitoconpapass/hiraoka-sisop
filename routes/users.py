from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.users import Usuarios
from schemas.users import UsuarioCreate, UsuarioOut, LoginRequest
from passlib.context import CryptContext
from datetime import datetime

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])

# pwd_context removed as we're doing direct password comparison for testing

def hash_password(password: str):
    return password  # For testing purposes, no hashing

def verify_password(password: str, stored_password: str):
    return password == stored_password  # Direct comparison for testing

@router.post("/registro", response_model=UsuarioOut)
def registrar_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    existe = db.query(Usuarios).filter(Usuarios.email == usuario.email).first()
    if existe:
        raise HTTPException(status_code=400, detail="El email ya está registrado")
    nuevo_usuario = Usuarios(
        nombre=usuario.nombre,
        apellidos=usuario.apellidos,
        email=usuario.email,
        telefono=usuario.telefono,
        password_hash=hash_password(usuario.password)
    )
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    return nuevo_usuario

@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    usuario = db.query(Usuarios).filter(Usuarios.email == request.email).first()
    if not usuario or not verify_password(request.password, usuario.password_hash):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    usuario.ultimo_acceso = datetime.utcnow()
    db.commit()
    return {"message": "Login exitoso", "usuario_id": usuario.id, "email": usuario.email}
