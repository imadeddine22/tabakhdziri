#!/bin/bash

# Tabakh Dziri Update Script
# This script safely updates the application with zero downtime

echo "========================================="
echo "Tabakh Dziri Update Script"
echo "========================================="
echo ""

# Configuration
PROJECT_DIR="/var/www/tabakhdziri"
BACKUP_DIR="/var/backups/tabakhdziri/pre-update"
DATE=$(date +%Y%m%d_%H%M%S)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Check if running as correct user
if [ "$EUID" -eq 0 ]; then 
    print_error "Please do not run this script as root"
    exit 1
fi

# Step 1: Create pre-update backup
echo "1. Creating pre-update backup..."
mkdir -p "$BACKUP_DIR"

# Backup current code
tar -czf "$BACKUP_DIR/code_$DATE.tar.gz" -C "$PROJECT_DIR" . 2>/dev/null
if [ $? -eq 0 ]; then
    print_success "Code backup created"
else
    print_error "Failed to create code backup"
    exit 1
fi

# Backup database
mongodump --uri="mongodb://localhost:27017/tabakh-dziri" --out="$BACKUP_DIR/db_$DATE" 2>/dev/null
if [ $? -eq 0 ]; then
    print_success "Database backup created"
else
    print_warning "Database backup failed (continuing anyway)"
fi

# Step 2: Pull latest changes
echo ""
echo "2. Pulling latest changes from repository..."
cd "$PROJECT_DIR"

git fetch origin
if [ $? -ne 0 ]; then
    print_error "Failed to fetch from repository"
    exit 1
fi

# Check if there are updates
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse @{u})

if [ $LOCAL = $REMOTE ]; then
    print_warning "Already up to date. No updates needed."
    echo ""
    read -p "Do you want to rebuild anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 0
    fi
else
    git pull origin main
    if [ $? -ne 0 ]; then
        print_error "Failed to pull changes"
        exit 1
    fi
    print_success "Changes pulled successfully"
fi

# Step 3: Update Backend
echo ""
echo "3. Updating Backend..."
cd "$PROJECT_DIR/food-delivery-backend"

# Install/update dependencies
npm install --production
if [ $? -ne 0 ]; then
    print_error "Failed to install backend dependencies"
    exit 1
fi
print_success "Backend dependencies updated"

# Check if .env needs updating
if [ -f ".env.example" ]; then
    print_warning "Check if .env needs updating based on .env.example"
fi

# Step 4: Update Frontend
echo ""
echo "4. Updating Frontend..."
cd "$PROJECT_DIR/food-delivery-app"

# Install/update dependencies
npm install
if [ $? -ne 0 ]; then
    print_error "Failed to install frontend dependencies"
    exit 1
fi
print_success "Frontend dependencies updated"

# Build frontend
echo "Building frontend (this may take a few minutes)..."
npm run build
if [ $? -ne 0 ]; then
    print_error "Frontend build failed"
    exit 1
fi
print_success "Frontend built successfully"

# Step 5: Restart applications
echo ""
echo "5. Restarting applications..."

# Restart backend
pm2 restart tabakh-backend
if [ $? -ne 0 ]; then
    print_error "Failed to restart backend"
    exit 1
fi
print_success "Backend restarted"

# Wait a moment for backend to start
sleep 2

# Restart frontend
pm2 restart tabakh-frontend
if [ $? -ne 0 ]; then
    print_error "Failed to restart frontend"
    exit 1
fi
print_success "Frontend restarted"

# Step 6: Health check
echo ""
echo "6. Performing health check..."
sleep 3

# Check if backend is responding
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/health)
if [ "$BACKEND_STATUS" = "200" ]; then
    print_success "Backend is healthy"
else
    print_warning "Backend health check returned: $BACKEND_STATUS"
fi

# Check if frontend is responding
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ "$FRONTEND_STATUS" = "200" ] || [ "$FRONTEND_STATUS" = "304" ]; then
    print_success "Frontend is healthy"
else
    print_warning "Frontend health check returned: $FRONTEND_STATUS"
fi

# Step 7: Show PM2 status
echo ""
echo "7. Current application status:"
pm2 status

# Step 8: Summary
echo ""
echo "========================================="
echo "Update Summary"
echo "========================================="
echo "Update completed at: $(date)"
echo "Backup location: $BACKUP_DIR"
echo ""
print_success "Update completed successfully!"
echo ""
echo "You can check the logs with:"
echo "  pm2 logs"
echo ""
echo "If something went wrong, you can rollback with:"
echo "  cd $PROJECT_DIR"
echo "  tar -xzf $BACKUP_DIR/code_$DATE.tar.gz"
echo "  pm2 restart all"
echo "========================================="

exit 0
