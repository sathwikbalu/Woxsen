import requests
url = "https://029b-34-142-234-104.ngrok-free.app/analyze-sentiment"

payload = {"prompt": "I feel very happy today!"}
headers = {"Content-Type": "application/json"}

response = requests.post(url, json=payload, headers=headers)
if response.status_code == 200:
    print("Response JSON:", response.json())
else:
    print("Error:", response.status_code, response.text)

print(response.status_code)  # Check status code
         # Debug raw response
print(response.json())  
response_json = response.json()      # Try parsing JSON only if the response is valid
sentiment = response_json.get("sentiment")  # Get the 'sentiment' field
print(f"Sentiment: {sentiment}")