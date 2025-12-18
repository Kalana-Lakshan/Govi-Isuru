from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import tensorflow as tf
import numpy as np
from PIL import Image
import io

app = FastAPI()

# Enable CORS for React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Load the Trained Model
print("Loading AI Model...")
try:
    # Use your latest balanced model
    model = tf.keras.models.load_model('rice_model_v2.h5')
except Exception as e:
    print(f"Error loading model: {e}")
    # Fallback to old model if v2 isn't found
    model = tf.keras.models.load_model('rice_model.h5')

# Define your classes in the EXACT order they were trained
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

def preprocess_image(image_bytes):
    img = Image.open(io.BytesIO(image_bytes))
    img = img.convert('RGB') # Ensure 3 channels
    img = img.resize((224, 224)) 
    img = np.array(img)
    img = img / 255.0 # Must match training rescale
    img = np.expand_dims(img, axis=0) # Shape becomes (1, 224, 224, 3)
    return img

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        # Read and Process Image
        image_bytes = await file.read()
        processed_image = preprocess_image(image_bytes)
        
        # 2. Get Prediction Probabilities
        predictions = model.predict(processed_image) # Returns e.g. [[0.1, 0.8, 0.1]]
        
        # 3. Extract highest confidence index and value
        # predictions[0] converts [[...]] to [...]
        predicted_index = np.argmax(predictions[0]) 
        confidence = float(np.max(predictions[0])) 
        
        # 4. Map index to the Disease Name
        predicted_class = class_names[predicted_index]
        
        treatment_info = treatments.get(predicted_class, {
            "si": "ප්‍රතිකාර දත්ත නොමැත", 
            "en": "No treatment data available"
        })

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