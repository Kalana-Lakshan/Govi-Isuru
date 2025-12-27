import os
import joblib
import pandas as pd
from typing import List, Dict, Any
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import accuracy_score

MODEL_PATH = os.path.join('models', 'crop_suitability.joblib')
SAMPLE_DATA_PATH = os.path.join('data', 'crop_suitability_samples.csv')

CATEGORICAL = ['district', 'season', 'soil_type', 'drainage', 'slope']
NUMERIC = ['soil_ph', 'rainfall_mm', 'temperature_c', 'land_size_ha']
BOOL = ['irrigation']
TARGET = 'crop'


def load_or_train_model() -> Pipeline:
  # Try load saved model
  if os.path.exists(MODEL_PATH):
    try:
      return joblib.load(MODEL_PATH)
    except Exception:
      pass
  # Train from sample CSV
  if not os.path.exists(SAMPLE_DATA_PATH):
    raise FileNotFoundError(f"Sample data not found at {SAMPLE_DATA_PATH}")
  df = pd.read_csv(SAMPLE_DATA_PATH)
  # Cast bool
  df['irrigation'] = df['irrigation'].astype(bool)
  X = df[CATEGORICAL + NUMERIC + BOOL]
  y = df[TARGET]

  preproc = ColumnTransformer(
    [
      ('cat', OneHotEncoder(handle_unknown='ignore'), CATEGORICAL),
      ('num', 'passthrough', NUMERIC),
      ('bool', 'passthrough', BOOL),
    ]
  )

  clf = GradientBoostingClassifier(random_state=42)
  pipe = Pipeline([
    ('prep', preproc),
    ('clf', clf)
  ])

  try:
    X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.3, random_state=42, stratify=y)
    pipe.fit(X_train, y_train)
    acc = accuracy_score(y_val, pipe.predict(X_val))
    print(f"[Suitability] Trained GradientBoostingClassifier acc={acc:.2f}")
  except Exception as e:
    # If the dataset is tiny, train on all data without validation
    print(f"[Suitability] train/val split skipped ({e}); training on full data")
    pipe.fit(X, y)
  os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
  joblib.dump(pipe, MODEL_PATH)
  return pipe


model = load_or_train_model()


def predict_suitability(payload: Dict[str, Any]) -> List[Dict[str, Any]]:
  """Return ranked crops with probability scores."""
  # Ensure all fields exist with defaults
  defaults = {
    'district': '', 'season': 'Maha', 'soil_ph': 6.3, 'soil_type': 'Loam',
    'drainage': 'Moderate', 'slope': 'Flat', 'irrigation': True,
    'rainfall_mm': 1100, 'temperature_c': 28, 'land_size_ha': 1.0,
  }
  data = {**defaults, **payload}
  df = pd.DataFrame([data])
  df['irrigation'] = df['irrigation'].astype(bool)

  proba = model.predict_proba(df)[0]
  classes = list(model.classes_)
  recs = []
  for cls, p in sorted(zip(classes, proba), key=lambda x: x[1], reverse=True):
    recs.append({
      'crop': cls,
      'score': float(p * 100),
      'reason': f"Estimated suitability {p*100:.1f}% based on soil pH {data['soil_ph']}, rainfall {data['rainfall_mm']} mm, temp {data['temperature_c']}°C, irrigation {data['irrigation']}",
      'notes': 'Model: GradientBoostingClassifier trained on sample data. Retrain with local datasets for better accuracy.'
    })
  return recs
