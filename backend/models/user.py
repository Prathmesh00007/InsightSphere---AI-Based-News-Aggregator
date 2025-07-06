from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional
from datetime import datetime
from bson import ObjectId

class UserBase(BaseModel):
    """Base user model with common attributes"""
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    name: str = Field(..., min_length=1, max_length=100)
    country: str = Field(..., min_length=2, max_length=100)

class UserCreate(UserBase):
    """Model for user creation"""
    password: str = Field(..., min_length=6)

class UserInDB(UserBase):
    """Model for user data in database"""
    id: str = Field(..., alias="_id")  # Use alias to map _id to id
    hashed_password: str
    disabled: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    @validator("id", pre=True)
    def convert_objectid_to_str(cls, v):
        if isinstance(v, ObjectId):
            return str(v)
        return v

class UserUpdate(BaseModel):
    """Model for user updates"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    email: Optional[EmailStr] = None
    country: Optional[str] = Field(None, min_length=2, max_length=100)
    password: Optional[str] = Field(None, min_length=6)

class UserResponse(UserBase):
    """Model for user response"""
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True 

class RegisterResponse(BaseModel):
    user: UserResponse
    token: str
    token_type: str