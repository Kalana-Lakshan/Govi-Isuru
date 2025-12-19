# 1. Use an official Python runtime (3.9-slim is perfect for size)
FROM python:3.10-slim

# 2. Prevent Python from writing .pyc files and enable real-time logging
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 3. Set the working directory
WORKDIR /app

# 4. Install system dependencies for OpenCV and AI libraries
# Added 'build-essential' in case any of your pip packages need to compile C++ code
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 5. Copy requirements and install
# This layer is cached unless requirements.txt changes
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 6. Copy the rest of the AI service code
COPY . .

# 7. Expose the port (8000 is standard for FastAPI/Flask)
EXPOSE 8000

# 8. Command to run the application
CMD ["python", "main.py"]