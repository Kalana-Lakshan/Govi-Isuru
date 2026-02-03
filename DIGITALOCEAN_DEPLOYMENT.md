# GOVI-ISURU DigitalOcean Deployment Guide

## 🎯 Overview

This guide walks you through deploying GOVI-ISURU to DigitalOcean using Docker containers.

**Project Stack:**
- **Frontend:** React 19.2.3 (Nginx)
- **Backend:** Node.js 22 Express 5.2.1
- **AI Service:** Python 3.11 FastAPI + TensorFlow
- **Database:** MongoDB Atlas (cloud-hosted)
- **Hosting:** DigitalOcean Droplet

---

## 📋 Prerequisites

### What you need:
1. **DigitalOcean Account** - Create at [digitalocean.com](https://digitalocean.com)
2. **Domain Name** - Registered and pointing to DigitalOcean DNS
3. **MongoDB Atlas Cluster** - Your existing online MongoDB connection string
4. **Git Repository** - Your code pushed to GitHub
5. **API Keys:**
   - News API Key (from [newsapi.org](https://newsapi.org))
   - Gmail App Password (or SendGrid API key)

---

## 🚀 Step 1: Create DigitalOcean Droplet

### 1a. Create Basic Droplet
```
1. Log in to DigitalOcean Dashboard
2. Click "Create" → "Droplet"
3. Choose:
   - Image: Ubuntu 22.04 LTS
   - Size: $24/month (4GB RAM, 2 vCPU) - RECOMMENDED
   - Region: Singapore (SGP1) ← Best for Sri Lanka
   - Auth: SSH Key (create if you don't have)
   - Backups: Enable for peace of mind (+$4.80/month)
4. Click "Create Droplet"
5. Wait 2-3 minutes for droplet to be ready
```

### 1b. Get Your Droplet IP
```
Copy the IPv4 address from dashboard (e.g., 192.0.2.100)
```

### 1c. SSH into Droplet
```bash
ssh root@<your-droplet-ip>
```

---

## 🔧 Step 2: Prepare Environment File

### 2a. Create .env file
```bash
# On your local machine
cp .env.example .env
```

### 2b. Edit .env with your values
```bash
nano .env
```

Fill in all values:
```
MONGO_URI=mongodb+srv://your_user:your_password@cluster.mongodb.net/govi_isuru?retryWrites=true&w=majority
JWT_SECRET=your_secret_key_min_32_characters_long_change_this
APP_URL=https://yourdomain.com
NEWS_API_KEY=your_newsapi_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

⚠️ **IMPORTANT:** Never commit .env to Git!

---

## 📦 Step 3: Deploy to DigitalOcean

### Option A: Automated Deployment (Recommended)

```bash
# From your local machine (Windows/Mac/Linux)
bash scripts/deploy-digitalocean.sh 192.0.2.100 yourdomain.com
```

This script will:
- Copy all files to droplet
- Install Docker & Docker Compose
- Start all services
- Configure Nginx

### Option B: Manual Deployment

```bash
# SSH into droplet
ssh root@<droplet-ip>

# Clone your repo
git clone https://github.com/yourusername/govi-isuru.git
cd govi-isuru

# Create .env file
nano .env
# Paste your environment variables

# Build and start services
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps
```

---

## 🌐 Step 4: Setup Domain & SSL

### 4a. Point Domain to Droplet
```
1. In your domain registrar (GoDaddy, Namecheap, etc.)
2. Update DNS A record to your droplet IP
3. Wait 5-30 minutes for DNS propagation
```

Check if DNS is ready:
```bash
nslookup yourdomain.com
# Should show your droplet IP
```

### 4b. Setup SSL Certificate (Let's Encrypt)
```bash
# SSH into droplet
ssh root@<droplet-ip>

# Install Certbot
apt-get update
apt-get install -y certbot python3-certbot-nginx

# Get certificate
certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Update Nginx config with SSL
nano /etc/nginx/sites-available/govi-isuru
# Add SSL directives (see example below)

# Reload Nginx
nginx -t
systemctl reload nginx
```

**Nginx SSL Config Example:**
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # ... rest of config
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## 📊 Step 5: Verify Deployment

### Check Services Status
```bash
ssh root@<droplet-ip>
docker-compose -f docker-compose.prod.yml ps

# Expected output:
# NAME                STATUS              PORTS
# govi-ai-service    Up 2 minutes        8000/tcp
# govi-backend       Up 2 minutes        5000/tcp
# govi-frontend      Up 2 minutes        80/tcp
```

### Test Endpoints
```bash
# Health check
curl https://yourdomain.com/health

# API test
curl https://yourdomain.com/api/alerts/outbreak-summary

# Frontend
curl https://yourdomain.com
```

### View Logs
```bash
# All logs
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f ai-service
docker-compose -f docker-compose.prod.yml logs -f frontend
```

---

## 🔍 Troubleshooting

### Service Not Starting
```bash
docker-compose -f docker-compose.prod.yml logs backend
# Check for error messages in logs
```

### MongoDB Connection Error
```bash
# Verify MongoDB Atlas IP whitelist
# 1. Go to MongoDB Atlas > Network Access
# 2. Add your droplet IP (or allow all: 0.0.0.0/0 - not recommended for production)
```

### Domain/SSL Issues
```bash
# Check DNS resolution
nslookup yourdomain.com

# Check SSL certificate
curl -I https://yourdomain.com

# Verify Nginx config
nginx -t
```

### Port Already in Use
```bash
# Kill process using port
lsof -i :80
kill -9 <PID>

# Or use different port in docker-compose.prod.yml
```

---

## 🛡️ Security Checklist

- [ ] Changed JWT_SECRET to strong value
- [ ] Locked down MongoDB Atlas IP whitelist
- [ ] Enabled SSL/TLS certificate
- [ ] Set NODE_ENV=production
- [ ] Disabled API debugging endpoints
- [ ] Setup firewall rules
- [ ] Regular backups enabled
- [ ] Monitoring/alerting configured

---

## 📈 Monitoring & Maintenance

### View Resource Usage
```bash
# CPU/Memory usage
docker stats

# Disk space
df -h
```

### Update Services
```bash
# Pull latest code
cd /root/govi-isuru
git pull origin main

# Rebuild images
docker-compose -f docker-compose.prod.yml build

# Restart services
docker-compose -f docker-compose.prod.yml up -d
```

### Setup Automated Backups
```bash
# DigitalOcean: Enable Backups in dashboard (+$4.80/month)
# Or setup external backup script
```

---

## 💰 Cost Breakdown

| Item | Cost | Notes |
|------|------|-------|
| Droplet (4GB) | $24/month | Standard instance |
| Backups | $4.80/month | Optional |
| Domain | $10-15/year | Via registrar |
| MongoDB Atlas | Free-Free Tier | Shared cluster (upgrade as needed) |
| **Total** | **~$30-40/month** | Scalable |

---

## 🎉 You're Done!

Your GOVI-ISURU application is now live!

**Key URLs:**
- 🌐 **Website:** https://yourdomain.com
- 🔌 **Backend API:** https://yourdomain.com/api
- 🤖 **AI Service:** https://yourdomain.com/ai/docs (internal)
- 📊 **MongoDB Atlas:** https://cloud.mongodb.com

---

## 📞 Support & Next Steps

1. **Monitor Logs:** `docker-compose logs -f`
2. **Scale Up:** Add more services or upgrade droplet
3. **Setup CI/CD:** GitHub Actions for auto-deploy
4. **Add CDN:** CloudFlare for faster content delivery
5. **Custom Domain Email:** Setup mail with domain

---

**Happy farming! 🌾**
