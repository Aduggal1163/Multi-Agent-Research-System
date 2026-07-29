from langchain_core.messages import SystemMessage, HumanMessage
from models import llm, ResearchQuestion
from state import ResearchState
from prompts import SPLITTER_SYSTEM_PROMPT
from utils.logger import setup_logger

# Setup logger for the splitter agent
logger = setup_logger("agents.splitter")

def split_questions(state: ResearchState) -> dict:
    """User gives one query, split it into 3 questions for detailed research."""
    logger.info("Splitter Agent started processing user query: '%s'", state.get('user_query'))
    try:
        # Bind the structured output schema
        question_llm = llm.with_structured_output(ResearchQuestion)
        
        logger.info("Invoking LLM to split user query into 3 distinct research questions...")
        response = question_llm.invoke([
            SystemMessage(content=SPLITTER_SYSTEM_PROMPT),
            HumanMessage(content=f"Research query is: {state.get('user_query')}")
        ])
        
        questions = response.questions
        logger.info("Successfully generated %d questions", len(questions))
        for idx, question in enumerate(questions, start=1):
            logger.info("  Question %d: %s", idx, question)
            
        if len(questions) != 3:
            raise ValueError(f"Expected 3 questions but got {len(questions)}")
            
        return {
            'research_questions': questions
        }
    except Exception as e:
        logger.error("Splitter Agent failed with error: %s", str(e), exc_info=True)
        raise
