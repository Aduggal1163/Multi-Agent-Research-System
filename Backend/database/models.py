from sqlalchemy import Column, Integer, Float, Text, DateTime, String
from datetime import datetime, timezone

from database.db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, default="Enterprise Analyst")
    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc)
    )


class ResearchReport(Base):
    __tablename__ = "research_reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    query = Column(Text, nullable=False)
    synthesis = Column(Text, nullable=False)
    report = Column(Text, nullable=False)
    review = Column(Text)
    score = Column(Float)
    iterations = Column(Integer)
    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc)
    )


class DocumentModel(Base):
    __tablename__ = "uploaded_documents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    filename = Column(Text, nullable=False)
    title = Column(Text, nullable=False)
    summary = Column(Text, nullable=True)
    short_summary = Column(Text, nullable=True)
    detailed_summary = Column(Text, nullable=True)
    bullet_summary = Column(Text, nullable=True)
    mindmap_code = Column(Text, nullable=True)
    flowchart_code = Column(Text, nullable=True)
    chunk_count = Column(Integer, default=0)
    file_path = Column(Text, nullable=False)
    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc)
    )