#!/bin/bash

# ====================================
# GOVI-ISURU Local Docker Build & Run
# ====================================
# For testing before deployment

set -e

echo "🐳 Building Docker images..."
docker-compose -f docker-compose.prod.yml build --no-cache

echo ""
echo "🚀 Starting services..."
docker-compose -f docker-compose.prod.yml up -d

echo ""
echo "✅ All services started!"
echo ""
echo "📋 Service Status:"
docker-compose -f docker-compose.prod.yml ps
echo ""
echo "📊 View logs:"
echo "  - All: docker-compose -f docker-compose.prod.yml logs -f"
echo "  - Backend: docker-compose -f docker-compose.prod.yml logs -f backend"
echo "  - Frontend: docker-compose -f docker-compose.prod.yml logs -f frontend"
echo "  - AI Service: docker-compose -f docker-compose.prod.yml logs -f ai-service"
echo ""
echo "🧪 Test endpoints:"
echo "  - Frontend: http://localhost"
echo "  - Backend: http://localhost:5000/health"
echo "  - AI Service: http://localhost:8000/docs"
echo ""
echo "🛑 Stop services:"
echo "  docker-compose -f docker-compose.prod.yml down"
echo ""
