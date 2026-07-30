import os
import sys
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session

# Ensure Backend directory is in Python path for direct imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from graph import create_multi_agent_research
from database.db import get_db, Base, engine
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
from utils.logger import setup_logger

logger = setup_logger("api")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting up FastAPI application...")
    logger.info("Initializing database tables if not existing...")
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables initialized successfully.")
    except Exception as e:
        logger.critical("Database initialization failed: %s", str(e), exc_info=True)
        raise
    yield
    logger.info("Shutting down FastAPI application...")

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Multi-Agent Research API",
    description="LangGraph Multi-Agent Research System",
    lifespan=lifespan,
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger.info("Compiling workflow graph...")
workflow = create_multi_agent_research()
logger.info("Workflow graph compiled successfully.")

# =====================================================
# Generate Research
# =====================================================

@app.post("/research", response_model=ResearchResponse)
def generate_research(
    request: ResearchRequest,
    db: Session = Depends(get_db)
):
    logger.info("API: POST /research called with query: '%s'", request.query)
    
    if not request.query.strip():
        logger.warning("API: Empty research query provided")
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    try:
        logger.info("API: Initiating LangGraph research workflow for query: '%s'", request.query)
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
        logger.info("API: Research workflow completed. Score: %s, Iterations: %s", 
                    result.get("score"), result.get("iterations"))
        
        logger.info("API: Writing results to the database...")
        saved_report = create_research_report(
            db=db,
            query=result["user_query"],
            synthesis=result["synthesis"],
            report=result["report"],
            review=result["review"],
            score=result["score"],
            iterations=result["iterations"]
        )
        logger.info("API: Research report successfully saved with ID: %s", saved_report.id)

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
    except Exception as e:
        logger.error("API: Research workflow execution failed for query '%s': %s", 
                     request.query, str(e), exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Research generation failed: {str(e)}"
        )


# =====================================================
# Get All Reports
# =====================================================

@app.get("/reports", response_model=list[ResearchResponse])
def get_reports(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    logger.info("API: GET /reports called (skip=%s, limit=%s)", skip, limit)
    try:
        reports = get_all_research_reports(
            db=db,
            skip=skip,
            limit=limit
        )
        logger.info("API: Retrieved %d research reports from database", len(reports))
        return reports
    except Exception as e:
        logger.error("API: Failed to fetch research reports: %s", str(e), exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to fetch reports")


# =====================================================
# Get One Report
# =====================================================

@app.get("/reports/{report_id}", response_model=ResearchResponse)
def get_report(
    report_id: int,
    db: Session = Depends(get_db)
):
    logger.info("API: GET /reports/%s called", report_id)
    try:
        report = get_research_report(
            db=db,
            report_id=report_id
        )

        if report is None:
            logger.warning("API: Research report ID %s not found in database", report_id)
            raise HTTPException(
                status_code=404,
                detail="Report not found"
            )

        logger.info("API: Retrieved report ID %s ('%s')", report_id, report.query[:30])
        return report
    except HTTPException:
        raise
    except Exception as e:
        logger.error("API: Failed to fetch report ID %s: %s", report_id, str(e), exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to fetch report")


# =====================================================
# Search Reports
# =====================================================

@app.get("/search", response_model=list[ResearchResponse])
def search_reports(
    query: str,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    logger.info("API: GET /search called with query: '%s' (skip=%s, limit=%s)", query, skip, limit)
    try:
        reports = search_research_reports(
            db=db,
            search_term=query,
            skip=skip,
            limit=limit
        )
        logger.info("API: Found %d matching reports for search query: '%s'", len(reports), query)
        return reports
    except Exception as e:
        logger.error("API: Search failed for term '%s': %s", query, str(e), exc_info=True)
        raise HTTPException(status_code=500, detail="Search operation failed")


# =====================================================
# Delete Report
# =====================================================

@app.delete("/reports/{report_id}")
def delete_report(
    report_id: int,
    db: Session = Depends(get_db)
):
    logger.info("API: DELETE /reports/%s called", report_id)
    try:
        deleted = delete_research_report(
            db=db,
            report_id=report_id
        )

        if not deleted:
            logger.warning("API: Delete failed, report ID %s not found", report_id)
            raise HTTPException(
                status_code=404,
                detail="Report not found"
            )

        logger.info("API: Report ID %s successfully deleted", report_id)
        return {
            "message": "Report deleted successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error("API: Failed to delete report ID %s: %s", report_id, str(e), exc_info=True)
        raise HTTPException(status_code=500, detail="Delete operation failed")