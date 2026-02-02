"""
Multi-Crop Disease Prediction API with Grad-CAM Visualization
FastAPI service for Govi Isuru Smart Farming Platform
Supports Rice and Tea Leaf Disease Detection
"""

import os
import io
import json
import base64
import numpy as np
import tensorflow as tf
try:
    import tf_keras as keras
    from tf_keras import layers
except Exception:
    import keras
    from keras import layers
from PIL import Image
import cv2
from fastapi import FastAPI, File, UploadFile, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from enum import Enum
from crop_suitability_model import predict_suitability

# Allow loading legacy/serialized Keras objects when supported
try:
    keras.config.enable_unsafe_deserialization()
except Exception:
    pass

# Configuration - Multi-crop support
MODELS_CONFIG = {
    "rice": {
        "model_path": "models/best_model.keras",
        "class_indices_path": "models/class_indices.json",
        "disease_info_path": "models/disease_info.json"
    },
    "tea": {
        "model_path": "models/tea/tea_best_model.keras",
        "class_indices_path": "models/tea/tea_class_indices.json",
        "disease_info_path": "models/tea/tea_disease_info.json"
    },
    "chili": {
        "model_path": "models/chili/chili_best_model.keras",
        "class_indices_path": "models/chili/chili_class_indices.json",
        "disease_info_path": "models/chili/chili_disease_info.json"
    }
}
IMAGE_SIZE = (224, 224)

# Crop type enum
class CropType(str, Enum):
    rice = "rice"
    tea = "tea"
    chili = "chili"

