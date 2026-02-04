# 📋 Complete Docker & AWS Deployment Roadmap

## Quick Start - Run Locally NOW (5 minutes)

### 1. Install Docker
- Download [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)
- Open PowerShell as Administrator
- Verify: `docker --version`

### 2. Start the Project

```powershell
# Navigate to project
cd "c:\Users\ADMIN\Documents\Devthon 3.0\new folder\Govi-Isuru"

# Copy environment file
copy .env.example .env

# Build images
docker-compose build

# Start services
docker-compose up -d

# Check status
docker-compose ps
```

### 3. Access Your App
- **Frontend:** http://localhost
- **Backend API:** http://localhost:5000
- **AI Service Docs:** http://localhost:8000/docs

### 4. View Logs
```powershell
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f ai-service
docker-compose logs -f frontend
```

---

## Step-by-Step Learning Path

### Phase 1: Local Testing (This Week)
**Goal:** Get the app running and test all features locally

1. **Read:** [LOCAL_TESTING_GUIDE.md](LOCAL_TESTING_GUIDE.md) (10 min)
2. **Run:** `docker-compose build` → `docker-compose up -d`
3. **Test:** 
   - Access http://localhost
   - Try user signup/login
   - Test disease prediction
   - Test chatbot
4. **Verify:** All containers running (`docker-compose ps`)

**Success Criteria:**
- ✅ All services running (status: "Up")
- ✅ Frontend loads at http://localhost
- ✅ Can create user account
- ✅ Backend responds to API calls
- ✅ AI service accessible

---

### Phase 2: Prepare for Cloud (Next Week)
**Goal:** Prepare your code and credentials for production

