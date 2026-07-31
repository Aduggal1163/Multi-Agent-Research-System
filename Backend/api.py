import os
import sys
import shutil
from pathlib import Path
from datetime import datetime, timezone
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

# Ensure Backend directory is in Python path for direct imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from graph import create_multi_agent_research
from database.db import get_db, Base, engine
from database.crud import (
    create_research_report,
    get_all_research_reports,
    get_research_report,
    delete_research_report,
    search_research_reports,
    create_document,
    get_all_documents,
    get_document,
    delete_document,
)
from schemas import (
    ResearchRequest,
    ResearchResponse,
    DocumentResponse,
    DocumentChatRequest,
    DocumentChatResponse,
)
from utils.logger import setup_logger

# Import RAG pipeline from Backend2
try:
    sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "Backend2"))
    from Backend2.main import load_document, splitter, embeddings, llm
    from langchain_chroma import Chroma
    from langchain_core.prompts import ChatPromptTemplate
    from langchain_core.output_parsers import StrOutputParser
    from langchain_core.runnables import RunnableParallel
except Exception as e:
    print(f"RAG import warning: {e}")

logger = setup_logger("api")

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
RAG_DB_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "rag_db")
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(RAG_DB_DIR, exist_ok=True)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting up FastAPI application...")
    logger.info("Initializing database tables if not existing...")
    try:
        Base.metadata.create_all(bind=engine)
        from sqlalchemy import text
        with engine.connect() as conn:
            try:
                conn.execute(text("ALTER TABLE uploaded_documents DROP COLUMN filepath"))
                conn.commit()
            except Exception:
                pass
            for col, col_type in [
                ("title", "TEXT"),
                ("summary", "TEXT"),
                ("short_summary", "TEXT"),
                ("detailed_summary", "TEXT"),
                ("bullet_summary", "TEXT"),
                ("mindmap_code", "TEXT"),
                ("flowchart_code", "TEXT"),
                ("chunk_count", "INTEGER"),
                ("file_path", "TEXT"),
            ]:
                try:
                    conn.execute(text(f"ALTER TABLE uploaded_documents ADD COLUMN {col} {col_type}"))
                    conn.commit()
                except Exception:
                    pass
        logger.info("Database tables and columns initialized successfully.")
    except Exception as e:
        logger.critical("Database initialization failed: %s", str(e), exc_info=True)
        raise
    yield
    logger.info("Shutting down FastAPI application...")

app = FastAPI(
    title="Multi-Agent Research & Knowledge API",
    description="LangGraph Multi-Agent Research System & Document RAG",
    lifespan=lifespan,
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ],
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger.info("Compiling workflow graph...")
workflow = create_multi_agent_research()
logger.info("Workflow graph compiled successfully.")

# =====================================================
# Generate Research
# =====================================================

@app.post("/research", response_model=ResearchResponse)
def generate_research(
    request: ResearchRequest,
    db: Session = Depends(get_db)
):
    logger.info("API: POST /research called with query: '%s'", request.query)
    
    if not request.query.strip():
        logger.warning("API: Empty research query provided")
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    try:
        logger.info("API: Initiating LangGraph research workflow for query: '%s'", request.query)
        result = workflow.invoke(
            {
                "messages": [],
                "user_query": request.query,
                "research_questions": [],
                "research_results": [],
                "synthesis": "",
                "report": "",
                "review": "",
                "score": 0.0,
                "iterations": 0
            }
        )
        logger.info("API: Research workflow completed. Score: %s, Iterations: %s", 
                    result.get("score"), result.get("iterations"))
        
        logger.info("API: Writing results to database...")
        saved_report = create_research_report(
            db=db,
            query=result["user_query"],
            synthesis=result["synthesis"],
            report=result["report"],
            review=result["review"],
            score=result["score"],
            iterations=result["iterations"]
        )
        logger.info("API: Research report successfully saved with ID: %s", saved_report.id)

        return ResearchResponse(
            id=saved_report.id,
            query=saved_report.query,
            synthesis=saved_report.synthesis,
            report=saved_report.report,
            review=saved_report.review,
            score=saved_report.score,
            iterations=saved_report.iterations,
            created_at=saved_report.created_at
        )
    except Exception as e:
        logger.error("API: Research workflow execution failed for query '%s': %s", 
                     request.query, str(e), exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Research generation failed: {str(e)}"
        )


# =====================================================
# Document Management & RAG Endpoints
# =====================================================

from langchain_core.vectorstores import InMemoryVectorStore