# Initialize FastAPI
app = FastAPI(
    title="Govi Isuru - Multi-Crop Disease Predictor",
    description="AI-powered crop disease detection for Rice, Tea, and Chili with Grad-CAM visualization",
    version="3.1.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------------------
# Crop Suitability Endpoint (tabular ML)
# -------------------------------------------------------------
@app.post("/suitability/predict")
def suitability_predict(payload: dict):
    try:
        recs = predict_suitability(payload)
        return {"recommendations": recs, "inputs": payload}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Global variables for models and metadata (multi-crop)
models = {}
class_indices = {}
class_names = {}
disease_info = {}

def load_crop_model(crop_type: str):
    """Load model and metadata for a specific crop type"""
    global models, class_indices, class_names, disease_info
    
    config = MODELS_CONFIG.get(crop_type)
    if not config:
        print(f"⚠️ Unknown crop type: {crop_type}")
        return False
    
    print(f"\n🔄 Loading {crop_type} model and metadata...")
    
    # Load model
    if os.path.exists(config["model_path"]):
        models[crop_type] = keras.models.load_model(
            config["model_path"],
            compile=False,
            safe_mode=False
        )
        print(f"✅ {crop_type.title()} model loaded from {config['model_path']}")
    else:
        print(f"⚠️ {crop_type.title()} model not found at {config['model_path']}")
        return False
    
    # Load class indices
    if os.path.exists(config["class_indices_path"]):
        with open(config["class_indices_path"], 'r') as f:
            class_indices[crop_type] = json.load(f)
        class_names[crop_type] = {int(k): v for k, v in class_indices[crop_type].items()}
        print(f"✅ {crop_type.title()} class indices loaded: {list(class_names[crop_type].values())}")
    else:
        print(f"⚠️ {crop_type.title()} class indices not found")
        return False
    
    # Load disease info
    if os.path.exists(config["disease_info_path"]):
        with open(config["disease_info_path"], 'r', encoding='utf-8') as f:
            disease_info[crop_type] = json.load(f)
        print(f"✅ {crop_type.title()} disease info loaded")
    else:
        print(f"⚠️ {crop_type.title()} disease info not found, using defaults")
        disease_info[crop_type] = {}
    
    return True

def load_all_models():
    """Load all available models"""
    print("=" * 60)
    print("🌾🍵 Loading All Crop Disease Models")
    print("=" * 60)
    
    results = {}
    for crop_type in MODELS_CONFIG.keys():
        results[crop_type] = load_crop_model(crop_type)
    
    return results

def preprocess_image(image_bytes):
    """Preprocess image for model prediction"""
    # Open image
    image = Image.open(io.BytesIO(image_bytes))
    
    # Convert to RGB if necessary
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    # Resize
    image = image.resize(IMAGE_SIZE, Image.Resampling.LANCZOS)
    
    # Convert to numpy array and normalize
    img_array = np.array(image) / 255.0
    
    # Add batch dimension
    img_array = np.expand_dims(img_array, axis=0)
    
    return img_array, image

def generate_gradcam(model, img_array, class_idx, layer_name=None):
    """
    Generate Grad-CAM heatmap for the predicted class
    Works with MobileNetV2 architecture
    """
    try:
        # For MobileNetV2, get the last conv layer from the base model
        grad_model = None
        conv_layer = None
        
        # Find the MobileNetV2 base model and its last conv layer
        for layer in model.layers:
            if 'mobilenetv2' in layer.name.lower() or 'mobilenet' in layer.name.lower():
                # It's the base model
                base_model = layer
                # Get the last convolutional layer output
                for sub_layer in reversed(base_model.layers):
                    if 'conv' in sub_layer.name.lower() and 'bn' not in sub_layer.name.lower():
                        conv_layer = sub_layer
                        break
                break
            elif 'efficientnet' in layer.name.lower():
                base_model = layer
                for sub_layer in reversed(base_model.layers):
                    if 'conv' in sub_layer.name.lower():
                        conv_layer = sub_layer
                        break
                break
        
        if conv_layer is None:
            print("⚠️ Could not find conv layer for Grad-CAM")
            return None
        
        # Create grad model
        # Get the output of the conv layer through the base model
        base_model_output = base_model(model.input)
        
        # We need to rebuild to get intermediate outputs
        # Create a new model that outputs both conv features and predictions
        intermediate_model = keras.Model(
            inputs=base_model.input,
            outputs=base_model.get_layer(conv_layer.name).output
        )
        
        # Get conv outputs
        with tf.GradientTape() as tape:
            # Forward pass through base model to get conv outputs
            conv_outputs = intermediate_model(img_array)
            tape.watch(conv_outputs)
            
            # Continue forward pass to get predictions
            x = layers.GlobalAveragePooling2D()(conv_outputs)
            
            # We need predictions, so use the full model
            predictions = model(img_array)
            loss = predictions[:, class_idx]
        
        # Get gradients
        grads = tape.gradient(loss, conv_outputs)
        
        if grads is None:
            # Fallback: simple attention-based visualization
            return generate_simple_attention(model, img_array, class_idx)
        
        # Global average pooling of gradients
        pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
        
        # Weight conv outputs by gradients
        conv_outputs = conv_outputs[0]
        heatmap = tf.reduce_sum(tf.multiply(pooled_grads, conv_outputs), axis=-1)
        
        # ReLU and normalize
        heatmap = np.maximum(heatmap.numpy(), 0)
        if np.max(heatmap) > 0:
            heatmap /= np.max(heatmap)
        
        return heatmap
        
    except Exception as e:
        print(f"⚠️ Grad-CAM error: {str(e)}")
        # Fallback to simple attention
        return generate_simple_attention(model, img_array, class_idx)

def generate_simple_attention(model, img_array, class_idx):
    """
    Generate a simple attention map based on gradient of output w.r.t. input
    Fallback when Grad-CAM fails
    """
    try:
        img_tensor = tf.convert_to_tensor(img_array)
        
        with tf.GradientTape() as tape:
            tape.watch(img_tensor)
            predictions = model(img_tensor)
            loss = predictions[:, class_idx]
        
        grads = tape.gradient(loss, img_tensor)
        
        if grads is None:
            return None
        
        # Take absolute value and average across channels
        attention = tf.reduce_mean(tf.abs(grads), axis=-1)[0]
        attention = attention.numpy()
        
        # Normalize
        if np.max(attention) > 0:
            attention /= np.max(attention)
        
        return attention
        
    except Exception as e:
        print(f"⚠️ Attention map error: {str(e)}")
        return None

def create_gradcam_overlay(original_image, heatmap, alpha=0.4):
    """
    Overlay Grad-CAM heatmap on original image
    
    Returns base64 encoded image
    """
    # Convert PIL image to numpy array
    img_array = np.array(original_image)
    
    # Resize heatmap to match image size
    heatmap_resized = cv2.resize(heatmap, (img_array.shape[1], img_array.shape[0]))
    
    # Convert heatmap to RGB colormap
    heatmap_colored = cv2.applyColorMap(np.uint8(255 * heatmap_resized), cv2.COLORMAP_JET)
    heatmap_colored = cv2.cvtColor(heatmap_colored, cv2.COLOR_BGR2RGB)
    
    # Overlay heatmap on original image
    overlay = np.uint8(img_array * (1 - alpha) + heatmap_colored * alpha)
    
    # Convert to base64
    overlay_image = Image.fromarray(overlay)
    buffer = io.BytesIO()
    overlay_image.save(buffer, format='PNG')
    buffer.seek(0)
    
    return base64.b64encode(buffer.getvalue()).decode('utf-8')

def create_heatmap_only(heatmap):
    """Create standalone heatmap image as base64"""
    # Resize to standard size
    heatmap_resized = cv2.resize(heatmap, IMAGE_SIZE)
    
    # Apply colormap
    heatmap_colored = cv2.applyColorMap(np.uint8(255 * heatmap_resized), cv2.COLORMAP_JET)
    heatmap_colored = cv2.cvtColor(heatmap_colored, cv2.COLOR_BGR2RGB)
    
    # Convert to base64
    heatmap_image = Image.fromarray(heatmap_colored)
    buffer = io.BytesIO()
    heatmap_image.save(buffer, format='PNG')
    buffer.seek(0)
    
    return base64.b64encode(buffer.getvalue()).decode('utf-8')

@app.on_event("startup")
async def startup_event():
    """Load all models on startup"""
    try:
        results = load_all_models()
        for crop, success in results.items():
            if not success:
                print(f"⚠️ {crop.title()} model loading failed. Please train the model first.")
    except Exception as e:
        print(f"⚠️ Error during model loading startup: {str(e)[:200]}")
        print("⚠️ API will still be available, models will load on first use")

@app.get("/")
async def root():
    """API health check"""
    return {
        "status": "healthy",
        "service": "Govi Isuru Multi-Crop Disease Predictor",
        "version": "3.0.0",
        "supported_crops": list(MODELS_CONFIG.keys()),
        "models_loaded": {crop: (crop in models) for crop in MODELS_CONFIG.keys()},
        "classes": {
            crop: list(class_indices.get(crop, {}).values()) 
            for crop in MODELS_CONFIG.keys()
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "models_loaded": {crop: (crop in models) for crop in MODELS_CONFIG.keys()}
    }

@app.get("/crops")
async def get_supported_crops():
    """Get list of supported crop types"""
    return {
        "crops": [
            {
                "type": crop,
                "name": crop.title(),
                "model_loaded": crop in models,
                "classes_count": len(class_names.get(crop, {}))
            }
            for crop in MODELS_CONFIG.keys()
        ]
    }

@app.post("/predict")
async def predict_disease(
    file: UploadFile = File(...),
    crop_type: CropType = Query(default=CropType.rice, description="Type of crop (rice,tea or chili)")
):
    """
    Predict crop disease from uploaded image
    
    Parameters:
    - file: Image file
    - crop_type: Type of crop (rice or tea)
    
    Returns:
    - prediction: Disease name
    - confidence: Prediction confidence (0-1)
    - all_predictions: All class probabilities
    - disease_info: Treatment and information
    - gradcam: Grad-CAM visualization (base64)
    """
    crop = crop_type.value
    
    if crop not in models:
        raise HTTPException(
            status_code=503,
            detail=f"{crop.title()} model not loaded. Please ensure the model is trained and available."
        )
    
    # Validate file type
    if not file.content_type.startswith('image/'):
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Please upload an image."
        )
    
    try:
        # Read image
        image_bytes = await file.read()
        
        print("🔄 Prediction in process...")
        # Preprocess
        img_array, original_image = preprocess_image(image_bytes)
        
        # Predict using the correct model
        model = models[crop]
        predictions = model.predict(img_array, verbose=0)[0]
        
        # Get top prediction
        predicted_idx = int(np.argmax(predictions))
        confidence = float(predictions[predicted_idx])
        predicted_class = class_names[crop][predicted_idx]
        
        # Generate Grad-CAM
        gradcam_data = None
        heatmap = generate_gradcam(model, img_array, predicted_idx)
        
        if heatmap is not None:
            overlay_base64 = create_gradcam_overlay(original_image, heatmap)
            heatmap_base64 = create_heatmap_only(heatmap)
            gradcam_data = {
                "overlay": overlay_base64,
                "heatmap": heatmap_base64
            }
        
        # Get disease information for this crop
        info = disease_info.get(crop, {}).get(predicted_class, {})
        
        # Build all predictions
        all_preds = []
        for idx, prob in enumerate(predictions):
            all_preds.append({
                "class": class_names[crop][idx],
                "probability": float(prob)
            })
        all_preds.sort(key=lambda x: x['probability'], reverse=True)
        
        return JSONResponse({
            "success": True,
            "crop_type": crop,
            "prediction": predicted_class,
            "confidence": confidence,
            "si_name": info.get("si_name", predicted_class),
            "description": info.get("description", ""),
            "treatment": info.get("treatment", []),
            "severity": info.get("severity", "unknown"),
            "all_predictions": all_preds,
            "gradcam": gradcam_data
        })
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )

