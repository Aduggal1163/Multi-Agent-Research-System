from sqlalchemy.orm import Session
from database.models import ResearchReport

def create_research_report(
    db: Session,
    query: str,
    synthesis: str,
    report: str,
    review: str = None,
    score: float = None,
    iterations: int = 0
) -> ResearchReport:
    """Inserts a completed research workflow output into the SQLite database."""
    db_report = ResearchReport(
        query=query,
        synthesis=synthesis,
        report=report,
        review=review,
        score=score,
        iterations=iterations
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report

def get_research_report(db: Session, report_id: int) -> ResearchReport | None:
    """Retrieves a single research report by its unique ID."""
    return db.query(ResearchReport).filter(ResearchReport.id == report_id).first()

def get_all_research_reports(db: Session, skip: int = 0, limit: int = 100) -> list[ResearchReport]:
    """Retrieves all stored research reports ordered by creation date (newest first)."""
    return db.query(ResearchReport).order_by(ResearchReport.created_at.desc()).offset(skip).limit(limit).all()

def delete_research_report(db: Session, report_id: int) -> bool:
    """Deletes a research report entry from the database. Returns True if found and deleted."""
    db_report = db.query(ResearchReport).filter(ResearchReport.id == report_id).first()
    if db_report:
        db.delete(db_report)
        db.commit()
        return True
    return False

def update_research_report(
    db: Session,
    report_id: int,
    query: str = None,
    synthesis: str = None,
    report: str = None,
    review: str = None,
    score: float = None,
    iterations: int = None
) -> ResearchReport | None:
    """Updates an existing research report's fields."""
    db_report = db.query(ResearchReport).filter(ResearchReport.id == report_id).first()
    if not db_report:
        return None
        
    if query is not None:
        db_report.query = query
    if synthesis is not None:
        db_report.synthesis = synthesis
    if report is not None:
        db_report.report = report
    if review is not None:
        db_report.review = review
    if score is not None:
        db_report.score = score
    if iterations is not None:
        db_report.iterations = iterations
        
    db.commit()
    db.refresh(db_report)
    return db_report

def search_research_reports(db: Session, search_term: str, skip: int = 0, limit: int = 100) -> list[ResearchReport]:
    """Searches for research reports matching a search term in the query, synthesis, or report fields."""
    like_term = f"%{search_term}%"
    return db.query(ResearchReport).filter(
        (ResearchReport.query.ilike(like_term)) |
        (ResearchReport.synthesis.ilike(like_term)) |
        (ResearchReport.report.ilike(like_term))
    ).order_by(ResearchReport.created_at.desc()).offset(skip).limit(limit).all()

