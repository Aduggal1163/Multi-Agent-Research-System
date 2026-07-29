import os
import re
from dotenv import load_dotenv
from graph import create_multi_agent_research
from utils.logger import setup_logger
from database.db import engine, Base, SessionLocal
from database.models import ResearchReport # Required to register mapping
from database.crud import (
    create_research_report,
    get_all_research_reports,
    get_research_report,
    delete_research_report,
    update_research_report,
    search_research_reports
)

# Load workspace environment variables
load_dotenv()

# Setup logger for main entry point
logger = setup_logger("main")

def export_to_markdown(query: str, report: str, synthesis: str, score: float, review: str, iterations: int):
    """Saves a research run to a local markdown file."""
    # Convert query to filename-friendly string
    safe_query = re.sub(r'[^a-zA-Z0-9_\-]', '_', query.strip())
    filename = f"research_{safe_query[:50]}.md"
    
    content = f"""# Research Report: {query}

**Score:** {score:.2f}
**Iterations:** {iterations}
**Review Feedback:** {review}

---

## 1. Synthesized Analysis
{synthesis}

---

## 2. Final Report
{report}
"""
    try:
        with open(filename, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"\n[Success] Report successfully exported to local file: {filename}\n")
    except Exception as e:
        logger.error("Failed to export report to file: %s", str(e))
        print(f"\n[Error] Failed to export report to file: {e}\n")

def edit_report_flow(db, report_id):
    """Provides a console user interface to update a report's fields."""
    r = get_research_report(db, report_id)
    if not r:
        print("\nReport not found.")
        return
        
    print("\n" + "="*80)
    print(f"EDITING REPORT ID: {r.id}")
    print("="*80)
    print("Leave field blank to keep current value.")
    print("-" * 80)
    
    new_query = input(f"New Query [{r.query[:30]}...]: ").strip()
    new_synthesis_prompt = input("Update Synthesized Analysis? (y/n): ").strip().lower()
    new_report_prompt = input("Update Final Report? (y/n): ").strip().lower()
    new_score_str = input(f"New Score [{r.score:.2f}]: ").strip()
    
    # Process synthesis
    synthesis_val = None
    if new_synthesis_prompt == 'y':
        print("\nEnter new Synthesized Analysis (press Ctrl+D or Ctrl+Z on new line when finished):")
        lines = []
        try:
            while True:
                line = input()
                lines.append(line)
        except EOFError:
            pass
        synthesis_val = "\n".join(lines)
        
    # Process report
    report_val = None
    if new_report_prompt == 'y':
        print("\nEnter new Final Report (press Ctrl+D or Ctrl+Z on new line when finished):")
        lines = []
        try:
            while True:
                line = input()
                lines.append(line)
        except EOFError:
            pass
        report_val = "\n".join(lines)
        
    # Process score
    score_val = None
    if new_score_str:
        try:
            score_val = float(new_score_str)
        except ValueError:
            print("Invalid score format. Keeping current score.")
            
    # Call update
    updated = update_research_report(
        db=db,
        report_id=report_id,
        query=new_query if new_query else None,
        synthesis=synthesis_val,
        report=report_val,
        score=score_val
    )
    if updated:
        print(f"\n[Database] Successfully updated report ID: {updated.id}")
    else:
        print("\n[Error] Failed to update report.")

