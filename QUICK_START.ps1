# Quick Docker Start Script for Windows
# Run this in PowerShell to set up and start the project

Write-Host "🚀 GOVI-ISURU Docker Quick Start" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""

# Step 1: Check Docker
Write-Host "✓ Step 1: Checking Docker installation..." -ForegroundColor Cyan
try {
    $dockerVersion = docker --version
    Write-Host "  ✅ Docker found: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Docker not found! Please install Docker Desktop first." -ForegroundColor Red
    Write-Host "  Download: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    exit 1
}

# Step 2: Check Docker Compose
Write-Host ""
Write-Host "✓ Step 2: Checking Docker Compose..." -ForegroundColor Cyan
try {
    $composeVersion = docker-compose --version
    Write-Host "  ✅ Docker Compose found: $composeVersion" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Docker Compose not found!" -ForegroundColor Red
    exit 1
}

# Step 3: Create .env file if it doesn't exist
Write-Host ""
Write-Host "✓ Step 3: Checking environment file..." -ForegroundColor Cyan
if (Test-Path ".env") {
    Write-Host "  ✅ .env file exists" -ForegroundColor Green
} else {
    if (Test-Path ".env.example") {
        Write-Host "  📋 Creating .env from .env.example..." -ForegroundColor Yellow
        Copy-Item ".env.example" ".env"
        Write-Host "  ✅ .env created. Please edit with your credentials:" -ForegroundColor Green
        Write-Host "     - MONGO_URI (MongoDB connection string)" -ForegroundColor Yellow
        Write-Host "     - JWT_SECRET (change to random value)" -ForegroundColor Yellow
        Write-Host "     - NEWS_API_KEY (optional)" -ForegroundColor Yellow
        Write-Host ""
    } else {
        Write-Host "  ⚠️  Neither .env nor .env.example found" -ForegroundColor Yellow
        Write-Host "  Create .env with these variables:" -ForegroundColor Yellow
        Write-Host "  MONGO_URI=mongodb://mongo:27017/govi_isuru" -ForegroundColor Gray
        Write-Host "  JWT_SECRET=your_secret_key_here" -ForegroundColor Gray
        Write-Host "  AI_SERVICE_URL=http://ai-service:8000" -ForegroundColor Gray
    }
}

# Step 4: Build Docker images
Write-Host ""
Write-Host "✓ Step 4: Building Docker images..." -ForegroundColor Cyan
Write-Host "  This may take 5-10 minutes..." -ForegroundColor Yellow
docker-compose build

if ($LASTEXITCODE -ne 0) {
    Write-Host "  ❌ Build failed!" -ForegroundColor Red
    Write-Host "  Check the errors above and run: docker-compose build --no-cache" -ForegroundColor Yellow
    exit 1
}
Write-Host "  ✅ Build completed successfully" -ForegroundColor Green

# Step 5: Start services
Write-Host ""
Write-Host "✓ Step 5: Starting services..." -ForegroundColor Cyan
docker-compose up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "  ❌ Failed to start services!" -ForegroundColor Red
    exit 1
}

# Wait for services to start
Write-Host "  Waiting for services to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Step 6: Verify services
Write-Host ""
Write-Host "✓ Step 6: Verifying services..." -ForegroundColor Cyan
$services = docker-compose ps --format "table {{.Service}}`t{{.Status}}"
$services | ForEach-Object {
    if ($_ -match "Up") {
        Write-Host "  ✅ $_" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $_" -ForegroundColor Red
    }
}

# Step 7: Display access information
Write-Host ""
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Access Your Application:" -ForegroundColor Cyan
Write-Host "  Frontend:    http://localhost" -ForegroundColor Yellow
Write-Host "  Backend API: http://localhost:5000" -ForegroundColor Yellow
Write-Host "  AI Service:  http://localhost:8000" -ForegroundColor Yellow
Write-Host "  AI Docs:     http://localhost:8000/docs" -ForegroundColor Yellow
Write-Host ""

# Step 8: Show useful commands
Write-Host "📋 Useful Commands:" -ForegroundColor Cyan
Write-Host "  View logs:            docker-compose logs -f" -ForegroundColor Gray
Write-Host "  View backend logs:    docker-compose logs -f backend" -ForegroundColor Gray
Write-Host "  View AI service logs: docker-compose logs -f ai-service" -ForegroundColor Gray
Write-Host "  Stop services:        docker-compose down" -ForegroundColor Gray
Write-Host "  Restart services:     docker-compose restart" -ForegroundColor Gray
Write-Host "  Check status:         docker-compose ps" -ForegroundColor Gray
Write-Host ""

Write-Host "📖 Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Open http://localhost in your browser" -ForegroundColor Gray
Write-Host "  2. Test signup/login functionality" -ForegroundColor Gray
Write-Host "  3. Try uploading images for disease prediction" -ForegroundColor Gray
Write-Host "  4. Check logs if anything fails" -ForegroundColor Gray
Write-Host "  5. Read: LOCAL_TESTING_GUIDE.md" -ForegroundColor Gray
Write-Host ""

Write-Host "Problems? Run these commands:" -ForegroundColor Yellow
Write-Host "  docker-compose logs -f          # See all logs" -ForegroundColor Gray
Write-Host "  docker-compose down -v          # Clean everything" -ForegroundColor Gray
Write-Host "  docker-compose build --no-cache # Rebuild from scratch" -ForegroundColor Gray
