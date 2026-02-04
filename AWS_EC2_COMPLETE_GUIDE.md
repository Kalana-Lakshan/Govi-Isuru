# 🚀 Complete AWS EC2 Deployment Guide - Step by Step

## 📋 What You'll Need

- AWS Account (credit card required)
- Your project files ready (already done ✅)
- 30-45 minutes of your time
- Basic knowledge of copy-pasting commands

---

## Part 1: Create AWS Account (Skip if you have one)

### Step 1.1: Sign Up for AWS
1. Go to https://aws.amazon.com
2. Click **"Create an AWS Account"**
3. Enter your email, password, and AWS account name
4. Provide credit card details (AWS Free Tier is free for 12 months!)
5. Verify your phone number
6. Select **"Basic Support - Free"** plan
7. Wait for account activation email (1-5 minutes)

### Step 1.2: Sign In to AWS Console
1. Go to https://console.aws.amazon.com
2. Sign in with your email and password
3. You should see the AWS Management Console dashboard

---

## Part 2: Launch an EC2 Instance

### Step 2.1: Open EC2 Service
1. In AWS Console, click the search bar at the top
2. Type "EC2" and click on **"EC2"** (Virtual Servers in the Cloud)
3. Make sure you're in the region closest to you (top-right corner)
   - For Asia: Select **"Asia Pacific (Mumbai)"** or **"Singapore"**
   - For US: Select **"US East (N. Virginia)"**

### Step 2.2: Launch Instance
1. Click the orange **"Launch Instance"** button
2. You'll see "Launch an instance" page

### Step 2.3: Name Your Instance
**Name and tags:**
- Name: `govi-isuru-production`
- Tags are automatically created, leave them as is

### Step 2.4: Choose Operating System
**Application and OS Images (Amazon Machine Image):**
1. Select **"Ubuntu"** (should be selected by default)
2. Choose **"Ubuntu Server 24.04 LTS"** or latest LTS version
3. Architecture: **64-bit (x86)**
4. Make sure it says **"Free tier eligible"** 

### Step 2.5: Choose Instance Type
**Instance type:**
1. Select **"t3.xlarge"** (for AI service to work smoothly)
   - vCPUs: 4
   - Memory: 16 GB
   - **Note**: This is NOT free tier, costs ~$0.166/hour (~$120/month)
   
   **💡 Cheaper Option for Testing:**
   - Use **"t3.large"** (2 vCPU, 8GB RAM) - ~$0.083/hour (~$60/month)
   - Or **"t3.medium"** (2 vCPU, 4GB RAM) - ~$0.042/hour (~$30/month) but AI service might be slow

### Step 2.6: Create Key Pair (IMPORTANT!)
**Key pair (login):**
1. Click **"Create new key pair"**
2. Key pair name: `govi-isuru-key`
3. Key pair type: **RSA**
4. Private key file format: **`.pem`** (for Mac/Linux) or **`.ppk`** (for Windows/PuTTY)
   - If using Windows PowerShell/Command Prompt: Choose **`.pem`**
5. Click **"Create key pair"**
6. **SAVE THIS FILE!** It downloads automatically - don't lose it!
7. Move it to a safe location like `C:\AWS-Keys\govi-isuru-key.pem`

### Step 2.7: Network Settings
**Network settings:**
1. Click **"Edit"** button
2. **VPC**: Keep default
3. **Subnet**: Keep default
4. **Auto-assign public IP**: **Enable**
5. **Firewall (security groups)**: Select **"Create security group"**
6. Security group name: `govi-isuru-sg`
7. Description: `Security group for Govi Isuru application`

**Security group rules - ADD THESE:**

Click **"Add security group rule"** for each:

| Type | Protocol | Port Range | Source Type | Source | Description |
|------|----------|------------|-------------|---------|-------------|
| SSH | TCP | 22 | Anywhere | 0.0.0.0/0 | SSH access |
| HTTP | TCP | 80 | Anywhere | 0.0.0.0/0 | Frontend access |
| HTTPS | TCP | 443 | Anywhere | 0.0.0.0/0 | HTTPS access (future) |
| Custom TCP | TCP | 5000 | Anywhere | 0.0.0.0/0 | Backend API (temp) |
| Custom TCP | TCP | 8000 | Anywhere | 0.0.0.0/0 | AI Service (temp) |

**How to add each rule:**
- Click **"Add security group rule"**
- Select Type from dropdown
- Source will auto-fill, but change to **"Anywhere"** (0.0.0.0/0)
- Add description
- Repeat for all 5 rules