def run_new_research(app):
    """Executes a new LangGraph research workflow and persists it to the database."""
    query = input("\nEnter your research topic: ").strip()
    if not query:
        print("Please enter a valid research topic!")
        logger.warning("Empty research query entered by the user.")
        return
        
    logger.info("Starting workflow execution for research query: '%s'", query)
    print("\n" + "="*80)
    print(f"RUNNING RESEARCH WORKFLOW - Topic: {query}")
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
        
        questions = result.get("research_questions", [])
        synthesis = result.get("synthesis", "")
        report = result.get("report", "")
        score = result.get("score", 0.0)
        review = result.get("review", "")
        iterations = result.get("iterations", 0)

        # Print outputs
        print("="*80)
        print("GENERATED RESEARCH QUESTIONS")
        print("="*80)
        for i, q in enumerate(questions, 1):
            print(f"{i}. {q}")
        print("\n")

        print("="*80)
        print("SYNTHESIZED ANALYSIS")
        print("="*80)
        print(synthesis)
        print("\n")

        print("="*80)
        print("FINAL RESEARCH REPORT")
        print("="*80)
        print(report)
        print("\n")

        print("="*80)
        print("QUALITY REVIEW & FEEDBACK")
        print("="*80)
        print(f"Final Score: {score:.2f}")
        print(f"Feedback: {review}")
        print(f"Iterations: {iterations}")
        print("="*80 + "\n")

        # Save to SQLite Database
        db = SessionLocal()
        try:
            logger.info("Saving results to the database...")
            saved = create_research_report(
                db=db,
                query=query,
                synthesis=synthesis,
                report=report,
                review=review,
                score=score,
                iterations=iterations
            )
            print(f"[Database] Successfully saved report to DB with ID: {saved.id}")
            logger.info("Report saved with ID: %d", saved.id)
        except Exception as dbe:
            logger.error("Failed to save report to database: %s", str(dbe), exc_info=True)
            print(f"[Error] Failed to save report to database: {dbe}")
        finally:
            db.close()

        # Prompt for Markdown export
        export_choice = input("Would you like to export this report to a Markdown file? (y/n): ").strip().lower()
        if export_choice == 'y':
            export_to_markdown(query, report, synthesis, score, review, iterations)
            
    except Exception as e:
        logger.error("Research workflow execution failed: %s", str(e), exc_info=True)
        print("\nResearch Workflow Failed. Please check the logs/env configurations and try again.")

def view_history_menu():
    """Lists saved research reports and allows detail view / deletion / updates."""
    db = SessionLocal()
    try:
        while True:
            reports = get_all_research_reports(db, limit=20)
            if not reports:
                print("\nNo research history found in the database.")
                break
                
            print("\n" + "="*80)
            print("                       SAVED RESEARCH HISTORY")
            print("="*80)
            print(f"{'ID':<5} | {'Query':<35} | {'Score':<6} | {'Iter':<4} | {'Created At'}")
            print("-"*80)
            for r in reports:
                trunc_query = r.query[:32] + "..." if len(r.query) > 35 else r.query
                created_str = r.created_at.strftime("%Y-%m-%d %H:%M") if r.created_at else "N/A"
                print(f"{r.id:<5} | {trunc_query:<35} | {r.score:<6.2f} | {r.iterations:<4} | {created_str}")
            print("="*80)
            
            print("\nOptions:")
            print("  [ID] - Enter a report ID to view details")
            print("  d[ID] - Delete a report (e.g., d5)")
            print("  m - Back to Main Menu")
            
            opt = input("Choice: ").strip().lower()
            if opt == 'm':
                break
            
            # Check for delete option
            if opt.startswith('d') and opt[1:].isdigit():
                rep_id = int(opt[1:])
                success = delete_research_report(db, rep_id)
                if success:
                    print(f"\n[Database] Successfully deleted report ID: {rep_id}")
                else:
                    print(f"\n[Database] Report ID {rep_id} not found.")
                continue
                
            # Check for view option
            if opt.isdigit():
                rep_id = int(opt)
                r = get_research_report(db, rep_id)
                if not r:
                    print(f"\nReport ID {rep_id} not found.")
                    continue
                
                while True:
                    # Fetch fresh data in case it was edited in loop
                    r = get_research_report(db, rep_id)
                    print("\n" + "="*80)
                    print(f"DETAIL VIEW - REPORT ID: {r.id}")
                    print("="*80)
                    print(f"Query: {r.query}")
                    print(f"Score: {r.score:.2f} | Iterations: {r.iterations}")
                    print(f"Feedback: {r.review}")
                    print("-"*80)
                    print("SYNTHESIZED ANALYSIS:")
                    print(r.synthesis)
                    print("-"*80)
                    print("FINAL REPORT:")
                    print(r.report)
                    print("="*80 + "\n")
                    
                    print("Options:")
                    print("  e - Edit/Update this report's content")
                    print("  x - Export this report to a Markdown file")
                    print("  b - Back to history list")
                    
                    action = input("Choice: ").strip().lower()
                    if action == 'e':
                        edit_report_flow(db, r.id)
                    elif action == 'x':
                        export_to_markdown(r.query, r.report, r.synthesis, r.score, r.review, r.iterations)
                    elif action == 'b':
                        break
                    else:
                        print("Invalid option!")
            else:
                print("\nInvalid choice! Enter an ID, 'd[ID]' (to delete), or 'm'.")
                
    finally:
        db.close()

