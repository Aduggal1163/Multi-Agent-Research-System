import os
from dotenv import load_dotenv

# Load workspace environment variables
load_dotenv()

# LLM configurations
DEFAULT_MODEL = os.getenv("DEFAULT_MODEL", "gpt-4o-mini")
DEFAULT_TEMPERATURE = float(os.getenv("DEFAULT_TEMPERATURE", "0.0"))
CREATIVE_TEMPERATURE = float(os.getenv("CREATIVE_TEMPERATURE", "0.8"))

# Tavily search configurations
TAVILY_MAX_RESULTS = int(os.getenv("TAVILY_MAX_RESULTS", "8"))
TAVILY_TOPIC = os.getenv("TAVILY_TOPIC", "general")

# Workflow iteration thresholds and target quality score
TARGET_SCORE = float(os.getenv("TARGET_SCORE", "0.8"))
MAX_ITERATIONS = int(os.getenv("MAX_ITERATIONS", "3"))
