from flask import request, jsonify
from services.llm_service import is_personal_query, generate_mongo_query, format_query_response, get_fallback_response
from services.cache_service import find_similar_question, add_to_cache, get_exact_match
from services.query_service import parse_mongo_query, execute_mongo_query
from utils import serialize_results, handle_exception
from config import logger




def register_routes(app):

    @app.route("/", methods=["GET"])

    def home():
        return "Flask chatbot backend is running!"
    


    @app.route("/ask", methods=["POST"])

    def ask():
        try:
            data = request.json
            query, email = data.get("query"), data.get("email")
    
            if not query or not email:
                return jsonify({"error": "Query and email are required"}), 400
    
            # is the query personal?
            if is_personal_query(query):
                mongo_query_string = generate_mongo_query(query, email)
                mongo_query = parse_mongo_query(mongo_query_string)
                results = execute_mongo_query(mongo_query)
    
                if not results:
                    return jsonify({"answer": "No personal records found."})
    
                response = format_query_response(query, serialize_results(results))
                return jsonify({"answer": response})
    
            # exact match
            exact_match = get_exact_match(query)
            if exact_match:
                return jsonify({"answer": exact_match, "source": "cache_exact_match"})
    
            # similar question
            similar_answer, score = find_similar_question(query)
            if similar_answer:
                return jsonify({"answer": similar_answer, "source": "cache_similar_match", "similarity": score})
    
            final_answer = get_fallback_response(query)
            
            # add a new question to cache
            add_to_cache(query, final_answer)
            return jsonify({"answer": final_answer, "source": "fresh_query"})
    
    
        except Exception as e:
            error_message = handle_exception(e)
            return jsonify({"error": error_message}), 500