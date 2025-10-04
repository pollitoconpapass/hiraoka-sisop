from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr

class UsuarioBase(BaseModel):
    nombre: str
    apellidos: str
    email: EmailStr
    telefono: Optional[str] = None

class UsuarioCreate(UsuarioBase):
    password: str

class UsuarioOut(UsuarioBase):
    id: int
    estado: str
    fecha_registro: datetime
    email_verificado: bool

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
