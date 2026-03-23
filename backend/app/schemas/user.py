from datetime import datetime
from pydantic import BaseModel, ConfigDict


class UserCreate(BaseModel):
    device_id: str


class UserPreferenceCreate(BaseModel):
    preference_key: str
    preference_value: str


class UserPreferenceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    preference_key: str
    preference_value: str


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    device_id: str
    created_at: datetime
    preferences: list[UserPreferenceResponse] = []
