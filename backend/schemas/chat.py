from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    topic: str = Field(..., min_length=1, description="Basic topic for the email")


class ChatResponse(BaseModel):
    response: str