# Legacy endpoint for backward compatibility with rice predictions
@app.post("/predict/rice")
async def predict_rice_disease(file: UploadFile = File(...)):
    """Legacy endpoint for rice disease prediction"""
    return await predict_disease(file=file, crop_type=CropType.rice)

@app.post("/predict/tea")
async def predict_tea_disease(file: UploadFile = File(...)):
    """Endpoint for tea disease prediction"""
    return await predict_disease(file=file, crop_type=CropType.tea)

@app.post("/predict/chili")
async def predict_chili_disease(file: UploadFile = File(...)):
    """Endpoint for chili disease prediction"""
    return await predict_disease(file=file, crop_type=CropType.chili)

@app.get("/classes")
async def get_all_classes():
    """Get list of all disease classes for all crops"""
    result = {}
    
    for crop in MODELS_CONFIG.keys():
        if crop in class_indices:
            classes_with_info = []
            for class_name in class_indices[crop].values():
                info = disease_info.get(crop, {}).get(class_name, {})
                classes_with_info.append({
                    "name": class_name,
                    "si_name": info.get("si_name", class_name),
                    "severity": info.get("severity", "unknown")
                })
            result[crop] = classes_with_info
    
    return {"classes": result}

@app.get("/classes/{crop_type}")
async def get_crop_classes(crop_type: CropType):
    """Get list of disease classes for a specific crop"""
    crop = crop_type.value
    
    if crop not in class_indices:
        return {"classes": []}
    
    classes_with_info = []
    for class_name in class_indices[crop].values():
        info = disease_info.get(crop, {}).get(class_name, {})
        classes_with_info.append({
            "name": class_name,
            "si_name": info.get("si_name", class_name),
            "severity": info.get("severity", "unknown")
        })
    
    return {"crop": crop, "classes": classes_with_info}

