from pydantic import BaseModel
from typing import Optional

class UserModel(BaseModel):
    email: str
    hashed_password: str

class ClassModel(BaseModel):
    name: str
    description: str
    schedule: str
    image_url: str

class ClassUpdateModel(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    schedule: Optional[str] = None

class PricingModel(BaseModel):
    name: str
    is_featured: bool = False
    monthly: str
    quarterly: str
    half_yearly: str
    yearly: str

class PricingUpdateModel(BaseModel):
    name: Optional[str] = None
    is_featured: Optional[bool] = None
    monthly: Optional[str] = None
    quarterly: Optional[str] = None
    half_yearly: Optional[str] = None
    yearly: Optional[str] = None
