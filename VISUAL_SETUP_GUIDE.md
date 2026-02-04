# 🐳 Docker & AWS Setup - Visual Step-by-Step Guide

## 🎯 Your Goal
Run GOVI-ISURU locally with Docker → Later deploy to AWS EC2

---

## PHASE 1: LOCAL TESTING (This Week)

### Step 1️⃣ Install Docker (if not done)
```
Download → https://www.docker.com/products/docker-desktop
Install → Follow wizard
Verify → Open PowerShell, run: docker --version
```

✅ **You should see:** `Docker version 20.10.x`

---

### Step 2️⃣ Navigate to Your Project

```powershell
cd "c:\Users\ADMIN\Documents\Devthon 3.0\new folder\Govi-Isuru"
```

✅ **Check:** You should see docker-compose.yml in the folder

---

### Step 3️⃣ Run the Quick Start Script

```powershell
.\QUICK_START.ps1
```

**The script will:**
1. ✅ Check Docker is installed
2. ✅ Create .env file from template
3. ✅ Build Docker images (~5-10 minutes)
4. ✅ Start all services
5. ✅ Show you where to access the app

✅ **Expected output:** All services show "Up" status

---

### Step 4️⃣ Access Your Application

**Open your browser:**

| Service | URL |
|---------|-----|
| Frontend (Main App) | http://localhost |
| Backend API | http://localhost:5000 |
| AI Service Docs | http://localhost:8000/docs |

✅ **You should see:** React login page at http://localhost

---

### Step 5️⃣ Test Everything

```
1. Create account (signup)
2. Login
3. Upload image for disease prediction
4. Test chatbot
5. Browse marketplace
```

✅ **Success:** All features working locally!

---

### Step 6️⃣ View Logs If Something Breaks

```powershell
# See all logs
docker-compose logs -f

# See specific service
docker-compose logs -f backend
docker-compose logs -f ai-service
docker-compose logs -f frontend
```

✅ **Tip:** Most issues show in logs - read them carefully!

---

### Step 7️⃣ Stop Services (When Done Testing)

```powershell
# Stop but keep data
docker-compose down

# Stop and delete everything
docker-compose down -v
```

---

## 🎓 LOCAL TESTING QUICK REFERENCE

### Daily Commands

```powershell
# Start services
docker-compose up -d

# Check if running
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Restart a service
docker-compose restart backend

# Access container
docker-compose exec backend sh
```

### Useful Endpoints

```
Frontend:           http://localhost
API Health:         http://localhost:5000/health
AI Docs:            http://localhost:8000/docs
AI Health:          http://localhost:8000/health
Mongo Compass:      localhost:27017
```

---

## ⚠️ COMMON LOCAL ISSUES & FIXES

### Issue: Port 80 already in use
```powershell
# Find what's using it
netstat -ano | findstr :80

# Kill the process (replace 1234 with actual PID)
taskkill /PID 1234 /F

# Or change port in docker-compose.yml
# From: "80:80"
# To: "8080:80"
# Then use: http://localhost:8080
```

### Issue: Containers keep exiting
```powershell
# Check logs
docker-compose logs

# Rebuild
docker-compose build --no-cache

# Edit .env file - check MONGO_URI is correct
notepad .env

# Try again
docker-compose up -d
```

### Issue: Can't access http://localhost
```powershell
# Check containers are running
docker-compose ps

# If not running, check logs
docker-compose logs

# If frontend shows "Exited", rebuild it
docker-compose build --no-cache frontend
docker-compose up -d
```

---

## ✅ Local Testing Checklist

- [ ] Docker Desktop installed
- [ ] Project folder opened in PowerShell
- [ ] `.\QUICK_START.ps1` ran successfully
- [ ] All containers show "Up" status
- [ ] http://localhost loads in browser
- [ ] Can create user account
- [ ] Can login
- [ ] Backend API responds
- [ ] AI service accessible at port 8000

---

---

## PHASE 2: PREPARE FOR AWS (Next Week)

### Step 1️⃣ Create AWS Account

1. Go to: https://aws.amazon.com/
2. Click "Create an AWS Account"
3. Follow the signup process
4. Set up billing alerts (AWS Billing Dashboard)

✅ **Note:** You get 12 months free tier!

---

### Step 2️⃣ Create MongoDB Atlas (Cloud Database)

1. Go to: https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Create account
4. Create a cluster (Free Tier available!)
5. Get connection string
6. **Update your .env file with the connection string**

✅ **Format:** `mongodb+srv://username:password@cluster.mongodb.net/db`

---

### Step 3️⃣ Prepare Your Code

Make sure your project folder contains:
```
✅ docker-compose.yml (for local)
✅ docker-compose.prod.yml (for production)
✅ .env (with your secrets - don't commit!)
✅ .env.example (safe to commit)
✅ All source code
```

```powershell
# Optional: Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/govi-isuru.git
git push -u origin main
```

---

---

## PHASE 3: DEPLOY TO AWS EC2 (Following Week)

### Architecture Diagram

```
Your Domain (yourdomain.com)
        ↓
    AWS Route 53 (DNS)
        ↓
    Security Group (Port 80, 443)
        ↓
    EC2 Instance (Ubuntu)
        ↓
    Nginx (Reverse Proxy)
        ↓
    Docker Services
    ├─ Frontend (React)
    ├─ Backend (Node.js)
    ├─ AI Service (FastAPI)
    └─ MongoDB (Remote - Atlas)
```

---

### Step 1️⃣ Create EC2 Instance

