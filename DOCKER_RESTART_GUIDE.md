# Quick Docker Restart Guide

## Docker Desktop is not running

### Steps to Fix:

1. **Start Docker Desktop**
   - Open Docker Desktop from Start Menu
   - Wait for Docker to fully start (check system tray icon)

2. **Verify Docker is Running**
   ```powershell
   docker ps
   ```

3. **Start All Services**
   ```powershell
   docker-compose -f docker-compose.prod.yml up -d
   ```

4. **Check Status**
   ```powershell
   docker ps
   ```

All services should start:
- ✅ govi-frontend (port 80)
- ✅ govi-backend (port 5000)  
- ✅ govi-ai-service (port 8000)

5. **Access Application**
   - Open browser: http://localhost
   - Login should now work without 404 error!

---

## If AI Service Shows "Unhealthy"

The AI service may show "unhealthy" status but it's actually working fine. This is just a health check issue. You can verify it works:

```powershell
curl http://localhost:8000/
```

Should return JSON with service status.

---

## Quick Commands

**Stop all:**
```powershell
docker-compose -f docker-compose.prod.yml down
```

**Start all:**
```powershell
docker-compose -f docker-compose.prod.yml up -d
```

**View logs:**
```powershell
docker-compose -f docker-compose.prod.yml logs -f
```

**Restart just frontend:**
```powershell
docker-compose -f docker-compose.prod.yml restart frontend
```
