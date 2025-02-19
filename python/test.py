# import google.generativeai as genai
# import os

# def setup_gemini(api_key):
#     genai.configure(api_key=api_key)
    
#     # Configure the model
#     model = genai.GenerativeModel('gemini-1.5-flash')
    
#     # System message focused on sad to happy scale
#     system_message = """You are an emotion analysis expert specializing in measuring happiness levels. Analyze text on a scale of 1 to 10, where:

# 1: Deeply sad - Expressions of severe depression, grief, or despair
# 2: Very sad - Strong feelings of sadness, loss, or hopelessness
# 3: Sad - Clear negative emotions, disappointment, or unhappiness
# 4: Slightly sad - Mild melancholy or minor disappointment
# 5: Neutral - Neither sad nor happy, or mixed emotions
# 6: Slightly happy - Mild contentment or small pleasures
# 7: Moderately happy - Clear positive feelings and satisfaction
# 8: Happy - Strong positive emotions and joy
# 9: Very happy - Great enthusiasm and delight
# 10: Ecstatic - Pure joy, elation, or extreme happiness

# Guidelines for happiness analysis:
# - Look for emotional keywords and expressions
# - Consider intensity of happy/sad indicators
# - Note presence of laughter, excitement, or crying
# - Evaluate overall emotional tone
# - Account for context and situation
# - Consider use of emojis or emotional punctuation

# Provide your analysis in this format:
# HAPPINESS SCORE: [1-10]
# REASONING: [2-3 sentences explaining the score]
# EMOTIONAL MARKERS: [specific words/phrases that indicate happiness/sadness level]
# """
    
#     chat = model.start_chat(history=[
#         {
#             "role": "user",
#             "parts": [system_message]
#         },
#         {
#             "role": "model",
#             "parts": ["I understand. I will analyze text specifically for happiness levels on a 1-10 scale, considering the full spectrum from deep sadness to pure joy. I will provide structured responses with scores, reasoning, and emotional markers following the specified format."]
#         }
#     ])
    
#     return chat

# def analyze_happiness(chat, text):
#     response = chat.send_message(f"Please analyze the happiness level in this text: {text}")
#     return response.text

# # Example usage
# def main():
#     api_key = "AIzaSyBWG53DzCscQUFgUhYp1Nufa3tw9NfsfmA" # Replace with actual API key
#     chat = setup_gemini(api_key)
    
#     # Example text for analysis
#     sample_text = "I want to die"
    
#     result = analyze_happiness(chat, sample_text)
#     print("Happiness Analysis Result:")
#     print(result)

# if __name__ == "__main__":
#     main()


import google.generativeai as genai
import os

def setup_gemini(api_key):
    """Configures the Gemini model for emotion analysis."""
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')

    system_message = """You are an emotion analysis expert specializing in measuring happiness levels. Analyze text on a scale of 1 to 10, where:

1: Deeply sad - Expressions of severe depression, grief, or despair  
2: Very sad - Strong feelings of sadness, loss, or hopelessness  
3: Sad - Clear negative emotions, disappointment, or unhappiness  
4: Slightly sad - Mild melancholy or minor disappointment  
5: Neutral - Neither sad nor happy, or mixed emotions  
6: Slightly happy - Mild contentment or small pleasures  
7: Moderately happy - Clear positive feelings and satisfaction  
8: Happy - Strong positive emotions and joy  
9: Very happy - Great enthusiasm and delight  
10: Ecstatic - Pure joy, elation, or extreme happiness  

### Guidelines:
- Identify emotional keywords and intensity  
- Consider tone, punctuation, and context  
- Evaluate presence of positive/negative emotions  
- Emojis, exclamation marks, and laughter add positivity  

**Response Format:**  
HAPPINESS SCORE: [1-10]  
EMOTION STATE: [Sad/Neutral/Happy]  
REASONING: [Brief explanation]  
"""

    chat = model.start_chat(history=[
        {"role": "user", "parts": [system_message]},
        {"role": "model", "parts": ["I understand. I will analyze text and return a structured response."]}
    ])
    return chat

def analyze_happiness(chat, text):
    """Analyzes the happiness level of a given text and returns structured results."""
    response = chat.send_message(f"Analyze the happiness level in this text: {text}")
    response_text = response.text.strip()

    # Extracting happiness score and emotion state
    try:
        score_line = next(line for line in response_text.split("\n") if "HAPPINESS SCORE:" in line)
        emotion_line = next(line for line in response_text.split("\n") if "EMOTION STATE:" in line)
        
        score = int(score_line.split(":")[1].strip())  # Extracting numerical score
        emotion = emotion_line.split(":")[1].strip()   # Extracting emotion state

        return score, emotion
    except Exception:
        return None, "Error extracting emotion data"

def main():
    api_key = "AIzaSyBWG53DzCscQUFgUhYp1Nufa3tw9NfsfmA"  # Use environment variable for security
    if not api_key:
        print("API key is missing. Set the GEMINI_API_KEY environment variable.")
        return

    chat = setup_gemini(api_key)

    # Example text
    sample_text = "I feel so lost and hopeless, nothing makes sense anymore."
    
    score, emotion = analyze_happiness(chat, sample_text)

    if score:
        print(f"Happiness Score: {score}")
        print(f"Emotion State: {emotion}")
    else:
        print("Error analyzing emotion.")

if __name__ == "__main__":
    main()