@app.get("/disease/{crop_type}/{disease_name}")
async def get_disease_info_by_crop(crop_type: CropType, disease_name: str):
    """Get detailed information about a specific disease for a crop"""
    crop = crop_type.value
    
    if crop not in disease_info:
        raise HTTPException(status_code=503, detail=f"Disease info for {crop} not loaded")
    
    # Find disease (case-insensitive)
    for name, info in disease_info[crop].items():
        if name.lower() == disease_name.lower() or name.lower().replace('_', ' ') == disease_name.lower():
            return {
                "crop": crop,
                "name": name,
                **info
            }
    
    raise HTTPException(status_code=404, detail=f"Disease '{disease_name}' not found for {crop}")


# ==================== YIELD PREDICTION ENDPOINTS ====================

# Initialize yield predictor
yield_predictor = None

def get_yield_predictor():
    """Get or initialize the yield predictor"""
    global yield_predictor
    if yield_predictor is None:
        try:
            from yield_predictor import YieldPredictor
            from pathlib import Path
            
            data_path = Path(__file__).parent / "paddy_data" / "paddy_statistics.json"
            model_path = Path(__file__).parent / "models" / "yield_predictor.pkl"
            
            yield_predictor = YieldPredictor()
            
            # Try to load existing model
            if model_path.exists():
                yield_predictor.load_model(model_path)
                print("✅ Yield predictor model loaded")
            
            # Always load data for historical trends (even if model exists)
            if data_path.exists():
                yield_predictor.load_data(data_path)
                print("✅ Yield predictor historical data loaded")
            else:
                print("⚠️ Yield predictor data not found. Run extract_paddy_data.py first.")
        except Exception as e:
            print(f"⚠️ Could not initialize yield predictor: {e}")
            yield_predictor = None
    
    return yield_predictor


