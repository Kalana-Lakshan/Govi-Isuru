# ====================================
# GOVI-ISURU Local Docker Build & Run (Windows)
# ====================================
# For Windows PowerShell users

param(
    [string]$Action = "up"
)

if ($Action -eq "up") {
    Write-Host "🐳 Building Docker images..." -ForegroundColor Cyan
    docker-compose -f docker-compose.prod.yml build --no-cache
    
    Write-Host ""
    Write-Host "🚀 Starting services..." -ForegroundColor Green
    docker-compose -f docker-compose.prod.yml up -d
    
    Write-Host ""
    Write-Host "✅ All services started!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Service Status:" -ForegroundColor Yellow
    docker-compose -f docker-compose.prod.yml ps
    
} elseif ($Action -eq "down") {
    Write-Host "🛑 Stopping services..." -ForegroundColor Yellow
    docker-compose -f docker-compose.prod.yml down
    Write-Host "✅ Services stopped" -ForegroundColor Green
    
} elseif ($Action -eq "logs") {
    Write-Host "📊 Showing live logs (press Ctrl+C to exit)..." -ForegroundColor Yellow
    docker-compose -f docker-compose.prod.yml logs -f
    
} elseif ($Action -eq "restart") {
    Write-Host "🔄 Restarting services..." -ForegroundColor Yellow
    docker-compose -f docker-compose.prod.yml restart
    Write-Host "✅ Services restarted" -ForegroundColor Green
    
} else {
    Write-Host "Usage: .\scripts\start-local.ps1 [up|down|logs|restart]" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Commands:" -ForegroundColor Cyan
    Write-Host "  up      - Start all services" -ForegroundColor White
    Write-Host "  down    - Stop all services" -ForegroundColor White
    Write-Host "  logs    - View live logs" -ForegroundColor White
    Write-Host "  restart - Restart services" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "🌐 Access your app:" -ForegroundColor Green
Write-Host "  - Frontend: http://localhost" -ForegroundColor White
Write-Host "  - Backend: http://localhost:5000/health" -ForegroundColor White
Write-Host "  - AI Service: http://localhost:8000/docs" -ForegroundColor White
Write-Host ""
