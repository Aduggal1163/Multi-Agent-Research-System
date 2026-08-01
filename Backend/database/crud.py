from sqlalchemy.orm import Session
from database.models import ResearchReport, DocumentModel, User

# =====================================================
# User CRUD Operations
# =====================================================
def create_user(
    db: Session,
    email: str,
    hashed_password: str,
    full_name: str,
    role: str = "Enterprise Analyst"
) -> User:
    """Creates a new user entry in the SQLite database."""
    db_user = User(
        email=email.lower().strip(),
        hashed_password=hashed_password,
        full_name=full_name.strip(),
        role=role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_email(db: Session, email: str) -> User | None:
    """Retrieves a user by unique email address."""
    return db.query(User).filter(User.email == email.lower().strip()).first()

def get_user_by_id(db: Session, user_id: int) -> User | None:
    """Retrieves a user by unique primary key ID."""
    return db.query(User).filter(User.id == user_id).first()


# =====================================================
# Research Report CRUD Operations
# =====================================================
def create_research_report(
    db: Session,
    query: str,
    synthesis: str,
    report: str,
    review: str = None,
    score: float = None,
    iterations: int = 0,
    user_id: int = None
) -> ResearchReport:
    """Inserts a completed research workflow output into the SQLite database."""
    db_report = ResearchReport(
        query=query,
        synthesis=synthesis,
        report=report,
        review=review,
        score=score,
        iterations=iterations,
        user_id=user_id
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report

def get_research_report(db: Session, report_id: int) -> ResearchReport | None:
    """Retrieves a single research report by its unique ID."""
    return db.query(ResearchReport).filter(ResearchReport.id == report_id).first()

def get_all_research_reports(db: Session, skip: int = 0, limit: int = 100, user_id: int = None) -> list[ResearchReport]:
    """Retrieves all stored research reports ordered by creation date (newest first)."""
    query = db.query(ResearchReport)
    if user_id is not None:
        query = query.filter(ResearchReport.user_id == user_id)
    return query.order_by(ResearchReport.created_at.desc()).offset(skip).limit(limit).all()

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


# =====================================================
# Document CRUD Operations
# =====================================================
def create_document(
    db: Session,
    filename: str,
    title: str,
    summary: str,
    chunk_count: int,
    file_path: str,
    short_summary: str = "",
    detailed_summary: str = "",
    bullet_summary: str = "",
    mindmap_code: str = "",
    flowchart_code: str = "",
    user_id: int = None
) -> DocumentModel:
    """Inserts an uploaded document metadata into the SQLite database."""
    db_doc = DocumentModel(
        filename=filename,
        title=title,
        summary=summary,
        short_summary=short_summary or summary,
        detailed_summary=detailed_summary or summary,
        bullet_summary=bullet_summary,
        mindmap_code=mindmap_code,
        flowchart_code=flowchart_code,
        chunk_count=chunk_count,
        file_path=file_path,
        user_id=user_id
    )
    db.add(db_doc)
    db.commit()
    db.refresh(db_doc)
    return db_doc

def get_all_documents(db: Session, skip: int = 0, limit: int = 100, user_id: int = None) -> list[DocumentModel]:
    """Retrieves all stored uploaded documents ordered by creation date."""
    query = db.query(DocumentModel)
    if user_id is not None:
        query = query.filter(DocumentModel.user_id == user_id)
    return query.order_by(DocumentModel.created_at.desc()).offset(skip).limit(limit).all()

def get_document(db: Session, doc_id: int) -> DocumentModel | None:
    """Retrieves a single uploaded document by ID."""
    return db.query(DocumentModel).filter(DocumentModel.id == doc_id).first()

def delete_document(db: Session, doc_id: int) -> bool:
    """Deletes a document entry from the database."""
    db_doc = db.query(DocumentModel).filter(DocumentModel.id == doc_id).first()
    if db_doc:
        db.delete(db_doc)
        db.commit()
        return True
    return False
