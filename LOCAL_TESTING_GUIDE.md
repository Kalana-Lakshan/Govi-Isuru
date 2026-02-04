# 🐳 Local Docker Testing Guide - GOVI-ISURU

## Prerequisites

Before running Docker locally, ensure you have:

1. **Docker Desktop** installed
   - [Download Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)
   - After installation, verify: `docker --version`

2. **Docker Compose** (included with Docker Desktop)
   - Verify: `docker-compose --version`

3. **Git** (optional but recommended)
   - Verify: `git --version`

---

## Step 1: Prepare Environment Variables

Create a `.env` file in your project root:

```bash
cp .env.example .env
```

Edit `.env` with your actual values:

```env
# MongoDB Atlas Connection String
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/govi_isuru?retryWrites=true&w=majority

# JWT Secret for authentication
JWT_SECRET=your_super_secret_key_here_change_this

# AI Service URL (use this for local Docker)
AI_SERVICE_URL=http://ai-service:8000

# News API Key (get from https://newsapi.org/)
NEWS_API_KEY=your_news_api_key_here

# Port configuration
PORT=5000
CLIENT_PORT=80
AI_SERVICE_PORT=8000

# Optional: For production (we'll use this for EC2)
NODE_ENV=development
REACT_APP_API_URL=http://localhost:5000
```

**❌ Important:** Don't commit `.env` to git! It's already in `.gitignore`

---

## Step 2: Run Locally with Docker Compose

### Option A: Using Default docker-compose.yml (with local MongoDB)

This is easiest for testing:

```powershell
# Navigate to project root
cd "c:\Users\ADMIN\Documents\Devthon 3.0\new folder\Govi-Isuru"

# Build images
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

**Services running:**
- 🌐 Frontend: http://localhost
- 🔧 Backend: http://localhost:5000
- 🤖 AI Service: http://localhost:8000
- 💾 MongoDB: localhost:27017 (local container)

---

### Option B: Using docker-compose.prod.yml (with MongoDB Atlas)

For production testing with cloud database:

```powershell
# Start services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

---

## Step 3: Verify Services Are Running

```powershell
# Check all containers
docker-compose ps

# Expected output:
# NAME                STATUS
# govi-isuru-mongo-1                    Up (if using default)
# govi-isuru-backend-1                  Up
# govi-isuru-ai-service-1              Up
# govi-isuru-frontend-1                Up
```

---

## Step 4: Test the Application

### Frontend
```
http://localhost
```

### Backend Health Check
```powershell
# PowerShell
Invoke-WebRequest -Uri "http://localhost:5000/health" -UseBasicParsing

# Or use curl
curl http://localhost:5000/health
```

### AI Service Health Check
```powershell
curl http://localhost:8000/health
# or check docs at http://localhost:8000/docs
```

### Check MongoDB Connection
```powershell
# From container
docker-compose exec backend npm run check-db

# Or manually test
curl http://localhost:5000/api/health
```

---

## Step 5: Common Docker Commands

```powershell
# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f ai-service
docker-compose logs -f frontend

# Restart a service
docker-compose restart backend

# Stop all services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v

# Rebuild without cache
docker-compose build --no-cache

# Access container shell
docker-compose exec backend sh
docker-compose exec ai-service bash

# View resource usage
docker stats
```

---

## Troubleshooting Local Testing

### Port Already in Use
```powershell
# Find what's using port 80 (frontend)
netstat -ano | findstr :80

# Find what's using port 5000 (backend)
netstat -ano | findstr :5000

# Kill process (replace PID with actual number)
taskkill /PID <PID> /F

# Or change ports in docker-compose.yml:
# ports:
#   - "8080:80"    # Change 80 to 8080
```

### Container Exits Immediately
```powershell
# Check logs
docker-compose logs backend

# Rebuild without cache
docker-compose build --no-cache

# Inspect Dockerfile
cat ai-service/Dockerfile
cat server/Dockerfile
cat client/Dockerfile
```

### MongoDB Connection Failed
```powershell
# If using local MongoDB
docker-compose logs mongo

# Verify MONGO_URI in .env
# Format: mongodb://mongo:27017/govi_isuru (for local)
# Or: mongodb+srv://user:pass@cluster.mongodb.net/dbname (for Atlas)
```

### AI Service Models Not Loading
```powershell
# Check if models directory exists in ai-service/models/
dir ai-service\models

# Rebuild AI service
docker-compose build --no-cache ai-service

# Check logs
docker-compose logs -f ai-service
```

---

## Step 6: Test Key Features

### 1. Authentication Flow
```powershell
# Signup
curl -X POST http://localhost:5000/api/auth/signup `
  -H "Content-Type: application/json" `
  -d '{
    "name":"Test User",
    "email":"test@example.com",
    "password":"testpass123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{
    "email":"test@example.com",
    "password":"testpass123"
  }'
```

### 2. Disease Prediction
```powershell
# Send image to AI service
# The AI service should be running at http://localhost:8000
# Check documentation at http://localhost:8000/docs
```

### 3. Chat/Chatbot
```powershell
curl http://localhost:5000/api/chatbot
```

---

## ✅ Local Testing Checklist

- [ ] Docker Desktop installed and running
- [ ] `.env` file created with credentials
- [ ] `docker-compose build` succeeded
- [ ] `docker-compose up -d` all services running
- [ ] Frontend loads at http://localhost
- [ ] Backend health check passes
- [ ] AI Service responds at http://localhost:8000
- [ ] MongoDB connection successful
- [ ] User signup/login works
- [ ] Can upload images for disease prediction
- [ ] Chatbot responds

---

## Next Steps: AWS EC2 Deployment

Once local testing is complete:

1. **Read:** [DIGITALOCEAN_DEPLOYMENT.md](DIGITALOCEAN_DEPLOYMENT.md)
   - Contains deployment architecture & setup
   
2. **For AWS EC2 instead of DigitalOcean:**
   - Create EC2 instance (Ubuntu 22.04 LTS recommended)
   - Install Docker: `sudo apt-get install docker.io docker-compose`
   - Follow the same docker-compose commands
   - Configure security groups for ports 80, 443, 5000, 8000
   - Set up SSL with Let's Encrypt/Certbot
   - Use Nginx reverse proxy (same setup as DigitalOcean)

3. **See:** [AWS_EC2_DEPLOYMENT.md](AWS_EC2_DEPLOYMENT.md) (created next)

---

## Performance Tips

- Use `docker-compose.prod.yml` for better performance (no local DB)
- Add resource limits in docker-compose.yml:
  ```yaml
  services:
    backend:
      deploy:
        resources:
          limits:
            cpus: '1'
            memory: 1024M
  ```
- Monitor with `docker stats`

---

## Support Commands

```powershell
# Get detailed service info
docker-compose config

# Validate docker-compose.yml
docker-compose config --quiet

# Export logs to file
docker-compose logs > logs.txt

# Clean up unused resources
docker system prune -a
```

