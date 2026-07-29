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