### Step 2.8: Configure Storage
**Configure storage:**
1. Size (GiB): **30** (minimum, 50 GB recommended for logs and models)
2. Root volume type: **gp3** (General Purpose SSD)
3. Check **"Delete on termination"** (so you don't pay for storage after deleting instance)

### Step 2.9: Launch!
1. Review your settings in the **Summary** panel on the right
2. Click the orange **"Launch instance"** button
3. Wait for "Success" message (takes 10-30 seconds)
4. Click **"View all instances"**

### Step 2.10: Wait for Instance to Start
1. You'll see your instance with "Instance state" column
2. Wait until it shows **"Running"** (green dot) - takes 1-2 minutes
3. Wait until **"Status check"** shows **"2/2 checks passed"** - takes 3-5 minutes
4. Note down the **"Public IPv4 address"** (e.g., 3.108.123.45)

---

## Part 3: Connect to Your EC2 Instance

### Step 3.1: Set Key File Permissions (IMPORTANT!)

**On Windows PowerShell:**
```powershell
# Navigate to where you saved the key
cd C:\AWS-Keys

# Set permissions (only you can read)
icacls govi-isuru-key.pem /inheritance:r
icacls govi-isuru-key.pem /grant:r "$($env:USERNAME):R"
```

**On Mac/Linux:**
```bash
chmod 400 govi-isuru-key.pem
```

### Step 3.2: Connect via SSH

**Replace `YOUR-PUBLIC-IP` with your actual EC2 public IP:**

**Windows PowerShell:**
```powershell
ssh -i C:\AWS-Keys\govi-isuru-key.pem ubuntu@YOUR-PUBLIC-IP
```

**Mac/Linux:**
```bash
ssh -i ~/Downloads/govi-isuru-key.pem ubuntu@YOUR-PUBLIC-IP
```

**Example:**
```bash
ssh -i govi-isuru-key.pem ubuntu@3.108.123.45
```

**First time connection:**
- You'll see: "The authenticity of host... Are you sure you want to continue connecting?"
- Type `yes` and press Enter

**You're in!** You should see Ubuntu welcome message and a prompt like:
```
ubuntu@ip-172-31-xx-xx:~$
```

---

## Part 4: Install Docker on EC2

### Step 4.1: Update Ubuntu
```bash
sudo apt update
sudo apt upgrade -y
```
(Takes 2-5 minutes)

### Step 4.2: Install Docker
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to docker group (so you don't need sudo)
sudo usermod -aG docker ubuntu

# Exit and reconnect for group changes to take effect
exit
```

**Reconnect to EC2:**
```bash
ssh -i C:\AWS-Keys\govi-isuru-key.pem ubuntu@YOUR-PUBLIC-IP
```

**Verify Docker installed:**
```bash
docker --version
```
Should show: `Docker version 27.x.x` or similar

### Step 4.3: Install Docker Compose
```bash
# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make it executable
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version
```
Should show: `Docker Compose version v2.x.x` or similar

---

## Part 5: Transfer Your Application to EC2

### Step 5.1: Install Git
```bash
sudo apt install git -y
```

### Step 5.2: Clone Your Repository

**If your code is on GitHub:**
```bash
cd ~
git clone https://github.com/YOUR-USERNAME/Govi-Isuru.git
cd Govi-Isuru
```

**Replace `YOUR-USERNAME` with your actual GitHub username!**

**If you pushed to branch "Kalana3":**
```bash
git checkout Kalana3
```

### Step 5.3: Verify Files
```bash
ls -la
```
You should see:
- `docker-compose.prod.yml`
- `client/` folder
- `server/` folder
- `ai-service/` folder
- `.env.example` file

---

## Part 6: Configure Environment Variables

### Step 6.1: Create .env File
```bash
nano .env
```

### Step 6.2: Copy and Paste This (Press Ctrl+Shift+V to paste in SSH):

```env
# Database
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/govi_isuru?retryWrites=true&w=majority

# JWT Secret (generate a random string)
JWT_SECRET=your_super_long_random_secret_key_at_least_32_characters_long

# Application URL (use your EC2 public IP for now)
APP_URL=http://YOUR-PUBLIC-IP

# News API (get free key from newsapi.org)
NEWS_API_KEY=your_newsapi_key_here

# Email Settings (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password

# Environment
NODE_ENV=production
```

### Step 6.3: Edit the Values
**IMPORTANT - Replace these:**

1. **MONGO_URI**: Your MongoDB Atlas connection string
   - Go to MongoDB Atlas → Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your actual password

2. **JWT_SECRET**: Generate a random secret
   ```bash
   # Generate random secret (run this in another terminal)
   openssl rand -base64 32
   ```
   Copy the output and paste it as JWT_SECRET value

3. **APP_URL**: Use your EC2 public IP
   - Example: `http://3.108.123.45`

4. **NEWS_API_KEY**: Get free API key
   - Go to https://newsapi.org/register
   - Sign up (free)
   - Copy your API key

5. **SMTP settings**: For Gmail
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Generate app password
   - Use that password (not your regular Gmail password)

### Step 6.4: Save the File
1. Press `Ctrl + X`
2. Press `Y` (Yes to save)
3. Press `Enter` (confirm filename)

### Step 6.5: Verify .env File
```bash
cat .env
```
Make sure all values are filled in correctly!

---

## Part 7: Build and Run Application

### Step 7.1: Build Docker Images
```bash
docker-compose -f docker-compose.prod.yml build
```

**This will take 10-20 minutes!** ☕ Time for coffee!

You'll see:
- Building backend...
- Building frontend...
- Building AI service... (this takes longest due to TensorFlow)

### Step 7.2: Start All Services
```bash
docker-compose -f docker-compose.prod.yml up -d
```

**If you see dependency errors:**
```bash
# Start services individually
docker-compose -f docker-compose.prod.yml up -d ai-service
sleep 60
docker-compose -f docker-compose.prod.yml up -d backend
sleep 10
docker run -d --name govi-frontend --network govi-isuru_govi-network -p 80:80 govi-isuru-frontend:latest
```

### Step 7.3: Check Services Running
```bash
docker ps
```

You should see 3 containers running:
- `govi-frontend` (port 80)
- `govi-backend` (port 5000)
- `govi-ai-service` (port 8000)

### Step 7.4: Check Logs (if any issues)
```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Or individual service
docker logs govi-backend
docker logs govi-frontend
docker logs govi-ai-service
```

Press `Ctrl + C` to exit logs

---

## Part 8: Access Your Application

### Step 8.1: Open in Browser
Go to: `http://YOUR-PUBLIC-IP`

**Example:** `http://3.108.123.45`

You should see your Govi Isuru login page! 🎉

### Step 8.2: Test the Application
1. Try creating a new account
2. Try logging in
3. Test different features
4. Check if AI service works

### Step 8.3: Test API Endpoints
```bash
# From your local computer
curl http://YOUR-PUBLIC-IP:5000/health
curl http://YOUR-PUBLIC-IP:8000/
```

---

## Part 9: Domain Name Setup (Optional but Recommended)

### Step 9.1: Buy a Domain
1. Go to **Namecheap**, **GoDaddy**, or **Google Domains**
2. Search for a domain (e.g., `govi-isuru.com`)
3. Purchase it (~$10-15/year)

### Step 9.2: Point Domain to EC2
1. Go to your domain registrar's DNS settings
2. Add an **A Record**:
   - Type: `A`
   - Name: `@` (or blank)
   - Value: Your EC2 Public IP (e.g., `3.108.123.45`)
   - TTL: `300` or `Auto`
3. Add another **A Record** for www:
   - Type: `A`
   - Name: `www`
   - Value: Your EC2 Public IP
   - TTL: `300` or `Auto`
4. Save changes

**Wait 5-30 minutes for DNS propagation**

Now you can access: `http://govi-isuru.com`

### Step 9.3: Update Environment
```bash
nano .env
```
Change `APP_URL` to your domain:
```
APP_URL=https://govi-isuru.com
```
Save and restart services:
```bash
docker-compose -f docker-compose.prod.yml restart
```

---

## Part 10: Setup HTTPS/SSL (Highly Recommended)

### Step 10.1: Install Certbot
```bash
sudo apt install certbot python3-certbot-nginx -y
```

### Step 10.2: Install Nginx (as reverse proxy)
```bash
sudo apt install nginx -y
```

### Step 10.3: Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/govi-isuru
```

Paste this (replace `govi-isuru.com` with your domain):
```nginx
server {
    listen 80;
    server_name govi-isuru.com www.govi-isuru.com;

    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Save: `Ctrl + X`, `Y`, `Enter`

### Step 10.4: Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/govi-isuru /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 10.5: Get SSL Certificate
```bash
sudo certbot --nginx -d govi-isuru.com -d www.govi-isuru.com
```

Follow the prompts:
1. Enter your email
2. Agree to terms (Y)
3. Share email? (Y or N, your choice)
4. Choose: **"2"** (Redirect HTTP to HTTPS)

**Done!** Now access: `https://govi-isuru.com` 🔒

### Step 10.6: Auto-Renewal
Certbot automatically sets up renewal. Test it:
```bash
sudo certbot renew --dry-run
```

---

## Part 11: Useful Commands

### Start/Stop Services
```bash
# Stop all
docker-compose -f docker-compose.prod.yml down

# Start all
docker-compose -f docker-compose.prod.yml up -d

# Restart all
docker-compose -f docker-compose.prod.yml restart

# Restart specific service
docker-compose -f docker-compose.prod.yml restart backend
```

### View Logs
```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker logs -f govi-backend
docker logs -f govi-frontend
docker logs -f govi-ai-service

# Last 100 lines
docker logs --tail 100 govi-backend
```

### Update Application
```bash
# Pull latest code
cd ~/Govi-Isuru
git pull origin Kalana3

# Rebuild and restart
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

### Check Resource Usage
```bash
# Disk space
df -h

# Memory
free -h

# Docker stats
docker stats

# System resources
htop
```

### Backup Database
```bash
# Export from MongoDB Atlas
# Go to Atlas Dashboard → Clusters → Collections → Export
# Or use mongodump command with your connection string
```

---

## Part 12: Cost Optimization Tips

### 1. Stop Instance When Not In Use
- AWS Console → EC2 → Select instance → Instance state → Stop
- **You only pay for storage when stopped (~$3/month for 30GB)**
- Start again when needed (IP address will change unless you use Elastic IP)

### 2. Use Elastic IP (Recommended)
- EC2 → Elastic IPs → Allocate Elastic IP address
- Associate with your instance
- **Now your IP won't change even if you stop/start**
- **Free while instance is running, $3.60/month if not associated**

### 3. Downgrade Instance Type
If AI service is slow on smaller instances, you can:
- Use larger instance only when needed
- Or optimize AI models (use quantized versions)

### 4. Set Up CloudWatch Alarms
- Get notified if costs exceed budget
- AWS Console → CloudWatch → Billing → Create alarm

---

## Part 13: Troubleshooting

### Problem: Can't connect via SSH
**Solution:**
1. Check security group allows SSH (port 22) from your IP
2. Verify key file permissions
3. Try: `ssh -v -i key.pem ubuntu@IP` for verbose output

### Problem: Website not loading
**Solution:**
```bash
# Check if containers are running
docker ps

# Check nginx status (if using SSL)
sudo systemctl status nginx

# Check security group allows HTTP (port 80)

# Check logs
docker logs govi-frontend
```

### Problem: 502 Bad Gateway
**Solution:**
```bash
# Backend not responding
docker logs govi-backend

# Restart services
docker-compose -f docker-compose.prod.yml restart
```

### Problem: Out of disk space
**Solution:**
```bash
# Clean Docker
docker system prune -a

# Check space
df -h

# May need to increase EBS volume size
```

### Problem: Out of memory
**Solution:**
```bash
# Check memory
free -h

# Check what's using memory
docker stats

# May need to upgrade instance type
```

### Problem: MongoDB connection failed
**Solution:**
1. Check MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
2. Verify MONGO_URI in .env file is correct
3. Check MongoDB Atlas cluster is running

---

## Part 14: Security Best Practices

### 1. Change SSH Port (Optional)
```bash
sudo nano /etc/ssh/sshd_config
# Change Port 22 to Port 2222
sudo systemctl restart sshd
```
Update security group to allow port 2222 instead of 22

### 2. Setup Firewall
```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### 3. Regular Updates
```bash
sudo apt update && sudo apt upgrade -y
```

### 4. Disable Password Authentication
```bash
sudo nano /etc/ssh/sshd_config
# Set: PasswordAuthentication no
sudo systemctl restart sshd
```

### 5. Install Fail2Ban
```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
```

---

## 🎉 Congratulations!

Your Govi Isuru application is now live on AWS EC2!

**Quick Reference:**
- **Application**: http://YOUR-DOMAIN or http://YOUR-IP
- **Backend API**: http://YOUR-DOMAIN:5000
- **AI Service**: http://YOUR-DOMAIN:8000/docs
- **SSH**: `ssh -i key.pem ubuntu@YOUR-IP`

**Next Steps:**
1. Test all features thoroughly
2. Monitor logs regularly
3. Set up automated backups
4. Configure monitoring/alerting
5. Share with users!

**Need Help?**
- AWS Documentation: https://docs.aws.amazon.com
- Docker Documentation: https://docs.docker.com
- Your application logs: `docker-compose logs -f`

---

**💡 Pro Tip:** Save this guide! You'll need it for maintenance and updates.

**📊 Monthly Cost Estimate:**
- t3.xlarge instance: ~$120/month
- 30GB EBS storage: ~$3/month
- Data transfer: ~$5-10/month (depends on traffic)
- **Total: ~$130-135/month**

**For cheaper option (t3.medium):** ~$35-40/month total
