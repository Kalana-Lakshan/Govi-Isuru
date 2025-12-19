import os
import io
import numpy as np
import tensorflow as tf
from google import genai  # Use the new unified SDK
from PIL import Image
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# 1. Load Environment Variables
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

# 2. Configure Gemini Client
# The new SDK uses a Client object for all interactions
client = genai.Client(api_key=api_key)

# Active model IDs as of late 2025
# 'gemini-3.0-flash' or 'gemini-2.5-flash' are stable options
MODEL_ID = "gemini-2.5-flash" 

app = FastAPI()

# Enable CORS for React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Load the Trained AI Model
print("Loading AI Model...")
model = None
try:
    model = tf.keras.models.load_model('rice_model_v2.h5')
    print("Model v2 loaded successfully.")
except Exception as e:
    print(f"Error loading model v2: {e}. Attempting fallback...")
    try:
        model = tf.keras.models.load_model('rice_model.h5')
        print("Fallback model loaded successfully.")
    except Exception as fallback_e:
        print(f"Critical Error: No models found. {fallback_e}")

# 4. Disease Data Configuration
class_names = ['Bacterial leaf blight', 'Brown spot', 'Leaf smut']
treatments = {
    'Bacterial leaf blight': {
        "si": "නයිට්‍රජන් පොහොර භාවිතය අඩු කරන්න. ජල මට්ටම පාලනය කරන්න.",
        "en": "Reduce Nitrogen fertilizer. Manage water levels properly."
    },
    'Brown spot': {
        "si": "පොටෑෂ් පොහොර යොදන්න. දිලීර නාශක (Mancozeb) භාවිතා කරන්න.",
        "en": "Apply Potash fertilizer. Use fungicides like Mancozeb."
    },
    'Leaf smut': {
        "si": "හානියට පත් කොළ ඉවත් කරන්න. Copper oxychloride භාවිතා කරන්න.",
        "en": "Remove infected leaves. Spray Copper oxychloride."
    }
}

# 5. Image Preprocessing Utility
def preprocess_image(image_bytes):
    img = Image.open(io.BytesIO(image_bytes))
    img = img.convert('RGB')
    img = img.resize((224, 224)) 
    img = np.array(img)
    img = img / 255.0
    img = np.expand_dims(img, axis=0)
    return img

# 6. API Endpoints

@app.post("/chat")
async def chat(request: Request):
    try:
        data = await request.json()
        user_message = data.get("message")
        print(f"User message received: {user_message}")

        # Use the new Client generate_content method
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=user_message
        )
        
        if response and response.text:
            return {"reply": response.text}
        return {"reply": "I heard you, but I couldn't generate an answer."}
            
    except Exception as e:
        print(f"DETAILED CHAT ERROR: {e}") 
        return {"reply": "I am having trouble connecting to my brain right now."}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not initialized.")
    try:
        image_bytes = await file.read()
        processed_image = preprocess_image(image_bytes)
        predictions = model.predict(processed_image)
        predicted_index = np.argmax(predictions[0]) 
        confidence = float(np.max(predictions[0])) 
        predicted_class = class_names[predicted_index]
        treatment_info = treatments.get(predicted_class, {"si": "දත්ත නැත", "en": "No data"})
        return {
            "disease": predicted_class,
            "confidence": confidence,
            "treatment": treatment_info['en'],
            "treatment_si": treatment_info['si']
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)