@app.get("/yield/predict")
async def predict_yield(
    district: str = Query(..., description="District name"),
    season: str = Query(..., description="Season: Maha or Yala"),
    year: int = Query(..., description="Year for prediction"),
    area_ha: float = Query(1.0, description="Area in hectares (optional)")
):
    """
    Predict paddy yield for a given district, season, and year
    """
    predictor = get_yield_predictor()
    if predictor is None:
        raise HTTPException(status_code=503, detail="Yield predictor not available")
    
    try:
        result = predictor.predict(district, season, year, area_ha)
        
        # Get district stats for additional info
        stats = predictor.district_stats.get(district, {})
        stability_index = 1 - stats.get('stability_index', 0.5)  # Convert CV to stability
        
        # Convert confidence string to numeric value
        confidence_map = {'high': 0.9, 'medium': 0.7, 'low': 0.5}
        confidence_value = confidence_map.get(result.get('confidence', 'medium'), 0.7)
        
        # Calculate total production
        predicted_yield = result.get('predicted_yield_kg_ha', 0)
        total_production = predicted_yield * (area_ha or 1.0)
        
        return {
            "success": True,
            "district": district,
            "season": season,
            "year": year,
            "yield_kg_ha": predicted_yield,
            "predicted_yield_kg_ha": predicted_yield,  # Keep for backward compatibility
            "total_production_kg": round(total_production, 2),
            "confidence": confidence_value,
            "confidence_level": result.get('confidence', 'medium'),
            "stability_index": round(max(0, min(1, stability_index)), 3),
            "yield_range": {
                "min": result.get('historical_min', predicted_yield * 0.8),
                "max": result.get('historical_max', predicted_yield * 1.2)
            },
            "method": result.get('method', 'statistical'),
            "historical_avg": result.get('historical_avg', predicted_yield)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/yield/profit")
async def predict_profit(
    district: str = Query(..., description="District name"),
    season: str = Query(..., description="Season: Maha or Yala"),
    year: int = Query(..., description="Year for prediction"),
    area_ha: float = Query(..., description="Cultivated area in hectares"),
    cost_per_ha: float = Query(None, description="Production cost per hectare (optional)"),
    price_per_kg: float = Query(None, description="Expected paddy price per kg (optional)")
):
    """
    Predict profit for paddy cultivation
    """
    predictor = get_yield_predictor()
    if predictor is None:
        raise HTTPException(status_code=503, detail="Yield predictor not available")
    
    try:
        result = predictor.predict_profit(
            district, season, year, area_ha, cost_per_ha, price_per_kg
        )
        return {
            "success": True,
            "district": district,
            "season": season,
            "year": year,
            **result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/yield/warning")
async def get_early_warning(
    district: str = Query(..., description="District name"),
    season: str = Query(..., description="Season: Maha or Yala"),
    year: int = Query(..., description="Year for prediction")
):
    """
    Get early warning and risk assessment for a district/season
    """
    predictor = get_yield_predictor()
    if predictor is None:
        raise HTTPException(status_code=503, detail="Yield predictor not available")
    
    try:
        result = predictor.generate_early_warning(district, season, year)
        return {
            "success": True,
            **result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/yield/rankings")
async def get_district_rankings():
    """
    Get districts ranked by yield, stability, and overall performance
    Returns a flat array suitable for frontend display
    """
    predictor = get_yield_predictor()
    if predictor is None:
        raise HTTPException(status_code=503, detail="Yield predictor not available")
    
    try:
        # Get district stats from predictor
        if not predictor.district_stats:
            # Return empty rankings if no data
            return {
                "success": True,
                "rankings": []
            }
        
        # Build rankings from district statistics
        rankings = []
        max_yield = max(stats.get('avg_yield', 0) for stats in predictor.district_stats.values())
        
        for district, stats in predictor.district_stats.items():
            avg_yield = stats.get('avg_yield', 0)
            
            # stability_index in predictor is stored as CV (coefficient of variation)
            # where LOWER is better (1 - original_stability_index)
            # So we need to convert back: higher stability score = better
            stability_cv = stats.get('stability_index', 0.5)
            stability_score = 1 - stability_cv  # Convert CV back to stability (higher = better)
            stability_score = max(0, min(1, stability_score))  # Clamp to 0-1
            
            trend = stats.get('trend_slope', 0)
            
            # Calculate overall score: 60% yield, 40% stability
            yield_score = (avg_yield / max_yield) if max_yield > 0 else 0  # Normalize to 0-1
            overall_score = (yield_score * 0.6 + stability_score * 0.4) * 100
            
            rankings.append({
                'district': district,
                'avg_yield': round(avg_yield, 0),
                'stability': round(stability_score, 3),  # 0-1, higher = better
                'trend': round(trend, 4),  # Keep as decimal, frontend multiplies by 100
                'overall_score': round(overall_score, 1)
            })
        
        # Sort by overall score (descending)
        rankings.sort(key=lambda x: x['overall_score'], reverse=True)
        
        return {
            "success": True,
            "rankings": rankings
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/yield/district-stats")
async def get_district_statistics(
    district: str = Query(None, description="District name (optional, returns all if not specified)")
):
    """
    Get historical statistics for a district or all districts
    """
    predictor = get_yield_predictor()
    if predictor is None:
        raise HTTPException(status_code=503, detail="Yield predictor not available")
    
    try:
        if district:
            if district not in predictor.district_stats:
                raise HTTPException(status_code=404, detail=f"District '{district}' not found")
            return {
                "success": True,
                "district": district,
                "statistics": predictor.district_stats[district]
            }
        else:
            return {
                "success": True,
                "districts": predictor.district_stats
            }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/yield/trends")
async def get_yield_trends(
    district: str = Query(None, description="District name (optional)"),
    season: str = Query(None, description="Season: Maha or Yala (optional)")
):
    """
    Get historical yield trends
    """
    predictor = get_yield_predictor()
    if predictor is None:
        raise HTTPException(status_code=503, detail="Yield predictor not available")
    
    try:
        if predictor.historical_data is None:
            raise HTTPException(status_code=503, detail="Historical data not loaded")
        
        data = predictor.historical_data.copy()
        
        if district:
            data = data[data['district'] == district]
        if season:
            data = data[data['season'] == season]
        
        # Aggregate by year
        trends = data.groupby(['year', 'season']).agg({
            'yield_kg_ha': 'mean',
            'production_mt': 'sum',
            'harvested_area_ha': 'sum'
        }).reset_index()
        
        trends = trends.rename(columns={
            'yield_kg_ha': 'avg_yield_kg_ha',
            'production_mt': 'total_production_mt',
            'harvested_area_ha': 'total_area_ha'
        })
        
        return {
            "success": True,
            "filter": {
                "district": district,
                "season": season
            },
            "trends": trends.to_dict(orient='records')
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/yield/climate-zones")
async def get_climate_zones():
    """
    Get districts grouped by climate zone
    """
    from yield_predictor import CLIMATE_ZONES
    return {
        "success": True,
        "climate_zones": CLIMATE_ZONES
    }


if __name__ == "__main__":
    print("=" * 60)
    print("🌾🍵 Govi Isuru - Multi-Crop Disease Predictor API")
    print("=" * 60)
    
    # Check for GPU
    gpus = tf.config.experimental.list_physical_devices('GPU')
    if gpus:
        print(f"🎮 GPU available: {len(gpus)} device(s)")
        for gpu in gpus:
            tf.config.experimental.set_memory_growth(gpu, True)
    else:
        print("💻 Running on CPU")
    
    uvicorn.run(app, host="0.0.0.0", port=8000)
