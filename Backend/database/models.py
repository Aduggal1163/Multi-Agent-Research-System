from sqlalchemy import Column, Integer, Float, Text, DateTime
from datetime import datetime, timezone

from database.db import Base


class ResearchReport(Base):
    __tablename__ = "research_reports"

    id = Column(Integer, primary_key=True, index=True)

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