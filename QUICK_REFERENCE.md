# 🚀 GOVI-ISURU Quick Reference

## Docker Commands

```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d

# View service status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
docker-compose -f docker-compose.prod.yml logs -f ai-service

# Stop services
docker-compose -f docker-compose.prod.yml down

# Restart services
docker-compose -f docker-compose.prod.yml restart

# Remove all containers
docker-compose -f docker-compose.prod.yml down -v
```

## DigitalOcean Commands

```bash
# Connect to droplet
ssh root@<droplet-ip>

# Copy files to droplet
scp -r . root@<droplet-ip>:/root/govi-isuru/

# Copy .env to droplet
scp .env root@<droplet-ip>:/root/govi-isuru/

# Run deployment script
bash scripts/deploy-digitalocean.sh <droplet-ip> <domain>
```

## Nginx Commands

```bash
# Test configuration
nginx -t

# Reload Nginx
systemctl reload nginx

# Restart Nginx
systemctl restart nginx

# View Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

## SSL/Certbot Commands

```bash
# Get SSL certificate
certbot certonly --standalone -d yourdomain.com

# Renew certificate
certbot renew

# Check certificate expiry
certbot certificates
```

## Useful Endpoints

```
Frontend: http://localhost / https://yourdomain.com
Backend: http://localhost:5000 / https://yourdomain.com/api
Health: GET /health
AI Docs: http://localhost:8000/docs (internal only)
```

## Environment Variables Template

```bash
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
APP_URL=https://yourdomain.com
NEWS_API_KEY=your-key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
NODE_ENV=production
```

## Debugging Tips

```bash
# Check if port is in use
lsof -i :80
lsof -i :5000
lsof -i :8000

# View docker network
docker network ls
docker network inspect govi-network

# Check container IP
docker inspect container-name | grep IPAddress

# Test API
curl http://localhost:5000/health
curl https://yourdomain.com/health
```

## File Structure

```
govi-isuru/
├── client/                    # React frontend
│   ├── public/
│   ├── src/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── server/                    # Node.js backend
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── Dockerfile
│   ├── index.js
│   └── package.json
├── ai-service/                # Python AI service
│   ├── models/
│   ├── Dockerfile
│   ├── main.py
│   ├── requirements.txt
│   └── ...
├── scripts/                   # Deployment scripts
│   ├── deploy-digitalocean.sh
│   ├── start-local.sh
│   └── start-local.ps1
├── docker-compose.yml         # Local development
├── docker-compose.prod.yml    # Production
├── .env.example               # Environment template
├── DIGITALOCEAN_DEPLOYMENT.md # Full guide
└── README.md
```

## Quick Deployment

```bash
# 1. Prepare environment
cp .env.example .env
# Edit .env with your values

# 2. Build and test locally
docker-compose -f docker-compose.prod.yml up

# 3. Deploy to DigitalOcean
bash scripts/deploy-digitalocean.sh 192.0.2.100 yourdomain.com

# 4. Verify
curl https://yourdomain.com/health
```

## Monitoring Checklist

- [ ] Check logs daily: `docker-compose logs`
- [ ] Monitor disk space: `df -h`
- [ ] Monitor memory: `docker stats`
- [ ] Verify backups: DigitalOcean dashboard
- [ ] Review error logs weekly
- [ ] Monitor uptime with external service
- [ ] Check SSL certificate expiry monthly

## Common Issues

| Issue | Solution |
|-------|----------|
| Service won't start | `docker-compose logs` to see error |
| MongoDB connection error | Add droplet IP to Atlas whitelist |
| HTTPS not working | Check SSL cert: `certbot certificates` |
| Port already in use | `lsof -i :<port>` then `kill -9 <pid>` |
| Slow API | Check MongoDB indexes, scale up droplet |
| Memory full | `docker system prune -a` to clean up |

---

**Version:** 1.0  
**Last Updated:** 2026-02-03
