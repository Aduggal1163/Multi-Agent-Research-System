from langchain.chat_models import init_chat_model
from langchain_tavily import TavilySearch
from pydantic import BaseModel, Field
from config import (
    DEFAULT_MODEL,
    DEFAULT_TEMPERATURE,
    CREATIVE_TEMPERATURE,
    TAVILY_MAX_RESULTS,
    TAVILY_TOPIC,
)

# Initialize standard precision LLM
llm = init_chat_model(model=DEFAULT_MODEL, temperature=DEFAULT_TEMPERATURE)

# Initialize creative writing/improving LLM
creative_llm = init_chat_model(model=DEFAULT_MODEL, temperature=CREATIVE_TEMPERATURE)

# Initialize search tool
search_tool = TavilySearch(
    max_results=TAVILY_MAX_RESULTS,
    topic=TAVILY_TOPIC
)

# Structured Output Schemas
class ResearchQuestion(BaseModel):
    questions: list[str] = Field(description='Exactly three research questions')

class QualityReview(BaseModel):
    score: float = Field(
        description="Quality score between 0.0 and 1.0"
    )
    feedback: str = Field(
        description="Short explanation of the score"
    )
