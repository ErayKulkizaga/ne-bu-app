from pydantic import BaseModel, ConfigDict


class IngredientResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    normalized_name: str
    e_number: str | None
    is_additive: bool
    additive_type: str | None
    concern_level: int
    description: str | None


class ProductIngredientResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    position: int
    raw_text: str | None
    ingredient: IngredientResponse
