import json
import ast
from db import all_collections
from config import logger


# convert MongoDB query string into a python object
def parse_mongo_query(query_string):
    try:
        return json.loads(query_string)
    except:
        return ast.literal_eval(query_string.replace("```json", "").replace("```", ""))




def execute_mongo_query(mongo_query):
    all_results = []
    
    for collection in all_collections:
        try:
            results = list(collection.aggregate(mongo_query))
            if results:
                all_results.extend(results)
        except Exception as e:
            logger.error(f"Error executing query on collection {collection.name}: {e}")
            continue
    
    return all_results