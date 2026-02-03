# 🚀 GOVI-ISURU Production Deployment Checklist

Use this checklist to ensure your deployment is production-ready.

## ✅ Pre-Deployment

- [ ] All code committed and pushed to main branch
- [ ] `.env` file created with all required variables
- [ ] MongoDB Atlas cluster set up and accessible
- [ ] Domain registered and pointing to DigitalOcean nameservers
- [ ] SSH key generated and saved securely
- [ ] DigitalOcean account created and funded
- [ ] Backup plan defined (DigitalOcean backups or external)

## ✅ Infrastructure Setup

- [ ] DigitalOcean Droplet created (4GB RAM, Singapore region)
- [ ] Droplet IP noted and saved
- [ ] SSH access verified (`ssh root@<ip>`)
- [ ] Firewall rules configured (allow HTTP, HTTPS, SSH)
- [ ] Droplet backups enabled
- [ ] Monitoring enabled (DigitalOcean monitoring dashboard)

## ✅ Docker & Deployment

- [ ] Docker installed on droplet
- [ ] Docker Compose installed on droplet
- [ ] Project files copied to `/root/govi-isuru`
- [ ] `.env` file uploaded with correct MongoDB URI
- [ ] Docker images built successfully
- [ ] All services started: `docker-compose -f docker-compose.prod.yml up -d`
- [ ] Services health check passing: `docker-compose ps`

## ✅ Networking & SSL

- [ ] Domain DNS A record pointing to droplet IP
- [ ] DNS propagation verified: `nslookup yourdomain.com`
- [ ] Nginx reverse proxy configured
- [ ] SSL certificate obtained from Let's Encrypt
- [ ] HTTPS working: `curl -I https://yourdomain.com`
- [ ] HTTP redirects to HTTPS
- [ ] All API endpoints accessible over HTTPS

## ✅ Application Testing

- [ ] Frontend loads: `https://yourdomain.com`
- [ ] Backend health check: `https://yourdomain.com/health`
- [ ] AI service accessible: Internal only
- [ ] API endpoints tested:
  - [ ] Login/Register working
  - [ ] Disease report submission working
  - [ ] Officer verification panel accessible
  - [ ] Analytics endpoints working
- [ ] Database connection verified in logs
- [ ] No errors in Docker logs: `docker-compose logs`

## ✅ Security

- [ ] JWT_SECRET is strong (32+ characters, random)
- [ ] MongoDB Atlas IP whitelist configured (add droplet IP)
- [ ] CORS_ORIGIN set to your domain
- [ ] NODE_ENV set to `production`
- [ ] API keys (News API, SMTP) verified
- [ ] No sensitive data in Docker images or logs
- [ ] Firewall blocks unnecessary ports
- [ ] SSH key-only authentication (no password)
- [ ] Regular backups configured

## ✅ Monitoring & Alerts

- [ ] Uptime monitoring configured (Uptime Robot, Pingdom)
- [ ] Email alerts enabled for service failures
- [ ] Log aggregation considered (optional)
- [ ] Performance monitoring enabled
- [ ] Disk space alerts set up
- [ ] Database backup alerts configured

## ✅ Continuous Integration/Deployment

- [ ] GitHub Actions workflow set up (optional)
- [ ] Secrets added to GitHub:
  - [ ] DROPLET_IP
  - [ ] SSH_KEY
  - [ ] DOMAIN
  - [ ] SLACK_WEBHOOK (optional)
- [ ] Auto-deploy on push to main branch (optional)
- [ ] Rollback plan documented

## ✅ Documentation

- [ ] README.md updated with deployment instructions
- [ ] DIGITALOCEAN_DEPLOYMENT.md guide completed
- [ ] Team has access to:
  - [ ] DigitalOcean Dashboard
  - [ ] MongoDB Atlas Console
  - [ ] Domain Registrar
  - [ ] GitHub Repository
- [ ] Emergency contacts documented
- [ ] Support process documented

## ✅ Post-Deployment

- [ ] 24-hour monitoring for any issues
- [ ] Performance metrics baseline established
- [ ] User feedback collected
- [ ] Analytics dashboard reviewed
- [ ] Error logs reviewed for any warnings
- [ ] Database backup verified
- [ ] DNS TTL reduced to 300 seconds (for faster failover)

## ⚠️ Known Issues & Mitigations

| Issue | Mitigation |
|-------|-----------|
| MongoDB connection fails | Check IP whitelist in Atlas, verify URI syntax |
| Services crash after restart | Check logs: `docker-compose logs` |
| High memory usage | Upgrade droplet size or optimize images |
| API slow responses | Check DB query performance, add indexes |
| Email not sending | Verify SMTP credentials, check spam folder |

## 🆘 Emergency Procedures

### Service Down
```bash
# SSH into droplet
ssh root@<ip>

# Restart all services
docker-compose -f docker-compose.prod.yml restart

# Or full restart
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
```

### Database Connection Issues
```bash
# Check MongoDB Atlas status
# 1. Visit: https://cloud.mongodb.com
# 2. Verify IP whitelist includes droplet IP
# 3. Check connection string in .env
```

### SSL Certificate Expiry
```bash
# Renew certificate (Let's Encrypt auto-renews, but manual if needed)
certbot renew --force-renewal
systemctl reload nginx
```

### Disk Space Full
```bash
# Check disk usage
df -h

# Clean Docker images/containers
docker system prune -a

# Or upgrade droplet size
```

## 📞 Support Contacts

- **DigitalOcean Support:** https://support.digitalocean.com
- **MongoDB Support:** https://support.mongodb.com
- **Let's Encrypt Support:** https://letsencrypt.org/contact/
- **Your Team Lead:** [Name & Contact]
- **DevOps Engineer:** [Name & Contact]

---

**Last Updated:** 2026-02-03
**Status:** ✅ Ready for Production
**Version:** 1.0.0
