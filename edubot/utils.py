import json
import traceback
from config import logger


# convert MongoDB results into JSON string
def serialize_results(results):
    return json.dumps(results, default=str)



def handle_exception(e):
    error_message = str(e)
    logger.error(f"Error: {error_message}")
    logger.error(traceback.format_exc())
    return error_message