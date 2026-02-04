# 🚀 GOVI-ISURU DOCKER & AWS - QUICK REFERENCE CARD

## 📌 PHASE 1: LOCAL TESTING

### ✅ Prerequisites
- [ ] Windows 10/11
- [ ] 10 GB free disk space
- [ ] Internet connection

### 🔧 Install Docker
```
1. Download: https://www.docker.com/products/docker-desktop
2. Install and start Docker Desktop
3. Verify: docker --version
```

### 🏃 Run Application (ONE COMMAND)
```powershell
cd "c:\Users\ADMIN\Documents\Devthon 3.0\new folder\Govi-Isuru"
.\QUICK_START.ps1
```

### 🌐 Access
```
Frontend:   http://localhost
Backend:    http://localhost:5000
AI Docs:    http://localhost:8000/docs
```

### 📊 Check Status
```powershell
docker-compose ps
```

### 📋 View Logs
```powershell
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f ai-service
docker-compose logs -f frontend
```

### 🛑 Stop Services
```powershell
docker-compose down
```

---

## 📌 PHASE 2: PREPARE FOR AWS

### 1️⃣ Create AWS Account
- Go to: aws.amazon.com
- Sign up (Free Tier available)

### 2️⃣ Create MongoDB Atlas
- Go to: mongodb.com/cloud/atlas
- Create cluster
- Get connection string
- Update .env file

### 3️⃣ Prepare Code
```powershell
# Verify these files exist:
# ✅ docker-compose.yml
# ✅ docker-compose.prod.yml
# ✅ .env (with your values)
# ✅ .env.example
```

---

## 📌 PHASE 3: AWS EC2 DEPLOYMENT

### 1️⃣ Create EC2 Instance
```
AWS Console → EC2 → Launch Instances
- OS: Ubuntu 22.04 LTS
- Type: t3.medium (~$30/month)
- Storage: 30 GB
- Security Group: Allow 80, 443, 22
- Key Pair: Download .pem file
```

### 2️⃣ Connect to EC2
```powershell
# From Windows PowerShell
ssh -i path/to/key.pem ubuntu@<PUBLIC_IP>
```

### 3️⃣ Install Docker on EC2
```bash
# On the EC2 instance
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose
sudo usermod -aG docker ubuntu
exit  # Logout and reconnect
```

### 4️⃣ Upload Project
```powershell
# From Windows
scp -i path/to/key.pem -r ./project ubuntu@<IP>:~/govi-isuru
scp -i path/to/key.pem .env ubuntu@<IP>:~/govi-isuru/.env
```

