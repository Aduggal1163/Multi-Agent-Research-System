import logging
import os
from dotenv import load_dotenv

# Ensure environment variables are loaded
load_dotenv()

def setup_logger(name: str) -> logging.Logger:
    """
    Sets up and configures a logger with a standard formatting style
    to keep logs consistent across agents and graph modules.
    """
    logger = logging.getLogger(name)
    
    # If the logger has already been configured, return it directly to prevent duplicate logs.
    if logger.hasHandlers() and len(logger.handlers) > 0:
        return logger

    logger.setLevel(logging.INFO)
    
    # Create console handler and set format
    ch = logging.StreamHandler()
    ch.setLevel(logging.INFO)
    
    formatter = logging.Formatter("%(asctime)s | %(name)s | %(levelname)s | %(message)s")
    ch.setFormatter(formatter)
    
    logger.addHandler(ch)
    
    # Create file handler to write to a centralized log file
    try:
        log_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        log_file = os.path.join(log_dir, "research_system.log")
        fh = logging.FileHandler(log_file, encoding="utf-8")
        fh.setLevel(logging.INFO)
        fh.setFormatter(formatter)
        logger.addHandler(fh)
    except Exception as e:
        # Fallback if log file cannot be written
        print(f"Warning: Failed to setup file log handler: {e}")
        
    # Prevent logger from propagating to parent loggers (avoiding double output if root logger is setup)
    logger.propagate = False
    
    return logger