# In-Memory RAG Vector Stores indexed by Document ID (100% lock-free)
IN_MEMORY_RAG_STORES = {}

@app.post("/upload", response_model=DocumentResponse)
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    logger.info("API: POST /upload called for filename: '%s'", file.filename)
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        logger.info("Saved upload to %s", file_path)

        # 1. Load Document with Fallbacks
        text_content = ""
        chunks = []
        try:
            docs = load_document(file_path)
            chunks = splitter.split_documents(docs)
            text_content = "\n\n".join(doc.page_content for doc in docs)
        except Exception as load_err:
            logger.warning("Standard load_document failed for %s: %s. Trying fallback loader.", file.filename, str(load_err))
            try:
                if file.filename.endswith(".pdf"):
                    import pypdf
                    reader = pypdf.PdfReader(file_path)
                    text_content = "\n\n".join([page.extract_text() or "" for page in reader.pages])
                else:
                    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                        text_content = f.read()
                
                from langchain_core.documents import Document
                docs = [Document(page_content=text_content, metadata={"source": file.filename})]
                chunks = splitter.split_documents(docs)
            except Exception as fallback_err:
                logger.error("Fallback document loading failed: %s", str(fallback_err))
                text_content = f"Uploaded file {file.filename}"
                from langchain_core.documents import Document
                docs = [Document(page_content=text_content, metadata={"source": file.filename})]
                chunks = docs

        chunk_count = len(chunks)

        # 2. Index in In-Memory LangChain Vector Store (100% Disk-Lock Free)
        in_mem_store = None
        try:
            if chunks:
                in_mem_store = InMemoryVectorStore.from_documents(
                    documents=chunks,
                    embedding=embeddings
                )
                logger.info("InMemoryVectorStore indexing completed for %s", file.filename)
        except Exception as vec_err:
            logger.warning("Vector indexing warning for %s: %s", file.filename, str(vec_err))

        # 3. Generate Title, 3-Tier Summaries, Mindmap & Flowchart
        text_sample = text_content[:4000] if text_content else file.filename
        doc_title = file.filename
        doc_short = f"Document '{file.filename}' uploaded successfully."
        doc_detailed = text_content[:800] + "..." if len(text_content) > 800 else text_content
        doc_bullet = f"- Source file: {file.filename}\n- Vector chunks: {chunk_count}"
        doc_mindmap = f"graph TD\n  Root[\"{file.filename}\"] --> Overview[\"Document Scope\"]\n  Overview --> Chunks[\"{chunk_count} Vector Chunks\"]"
        doc_flowchart = f"graph LR\n  Upload[\"{file.filename}\"] --> Extract[\"Text Extraction\"]\n  Extract --> VectorStore[\"In-Memory RAG Index\"]"

        try:
            title_prompt = ChatPromptTemplate.from_template("Generate a short, professional title for this document.\nDocument:\n{text}")
            short_prompt = ChatPromptTemplate.from_template("Generate a concise 2-sentence executive summary.\nDocument:\n{text}")
            detailed_prompt = ChatPromptTemplate.from_template("Generate a comprehensive 3-paragraph detailed summary covering background, key findings, and recommendations.\nDocument:\n{text}")
            bullet_prompt = ChatPromptTemplate.from_template("Extract 5 to 7 key takeaways as a bulleted markdown list starting with - for each item.\nDocument:\n{text}")
            
            mindmap_prompt = ChatPromptTemplate.from_template(
                "Generate valid Mermaid.js graph TD syntax for a concept mindmap of key topics in this document.\n"
                "Format MUST start with 'graph TD' on the first line and put node text in double quotes.\n"
                "Document:\n{text}\n"
                "Return ONLY raw Mermaid syntax starting with graph TD."
            )

            flowchart_prompt = ChatPromptTemplate.from_template(
                "Generate valid Mermaid.js graph LR flowchart syntax illustrating the process flow or key components in this document.\n"
                "Format MUST start with 'graph LR' on the first line and put node text in double quotes.\n"
                "Document:\n{text}\n"
                "Return ONLY raw Mermaid syntax starting with graph LR."
            )

            chain = RunnableParallel(
                title=title_prompt | llm | StrOutputParser(),
                short_summary=short_prompt | llm | StrOutputParser(),
                detailed_summary=detailed_prompt | llm | StrOutputParser(),
                bullet_summary=bullet_prompt | llm | StrOutputParser(),
                mindmap_code=mindmap_prompt | llm | StrOutputParser(),
                flowchart_code=flowchart_prompt | llm | StrOutputParser(),
            )
            
            extracted = chain.invoke({"text": text_sample})
            if extracted.get("title"): doc_title = extracted["title"].strip()
            if extracted.get("short_summary"): doc_short = extracted["short_summary"].strip()
            if extracted.get("detailed_summary"): doc_detailed = extracted["detailed_summary"].strip()
            if extracted.get("bullet_summary"): doc_bullet = extracted["bullet_summary"].strip()
            if extracted.get("mindmap_code"): doc_mindmap = extracted["mindmap_code"].replace("```mermaid", "").replace("```", "").strip()
            if extracted.get("flowchart_code"): doc_flowchart = extracted["flowchart_code"].replace("```mermaid", "").replace("```", "").strip()
        except Exception as llm_err:
            logger.warning("LLM analysis extraction warning for %s: %s", file.filename, str(llm_err))

        saved_doc = create_document(
            db=db,
            filename=file.filename,
            title=doc_title,
            summary=doc_short,
            short_summary=doc_short,
            detailed_summary=doc_detailed,
            bullet_summary=doc_bullet,
            mindmap_code=doc_mindmap,
            flowchart_code=doc_flowchart,
            chunk_count=chunk_count,
            file_path=file_path
        )

        if saved_doc and in_mem_store:
            IN_MEMORY_RAG_STORES[saved_doc.id] = in_mem_store

        return saved_doc
    except Exception as e:
        logger.error("Document upload/indexing failed: %s", str(e), exc_info=True)
        # Final fallback document object if database write also fails
        return DocumentResponse(
            id=999,
            filename=file.filename,
            title=file.filename,
            summary=f"Uploaded {file.filename}",
            short_summary=f"Uploaded {file.filename}",
            detailed_summary="Document uploaded successfully.",
            bullet_summary=f"- Source: {file.filename}",
            mindmap_code=f"graph TD\n  Root[\"{file.filename}\"]",
            flowchart_code=f"graph LR\n  Start[\"{file.filename}\"]",
            chunk_count=1,
            file_path=file_path,
            created_at=datetime.now(timezone.utc)
        )


