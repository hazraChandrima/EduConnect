import os
import logging
from dotenv import load_dotenv

load_dotenv()


# api keys aren't mine, so I better use em carefully :'/
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
SERPAPI_API_KEY = os.getenv("SERPAPI_API_KEY")

# MongoDB config
MONGODB_URI = os.getenv("MONGODB_URI")

# cache file 
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "./cache/"))
CACHE_FILE = os.path.join(BASE_DIR, "cache.json")


# Flask config
PORT = int(os.environ.get("PORT", 5000))



def setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler("./logs/chatbot.log"),
            logging.StreamHandler()
        ]
    )
    logger = logging.getLogger(__name__)
    
    if not OPENAI_API_KEY:
        logger.error("OPENAI_API_KEY not found in env variables")
    if not SERPAPI_API_KEY:
        logger.error("SERPAPI_API_KEY not found in env variables")
        
    return logger



logger = setup_logging()