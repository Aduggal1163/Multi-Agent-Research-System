from langchain_core.messages import SystemMessage, HumanMessage
from models import creative_llm, search_tool
from state import ResearchState
from prompts import INNOVATION_SYSTEM_PROMPT
from utils.logger import setup_logger

# Setup logger for the innovation agent
logger = setup_logger("agents.innovation")

def research3(state: ResearchState) -> dict:
    """Node representing the Innovation and Tech Analyst Agent."""
    logger.info("Innovation & Tech Agent started processing research task")
    try:
        # Retrieve the third query split for Tech & Trends Analysis
        question = state['research_questions'][2]
        logger.info("Innovation analysis target question: '%s'", question)
        
        logger.info("Invoking Tavily Search for technology trends research...")
        web_search_results = search_tool.invoke(question)
        logger.info("Tavily search completed successfully with results length: %d chars", len(str(web_search_results)))
        
        logger.info("Invoking Creative LLM to analyze search findings...")
        response = creative_llm.invoke([
            SystemMessage(content=INNOVATION_SYSTEM_PROMPT),
            HumanMessage(content=f"research question: {question} \nweb search results {web_search_results}")
        ])
        
        logger.info("Innovation analysis completed. Generated output size: %d characters", len(response.content))
        return {
            'research_results': [response.content]
        }
    except Exception as e:
        logger.error("Innovation & Tech Agent execution failed: %s", str(e), exc_info=True)
        raise
