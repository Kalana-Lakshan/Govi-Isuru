#!/bin/bash

# ====================================
# GOVI-ISURU Deployment Verification
# ====================================
# Run this script to verify your deployment is working correctly

set -e

echo "🔍 GOVI-ISURU Deployment Verification"
echo "======================================"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check functions
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "${RED}✗${NC} $1 (missing)"
        return 1
    fi
}

check_directory() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/"
        return 0
    else
        echo -e "${RED}✗${NC} $1/ (missing)"
        return 1
    fi
}

check_command() {
    if command -v "$1" &> /dev/null; then
        echo -e "${GREEN}✓${NC} $1 installed"
        return 0
    else
        echo -e "${RED}✗${NC} $1 not found"
        return 1
    fi
}

# ====================
# 1. Check System Tools
# ====================
echo "📋 Checking system tools..."
echo ""
TOOLS_OK=true
check_command "docker" || TOOLS_OK=false
check_command "docker-compose" || TOOLS_OK=false
check_command "git" || TOOLS_OK=false
echo ""

# ====================
# 2. Check Project Structure
# ====================
echo "📁 Checking project structure..."
echo ""
STRUCTURE_OK=true
check_file "docker-compose.yml" || STRUCTURE_OK=false
check_file "docker-compose.prod.yml" || STRUCTURE_OK=false
check_file ".env.example" || STRUCTURE_OK=false
check_file "README.md" || STRUCTURE_OK=false

check_directory "server" || STRUCTURE_OK=false
check_directory "client" || STRUCTURE_OK=false
check_directory "ai-service" || STRUCTURE_OK=false
check_directory "scripts" || STRUCTURE_OK=false
check_directory ".github" || STRUCTURE_OK=false
echo ""

# ====================
# 3. Check Dockerfiles
# ====================
echo "🐳 Checking Dockerfiles..."
echo ""
DOCKERFILES_OK=true
check_file "server/Dockerfile" || DOCKERFILES_OK=false
check_file "client/Dockerfile" || DOCKERFILES_OK=false
check_file "ai-service/Dockerfile" || DOCKERFILES_OK=false
echo ""

# ====================
# 4. Check Documentation
# ====================
echo "📚 Checking documentation..."
echo ""
DOCS_OK=true
check_file "DIGITALOCEAN_DEPLOYMENT.md" || DOCS_OK=false
check_file "DEPLOYMENT_CHECKLIST.md" || DOCS_OK=false
check_file "QUICK_REFERENCE.md" || DOCS_OK=false
check_file "DOCKERIZATION_SUMMARY.md" || DOCS_OK=false
echo ""

# ====================
# 5. Check Scripts
# ====================
echo "🔧 Checking deployment scripts..."
echo ""
SCRIPTS_OK=true
check_file "scripts/deploy-digitalocean.sh" || SCRIPTS_OK=false
check_file "scripts/start-local.sh" || SCRIPTS_OK=false
check_file "scripts/start-local.ps1" || SCRIPTS_OK=false
echo ""

# ====================
# 6. Check CI/CD
# ====================
echo "🔄 Checking CI/CD configuration..."
echo ""
CI_OK=true
check_file ".github/workflows/deploy.yml" || CI_OK=false
echo ""

# ====================
# 7. Verify .env Setup
# ====================
echo "🔐 Checking environment setup..."
echo ""
if [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC} .env file exists (make sure it has correct values!)"
else
    echo -e "${YELLOW}⚠${NC} .env file not found"
    echo "   Create it with: cp .env.example .env"
fi
echo ""

# ====================
# 8. Docker Build Check
# ====================
echo "🏗️  Checking Docker images can be built..."
echo ""
if [ "$DOCKERFILES_OK" = true ]; then
    echo -e "${GREEN}✓${NC} All Dockerfiles present"
    echo ""
    echo "   To build images, run:"
    echo "   docker-compose -f docker-compose.prod.yml build"
else
    echo -e "${RED}✗${NC} Missing Dockerfiles - cannot build"
fi
echo ""

# ====================
# Summary
# ====================
echo "======================================"
echo "📊 Deployment Readiness Summary"
echo "======================================"
echo ""

TOTAL_OK=0
TOTAL_CHECKS=7

[ "$TOOLS_OK" = true ] && echo -e "${GREEN}✓${NC} System tools installed" && TOTAL_OK=$((TOTAL_OK+1)) || echo -e "${RED}✗${NC} System tools missing"
[ "$STRUCTURE_OK" = true ] && echo -e "${GREEN}✓${NC} Project structure correct" && TOTAL_OK=$((TOTAL_OK+1)) || echo -e "${RED}✗${NC} Project structure issues"
[ "$DOCKERFILES_OK" = true ] && echo -e "${GREEN}✓${NC} Dockerfiles configured" && TOTAL_OK=$((TOTAL_OK+1)) || echo -e "${RED}✗${NC} Missing Dockerfiles"
[ "$DOCS_OK" = true ] && echo -e "${GREEN}✓${NC} Documentation complete" && TOTAL_OK=$((TOTAL_OK+1)) || echo -e "${RED}✗${NC} Missing documentation"
[ "$SCRIPTS_OK" = true ] && echo -e "${GREEN}✓${NC} Deployment scripts ready" && TOTAL_OK=$((TOTAL_OK+1)) || echo -e "${RED}✗${NC} Missing scripts"
[ "$CI_OK" = true ] && echo -e "${GREEN}✓${NC} CI/CD configured" && TOTAL_OK=$((TOTAL_OK+1)) || echo -e "${YELLOW}⚠${NC} CI/CD optional"

if [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC} Environment file created" && TOTAL_OK=$((TOTAL_OK+1))
else
    echo -e "${YELLOW}⚠${NC} Environment file needed (create with: cp .env.example .env)"
fi

echo ""
echo "Readiness: $TOTAL_OK/$TOTAL_CHECKS checks passed"
echo ""

if [ $TOTAL_OK -ge 6 ]; then
    echo -e "${GREEN}✅ Ready for deployment!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Setup .env file with your credentials:"
    echo "   cp .env.example .env"
    echo "   nano .env  # Edit with your values"
    echo ""
    echo "2. Test locally (optional):"
    echo "   docker-compose -f docker-compose.prod.yml up -d"
    echo ""
    echo "3. Deploy to DigitalOcean:"
    echo "   bash scripts/deploy-digitalocean.sh <droplet-ip> <domain>"
    echo ""
    echo "For detailed instructions, see: DIGITALOCEAN_DEPLOYMENT.md"
else
    echo -e "${RED}⚠️  Some checks failed. Review the errors above.${NC}"
fi

echo ""