**In AWS Console:**
1. Navigate to EC2 Dashboard
2. Click "Launch Instances"
3. Choose: **Ubuntu Server 22.04 LTS**
4. Instance Type: **t3.medium** (~$30/month)
5. Storage: **30 GB** (not 8 GB!)
6. Security Groups: Allow ports 80, 443, 22, 5000, 8000
7. Key Pair: Create new → Download .pem file
8. **Launch!**

✅ **You'll get:** Public IPv4 address (e.g., 54.123.45.67)

---

### Step 2️⃣ Connect to EC2 via SSH

**From PowerShell:**

```powershell
# Navigate to key file
cd C:\Users\ADMIN\.ssh

# Set permissions
icacls govi-isuru-key.pem /inheritance:r /grant:r "$($env:USERNAME):(F)"

# Connect
ssh -i govi-isuru-key.pem ubuntu@54.123.45.67
```

✅ **You should see:** Ubuntu terminal prompt

---

### Step 3️⃣ Install Docker on EC2

```bash
# Run these commands on the EC2 instance
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose
sudo usermod -aG docker ubuntu
exit  # Logout and reconnect
```

✅ **Verify:** `docker --version` should work

---

### Step 4️⃣ Upload Your Project

**From PowerShell (on your Windows machine):**

```powershell
# Upload entire project
scp -i C:\Users\ADMIN\.ssh\govi-isuru-key.pem `
    -r "C:\Users\ADMIN\Documents\Devthon 3.0\new folder\Govi-Isuru" `
    ubuntu@54.123.45.67:~/

# Or just .env file
scp -i C:\Users\ADMIN\.ssh\govi-isuru-key.pem `
    .env `
    ubuntu@54.123.45.67:~/govi-isuru/
```

---

### Step 5️⃣ Deploy on EC2

**On the EC2 instance (via SSH):**

```bash
cd ~/govi-isuru

# View .env
cat .env

# Build images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

✅ **Wait:** ~10 minutes for build to complete

---

### Step 6️⃣ Test Your Live App

**From your Windows browser:**

```
http://54.123.45.67
```

✅ **You should see:** Your app running on AWS!

---

### Step 7️⃣ Setup Domain (Optional)

1. Buy domain from: GoDaddy, Namecheap, Route53, etc.
2. Point to your EC2 public IP in DNS settings:
   ```
   A record: @ → 54.123.45.67
   A record: www → 54.123.45.67
   ```
3. Access: `https://yourdomain.com`

✅ **Cost:** ~$12/year for domain

---

### Step 8️⃣ Setup SSL Certificate (Free!)

**On EC2:**

```bash
sudo apt install -y certbot python3-certbot-nginx

# Get certificate (replace yourdomain.com)
sudo certbot certonly --standalone -d yourdomain.com

# Setup auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

✅ **Cost:** Free (Let's Encrypt)

---

## 📊 AWS DEPLOYMENT CHECKLIST

- [ ] AWS account created
- [ ] EC2 instance running (t3.medium)
- [ ] SSH key safely stored
- [ ] Connected to EC2 via SSH
- [ ] Docker installed on EC2
- [ ] Project uploaded to EC2
- [ ] .env file configured on EC2
- [ ] Docker images built on EC2
- [ ] Services running: `docker-compose ps`
- [ ] Can access app at public IP
- [ ] Domain pointing to public IP (optional)
- [ ] SSL certificate installed (optional)

---

## 💰 COST BREAKDOWN

### Setup (One-time)
- AWS Account: Free
- Certification: Free
- Domain: $12/year = $1/month

### Monthly Recurring
```
EC2 t3.medium:      $30/month
Storage (30GB):     $3/month
Data transfer:      ~$1/month
─────────────────────────────
TOTAL:             ~$35/month
```

✅ **Compare:** 
- DigitalOcean: $24/month (cheaper)
- Heroku: $50+/month
- Lambda: $80+/month (not ideal for persistent apps)

---

## 📋 FINAL CHECKLIST

### Before Starting
- [ ] Docker Desktop installed
- [ ] 10 GB free disk space
- [ ] AWS account ready (for later)

### Local Testing (This Week)
- [ ] Run `.\QUICK_START.ps1`
- [ ] All containers running
- [ ] App accessible at http://localhost
- [ ] All features tested

### AWS Deployment (Next Week)
- [ ] MongoDB Atlas created
- [ ] AWS account created
- [ ] EC2 instance running
- [ ] App deployed to EC2
- [ ] Domain configured (optional)
- [ ] SSL working (optional)

---

## 🆘 QUICK HELP

**Something not working?**

### Check Logs
```powershell
docker-compose logs -f
```

### Restart Everything
```powershell
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### View Status
```powershell
docker-compose ps
```

### Access Container
```powershell
docker-compose exec backend sh
```

### Still Stuck?
Read the detailed guides:
- **LOCAL_TESTING_GUIDE.md** - For local issues
- **AWS_EC2_DEPLOYMENT.md** - For cloud issues

---

## 🎯 NEXT IMMEDIATE ACTION

**Right now:**

1. **Open PowerShell**
2. **Run:**
   ```powershell
   cd "c:\Users\ADMIN\Documents\Devthon 3.0\new folder\Govi-Isuru"
   .\QUICK_START.ps1
   ```
3. **Wait** 5-10 minutes for setup
4. **Open browser:** http://localhost
5. **Enjoy!** Your app is running 🎉

---

## 📚 DOCUMENTATION FILES

Read these in order:

1. **This file** (you're reading it!) ✅
2. **DOCKER_AND_AWS_ROADMAP.md** - Complete overview
3. **LOCAL_TESTING_GUIDE.md** - Detailed local setup (this week)
4. **AWS_EC2_DEPLOYMENT.md** - Detailed AWS setup (next week)
5. **QUICK_REFERENCE.md** - Command cheat sheet (when needed)

---

**You've got this! 🚀**

