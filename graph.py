from langgraph.graph import StateGraph, START, END
from state import ResearchState
from agents.splitter import split_questions
from agents.market import research1
from agents.competitor import research2
from agents.innovation import research3
from agents.synthesis import synthesis_analyst
from agents.report import report_writer, improve_report
from agents.reviewer import quality_check, review_router
from utils.logger import setup_logger

# Setup logger for the graph compilation
logger = setup_logger("graph")

def create_multi_agent_research():
    """Initializes and compiles the StateGraph workflow."""
    logger.info("Initializing multi-agent research workflow graph")
    
    graph = StateGraph(ResearchState)
    
    # Registering Agent Nodes
    logger.info("Registering agent nodes to the workflow graph:")
    logger.info("  Node: 'split' -> split_questions")
    graph.add_node('split', split_questions)
    
    logger.info("  Node: 'research1' -> market.research1")
    graph.add_node('research1', research1)
    
    logger.info("  Node: 'research2' -> competitor.research2")
    graph.add_node('research2', research2)
    
    logger.info("  Node: 'research3' -> innovation.research3")
    graph.add_node('research3', research3)
    
    logger.info("  Node: 'synthesis' -> synthesis_analyst")
    graph.add_node('synthesis', synthesis_analyst)
    
    logger.info("  Node: 'report' -> report_writer")
    graph.add_node('report', report_writer)
    
    logger.info("  Node: 'improve_report' -> improve_report")
    graph.add_node('improve_report', improve_report)
    
    logger.info("  Node: 'quality' -> quality_check")
    graph.add_node('quality', quality_check)

    # Registering Edges
    logger.info("Registering connecting edges in the graph:")
    # START -> Splitter
    graph.add_edge(START, 'split')
    
    # Splitter -> Parallel Research Agents
    logger.info("  Edge: split -> research1, research2, research3 (Parallel execution)")
    graph.add_edge('split', 'research1')
    graph.add_edge('split', 'research2')
    graph.add_edge('split', 'research3')

    # Parallel Research Agents -> Synthesis Analyst
    logger.info("  Edge: research1, research2, research3 -> synthesis (Fan-in / Join)")
    graph.add_edge('research1', 'synthesis')
    graph.add_edge('research2', 'synthesis')
    graph.add_edge('research3', 'synthesis')
    
    # Synthesis -> Report Draft -> Quality Review
    logger.info("  Edge: synthesis -> report -> quality")
    graph.add_edge('synthesis', 'report')
    graph.add_edge('report', 'quality')
    
    # Conditional route: Quality Check -> Router logic -> END or Improve Report
    logger.info("  Conditional Edge: quality -> review_router -> {END, improve_report}")
    graph.add_conditional_edges(
        'quality',
        review_router,
        {
            END: END,
            'improve_report': 'improve_report'
        }
    )
    
    # Improve Report -> back to Quality Review
    logger.info("  Edge: improve_report -> quality (Review loop)")
    graph.add_edge('improve_report', 'quality')

    logger.info("Compiling workflow graph successfully")
    return graph.compile()
