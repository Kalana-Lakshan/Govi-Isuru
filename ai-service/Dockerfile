# Lightweight Python base with build tools for scientific deps
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# System deps for numpy, opencv, tensorflow runtime requirements
RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential gcc \
       libglib2.0-0 libsm6 libxrender1 libxext6 libgl1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python deps first (better layer caching)
COPY requirements.txt /app/requirements.txt
RUN pip config set global.require-hashes false \
    && pip install --no-cache-dir --default-timeout=1000 -r /app/requirements.txt
COPY . /app

EXPOSE 8000

# Start FastAPI app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
