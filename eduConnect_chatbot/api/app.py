import os
import json
import logging
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from flask import Flask, request, jsonify
from langchain_community.document_loaders import PDFPlumberLoader
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain.chains import RetrievalQA
from langchain.tools import Tool
from langchain_community.utilities import SerpAPIWrapper
from langchain_community.document_loaders import WikipediaLoader
from flask_cors import CORS  
from dotenv import load_dotenv
import traceback


logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("chatbot.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


load_dotenv()
logger.info("Environment variables loaded")

app = Flask(__name__)
CORS(app, resources={r"/ask": {"origins": "*"}}, supports_credentials=True)
logger.info("Flask app initialized with CORS")


pdf_directory = "C:/Users/Chandrima/Hackathons/Texas Instruments WiSE/chatbot/study_materials/"
faiss_index_path = "C:/Users/Chandrima/Hackathons/Texas Instruments WiSE/chatbot/faiss_index/"
cache_file = "C:/Users/Chandrima/Hackathons/Texas Instruments WiSE/chatbot/cache.json"


openai_api_key = os.getenv("OPENAI_API_KEY")
serpapi_api_key = os.getenv("SERPAPI_API_KEY")


if not openai_api_key:
    logger.error("OPENAI_API_KEY not found in environment variables")
if not serpapi_api_key:
    logger.error("SERPAPI_API_KEY not found in environment variables")


logger.info(f"Using PDF directory: {pdf_directory}")
logger.info(f"Using FAISS index path: {faiss_index_path}")


embeddings = OpenAIEmbeddings(openai_api_key=openai_api_key)
logger.info("OpenAI embeddings initialized")



def load_cache():
    if os.path.exists(cache_file):
        logger.info(f"Loading cache from {cache_file}")
        try:
            with open(cache_file, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Error loading cache: {e}")
            return {"questions": [], "embeddings": [], "answers": []}
    logger.info("No cache file found, creating new cache")
    return {"questions": [], "embeddings": [], "answers": []}

cache = load_cache()





def extract_main_topic(query):
    topic = query.split("on ")[-1].strip().lower()
    if topic == query.lower():  # if "on" wasn't found
        topic = query.split("about ")[-1].strip().lower()
    
    return topic





def find_similar_question(query, cache, embeddings_model, similarity_threshold=0.85):
    logger.info(f"Checking for semantically similar questions to: {query}")
    
    if not cache["questions"]:
        logger.info("Cache is empty")
        return None, 0
    
    query_topic = extract_main_topic(query)
    logger.info(f"Extracted topic: {query_topic}")
    
    try:
        query_embedding = embeddings_model.embed_query(query)
        
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
        logger.error(traceback.format_exc())
    
    return None, 0





# Load FAISS Index if not already present, delete the pre-existing one if you add a new document in ../study_materials/
try:
    if os.path.exists(faiss_index_path):
        logger.info(f"Loading existing FAISS index from {faiss_index_path}")
        vectordb = FAISS.load_local(faiss_index_path, embeddings, allow_dangerous_deserialization=True)
        logger.info("FAISS index loaded successfully")
    else:
        logger.info("No existing FAISS index found, creating new index")
        all_docs = []
        for filename in os.listdir(pdf_directory):
            if filename.endswith(".pdf"):
                logger.info(f"Loading PDF: {filename}")
                loader = PDFPlumberLoader(os.path.join(pdf_directory, filename))
                all_docs.extend(loader.load())
        
        logger.info(f"Loaded {len(all_docs)} documents from PDFs")
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        documents = text_splitter.split_documents(all_docs)
        logger.info(f"Split into {len(documents)} chunks")
        
        vectordb = FAISS.from_documents(documents, embeddings)
        logger.info("Created FAISS index from documents")
        vectordb.save_local(faiss_index_path)
        logger.info(f"Saved FAISS index to {faiss_index_path}")
except Exception as e:
    logger.error(f"Error setting up FAISS: {e}")
    logger.error(traceback.format_exc())
    raise

retriever = vectordb.as_retriever(search_type="similarity", search_kwargs={"k": 5})
logger.info("FAISS retriever initialized")

llm = ChatOpenAI(model_name="gpt-3.5-turbo", openai_api_key=openai_api_key)
logger.info("ChatOpenAI initialized")

qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=retriever)
logger.info("RetrievalQA chain initialized")






def search_wikipedia(query, max_length=1000):
    logger.info(f"Searching Wikipedia for: {query}")
    try:
        import wikipedia
        try:
            summary = wikipedia.summary(query, sentences=5)
            logger.info(f"Wikipedia found summary for: {query}")
            return summary
        
        except wikipedia.DisambiguationError as e:
            logger.info(f"Wikipedia disambiguation for '{query}'. Trying first option: {e.options[0]}")
            summary = wikipedia.summary(e.options[0], sentences=5)
            return f"Information about '{e.options[0]}': {summary}"
        
        except wikipedia.PageError:
            logger.info(f"No summary found, trying full page for: {query}")
            page = wikipedia.page(query)
            content = page.content
            
            if len(content) > max_length:
                truncated = content[:max_length]
                last_period = truncated.rfind('.')
                last_newline = truncated.rfind('\n')
                break_point = max(last_period, last_newline)
                if break_point > max_length // 2:  # Only use if it's not too short
                    truncated = truncated[:break_point+1]
                truncated += "... (content truncated)"
                return truncated
            return content

    except Exception as e:
        logger.error(f"Wikipedia search error: {e}")
        logger.error(traceback.format_exc())
        return None





def search_google(query):
    logger.info(f"Searching Google for: {query}")
    if not serpapi_api_key:
        logger.error("Cannot search Google: SERPAPI_API_KEY not set")
        return None
        
    try:
        search_wrapper = SerpAPIWrapper(serpapi_api_key=serpapi_api_key)
        search_tool = Tool(
            name="Google Search", 
            description="Search Google for information",
            func=search_wrapper.run
        )
        result = search_tool.run(query)
        logger.info("Google search completed successfully")
        return result
    
    except Exception as e:
        logger.error(f"Google search error: {e}")
        logger.error(traceback.format_exc())
        return None






@app.route("/ask", methods=["POST"])
def ask():
    try:
        data = request.json
        query = data.get("query")
        logger.info(f"Received query: {query}")
        
        # Checking for exact match in cache
        cached_answer = None
        if query in cache["questions"]:
            index = cache["questions"].index(query)
            cached_answer = cache["answers"][index]
            logger.info(f"Found exact match in cache for: {query}")
            return jsonify({"answer": cached_answer, "source": "cache_exact_match"})
        
        # Checking for similar questions using embeddings
        similarity_threshold = 0.85  # can adjust if needed
        similar_answer, similarity_score = find_similar_question(
            query, cache, embeddings, similarity_threshold
        )
        
        if similar_answer:
            logger.info(f"Found similar question in cache with similarity: {similarity_score:.4f}")
            return jsonify({
                "answer": similar_answer, 
                "source": "cache_similar_match",
                "similarity": float(similarity_score)
            })
        
        # if there's no cache hit, then we query the QA chain
        logger.info("No cache hit, querying QA chain")
        response = qa_chain.invoke({"query": query})
        answer = response["result"] if response else "No answer found."
        logger.info(f"QA chain response: {answer[:100]}...")  
        
        # if QA chain doesn't help, we then try to fetch some response from google search, then wikipedia
        if "I do not have information" in answer or "don't know" in answer or "I don't" in answer  or "I can't" in answer or "I cannot" in answer or "I'm not sure" in answer or "I am sorry" in answer or "I'm sorry" in answer or not answer.strip():
            logger.info("QA chain didn't provide useful answer, trying Google search...")
            google_answer = search_google(query)
            if google_answer:
                logger.info("Using Google answer")
                answer = google_answer
            else:
                logger.info("Google search didn't provide answer, trying Wikipedia...")
                wiki_answer = search_wikipedia(query)
                if wiki_answer:
                    logger.info("Using Wikipedia answer")
                    answer = wiki_answer
                else:
                    logger.warning("All sources failed to provide an answer")
                    answer = "No relevant information found."
        

        logger.info("Caching answer with embedding")
        query_embedding = embeddings.embed_query(query)
        
        if isinstance(query_embedding, np.ndarray):
            query_embedding = query_embedding.tolist()
            
        cache["questions"].append(query)
        cache["embeddings"].append(query_embedding)
        cache["answers"].append(answer)
        
        try:
            with open(cache_file, "w", encoding="utf-8") as f:
                json.dump(cache, f, indent=4)
            logger.info("Answer cached successfully")
        except Exception as e:
            logger.error(f"Error saving to cache: {e}")
        
        logger.info("Returning answer to user")
        return jsonify({"answer": answer, "source": "fresh_query"})
    
    except Exception as e:
        logger.error(f"Error processing request: {e}")
        logger.error(traceback.format_exc())
        return jsonify({"error": str(e)}), 500





if __name__ == "__main__":
    logger.info("Starting Flask server")
    app.run(host="0.0.0.0", port=5000, debug=True)