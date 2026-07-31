from pydantic import BaseModel
from datetime import datetime


class ResearchRequest(BaseModel):
    query: str
    document_ids: list[int] | None = None


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


class DocumentResponse(BaseModel):
    id: int
    filename: str
    title: str
    summary: str
    short_summary: str | None = None
    detailed_summary: str | None = None
    bullet_summary: str | None = None
    mindmap_code: str | None = None
    flowchart_code: str | None = None
    chunk_count: int
    file_path: str
    created_at: datetime

    class Config:
        from_attributes = True


class DocumentChatRequest(BaseModel):
    question: str
    doc_id: int | None = None


class DocumentChatResponse(BaseModel):
    answer: str
    sources: list[str] = []