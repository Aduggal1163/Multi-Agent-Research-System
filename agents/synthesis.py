from langchain_core.messages import SystemMessage, HumanMessage
from models import llm
from state import ResearchState
from prompts import SYNTHESIS_SYSTEM_PROMPT
from utils.logger import setup_logger

# Setup logger for the synthesis agent
logger = setup_logger("agents.synthesis")

def synthesis_analyst(state: ResearchState) -> dict:
    """Node representing the Synthesis & Analyst Agent."""
    logger.info("Synthesis & Analyst Agent started processing collected research results")
    try:
        responses = state.get('research_results', [])
        logger.info("Retrieved %d individual research agent response(s) to synthesize", len(responses))
        
        # Combine responses with double newlines
        results = '\n\n'.join(responses)
        logger.info("Aggregated text size for synthesis: %d characters", len(results))
        
        logger.info("Invoking LLM to synthesize research findings into high-level analysis...")
        response = llm.invoke([
            SystemMessage(content=SYNTHESIS_SYSTEM_PROMPT),
            HumanMessage(content=results)
        ])
        
        logger.info("Synthesis successfully completed. Output size: %d characters", len(response.content))
        return {
            'synthesis': response.content
        }
    except Exception as e:
        logger.error("Synthesis & Analyst Agent execution failed: %s", str(e), exc_info=True)
        raise
