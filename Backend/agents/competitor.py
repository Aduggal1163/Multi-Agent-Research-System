from langchain_core.messages import SystemMessage, HumanMessage
from models import llm, search_tool
from state import ResearchState
from prompts import COMPETITOR_SYSTEM_PROMPT
from utils.logger import setup_logger

# Setup logger for the competitor agent
logger = setup_logger("agents.competitor")

def research2(state: ResearchState) -> dict:
    """Node representing the Competitor Analyst Agent."""
    logger.info("Competitor Agent started processing research task")
    try:
        # Retrieve the second query split for Competitor Analysis
        question = state['research_questions'][1]
        logger.info("Competitor analysis target question: '%s'", question)
        
        logger.info("Invoking Tavily Search for competitor research...")
        web_search_results = search_tool.invoke(question)
        logger.info("Tavily search completed successfully with results length: %d chars", len(str(web_search_results)))
        
        logger.info("Invoking Competitor LLM to analyze search findings...")
        response = llm.invoke([
            SystemMessage(content=COMPETITOR_SYSTEM_PROMPT),
            HumanMessage(content=f"research question: {question} \nweb search results {web_search_results}")
        ])
        
        logger.info("Competitor analysis completed. Generated output size: %d characters", len(response.content))
        return {
            'research_results': [response.content]
        }
    except Exception as e:
        logger.error("Competitor Agent execution failed: %s", str(e), exc_info=True)
        raise
