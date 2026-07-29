from pydantic import BaseModel
from datetime import datetime


class ResearchRequest(BaseModel):
    query: str


class ResearchResponse(BaseModel):
    id: int
    query: str
    synthesis: str
    report: str
    review: str | None
    score: float | None
    iterations: int
    created_at: datetime

    class Config:
        from_attributes = True