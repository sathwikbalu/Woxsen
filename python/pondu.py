# app.py
from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

# Replace this with your Gemini API key
API_KEY = "AIzaSyBtLlboADtSAWc7X4N2hk0nPXkCMOPkR8U"
@app.route('/generate-response', methods=['POST'])
def generate_response():
    data = request.get_json()
    prompt = data.get("prompt")
    
    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400

    gemini_url = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        "gemini-1.5-flash-latest:generateText?key=" + API_KEY
    )

    headers = {"Content-Type": "application/json"}
    # Modify the payload based on Gemini API documentation requirements
    payload = {
        "prompt": {
            "text": prompt
        },
        "model": "gemini-1.5-flash-latest",
        "parameters": {
            "maxOutputTokens": 50,  # Customize as needed
            "temperature": 0.7      # Adjust for creativity
        }
    }

    try:
        response = requests.post(gemini_url, headers=headers, json=payload)
        response.raise_for_status()
        
        data = response.json()
        content = data.get("responses", [{}])[0].get("content", "No response content.")
        
        return jsonify({"content": content})
    except requests.exceptions.RequestException as e:
        print("Error with Gemini API:", e)
        return jsonify({"error": "Failed to communicate with Gemini API."}), 500


if __name__ == "__main__":
    app.run(debug=True)
