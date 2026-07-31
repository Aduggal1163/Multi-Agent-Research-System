from pathlib import Path

from dotenv import load_dotenv

from langchain_community.document_loaders import (
    PyPDFLoader,
    TextLoader,
    Docx2txtLoader,
)
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.chat_models import init_chat_model
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableParallel, RunnablePassthrough
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma

load_dotenv()

# ---------------------------
# Models
# ---------------------------

llm = init_chat_model(
    model="gpt-4o-mini",
    temperature=0.0,
)

embeddings = OpenAIEmbeddings(
    model="text-embedding-3-small"
)

splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
)

# ---------------------------
# Load Document
# ---------------------------

def load_document(file_path: str):
    extension = Path(file_path).suffix.lower()

    if extension == ".pdf":
        loader = PyPDFLoader(file_path)

    elif extension == ".txt":
        loader = TextLoader(file_path, encoding="utf-8")

    elif extension == ".docx":
        loader = Docx2txtLoader(file_path)

    else:
        raise ValueError(f"Unsupported file type: {extension}")

    return loader.load()


# ---------------------------
# Summary
# ---------------------------

def summary(file_path: str):
    docs = load_document(file_path)

    document_chunks = splitter.split_documents(docs)

    text = "\n\n".join(
        doc.page_content
        for doc in document_chunks
    )

    summary_prompt = ChatPromptTemplate.from_template(
        """
Generate a summary in three formats.

1. Short Summary
2. Detailed Summary
3. Bullet Point Summary

Document:
{text}
"""
    )

    title_prompt = ChatPromptTemplate.from_template(
        """
Generate a suitable title.

Document:
{text}
"""
    )

    chain = RunnableParallel(
        title=title_prompt | llm | StrOutputParser(),
        summary=summary_prompt | llm | StrOutputParser(),
    )

    response = chain.invoke(
        {
            "text": text
        }
    )

    print("\nTitle\n")
    print(response["title"])

    print("\nSummary\n")
    print(response["summary"])


# ---------------------------
# Create Vector Store
# ---------------------------

def create_kb(file_path: str):

    docs = load_document(file_path)

    document_chunks = splitter.split_documents(docs)

    vector_store = Chroma.from_documents(
        documents=document_chunks,
        embedding=embeddings,
        persist_directory="./rag_db",
    )

    return vector_store


# ---------------------------
# Chat
# ---------------------------

def chat_bot(file_path: str):

    vector_store = create_kb(file_path)

    retriever = vector_store.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 3},
    )

    prompt = ChatPromptTemplate.from_template(
        """
You are a helpful AI assistant.

Answer ONLY from the provided context.

Context:
{context}

Question:
{question}

Rules:
- Be concise.
- If the answer is not present, reply:
"I don't know based on the provided document."
"""
    )

    def format_docs(docs):
        return "\n\n".join(
            doc.page_content
            for doc in docs
        )

    rag_chain = (
        {
            "context": retriever | format_docs,
            "question": RunnablePassthrough(),
        }
        | prompt
        | llm
        | StrOutputParser()
    )

    print("\nDocument chatbot is ready.")
    print("Type 'exit' to quit.\n")

    while True:

        question = input("You: ").strip()

        if question.lower() in ["exit", "quit"]:
            print("Goodbye!")
            break

        answer = rag_chain.invoke(question)

        print("\nAI:", answer)
        print("-" * 60)


# ---------------------------
# Main
# ---------------------------

if __name__ == "__main__":

    file_path = input("Enter file path: ").strip()

    summary(file_path)

    print("\n" + "=" * 60 + "\n")

    chat_bot(file_path)