from pydantic import BaseModel

class DireccionBase(BaseModel):
    calle: str
    ciudad: str
    estado: str
    pais: str
    codigo_postal: str

class DireccionCreate(DireccionBase):
    id_usuario: int

class DireccionResponse(DireccionBase):
    id: int

    class Config:
        from_attributes = True
