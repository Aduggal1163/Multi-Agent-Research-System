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
    
    # Prevent logger from propagating to parent loggers (avoiding double output if root logger is setup)
    logger.propagate = False
    
    return logger
