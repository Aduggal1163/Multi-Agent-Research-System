from sqlalchemy import Column, Integer, Float, Text, DateTime
from datetime import datetime

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
        default=datetime.utcnow
    )