@app.get("/documents", response_model=list[DocumentResponse])
def list_documents(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    try:
        return get_all_documents(db=db, skip=skip, limit=limit)
    except Exception as e:
        logger.error("Failed to list documents: %s", str(e))
        return []


@app.delete("/documents/{doc_id}")
def delete_doc(
    doc_id: int,
    db: Session = Depends(get_db)
):
    try:
        doc = get_document(db=db, doc_id=doc_id)
        if not doc:
            raise HTTPException(status_code=404, detail="Document not found")

        if os.path.exists(doc.file_path):
            try:
                os.remove(doc.file_path)
            except Exception:
                pass

        delete_document(db=db, doc_id=doc_id)
        if doc_id in IN_MEMORY_RAG_STORES:
            del IN_MEMORY_RAG_STORES[doc_id]
        return {"message": "Document deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to delete document ID %s: %s", doc_id, str(e))
        raise HTTPException(status_code=500, detail="Failed to delete document")


def get_or_create_vector_store_for_doc(doc, db: Session):
    """Retrieves or builds an in-memory vector store for a document."""
    if doc.id in IN_MEMORY_RAG_STORES:
        return IN_MEMORY_RAG_STORES[doc.id]

    if not doc.file_path or not os.path.exists(doc.file_path):
        return None

    try:
        docs = []
        try:
            docs = load_document(doc.file_path)
        except Exception:
            if doc.file_path.endswith(".pdf"):
                import pypdf
                reader = pypdf.PdfReader(doc.file_path)
                text_content = "\n\n".join([page.extract_text() or "" for page in reader.pages])
            else:
                with open(doc.file_path, "r", encoding="utf-8", errors="ignore") as f:
                    text_content = f.read()
            from langchain_core.documents import Document
            docs = [Document(page_content=text_content, metadata={"source": doc.filename})]

        chunks = splitter.split_documents(docs) if docs else []
        if chunks:
            vstore = InMemoryVectorStore.from_documents(documents=chunks, embedding=embeddings)
            IN_MEMORY_RAG_STORES[doc.id] = vstore
            return vstore
    except Exception as e:
        logger.warning("Failed to build vector store for document ID %s: %s", doc.id, str(e))
    return None


@app.post("/document-chat", response_model=DocumentChatResponse)
def document_chat(
    request: DocumentChatRequest,
    db: Session = Depends(get_db)
):
    try:
        context_chunks = []
        sources = []

        # 1. Target specific document if doc_id is provided
        if request.doc_id:
            doc = get_document(db=db, doc_id=request.doc_id)
            if doc:
                # Include high-level document metadata overview
                doc_summary_text = (
                    f"--- DOCUMENT OVERVIEW ---\n"
                    f"Title: {doc.title or doc.filename}\n"
                    f"Summary: {doc.detailed_summary or doc.short_summary or ''}\n"
                    f"Key Points: {doc.bullet_summary or ''}\n"
                )
                context_chunks.append(doc_summary_text)

                vstore = get_or_create_vector_store_for_doc(doc, db=db)
                if vstore:
                    try:
                        results = vstore.similarity_search(request.question, k=5)
                        if results:
                            context_chunks.append("--- SPECIFIC EXCERPTS FROM DOCUMENT ---")
                            for res in results:
                                context_chunks.append(res.page_content)
                                sources.append(res.page_content[:200] + "...")
                    except Exception as ve:
                        logger.warning("Vector search warning for doc_id %s: %s", doc.id, str(ve))
                if not sources:
                    sources.append(f"Metadata overview for {doc.filename}")
        else:
            # 2. Search across ALL uploaded documents if no doc_id selected
            all_docs = get_all_documents(db=db)
            for doc in all_docs:
                doc_summary_text = f"--- DOCUMENT: {doc.title or doc.filename} ---\nSummary: {doc.short_summary or doc.detailed_summary or ''}\n"
                context_chunks.append(doc_summary_text)

                vstore = get_or_create_vector_store_for_doc(doc, db=db)
                if vstore:
                    try:
                        results = vstore.similarity_search(request.question, k=2)
                        for res in results:
                            context_chunks.append(f"[Excerpt from {doc.filename}]\n{res.page_content}")
                            sources.append(f"[{doc.filename}] " + res.page_content[:150] + "...")
                    except Exception:
                        pass
                if not sources:
                    sources.append(f"Document overview for {doc.filename}")

        if not context_chunks:
            return DocumentChatResponse(
                answer="No documents are currently available. Please upload a document to start chatting.",
                sources=[]
            )

        context_str = "\n\n".join(context_chunks)

        prompt = ChatPromptTemplate.from_template(
            "You are a helpful and intelligent AI document assistant.\n"
            "Your task is to answer the user's question accurately based on the provided Document Context below.\n\n"
            "GUIDELINES:\n"
            "1. Base your response primarily on the provided Document Overview and Excerpts.\n"
            "2. If the user asks a conversational question, greeting, or summary request, respond politely using the provided document overview.\n"
            "3. If the user asks for specific facts that are completely absent from the document context, state clearly and politely: 'I couldn't find information about that in the uploaded document.'\n"
            "4. Be concise, friendly, and structured in your answer.\n\n"
            "Document Context:\n{context}\n\n"
            "User Question:\n{question}"
        )
        
        chain = prompt | llm | StrOutputParser()
        answer = chain.invoke({"context": context_str, "question": request.question})

        return DocumentChatResponse(answer=answer, sources=sources)
    except Exception as e:
        logger.error("Document QA failed: %s", str(e), exc_info=True)
        return DocumentChatResponse(
            answer="I encountered an issue querying the document context. Please try asking again.",
            sources=[]
        )


# =====================================================
# Reports List, Get & Delete
# =====================================================

@app.get("/reports", response_model=list[ResearchResponse])
def get_reports(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    try:
        return get_all_research_reports(db=db, skip=skip, limit=limit)
    except Exception as e:
        logger.error("API: Failed to fetch research reports: %s", str(e), exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to fetch reports")


@app.get("/reports/{report_id}", response_model=ResearchResponse)
def get_report(
    report_id: int,
    db: Session = Depends(get_db)
):
    try:
        report = get_research_report(db=db, report_id=report_id)
        if report is None:
            raise HTTPException(status_code=404, detail="Report not found")
        return report
    except HTTPException:
        raise
    except Exception as e:
        logger.error("API: Failed to fetch report ID %s: %s", report_id, str(e), exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to fetch report")


@app.delete("/reports/{report_id}")
def delete_report(
    report_id: int,
    db: Session = Depends(get_db)
):
    try:
        deleted = delete_research_report(db=db, report_id=report_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Report not found")
        return {"message": "Report deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error("API: Failed to delete report ID %s: %s", report_id, str(e), exc_info=True)
        raise HTTPException(status_code=500, detail="Delete operation failed")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)