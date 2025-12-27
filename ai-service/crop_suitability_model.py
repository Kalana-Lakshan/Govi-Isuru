import os
import joblib
import pandas as pd
from typing import List, Dict, Any
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

MODEL_PATH = os.path.join('models', 'crop_suitability.joblib')
SAMPLE_DATA_PATH = os.path.join('data', 'crop_suitability_samples.csv')

CATEGORICAL = ['district', 'season', 'soil_type', 'drainage', 'slope']
NUMERIC = ['soil_ph', 'rainfall_mm', 'temperature_c', 'land_size_ha']
BOOL = ['irrigation']
TARGET = 'crop'


def load_or_train_model() -> Pipeline:
  """Load existing model or train new one from data"""
  # Try load saved model
  if os.path.exists(MODEL_PATH):
    try:
      model = joblib.load(MODEL_PATH)
      print(f"✅ Loaded existing crop suitability model from {MODEL_PATH}")
      return model
    except Exception as e:
      print(f"⚠️ Failed to load model: {e}. Training new model...")
  
  # Train from sample CSV
  if not os.path.exists(SAMPLE_DATA_PATH):
    raise FileNotFoundError(f"Sample data not found at {SAMPLE_DATA_PATH}. Run generate_crop_suitability_data.py first.")
  
  print(f"🔄 Training new crop suitability model from {SAMPLE_DATA_PATH}...")
  df = pd.read_csv(SAMPLE_DATA_PATH)
  
  # Cast bool
  df['irrigation'] = df['irrigation'].astype(bool)
  X = df[CATEGORICAL + NUMERIC + BOOL]
  y = df[TARGET]

  # Preprocessing pipeline
  preproc = ColumnTransformer([
    ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), CATEGORICAL),
    ('num', 'passthrough', NUMERIC),
    ('bool', 'passthrough', BOOL),
  ])

  # Use RandomForest for better performance
  clf = RandomForestClassifier(
    n_estimators=200,
    max_depth=15,
    min_samples_split=5,
    min_samples_leaf=2,
    random_state=42,
    n_jobs=-1
  )
  
  pipe = Pipeline([
    ('prep', preproc),
    ('clf', clf)
  ])

  # Train with validation if enough data
  try:
    X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    pipe.fit(X_train, y_train)
    acc = accuracy_score(y_val, pipe.predict(X_val))
    print(f"✅ Model trained - Validation Accuracy: {acc:.4f} ({acc*100:.2f}%)")
  except Exception as e:
    # If the dataset is tiny, train on all data without validation
    print(f"⚠️ Train/val split skipped ({e}). Training on full dataset...")
    pipe.fit(X, y)
    print(f"✅ Model trained on {len(X)} samples")
  
  # Save model
  os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
  joblib.dump(pipe, MODEL_PATH)
  print(f"💾 Model saved to {MODEL_PATH}")
  
  return pipe


model = load_or_train_model()


