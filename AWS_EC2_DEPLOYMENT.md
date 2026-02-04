# 🚀 AWS EC2 Deployment Guide - GOVI-ISURU

## Overview

This guide walks you through deploying GOVI-ISURU on AWS EC2 instead of DigitalOcean. It covers the complete process from instance creation to live deployment.

---

## Part 1: AWS EC2 Instance Setup

### Step 1: Create EC2 Instance

1. **Sign in to AWS Console**
   - Go to [AWS Management Console](https://console.aws.amazon.com)
   - Navigate to EC2 Dashboard

2. **Launch Instance**
   - Click "Launch Instances"
   - **Name:** `govi-isuru-server`
   
3. **Choose AMI (Operating System)**
   - Select: **Ubuntu Server 22.04 LTS (Free Tier Eligible)**
   - Architecture: 64-bit (x86)

4. **Instance Type**
   - **Development:** `t3.medium` (2 vCPU, 4 GB RAM) - ~$30/month
   - **Production:** `t3.large` (2 vCPU, 8 GB RAM) - ~$60/month
   - **Recommended:** `t3.medium` (good balance for your project)

5. **Storage**
   - Size: **30 GB** (default 8 GB is too small)
   - Type: **gp3** (general purpose)
   - Delete on Termination: **Yes**

6. **Network Settings**
   - VPC: Default
   - Auto-assign Public IP: **Enable**
   - Security Group: Create new
     - Name: `govi-isuru-sg`
     - Inbound Rules (add these):
       ```
       HTTP    | Port 80   | From 0.0.0.0/0
       HTTPS   | Port 443  | From 0.0.0.0/0
       SSH     | Port 22   | From 0.0.0.0/0 (or your IP)
       Custom  | Port 5000 | From 0.0.0.0/0
       Custom  | Port 8000 | From 0.0.0.0/0
       ```

7. **Key Pair**
   - Create new key pair
   - Name: `govi-isuru-key`
   - Type: RSA
   - Format: .pem
   - **Save this file safely!** (e.g., `C:\Users\ADMIN\.ssh\govi-isuru-key.pem`)

8. **Launch**
   - Click "Launch Instance"
   - Wait for instance to reach "Running" state
   - Note the **Public IPv4 address** (we'll use this)

---

## Part 2: Connect to EC2 Instance

### On Windows (Using PowerShell or PuTTY)

#### Option A: PowerShell (Recommended)

```powershell
# Navigate to where you saved the key
cd C:\Users\ADMIN\.ssh

# Change key permissions (required)
icacls govi-isuru-key.pem /inheritance:r /grant:r "$($env:USERNAME):(F)"

# Connect to instance
ssh -i govi-isuru-key.pem ubuntu@<PUBLIC_IP>

# Example:
ssh -i govi-isuru-key.pem ubuntu@54.123.45.67
```

#### Option B: PuTTY (GUI Tool)

1. Download [PuTTY](https://www.putty.org/)
2. Download [PuTTYgen](https://www.putty.org/) to convert .pem to .ppk
3. Open PuTTYgen → Load your `govi-isuru-key.pem` → Save as Private Key
4. Open PuTTY:
   - Host Name: `ubuntu@54.123.45.67` (replace with your IP)
   - Connection → SSH → Auth → Private key file → Select .ppk file
   - Click Open

---

## Part 3: Initial Server Setup

Once connected via SSH:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
sudo apt install -y docker.io docker-compose git curl wget

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add ubuntu user to docker group (avoid sudo)
sudo usermod -aG docker ubuntu

# Verify installation
docker --version
docker-compose --version

# Log out and back in for group changes
exit
ssh -i govi-isuru-key.pem ubuntu@<PUBLIC_IP>
```

---

## Part 4: Deploy Your Project

### Option A: Clone from Git (Recommended)

```bash
# Clone your repository
git clone https://github.com/yourusername/govi-isuru.git
cd govi-isuru

# Create .env file
cp .env.example .env

# Edit .env with your credentials
nano .env
```

### Option B: Upload Files via SCP

From your local machine:

```powershell
# PowerShell
scp -i C:\Users\ADMIN\.ssh\govi-isuru-key.pem `
    -r "C:\Users\ADMIN\Documents\Devthon 3.0\new folder\Govi-Isuru\*" `
    ubuntu@<PUBLIC_IP>:~/govi-isuru/

# For just the .env file
scp -i C:\Users\ADMIN\.ssh\govi-isuru-key.pem `
    C:\Users\ADMIN\.env `
    ubuntu@<PUBLIC_IP>:~/govi-isuru/.env
```

---

## Part 5: Configure Environment

On the EC2 instance:

```bash
cd ~/govi-isuru

# Create .env file
cat > .env << 'EOF'
# MongoDB Atlas (use your cloud database)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/govi_isuru?retryWrites=true&w=majority

# JWT Secret (use a strong random string)
JWT_SECRET=$(openssl rand -base64 32)

# Service URLs (use private Docker network)
AI_SERVICE_URL=http://ai-service:8000

# News API Key
NEWS_API_KEY=your_news_api_key

# Ports
PORT=5000
CLIENT_PORT=80
AI_SERVICE_PORT=8000

# Environment
NODE_ENV=production
REACT_APP_API_URL=https://yourdomain.com

EOF

# View and verify
cat .env
```

---

## Part 6: Build and Run Docker Services

```bash
cd ~/govi-isuru

# Build images (first time, takes ~10 minutes)
docker-compose -f docker-compose.prod.yml build

# Start services in background
docker-compose -f docker-compose.prod.yml up -d

# Verify all services are running
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Check specific service
docker-compose -f docker-compose.prod.yml logs -f backend
```

---

## Part 7: Configure Nginx Reverse Proxy

Create Nginx config:

```bash
sudo tee /etc/nginx/sites-available/govi-isuru > /dev/null << 'EOF'
upstream backend {
    server 127.0.0.1:5000;
}

upstream ai_service {
    server 127.0.0.1:8000;
}

server {
    listen 80;
    server_name _;
    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api/ {
        proxy_pass http://backend/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /ai/ {
        proxy_pass http://ai_service/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/govi-isuru /etc/nginx/sites-enabled/

# Test config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

## Part 8: Setup SSL Certificate (HTTPS)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate (replace with your domain)
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Update Nginx config to use SSL
sudo nano /etc/nginx/sites-available/govi-isuru

# Add these lines to server block:
# listen 443 ssl;
# ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
# ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

# Setup auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Test renewal
sudo certbot renew --dry-run
```

---

## Part 9: Verify Deployment

```bash
# Check if services are running
docker-compose -f docker-compose.prod.yml ps

# Test backend
curl http://localhost:5000/health

# Test AI service
curl http://localhost:8000/health

# Test database connection
curl http://localhost:5000/api/health
```

From your local browser:
- Frontend: `http://<PUBLIC_IP>` or `https://yourdomain.com`
- Backend API: `http://<PUBLIC_IP>:5000` or `https://yourdomain.com/api`

---

## Part 10: Domain Configuration (Optional)

1. **Get a Domain**
   - Buy from: Route53, GoDaddy, Namecheap, etc.
   - Cost: $10-15/year

2. **Point Domain to EC2**
   - Go to your domain registrar
   - Create A record:
     ```
     Type: A
     Name: @
     Value: <your-public-ip>
     ```
   - For www subdomain:
     ```
     Type: A
     Name: www
     Value: <your-public-ip>
     ```

3. **Update Nginx Config**
   ```bash
   sudo nano /etc/nginx/sites-available/govi-isuru
   # Change: server_name yourdomain.com www.yourdomain.com;
   sudo nginx -t
   sudo systemctl reload nginx
   ```

---

## Monitoring & Maintenance

### Monitor Resources

```bash
# Check CPU/Memory usage
docker stats

# Check disk usage
df -h

# Check logs
docker-compose -f docker-compose.prod.yml logs -f

# System load
top
# or
htop (install with: sudo apt install htop)
```

### Restart Services

```bash
# Restart all services
docker-compose -f docker-compose.prod.yml restart

# Restart specific service
docker-compose -f docker-compose.prod.yml restart backend

# View recent logs (last 50 lines)
docker-compose -f docker-compose.prod.yml logs --tail=50
```

### Backup Data

```bash
# Backup database (if using local MongoDB)
docker-compose exec mongo mongodump --out /backup

# If using MongoDB Atlas, backups are automatic
```

---

## Cost Estimate

```
t3.medium EC2:              ~$30/month
Storage (30GB):             ~$3/month
Data transfer (minimal):    ~$1/month
Domain (annual):            ~$12/year = $1/month
─────────────────────────────────────
TOTAL:                      ~$35/month
```

**vs DigitalOcean:** Similar cost, more control
**vs Lambda/Serverless:** Better for persistent services

---

## Troubleshooting

### Can't SSH
```bash
# Check security group allows port 22
# Check key pair permissions
# Verify instance is running
```

### Port 80 Not Accessible
```bash
# Check security group allows port 80
# Check if Nginx is running
sudo systemctl status nginx

# Check if docker service is running
docker-compose ps
```

### Services Keep Restarting
```bash
# Check logs
docker-compose logs -f

# Common issues:
# - Wrong MONGO_URI
# - Port already in use
# - Insufficient disk space (df -h)
```

### High CPU/Memory Usage
```bash
# Check which container is consuming resources
docker stats

# Increase instance size if needed
# In AWS Console: EC2 → Instances → Select instance → Instance State → Stop
# Then: Instance Settings → Change Instance Type
```

---

## Security Best Practices

1. **Update Regularly**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Restrict SSH Access**
   - Change Security Group to allow SSH only from your IP
   - Use strong SSH keys (never use password)

3. **Use Secrets Manager**
   - Store sensitive data in AWS Secrets Manager
   - Don't commit `.env` to git

4. **Monitor CloudWatch**
   - Set up CloudWatch alerts for high CPU/memory
   - Enable VPC Flow Logs

5. **Enable Backups**
   - For MongoDB Atlas, enable automated backups
   - For data, use S3 for storage

---

## Next Steps After Deployment

- [ ] Test all features in production
- [ ] Set up monitoring/alerting
- [ ] Configure CDN (CloudFront) for static assets
- [ ] Set up backup schedule
- [ ] Document deployment process for team
- [ ] Plan scaling strategy

---

## Support & Resources

- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [Docker Documentation](https://docs.docker.com/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [MongoDB Atlas](https://docs.atlas.mongodb.com/)

