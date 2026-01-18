from pydantic import BaseModel, EmailStr, Field
from datetime import date
from typing import Optional


# Customer Schemas
class CustomerBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    phone: str = Field(..., min_length=1, max_length=20)


class CustomerCreate(CustomerBase):
    pass


class CustomerUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, min_length=1, max_length=20)


class CustomerResponse(CustomerBase):
    id: int

    class Config:
        from_attributes = True


# Vehicle Schemas
class VehicleBase(BaseModel):
    make: str = Field(..., min_length=1, max_length=50)
    model: str = Field(..., min_length=1, max_length=50)
    year: int = Field(..., ge=1900, le=2100)
    price: float = Field(..., ge=0)
    status: str = Field(default="available", max_length=20)
    customer_id: Optional[int] = None


class VehicleCreate(VehicleBase):
    pass


class VehicleUpdate(BaseModel):
    make: Optional[str] = Field(None, min_length=1, max_length=50)
    model: Optional[str] = Field(None, min_length=1, max_length=50)
    year: Optional[int] = Field(None, ge=1900, le=2100)
    price: Optional[float] = Field(None, ge=0)
    status: Optional[str] = Field(None, max_length=20)
    customer_id: Optional[int] = None


class VehicleResponse(VehicleBase):
    id: int

    class Config:
        from_attributes = True


# Service Schemas
class ServiceBase(BaseModel):
    vehicle_id: int
    description: str = Field(..., min_length=1, max_length=500)
    cost: float = Field(..., ge=0)
    date: date
    status: str = Field(default="pending", max_length=20)


class ServiceCreate(ServiceBase):
    pass


class ServiceUpdate(BaseModel):
    vehicle_id: Optional[int] = None
    description: Optional[str] = Field(None, min_length=1, max_length=500)
    cost: Optional[float] = Field(None, ge=0)
    date: Optional[date] = None
    status: Optional[str] = Field(None, max_length=20)


class ServiceResponse(ServiceBase):
    id: int

    class Config:
        from_attributes = True