def run_search_menu():
    """Provides keyword search over saved reports query/synthesis/report fields."""
    db = SessionLocal()
    try:
        search_term = input("\nEnter search keyword: ").strip()
        if not search_term:
            print("Please enter a valid search term!")
            return
            
        reports = search_research_reports(db, search_term)
        if not reports:
            print(f"\nNo reports found matching: '{search_term}'")
            return
            
        while True:
            # Re-fetch from database to ensure any updates are shown
            reports = search_research_reports(db, search_term)
            if not reports:
                print(f"\nNo reports left matching: '{search_term}'")
                break
                
            print("\n" + "="*80)
            print(f"SEARCH RESULTS FOR: '{search_term}'")
            print("="*80)
            print(f"{'ID':<5} | {'Query':<35} | {'Score':<6} | {'Iter':<4} | {'Created At'}")
            print("-"*80)
            for r in reports:
                trunc_query = r.query[:32] + "..." if len(r.query) > 35 else r.query
                created_str = r.created_at.strftime("%Y-%m-%d %H:%M") if r.created_at else "N/A"
                print(f"{r.id:<5} | {trunc_query:<35} | {r.score:<6.2f} | {r.iterations:<4} | {created_str}")
            print("="*80)
            
            print("\nOptions:")
            print("  [ID] - Enter a report ID to view details")
            print("  d[ID] - Delete a report (e.g., d5)")
            print("  m - Back to Main Menu")
            
            opt = input("Choice: ").strip().lower()
            if opt == 'm':
                break
            
            # Check for delete option
            if opt.startswith('d') and opt[1:].isdigit():
                rep_id = int(opt[1:])
                success = delete_research_report(db, rep_id)
                if success:
                    print(f"\n[Database] Successfully deleted report ID: {rep_id}")
                else:
                    print(f"\n[Database] Report ID {rep_id} not found.")
                continue
                
            # Check for view option
            if opt.isdigit():
                rep_id = int(opt)
                r = get_research_report(db, rep_id)
                if not r:
                    print(f"\nReport ID {rep_id} not found.")
                    continue
                
                while True:
                    r = get_research_report(db, rep_id)
                    print("\n" + "="*80)
                    print(f"DETAIL VIEW - REPORT ID: {r.id}")
                    print("="*80)
                    print(f"Query: {r.query}")
                    print(f"Score: {r.score:.2f} | Iterations: {r.iterations}")
                    print(f"Feedback: {r.review}")
                    print("-"*80)
                    print("SYNTHESIZED ANALYSIS:")
                    print(r.synthesis)
                    print("-"*80)
                    print("FINAL REPORT:")
                    print(r.report)
                    print("="*80 + "\n")
                    
                    print("Options:")
                    print("  e - Edit/Update this report's content")
                    print("  x - Export this report to a Markdown file")
                    print("  b - Back to search results")
                    
                    action = input("Choice: ").strip().lower()
                    if action == 'e':
                        edit_report_flow(db, r.id)
                    elif action == 'x':
                        export_to_markdown(r.query, r.report, r.synthesis, r.score, r.review, r.iterations)
                    elif action == 'b':
                        break
                    else:
                        print("Invalid option!")
            else:
                print("\nInvalid choice! Enter an ID, 'd[ID]' (to delete), or 'm'.")
    finally:
        db.close()

def demo():
    """Runs the multi-agent research workflow interactively."""
    logger.info("Multi-agent research CLI demo initialized")
    
    # Initialize the database tables
    try:
        logger.info("Creating database tables if they do not exist...")
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables initialized successfully")
    except Exception as e:
        logger.critical("Failed to initialize database: %s", str(e), exc_info=True)
        print(f"Database initialization failed: {e}")
        return

    # Initialize the compiled LangGraph workflow app
    app = create_multi_agent_research()
    
    while True:
        print("\n" + "="*80)
        print("                 MULTI-AGENT RESEARCH SYSTEM - MAIN MENU")
        print("="*80)
        print("1. Start a new research task")
        print("2. View saved research history")
        print("3. Search saved reports by keyword")
        print("4. Exit")
        print("="*80)
        
        choice = input("Select an option (1-4): ").strip()
        
        if choice == "1":
            run_new_research(app)
        elif choice == "2":
            view_history_menu()
        elif choice == "3":
            run_search_menu()
        elif choice == "4":
            print("\nExiting. Thank you for using Multi-agent Research System!")
            logger.info("CLI session terminated by user")
            break
        else:
            print("\nInvalid choice! Please select 1, 2, 3, or 4.")

if __name__ == '__main__':
    demo()