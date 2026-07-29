from langchain_core.messages import SystemMessage, HumanMessage
from models import llm, search_tool
from state import ResearchState
from prompts import MARKET_SYSTEM_PROMPT
from utils.logger import setup_logger

# Setup logger for the market agent
logger = setup_logger("agents.market")

def research1(state: ResearchState) -> dict:
    """Node representing the Market Analyst Agent."""
    logger.info("Market Agent started processing research task")
    try:
        # Retrieve the first query split for Market Analysis
        question = state['research_questions'][0]
        logger.info("Market analysis target question: '%s'", question)
        
        logger.info("Invoking Tavily Search for market research...")
        web_search_results = search_tool.invoke(question)
        logger.info("Tavily search completed successfully with results length: %d chars", len(str(web_search_results)))
        
        logger.info("Invoking Market LLM to analyze search findings...")
        response = llm.invoke([
            SystemMessage(content=MARKET_SYSTEM_PROMPT),
            HumanMessage(content=f"research question: {question} \nweb search results {web_search_results}")
        ])
        
        logger.info("Market analysis completed. Generated output size: %d characters", len(response.content))
        return {
            'research_results': [response.content]
        }
    except Exception as e:
        logger.error("Market Agent execution failed: %s", str(e), exc_info=True)
        raise
