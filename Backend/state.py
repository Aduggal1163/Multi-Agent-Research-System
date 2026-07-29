import operator
from typing import Annotated
from typing_extensions import TypedDict
from langgraph.graph.message import add_messages

class ResearchState(TypedDict):
    messages: Annotated[list, add_messages]
    user_query: str
    research_questions: list[str]
    research_results: Annotated[list[str], operator.add]
    synthesis: str
    report: str
    review: str
    score: float
    iterations: int
