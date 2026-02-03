#!/bin/bash

# ====================================
# GOVI-ISURU DigitalOcean Deployment
# ====================================
# This script automates deployment to DigitalOcean Droplet
# Usage: ./scripts/deploy-digitalocean.sh <droplet-ip> <domain>

set -e  # Exit on error

DROPLET_IP=${1:-}
DOMAIN=${2:-}

if [ -z "$DROPLET_IP" ] || [ -z "$DOMAIN" ]; then
    echo "Usage: ./scripts/deploy-digitalocean.sh <droplet-ip> <domain>"
    echo "Example: ./scripts/deploy-digitalocean.sh 192.168.1.100 yourdomain.com"
    exit 1
fi

echo "🚀 Starting GOVI-ISURU deployment..."
echo "📍 Target: $DROPLET_IP"
echo "🌐 Domain: $DOMAIN"

# Step 1: Copy files to droplet
echo "📦 Copying project files..."
ssh -o StrictHostKeyChecking=no root@$DROPLET_IP 'mkdir -p /root/govi-isuru'
scp -r -o StrictHostKeyChecking=no . root@$DROPLET_IP:/root/govi-isuru/

# Step 2: Install dependencies and start services
echo "⚙️  Setting up Docker and dependencies..."
ssh -o StrictHostKeyChecking=no root@$DROPLET_IP << 'ENDSSH'
    cd /root/govi-isuru
    
    # Install Docker if not present
    if ! command -v docker &> /dev/null; then
        echo "Installing Docker..."
        curl -fsSL https://get.docker.com -o get-docker.sh
        sh get-docker.sh
    fi
    
    # Install Docker Compose if not present
    if ! command -v docker-compose &> /dev/null; then
        echo "Installing Docker Compose..."
        curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        chmod +x /usr/local/bin/docker-compose
    fi
    
    # Create .env file from template if not exists
    if [ ! -f .env ]; then
        echo "Creating .env file..."
        cp .env.example .env
        echo "⚠️  Please edit .env with your actual credentials"
    fi
    
    # Start services
    echo "Starting Docker services..."
    docker-compose -f docker-compose.prod.yml up -d
    
    echo "✅ Services started"
ENDSSH

# Step 3: Configure Nginx reverse proxy
echo "🔧 Configuring Nginx reverse proxy..."
ssh -o StrictHostKeyChecking=no root@$DROPLET_IP << 'ENDSSH'
    # Install Nginx if not present
    if ! command -v nginx &> /dev/null; then
        apt-get update
        apt-get install -y nginx
    fi
    
    # Create Nginx config
    cat > /etc/nginx/sites-available/govi-isuru << EOF
upstream backend {
    server localhost:5000;
}

upstream ai_service {
    server localhost:8000;
}

server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    client_max_body_size 50M;

    # Frontend
    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    # Backend API
    location /api/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 30s;
    }

    # AI Service (optional, for direct access)
    location /ai/ {
        rewrite ^/ai/(.*)$ /\$1 break;
        proxy_pass http://ai_service;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
    }
}
EOF
    
    # Enable site
    ln -sf /etc/nginx/sites-available/govi-isuru /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    
    # Test and reload
    nginx -t
    systemctl reload nginx
    echo "✅ Nginx configured"
ENDSSH

echo ""
echo "✅ Deployment completed!"
echo ""
echo "📋 Next steps:"
echo "1. SSH into your droplet: ssh root@$DROPLET_IP"
echo "2. Edit the .env file: nano /root/govi-isuru/.env"
echo "3. Add your MongoDB Atlas URI and other secrets"
echo "4. Restart services: docker-compose -f docker-compose.prod.yml restart"
echo "5. Check logs: docker-compose -f docker-compose.prod.yml logs -f"
echo ""
echo "🌐 Your app should be live at: http://$DOMAIN"
echo ""
