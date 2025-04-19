from flask import Flask
from flask_cors import CORS
from config import PORT, logger
from api_routes import register_routes



def create_app():
    app = Flask(__name__)
    
    CORS(app, 
         resources={r"/ask": {"origins": [
             "*",
             "http://localhost:8081",
             "https://edu-frontend-1.onrender.com"
         ]}},
         supports_credentials=True)
    
    logger.info("Flask app initialized with CORS")
    
    register_routes(app)
    
    return app




if __name__ == "__main__":
    app = create_app()
    logger.info(f"Starting Flask server on port {PORT}")
    app.run(host="0.0.0.0", port=PORT)