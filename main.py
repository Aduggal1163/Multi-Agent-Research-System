from dotenv import load_dotenv
from graph import create_multi_agent_research
from utils.logger import setup_logger

# Load workspace environment variables
load_dotenv()

# Setup logger for main entry point
logger = setup_logger("main")

def demo():
    """Runs the multi-agent research workflow interactively."""
    logger.info("Multi-agent research CLI demo initialized")
    
    # Initialize the compiled LangGraph workflow app
    app = create_multi_agent_research()
    
    query = input("Enter your research topic: ").strip()
    if not query:
        print("Please enter a valid research topic!")
        logger.warning("Empty research query entered by the user. Exiting demo.")
        return
        
    logger.info("Starting workflow execution for research query: '%s'", query)
    print("\n" + "="*80)
    print(f"MULTI AGENT PROJECT DEMO - Topic: {query}")
    print("="*80 + "\n")
    
    try:
        # Invoke the compiled graph with the initial state dictionary
        result = app.invoke({
            'messages': [],
            'user_query': query,
            'research_questions': [],
            'research_results': [],
            'synthesis': '',
            'report': '',
            'review': '',
            'score': 0.0,
            'iterations': 0
        })
        
        logger.info("Research Workflow completed successfully")
        
        print("="*80)
        print("GENERATED RESEARCH QUESTIONS")
        print("="*80)
        for i, q in enumerate(result.get("research_questions", []), 1):
            print(f"{i}. {q}")
        print("\n")

        print("="*80)
        print("COLLECTED AGENT RESEARCH FINDINGS")
        print("="*80)
        for i, r in enumerate(result.get("research_results", []), 1):
            print(f"--- Agent {i} Findings ---")
            print(r)
            print()

        print("="*80)
        print("SYNTHESIZED ANALYSIS")
        print("="*80)
        print(result.get("synthesis", ""))
        print("\n")

        print("="*80)
        print("FINAL RESEARCH REPORT")
        print("="*80)
        print(result.get("report", ""))
        print("\n")

        print("="*80)
        print("QUALITY REVIEW & FEEDBACK")
        print("="*80)
        print(f"Final Score: {result.get('score', 0.0):.2f}")
        print(f"Feedback: {result.get('review', '')}")
        print("="*80)
        
    except Exception as e:
        logger.error("Research workflow execution failed: %s", str(e), exc_info=True)
        print("\nResearch Workflow Failed. Please check the logs/env configurations and try again.")
        return

if __name__ == '__main__':
    demo()