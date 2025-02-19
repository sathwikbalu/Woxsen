from flask import Flask, request, jsonify,render_template,send_file
from flask_cors import CORS
import pyttsx3
import os
from playsound import playsound
import torch
from torchvision import transforms
from PIL import Image
import base64
import google.generativeai as genai


app = Flask(__name__)
CORS(app) 

UPLOAD_FOLDER = './uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)




# Load the best saved model1
model1 = torch.load(r'C:\\Users\\Durga Sreeja\\EmbraceMindApp\\python\\best_vit_fer2013_model.pt', map_location=torch.device('cpu'))  # Change 'cpu' to 'cpu' if using GPU
model1.eval()  # Set the model1 to evaluation mode

# Define the emotion labels (FER-2013 dataset has 7 emotions)
emotion_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise']

# Define the image transformation (same as used during training)
transform = transforms.Compose([
    transforms.Resize((224, 224)),  # Resizing the image to match model1 input
    transforms.Grayscale(num_output_channels=3),  # Convert to 3-channel grayscale (if needed)
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])  # Normalization
])

# Load and preprocess the image
def preprocess_image(image_path):
    image = Image.open(image_path)
    image = transform(image)
    image = image.unsqueeze(0)  # Add batch dimension
    return image

# Predict emotion
def predict_emotion(image_path):
    image = preprocess_image(image_path)
    with torch.no_grad():
        image = image.to('cpu')  # If you use GPU, change to .to('cpu')
        outputs = model1(image).logits  # Forward pass
        _, predicted = torch.max(outputs, 1)  # Get the class with the highest score
        predicted_class = predicted.item()

    emotion_label = emotion_labels[predicted_class]  # Map the predicted index to the class label
    return emotion_label

@app.route("/upload", methods=["POST"])
def upload_image():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    # Save the file to the upload folder
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    emotion = predict_emotion(file_path)
    print(f'Predicted emotion: {emotion}')
    return {'resopnse': emotion}


@app.route("/generate-story", methods=["POST"])
def story():
    return { "data": { "story": "Generated story text" } }


genai.configure(api_key="AIzaSyBgYbW6KHlXiryvVlmdA5VNj2sXyi8aFjI")
model = genai.GenerativeModel('gemini-1.5-flash')




@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_input = data.get("text")

    if not user_input:
        return jsonify({"error": "No text input provided"}), 400

    try:
        print(user_input)
        # Get chat response from Gemini
        chat = model.start_chat(history=[])
        response = chat.send_message(user_input)
        print(response.text)
        
        return jsonify({
            "text": response.text
        })

    except Exception as e:
        print("Error in processing:", e)
        return jsonify({"error": "Failed to process the request"}), 500



if __name__ == "__main__":
    app.run(debug=True,port=7000)