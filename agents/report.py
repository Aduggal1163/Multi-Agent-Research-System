from langchain_core.messages import SystemMessage, HumanMessage
from models import creative_llm
from state import ResearchState
from prompts import REPORT_SYSTEM_PROMPT, IMPROVE_REPORT_SYSTEM_PROMPT
from utils.logger import setup_logger

# Setup logger for the report agent
logger = setup_logger("agents.report")

def report_writer(state: ResearchState) -> dict:
    """Writes a structured research report from the analysis."""
    logger.info("Report Writer Agent started drafting initial report (Current Iteration: %d)", state.get('iterations', 0))
    try:
        logger.info("Synthesized Analysis size: %d characters", len(state.get('synthesis', '')))
        logger.info("Invoking LLM to write initial structured research report...")
        response = creative_llm.invoke([
            SystemMessage(content=REPORT_SYSTEM_PROMPT),
            HumanMessage(content=(
                f"analysis: {state.get('synthesis')}\n"
                f"query: {state.get('user_query')}"
            ))
        ])
        
        next_iterations = state.get('iterations', 0) + 1
        logger.info("Draft report generation complete. Generated report size: %d characters. Next iteration sequence set to: %d", len(response.content), next_iterations)
        
        return {
            'report': response.content,
            'iterations': next_iterations
        }
    except Exception as e:
        logger.error("Report Writer Agent failed: %s", str(e), exc_info=True)
        raise

def improve_report(state: ResearchState) -> dict:
    """Improves the current report using reviewer feedback."""
    logger.info("Improve Report Agent started processing revisions (Current Iteration: %d)", state.get('iterations', 0))
    try:
        logger.info("Reviewer Feedback to incorporate: '%s'", state.get('review', 'No feedback provided'))
        logger.info("Current Report size: %d characters", len(state.get('report', '')))
        
        logger.info("Invoking LLM to improve report draft based on reviewer instructions...")
        response = creative_llm.invoke([
            SystemMessage(content=IMPROVE_REPORT_SYSTEM_PROMPT),
            HumanMessage(content=f"""
User Query:
{state.get("user_query")}

Research Analysis:
{state.get("synthesis")}

Current Report:
{state.get("report")}

Reviewer Feedback:
{state.get("review")}

Revise the report by fixing every issue.
Do not introduce information that is not supported by the research analysis.
Return the entire improved report.
""")
        ])
        
        next_iterations = state.get('iterations', 0) + 1
        logger.info("Report improvement complete. Revised report size: %d characters. Next iteration sequence set to: %d", len(response.content), next_iterations)
        
        return {
            "report": response.content,
            "iterations": next_iterations
        }
    except Exception as e:
        logger.error("Improve Report Agent failed: %s", str(e), exc_info=True)
        raise