### 5️⃣ Deploy
```bash
# On EC2
cd ~/govi-isuru
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

### 6️⃣ Access Live App
```
http://<PUBLIC_IP>
```

---

## 📊 DOCKER COMMANDS CHEAT SHEET

### Build & Run
```powershell
docker-compose build           # Build images
docker-compose up -d           # Start in background
docker-compose up              # Start with logs visible
docker-compose down            # Stop services
docker-compose down -v         # Stop and delete data
docker-compose build --no-cache # Force rebuild
```

### Monitor
```powershell
docker-compose ps              # List containers
docker-compose logs -f         # View all logs
docker-compose logs -f service # View specific logs
docker stats                   # Resource usage
```

### Access
```powershell
docker-compose exec service sh # Access container shell
docker ps                      # List running containers
docker images                  # List images
```

### Cleanup
```powershell
docker system prune -a         # Remove unused resources
docker-compose down -v         # Remove everything
```

---

## 🌐 IMPORTANT ENDPOINTS

| Service | Local | AWS |
|---------|-------|-----|
| Frontend | http://localhost | https://yourdomain.com |
| Backend | http://localhost:5000 | https://yourdomain.com/api |
| AI Service | http://localhost:8000 | Internal only |
| DB | localhost:27017 | MongoDB Atlas |

---

## 📁 KEY FILES

| File | Purpose |
|------|---------|
| docker-compose.yml | Local dev (with MongoDB) |
| docker-compose.prod.yml | Production (with Atlas) |
| .env | Your secrets (don't commit!) |
| .env.example | Template |
| QUICK_START.ps1 | One-click setup |
| LOCAL_TESTING_GUIDE.md | Detailed local guide |
| AWS_EC2_DEPLOYMENT.md | Detailed AWS guide |

---

## ⚠️ COMMON ISSUES & FIXES

### Port 80 already in use
```powershell
netstat -ano | findstr :80
taskkill /PID <PID> /F
```

### Containers won't start
```powershell
docker-compose logs -f          # Check errors
docker-compose build --no-cache # Rebuild
docker-compose up -d            # Try again
```

### Can't access http://localhost
```powershell
docker-compose ps              # Verify running
docker-compose logs            # Check logs
```

### Database connection failed
```
Check .env file:
- MONGO_URI must be correct
- For local: mongodb://mongo:27017/govi_isuru
- For cloud: mongodb+srv://user:pass@cluster.mongodb.net/db
```

---

## 💰 COST SUMMARY

### Local (Computer)
- Cost: $0
- Time: 5-10 minutes setup

### AWS Production
```
EC2 t3.medium:      $30/month
Storage:            $3/month
Data transfer:      $1/month
Domain (optional):  $1/month
─────────────────────────────
Total:             $35/month
```

**First year:** Free tier covers ~$100 value!

---

## 📚 DOCUMENTATION PRIORITY

1. ⭐ **00_START_DOCKER_AWS_GUIDE.md** - Read FIRST
2. 📊 **VISUAL_SETUP_GUIDE.md** - Easy to follow
3. 🗺️ **DOCKER_AND_AWS_ROADMAP.md** - Complete overview
4. 🖥️ **LOCAL_TESTING_GUIDE.md** - Detailed local setup
5. ☁️ **AWS_EC2_DEPLOYMENT.md** - Detailed AWS setup

---

## ✅ QUICK CHECKLIST

### Before Starting
- [ ] Docker Desktop installed
- [ ] Project folder ready
- [ ] PowerShell open

### After Local Setup
- [ ] `docker-compose ps` shows all running
- [ ] http://localhost loads
- [ ] Can create account
- [ ] Can login
- [ ] Backend responds
- [ ] AI service accessible

### Before AWS Deployment
- [ ] AWS account created
- [ ] MongoDB Atlas ready
- [ ] EC2 instance running
- [ ] Can SSH to instance
- [ ] Docker installed on EC2

### After AWS Deployment
- [ ] Services running on EC2
- [ ] App accessible at public IP
- [ ] Domain configured (optional)
- [ ] SSL working (optional)

---

## 🎯 NEXT ACTIONS (IN ORDER)

```
1. Right now (5 min):     Run .\QUICK_START.ps1
2. After setup (5 min):   Open http://localhost
3. Today (10 min):        Read 00_START_DOCKER_AWS_GUIDE.md
4. This week (30 min):    Read LOCAL_TESTING_GUIDE.md
5. Next week (30 min):    Read AWS_EC2_DEPLOYMENT.md
6. Deploy (2 hours):      Follow AWS guide to deploy
```

---

## 🚨 EMERGENCY COMMANDS

```powershell
# Everything broken?
docker-compose down -v
docker system prune -a
docker-compose build --no-cache
docker-compose up -d

# See what's wrong
docker-compose logs -f

# Access container to debug
docker-compose exec backend sh
docker-compose exec ai-service bash
```

---

## 🔗 USEFUL LINKS

- [Docker Docs](https://docs.docker.com/)
- [AWS EC2](https://docs.aws.amazon.com/ec2/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Let's Encrypt](https://letsencrypt.org/)
- [Nginx Docs](https://nginx.org/en/docs/)

---

## 💡 QUICK TIPS

1. **Always check logs first:** `docker-compose logs -f`
2. **Save .env file safely:** Never commit to Git
3. **Use strong passwords:** For JWT_SECRET
4. **Monitor costs:** Set AWS billing alerts
5. **Keep backups:** Especially database backups
6. **Update regularly:** `sudo apt update && upgrade`
7. **Use .env.example:** As template for .env
8. **Test locally first:** Before deploying to AWS

---

## 📞 SUPPORT

- **Local issues:** See LOCAL_TESTING_GUIDE.md troubleshooting
- **AWS issues:** See AWS_EC2_DEPLOYMENT.md troubleshooting
- **Command help:** See QUICK_REFERENCE.md
- **Lost in docs:** See DOCUMENTATION_INDEX.md
- **General help:** Check logs with `docker-compose logs -f`

---

## 🎉 YOU'RE READY!

Everything is configured and documented. 

**Start with:** `.\QUICK_START.ps1`

**Questions?** Check the relevant guide above.

**Good luck!** 🚀

