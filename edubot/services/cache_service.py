import os
import json
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from services.llm_service import embeddings
from config import CACHE_FILE, logger



def load_cache():
    if os.path.exists(CACHE_FILE):
        logger.info(f"Loading cache from {CACHE_FILE}")
        try:
            with open(CACHE_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Error loading cache: {e}")
            return {"questions": [], "embeddings": [], "answers": []}
    logger.info("No cache file found, creating new cache")
    return {"questions": [], "embeddings": [], "answers": []}


cache = load_cache()



# extract main topic from the cache
def extract_main_topic(query):
    topic = query.split("on ")[-1].strip().lower()
    if topic == query.lower():  # if "on" wasn't found
        topic = query.split("about ")[-1].strip().lower()
    
    return topic




# finding semantically similar question from the cache
def find_similar_question(query, similarity_threshold=0.85):
    logger.info(f"Checking for semantically similar questions to: {query}")
    
    if not cache["questions"]:
        logger.info("Cache is empty")
        return None, 0
    
    query_topic = extract_main_topic(query)
    logger.info(f"Extracted topic: {query_topic}")
    
    try:
        query_embedding = embeddings.embed_query(query)
        
        cache_embeddings = []
        for emb in cache["embeddings"]:
            if isinstance(emb, str):
                emb = json.loads(emb)
            cache_embeddings.append(emb)
        
        best_match_idx = -1
        max_similarity = 0
        
        for i, cached_question in enumerate(cache["questions"]):
            cached_topic = extract_main_topic(cached_question)
            
            if query_topic in cached_topic or cached_topic in query_topic:
                # Calculate cosine similarity
                similarity = cosine_similarity(
                    np.array(query_embedding).reshape(1, -1),
                    np.array(cache_embeddings[i]).reshape(1, -1)
                )[0][0]
                
                if similarity > max_similarity:
                    max_similarity = similarity
                    best_match_idx = i
        
        if best_match_idx >= 0 and max_similarity >= similarity_threshold:
            logger.info(f"Most similar question: '{cache['questions'][best_match_idx]}' with similarity: {max_similarity:.4f}")
            return cache["answers"][best_match_idx], max_similarity
        else:
            logger.info(f"No good match found. Best similarity was {max_similarity:.4f}")
                
    except Exception as e:
        logger.error(f"Error in similarity search: {e}")
        import traceback
        logger.error(traceback.format_exc())
    
    return None, 0





# add a new question to cache
def add_to_cache(query, answer):
    query_embedding = embeddings.embed_query(query)
    if isinstance(query_embedding, np.ndarray):
        query_embedding = query_embedding.tolist()

    cache["questions"].append(query)
    cache["embeddings"].append(query_embedding)
    cache["answers"].append(answer)

    with open(CACHE_FILE, "w", encoding="utf-8") as f:
        json.dump(cache, f, indent=4)
        
    logger.info(f"Added question to cache: {query[:50]}...")




# check if the exact same question exists in the cache
def get_exact_match(query):
    if query in cache["questions"]:
        idx = cache["questions"].index(query)
        return cache["answers"][idx]
    return None