def predict_suitability(payload: Dict[str, Any]) -> List[Dict[str, Any]]:
  """Return ranked crops with probability scores and detailed reasoning"""
  # Ensure all fields exist with defaults
  defaults = {
    'district': '', 'season': 'Maha', 'soil_ph': 6.3, 'soil_type': 'Loam',
    'drainage': 'Moderate', 'slope': 'Flat', 'irrigation': True,
    'rainfall_mm': 1100, 'temperature_c': 28, 'land_size_ha': 1.0,
  }
  data = {**defaults, **payload}
  df = pd.DataFrame([data])
  df['irrigation'] = df['irrigation'].astype(bool)

  # Get predictions with probabilities
  proba = model.predict_proba(df)[0]
  classes = list(model.classes_)
  
  # Generate detailed reasoning for each crop
  recs = []
  for cls, p in sorted(zip(classes, proba), key=lambda x: x[1], reverse=True):
    score = float(p * 100)
    
    # Build detailed reasoning
    reasons = []
    
    # pH suitability
    if cls == 'Rice':
      if 5.5 <= data['soil_ph'] <= 7.0:
        reasons.append(f"✓ Optimal pH ({data['soil_ph']}) for rice (ideal: 5.5-7.0)")
      else:
        reasons.append(f"⚠ pH {data['soil_ph']} is outside optimal range (5.5-7.0)")
    elif cls == 'Tea':
      if 4.5 <= data['soil_ph'] <= 5.5:
        reasons.append(f"✓ Ideal acidic pH ({data['soil_ph']}) for tea (4.5-5.5)")
      else:
        reasons.append(f"⚠ pH {data['soil_ph']} - tea prefers acidic soils (4.5-5.5)")
    elif cls == 'Chili':
      if 6.0 <= data['soil_ph'] <= 7.5:
        reasons.append(f"✓ Good pH ({data['soil_ph']}) for chili (ideal: 6.0-7.5)")
      else:
        reasons.append(f"⚠ pH {data['soil_ph']} is outside optimal range (6.0-7.5)")
    
    # Rainfall suitability
    if cls == 'Rice' and 900 <= data['rainfall_mm'] <= 2000:
      reasons.append(f"✓ Adequate rainfall ({data['rainfall_mm']}mm) for rice")
    elif cls == 'Tea' and data['rainfall_mm'] >= 1500:
      reasons.append(f"✓ High rainfall ({data['rainfall_mm']}mm) suits tea cultivation")
    elif cls == 'Chili' and 600 <= data['rainfall_mm'] <= 1200:
      reasons.append(f"✓ Moderate rainfall ({data['rainfall_mm']}mm) ideal for chili")
    
    # Temperature suitability
    if cls == 'Rice' and 24 <= data['temperature_c'] <= 32:
      reasons.append(f"✓ Temperature ({data['temperature_c']}°C) within rice range")
    elif cls == 'Tea' and 18 <= data['temperature_c'] <= 27:
      reasons.append(f"✓ Cool temperature ({data['temperature_c']}°C) perfect for tea")
    elif cls == 'Chili' and 25 <= data['temperature_c'] <= 33:
      reasons.append(f"✓ Warm temperature ({data['temperature_c']}°C) suits chili")
    
    # Soil type
    if cls == 'Rice' and data['soil_type'] in ['Clay', 'Loam']:
      reasons.append(f"✓ {data['soil_type']} soil is ideal for rice paddies")
    elif cls == 'Tea' and data['soil_type'] in ['Loam', 'Sandy']:
      reasons.append(f"✓ {data['soil_type']} soil with good drainage suits tea")
    elif cls == 'Chili' and data['soil_type'] in ['Sandy', 'Loam']:
      reasons.append(f"✓ {data['soil_type']} soil is excellent for chili")
    
    # Irrigation
    if data['irrigation']:
      if cls in ['Rice', 'Chili']:
        reasons.append(f"✓ Irrigation available - essential for {cls.lower()}")
    else:
      if cls == 'Tea':
        reasons.append(f"✓ No irrigation needed - tea thrives on rainfall")
    
    # Slope
    if cls == 'Rice' and data['slope'] == 'Flat':
      reasons.append(f"✓ Flat terrain perfect for rice paddies")
    elif cls == 'Tea' and data['slope'] in ['Gentle', 'Steep']:
      reasons.append(f"✓ {data['slope']} slope ideal for tea estates")
    
    reason_text = " | ".join(reasons[:4])  # Top 4 reasons
    
    recs.append({
      'crop': cls,
      'score': score,
      'confidence': 'High' if score > 70 else 'Medium' if score > 40 else 'Low',
      'reason': reason_text if reasons else f"Based on ML analysis: {score:.1f}% suitability",
      'notes': f'Season: {data["season"]}, District: {data["district"]}, Land: {data["land_size_ha"]}ha'
    })
  
  return recs