1. **MongoDB Setup**
   - Create [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (Free Tier)
   - Create a cluster
   - Copy connection string
   - Update `.env` with `MONGO_URI`

2. **News API** (Optional)
   - Get key from [https://newsapi.org/](https://newsapi.org/)
   - Add to `.env`

3. **GitHub Setup** (Recommended)
   - Create private repo on GitHub
   - Push your code (WITHOUT `.env` or `node_modules/`)
   - Example `.gitignore` created in project

---

### Phase 3: AWS EC2 Deployment (Final Step)
**Goal:** Deploy to AWS EC2 for production

#### Step A: Create AWS Account
- Go to [aws.amazon.com](https://aws.amazon.com)
- Sign up (Free Tier available)
- Set up billing alerts

#### Step B: Follow AWS EC2 Guide
1. **Read:** [AWS_EC2_DEPLOYMENT.md](AWS_EC2_DEPLOYMENT.md) (30 min)
2. **Create:** EC2 instance (t3.medium recommended)
3. **Connect:** SSH to instance
4. **Deploy:** Run docker-compose commands
5. **Test:** Access your live app

#### Step C: Setup Domain (Optional)
- Buy domain (~$10/year)
- Point to EC2 public IP
- Setup SSL certificate (free with Let's Encrypt)

---

## Architecture Overview

```
Your Computer (Windows)
    ↓
    └─ Docker Desktop runs:
        ├─ Frontend (React) - port 80
        ├─ Backend (Express) - port 5000
        ├─ AI Service (FastAPI) - port 8000
        └─ MongoDB (local) - port 27017

Later on AWS EC2 (Ubuntu):
    ↓
    └─ Docker Compose runs same services:
        ├─ Frontend (React) - port 80
        ├─ Backend (Express) - port 5000
        ├─ AI Service (FastAPI) - port 8000
        └─ MongoDB Atlas (cloud) - remote
```

---

## Environment Files Explained

### `.env.example` (Template)
Shows all required variables. Don't edit directly.

### `.env` (Your Secrets)
Create this file locally with your actual values:
```env
# Database
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/db

# Security
JWT_SECRET=random_secret_key_here_change_me

# APIs
NEWS_API_KEY=your_api_key

# Services
AI_SERVICE_URL=http://ai-service:8000
```

**⚠️ Important:** Never commit `.env` to git!

---

## Docker Commands Cheat Sheet

### Building & Running

```powershell
# Build all images
docker-compose build

# Start in background
docker-compose up -d

# Start with logs visible
docker-compose up

# Stop all services
docker-compose down

# Stop and remove data
docker-compose down -v

# Rebuild without cache
docker-compose build --no-cache
```

### Monitoring

```powershell
# List running containers
docker-compose ps

# View logs (all services)
docker-compose logs -f

# View logs (specific service)
docker-compose logs -f backend

# Get logs last 50 lines
docker-compose logs --tail=50 backend

# Follow AI service logs
docker-compose logs -f ai-service

# View resource usage
docker stats
```

### Container Access

```powershell
# Access backend shell
docker-compose exec backend sh

# Access AI service shell
docker-compose exec ai-service bash

# Run command in container
docker-compose exec backend npm list

# Check environment variables
docker-compose exec backend env
```

### Troubleshooting

```powershell
# Restart a service
docker-compose restart backend

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Remove all Docker data
docker system prune -a

# See detailed configuration
docker-compose config
```

---

## Common Issues & Fixes

### Issue: "Port 80 already in use"
```powershell
# Find what's using port 80
netstat -ano | findstr :80

# Kill the process (replace PID)
taskkill /PID 1234 /F

# Or change port in docker-compose.yml
# From: "80:80"
# To: "8080:80"
# Then access at http://localhost:8080
```

### Issue: Containers keep exiting
```powershell
# Check logs
docker-compose logs

# Common causes:
# 1. Wrong environment variables in .env
# 2. Database connection failed
# 3. Port already in use

# Solution:
docker-compose down -v
docker-compose build --no-cache
# Update .env
docker-compose up
```

### Issue: Can't access frontend
```powershell
# Verify container is running
docker-compose ps

# Check logs
docker-compose logs frontend

# Test with curl
curl http://localhost

# Or access: http://localhost:80
```

### Issue: API calls failing
```powershell
# Test backend
curl http://localhost:5000/health

# Check environment variables
docker-compose exec backend env | grep MONGO_URI

# View backend logs
docker-compose logs -f backend
```

---

## Timeline & Recommendations

### Week 1: Local Setup
- Day 1: Install Docker, run locally
- Days 2-3: Test all features, fix any issues
- Day 4-5: Update MongoDB Atlas URI
- Day 6-7: Review code, prepare for cloud

### Week 2: AWS Deployment
- Day 1-2: Create AWS account, read guide
- Day 3-4: Create EC2 instance, deploy
- Day 5-6: Test production, setup domain
- Day 7: Document and backup

### Week 3+: Monitoring & Optimization
- Monitor logs and performance
- Optimize Docker images if needed
- Set up automated backups
- Plan scaling strategy

---

## Files You Need to Know

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Local development (with MongoDB) |
| `docker-compose.prod.yml` | Production (with MongoDB Atlas) |
| `.env` | Your secrets (don't commit!) |
| `.env.example` | Template (safe to commit) |
| `server/Dockerfile` | Backend image definition |
| `client/Dockerfile` | Frontend image definition |
| `ai-service/Dockerfile` | AI service image definition |
| `LOCAL_TESTING_GUIDE.md` | This week's reading |
| `AWS_EC2_DEPLOYMENT.md` | Next week's reading |

---

## Important: Credentials & Security

### .env File
- ✅ Create locally, never commit to git
- ✅ Use strong, random JWT_SECRET
- ✅ Use MongoDB Atlas connection string
- ✅ Keep secure and backed up

### Git & GitHub
```bash
# .gitignore already includes:
.env
node_modules/
__pycache__/
*.log
.DS_Store

# Safe to commit:
.env.example (template only)
Dockerfiles
docker-compose.yml
source code
```

### AWS Credentials
- Use IAM roles, never hardcode credentials
- Store secrets in AWS Secrets Manager
- Enable MFA on AWS account
- Restrict security group access

---

## Success Checklist

### Before Local Testing
- [ ] Docker Desktop installed
- [ ] Git installed (optional but recommended)
- [ ] `.env` file created with test values

### After Local Testing
- [ ] All containers running
- [ ] Can access http://localhost
- [ ] Backend API responds
- [ ] Can create user account
- [ ] AI service loads models
- [ ] Database operations work

### Before AWS Deployment
- [ ] MongoDB Atlas account created
- [ ] Connection string tested locally
- [ ] All .env variables collected
- [ ] Project pushed to GitHub (optional)
- [ ] AWS account created
- [ ] EC2 budget alert set

### After AWS Deployment
- [ ] EC2 instance running
- [ ] SSH connection works
- [ ] Docker services running on EC2
- [ ] Public IP accessible
- [ ] Frontend loads in browser
- [ ] API requests work
- [ ] Domain pointing to EC2 (if applicable)
- [ ] SSL certificate working

---

## Useful Links

### Docker
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Docker CLI Reference](https://docs.docker.com/engine/reference/commandline/cli/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)

### AWS
- [AWS Free Tier](https://aws.amazon.com/free/)
- [EC2 Getting Started](https://docs.aws.amazon.com/ec2/index.html)
- [Security Groups](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html)

### Databases
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [MongoDB Documentation](https://docs.mongodb.com/)

### Other Services
- [News API](https://newsapi.org/)
- [Let's Encrypt](https://letsencrypt.org/)
- [Nginx](https://nginx.org/)

---

## Next Actions (In Order)

1. **Right now:** Read the first 10 lines of this file (you're reading it!)
2. **Next 5 min:** Install Docker Desktop if not already installed
3. **Next 10 min:** Run `docker-compose build && docker-compose up -d`
4. **Next 5 min:** Check http://localhost
5. **This week:** Read [LOCAL_TESTING_GUIDE.md](LOCAL_TESTING_GUIDE.md)
6. **Next week:** Read [AWS_EC2_DEPLOYMENT.md](AWS_EC2_DEPLOYMENT.md)

---

**You've got this! 🚀**

Need help? Check the troubleshooting sections in each guide or review the logs with `docker-compose logs -f`

