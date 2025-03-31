from flask import Flask, request, jsonify
from flask_cors import CORS  

app = Flask(__name__)

CORS(app, resources={r"/ask": {"origins": "*"}}, supports_credentials=True)

def get_bot_response(query):
    return f"You said: {query}"

@app.route('/ask', methods=['POST'])
def ask():
    try:
        data = request.json
        query = data.get('query', '')
        
        response = get_bot_response(query)
        
        return jsonify({"answer": response})
    except Exception as e:
        return jsonify({"answer": f"An error occurred: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
