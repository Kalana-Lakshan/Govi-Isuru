#!/usr/bin/env python3
"""Simple wrapper to run the FastAPI app without the app.on_event decorators causing issues"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

os.environ.setdefault("TF_USE_LEGACY_KERAS", "1")

import uvicorn
from main import app

if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("🌾🍵 Govi Isuru - Multi-Crop Disease Predictor API")
    print("=" * 60)
    print("\n🚀 Starting FastAPI server on http://0.0.0.0:8000")
    print("📚 Interactive API docs available at http://localhost:8000/docs")
    print("=" * 60 + "\n")
    
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)
