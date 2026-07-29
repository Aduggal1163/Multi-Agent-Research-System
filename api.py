from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi import FastAPI
from graph import create_multi_agent_research
from database.db import get_db
from database.crud import (
    create_research_report,
    get_all_research_reports,
    get_research_report,
    delete_research_report,
    search_research_reports,
)
from schemas import (
    ResearchRequest,
    ResearchResponse,
)

app = FastAPI(
    title="Multi-Agent Research API",
    description="LangGraph Multi-Agent Research System",
)
workflow = create_multi_agent_research()

# =====================================================
# Generate Research
# =====================================================


@app.post("/research", response_model=ResearchResponse)
def generate_research(
    request: ResearchRequest,
    db: Session = Depends(get_db)
):

    result = workflow.invoke(
        {
            "messages": [],
            "user_query": request.query,
            "research_questions": [],
            "research_results": [],
            "synthesis": "",
            "report": "",
            "review": "",
            "score": 0.0,
            "iterations": 0
        }
    )

    saved_report = create_research_report(
        db=db,
        query=result["user_query"],
        synthesis=result["synthesis"],
        report=result["report"],
        review=result["review"],
        score=result["score"],
        iterations=result["iterations"]
    )

    return ResearchResponse(
        id=saved_report.id,
        query=saved_report.query,
        synthesis=saved_report.synthesis,
        report=saved_report.report,
        review=saved_report.review,
        score=saved_report.score,
        iterations=saved_report.iterations,
        created_at=saved_report.created_at
    )


# =====================================================
# Get All Reports
# =====================================================

@app.get("/reports")
def get_reports(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return get_all_research_reports(
        db=db,
        skip=skip,
        limit=limit
    )


# =====================================================
# Get One Report
# =====================================================

@app.get("/reports/{report_id}")
def get_report(
    report_id: int,
    db: Session = Depends(get_db)
):

    report = get_research_report(
        db=db,
        report_id=report_id
    )

    if report is None:
        raise HTTPException(
            status_code=404,
            detail="Report not found"
        )

    return report


# =====================================================
# Search Reports
# =====================================================

@app.get("/search")
def search_reports(
    query: str,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):

    return search_research_reports(
        db=db,
        search_term=query,
        skip=skip,
        limit=limit
    )


# =====================================================
# Delete Report
# =====================================================

@app.delete("/reports/{report_id}")
def delete_report(
    report_id: int,
    db: Session = Depends(get_db)
):

    deleted = delete_research_report(
        db=db,
        report_id=report_id
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Report not found"
        )

    return {
        "message": "Report deleted successfully"
    }