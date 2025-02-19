import streamlit as st
import google.generativeai as genai

# Configure Gemini API
genai.configure(api_key="AIzaSyCcRUeTmMduDKi11gRvgM0H2-5qkMBkzzM")
model = genai.GenerativeModel('gemini-1.5-flash')

def get_response(user_input, domain):
    """Fetch response from Gemini model based on selected domain and reject out-of-domain queries."""
    prompt = f"You are an AI expert in {domain}. Respond to user queries accordingly. If the query is outside the {domain} domain, do not answer and respond with 'I can only assist with {domain} related questions.'.\nUser: {user_input}\nAI:"
    
    try:
        chat = model.start_chat(history=[])
        response = chat.send_message(prompt)
        return response.text
    except Exception as e:
        return f"Error: {e}"

# Streamlit UI
st.title("Domain-Specific Chatbot")

# Initialize session state if not already set
if "selected_domain" not in st.session_state:
    st.session_state.selected_domain = None

# Selection boxes for domain
col1, col2, col3 = st.columns(3)
with col1:
    if st.button("Agriculture"):
        st.session_state.selected_domain = "Agriculture"
with col2:
    if st.button("Education"):
        st.session_state.selected_domain = "Education"
with col3:
    if st.button("Health"):
        st.session_state.selected_domain = "Health"

# Chat input
if st.session_state.selected_domain:
    user_input = st.text_input(f"Enter your query for {st.session_state.selected_domain}:")
    if st.button("Send"):
        if user_input.strip():
            response = get_response(user_input, st.session_state.selected_domain)
            st.write("**Response:**")
            st.write(response)
        else:
            st.warning("Please enter a query.")
else:
    st.warning("Please select a domain to proceed.")