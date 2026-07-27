from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.types import Send
from langchain.chat_models import init_chat_model
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage, BaseMessage
from typing_extensions import TypedDict, Annotated
from typing import Literal
from pydantic import BaseModel, Field
import operator
import json
from dotenv import load_dotenv

load_dotenv()

llm = init_chat_model(model='gpt-4o-mini',temperature = 0)
creative_llm = init_chat_model(model='gpt-4o-mini',temperature = 0.8)
# ============================================================
# State Schema
# ============================================================

class ResearchState(TypedDict):
    messages: Annotated[list, add_messages]
    user_query: str
    research_questions: list[str]
    research_results: Annotated[list[str],operator.add]
    synthesis: str
    report: str
    review: str
    score: float

def create_multi_agent_research():
    def split_questions(state: ResearchState)->dict:
        """User gives one question split it into 3 questions for more detailed answer"""
        response = llm.invoke(
            [
                SystemMessage(content="""
Given a user's research topic, generate exactly three research questions.

Question 1 should focus on the Market.
Question 2 should focus on Competitors.
Question 3 should focus on Technology, Revenue Model, or Future Trends.
Return ONLY the questions.
Do not number them.
Put each question on a new line.
"""),
                HumanMessage(content=f"Research query is: {state['user_query']}")
            ]
        )
        questions = [
            q.strip()
            for q in response.content.split('\n')
            if q.strip()
        ]
        if len(questions) != 3:
            raise ValueError(
            f"Expected 3 questions but got {len(questions)}"
        )
        return {
            'research_questions': questions
        }


    def research1(state: ResearchState)->dict:
        question = state['research_questions'][0]
        response = llm.invoke([
            SystemMessage(content='You are a market research expert. focus only on market size, growth, industory trends and demand'),
            HumanMessage(content=question)
        ])
        return {
            'research_results':[response.content]
        }
    def research2(state: ResearchState)->dict:
            question = state['research_questions'][1]
            response = llm.invoke([
                SystemMessage(content='You are a Competitor Analyst. Focus only on major competitors, strengths, weaknesses and competitive landscape'),
                HumanMessage(content=question)
            ])
            return {
                'research_results':[response.content]
    }
    def research3(state: ResearchState)->dict:
            question = state['research_questions'][2]
            response = creative_llm.invoke([
                SystemMessage(content='You are a Innovation and Tech Analyst. Focus only on technology, future trends revenue models and opportunities'),
                HumanMessage(content=question)
            ])
            return {
                'research_results':[response.content]
    }

    def synthesis_analyst(state: ResearchState)->dict:
        """Make entire one solution"""
        responses = state['research_results']
        results = '\n\n'.join(responses)
        response = llm.invoke([
            SystemMessage(content=(
                    "You are a research analyst. Synthesize the collected findings into "
                    "a clear analysis. Identify:\n"
                    "1. Key themes across all findings\n"
                    "2. Any contradictions or gaps\n"
                    "3. The most important insights\n\n"
                    "Write 2-3 paragraphs."                
            )),
            HumanMessage(
                content=results
            )
        ])

        return {
            'synthesis': response.content
        }

# ============================================================
# Node: Report Writer — Produces the final report
# ============================================================

    def report_writer(state: ResearchState)->dict:
        """Writes a structured research report from the analysis"""
        response = creative_llm.invoke(
            [
                SystemMessage(content=(
                    "You are a report writer. Produce a well-structured research report "
                                        "with these sections:\n"
                                        "1. Executive Summary (2-3 sentences)\n"
                                        "2. Key Findings (bullet points)\n"
                                        "3. Analysis (1-2 paragraphs)\n"
                                        "4. Recommendations (3 actionable items)\n\n"
                                        "Use markdown formatting. Be specific and actionable."
                )),
                HumanMessage(content=(
                    f"analysis: {state['synthesis']}\n"
                    f"query: {state['user_query']}"
                ))
            ]
        )
        return {
            'report': response.content
        }

# ============================================================
# Node: Quality Checker — Reviews and scores the report
# ============================================================
    class QualityReview(BaseModel):
        score: float = Field(
        description="Quality score between 0.0 and 1.0"
        )
        feedback: str = Field(
        description="Short explanation of the score"
    )
    def quality_check(state: ResearchState) -> dict:
        review_llm = llm.with_structured_output(QualityReview)

        review = review_llm.invoke(
            [
            SystemMessage(
                content="""
You are a senior quality reviewer.

Evaluate the report on:

1. Completeness
2. Accuracy
3. Clarity
4. Structure
5. Actionability

Give:
- score between 0.0 and 1.0
- brief feedback (2-3 sentences)

A score above 0.8 means the report is excellent.
"""
            ),
            HumanMessage(content=state["report"])
        ]
    )

        return {
        "score": review.score,
        "review": review.feedback
        }        


    graph = StateGraph(ResearchState)
    graph.add_node('research1',research1)
    graph.add_node('research2',research2)
    graph.add_node('research3',research3)

    graph.add_node('split',split_questions)
    graph.add_node('synthesis',synthesis_analyst)
    graph.add_node('report',report_writer)
    graph.add_node('quality',quality_check)

    graph.add_edge(START, 'split')
    graph.add_edge('split','research1')
    graph.add_edge('split','research2')
    graph.add_edge('split','research3')

    graph.add_edge('research1','synthesis')
    graph.add_edge('research2','synthesis')
    graph.add_edge('research3','synthesis')

    graph.add_edge('synthesis','report')
    graph.add_edge('report','quality')
    graph.add_edge('quality',END)

    return graph.compile()

def demo():
    """working"""
    app = create_multi_agent_research()
    query = 'what is ai'
    print("MULTI AGENT PROJECT DEMO")
    result = app.invoke({
        'messages':[],
        'user_query':query,
        'research_questions':[],
        'research_results':[],
        'synthesis':'',
        'report':'',
        'review':'',
        'score':0.0
    })
    print("="*80)
    print("QUESTIONS")
    print("="*80)

    for q in result["research_questions"]:
        print("-", q)

    print("\n")

    print("="*80)
    print("RESEARCH")
    print("="*80)

    for r in result["research_results"]:
        print(r)
        print()

    print("="*80)
    print("SYNTHESIS")
    print("="*80)
    print(result["synthesis"])

    print("="*80)
    print("REPORT")
    print("="*80)
    print(result["report"])

    print("="*80)
    print("QUALITY")
    print("="*80)
    print(result["score"])
    print(result["review"])

if __name__ == '__main__':
    demo()