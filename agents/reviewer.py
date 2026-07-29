from langgraph.graph import END
from langchain_core.messages import SystemMessage, HumanMessage
from models import llm, QualityReview
from state import ResearchState
from prompts import QUALITY_CHECK_SYSTEM_PROMPT
from config import TARGET_SCORE, MAX_ITERATIONS
from utils.logger import setup_logger

# Setup logger for the reviewer agent
logger = setup_logger("agents.reviewer")

def quality_check(state: ResearchState) -> dict:
    """Reviews and scores the report draft."""
    logger.info("Quality Checker Agent started evaluating report (Current Iteration: %d)", state.get('iterations', 0))
    try:
        # Structured output setup
        review_llm = llm.with_structured_output(QualityReview)
        
        logger.info("Report size for evaluation: %d characters", len(state.get('report', '')))
        logger.info("Invoking LLM to perform quality review evaluation...")
        review = review_llm.invoke([
            SystemMessage(content=QUALITY_CHECK_SYSTEM_PROMPT),
            HumanMessage(content=state.get("report", ""))
        ])
        
        logger.info("Quality Checker evaluation finished:")
        logger.info("  Assigned Score: %.2f", review.score)
        logger.info("  Assigned Feedback: '%s'", review.feedback)
        
        return {
            "score": review.score,
            "review": review.feedback
        }
    except Exception as e:
        logger.error("Quality Checker Agent failed: %s", str(e), exc_info=True)
        raise

def review_router(state: ResearchState):
    """Router decision logic based on current iteration count and quality score."""
    logger.info("Review Router making routing decision:")
    current_iterations = state.get("iterations", 0)
    current_score = state.get("score", 0.0)
    
    logger.info("  Current Iteration: %d / Maximum Iterations: %d", current_iterations, MAX_ITERATIONS)
    logger.info("  Current Quality Score: %.2f / Target Quality Score: %.2f", current_score, TARGET_SCORE)
    
    if current_iterations >= MAX_ITERATIONS:
        logger.info("  Route Action: END (Reason: Maximum iterations threshold reached)")
        return END
        
    if current_score >= TARGET_SCORE:
        logger.info("  Route Action: END (Reason: Target quality score met/exceeded)")
        return END
        
    logger.info("  Route Action: 'improve_report' (Reason: Target score not met and iterations remain)")
    return 'improve_report'
