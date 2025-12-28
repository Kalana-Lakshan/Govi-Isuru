"""
Train a comprehensive crop suitability ML model for Sri Lankan agriculture
Uses Random Forest and Gradient Boosting ensemble for better predictions
"""

import os
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import warnings
warnings.filterwarnings('ignore')

# File paths
DATA_PATH = 'data/crop_suitability_samples.csv'
MODEL_PATH = 'models/crop_suitability.joblib'
REPORT_PATH = 'models/crop_suitability_report.txt'

# Feature definitions
CATEGORICAL = ['district', 'season', 'soil_type', 'drainage', 'slope']
NUMERIC = ['soil_ph', 'rainfall_mm', 'temperature_c', 'land_size_ha']
BOOL = ['irrigation']
TARGET = 'crop'

def load_data():
    """Load and prepare data"""
    print("📂 Loading data...")
    if not os.path.exists(DATA_PATH):
        raise FileNotFoundError(f"Dataset not found at {DATA_PATH}. Run generate_crop_suitability_data.py first.")
    
    df = pd.read_csv(DATA_PATH)
    print(f"✅ Loaded {len(df)} samples")
    print(f"   Crops: {df[TARGET].unique()}")
    print(f"   Features: {len(CATEGORICAL + NUMERIC + BOOL)}")
    
    return df

def create_preprocessor():
    """Create feature preprocessing pipeline"""
    return ColumnTransformer([
        ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), CATEGORICAL),
        ('num', 'passthrough', NUMERIC),
        ('bool', 'passthrough', BOOL),
    ])

def train_model(X_train, y_train, model_type='random_forest'):
    """Train classification model"""
    print(f"\n🤖 Training {model_type} model...")
    
    preprocessor = create_preprocessor()
    
    if model_type == 'random_forest':
        classifier = RandomForestClassifier(
            n_estimators=200,
            max_depth=15,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42,
            n_jobs=-1
        )
    else:  # gradient_boosting
        classifier = GradientBoostingClassifier(
            n_estimators=150,
            max_depth=7,
            learning_rate=0.1,
            random_state=42
        )
    
    pipeline = Pipeline([
        ('preprocessor', preprocessor),
        ('classifier', classifier)
    ])
    
    pipeline.fit(X_train, y_train)
    return pipeline

def evaluate_model(model, X_test, y_test):
    """Evaluate model performance"""
    print("\n📊 Evaluating model...")
    
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"   Test Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
    
    # Classification report
    report = classification_report(y_test, y_pred, zero_division=0)
    print("\n📋 Classification Report:")
    print(report)
    
    # Confusion matrix
    cm = confusion_matrix(y_test, y_pred)
    print("\n🔢 Confusion Matrix:")
    crops = sorted(y_test.unique())
    print(f"         {' '.join([f'{c:>8}' for c in crops])}")
    for i, crop in enumerate(crops):
        print(f"{crop:>8} {' '.join([f'{cm[i][j]:>8}' for j in range(len(crops))])}")
    
    return accuracy, report

def get_feature_importance(model, feature_names):
    """Extract feature importance from trained model"""
    try:
        classifier = model.named_steps['classifier']
        if hasattr(classifier, 'feature_importances_'):
            importances = classifier.feature_importances_
            
            # Get feature names after preprocessing
            preprocessor = model.named_steps['preprocessor']
            cat_features = preprocessor.named_transformers_['cat'].get_feature_names_out(CATEGORICAL)
            all_features = list(cat_features) + NUMERIC + BOOL
            
            # Sort by importance
            indices = np.argsort(importances)[::-1][:15]  # Top 15
            
            print("\n🎯 Top 15 Feature Importances:")
            for i, idx in enumerate(indices, 1):
                print(f"   {i:2d}. {all_features[idx]:30s} {importances[idx]:.4f}")
    except Exception as e:
        print(f"   Could not extract feature importance: {e}")

def save_model(model, report, accuracy):
    """Save trained model and report"""
    print(f"\n💾 Saving model to {MODEL_PATH}...")
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    
    # Save detailed report
    with open(REPORT_PATH, 'w') as f:
        f.write("=" * 80 + "\n")
        f.write("CROP SUITABILITY MODEL TRAINING REPORT\n")
        f.write("=" * 80 + "\n\n")
        f.write(f"Model Type: Random Forest Classifier\n")
        f.write(f"Training Date: {pd.Timestamp.now()}\n")
        f.write(f"Test Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)\n\n")
        f.write("Classification Report:\n")
        f.write("-" * 80 + "\n")
        f.write(report)
    
    print(f"✅ Model saved successfully!")
    print(f"📄 Report saved to {REPORT_PATH}")

def main():
    """Main training pipeline"""
    print("\n" + "=" * 80)
    print(" 🌾 CROP SUITABILITY MODEL TRAINING")
    print("=" * 80 + "\n")
    
    # Load data
    df = load_data()
    
    # Convert boolean
    df['irrigation'] = df['irrigation'].astype(bool)
    
    # Split features and target
    X = df[CATEGORICAL + NUMERIC + BOOL]
    y = df[TARGET]
    
    # Train-test split
    print("\n📐 Splitting data (80% train, 20% test)...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"   Train set: {len(X_train)} samples")
    print(f"   Test set:  {len(X_test)} samples")
    
    # Train model
    model = train_model(X_train, y_train, model_type='random_forest')
    
    # Evaluate
    accuracy, report = evaluate_model(model, X_test, y_test)
    
    # Feature importance
    get_feature_importance(model, CATEGORICAL + NUMERIC + BOOL)
    
    # Cross-validation score
    print("\n🔄 Running 5-fold cross-validation...")
    cv_scores = cross_val_score(model, X, y, cv=5, n_jobs=-1)
    print(f"   CV Scores: {[f'{s:.4f}' for s in cv_scores]}")
    print(f"   Mean CV Score: {cv_scores.mean():.4f} (± {cv_scores.std():.4f})")
    
    # Save model
    save_model(model, report, accuracy)
    
    print("\n" + "=" * 80)
    print("✅ TRAINING COMPLETE!")
    print("=" * 80)
    print(f"\n📈 Final Model Accuracy: {accuracy*100:.2f}%")
    print(f"🔮 The model is now ready for predictions!")
    print(f"💡 Restart your FastAPI server to load the new model.\n")

if __name__ == '__main__':
    main()
