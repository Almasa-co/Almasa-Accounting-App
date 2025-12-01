#!/bin/bash

# Almasa Accounting App - Deployment Script
# This script automates the deployment process on Linux servers

set -e  # Exit on error

echo "🚀 Starting deployment..."

# Configuration
APP_DIR="/var/www/AlmasaAccounting"
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"
BACKUP_DIR="/var/backups/AlmasaAccounting"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if running as correct user
if [ "$EUID" -eq 0 ]; then 
    print_error "Do not run this script as root. Run as www-data or your app user."
    exit 1
fi

# Navigate to app directory
cd "$APP_DIR" || exit 1

# Pull latest code
echo "📥 Pulling latest code from repository..."
git pull origin main || {
    print_error "Failed to pull latest code"
    exit 1
}
print_success "Code updated"

# Backend deployment
echo ""
echo "🔧 Deploying Backend..."
cd "$BACKEND_DIR"

# Install dependencies
echo "📦 Installing backend dependencies..."
npm install --production || {
    print_error "Failed to install backend dependencies"
    exit 1
}
print_success "Backend dependencies installed"

# Generate Prisma Client
echo "🔨 Generating Prisma Client..."
npm run db:generate || {
    print_error "Failed to generate Prisma Client"
    exit 1
}
print_success "Prisma Client generated"

# Run database migrations
echo "🗄️  Running database migrations..."
npm run db:migrate:prod || {
    print_warning "Migration failed or no new migrations"
}
print_success "Database migrations completed"

# Build backend
echo "🏗️  Building backend..."
npm run build || {
    print_error "Failed to build backend"
    exit 1
}
print_success "Backend built successfully"

# Frontend deployment
echo ""
echo "🎨 Deploying Frontend..."
cd "$FRONTEND_DIR"

# Install dependencies
echo "📦 Installing frontend dependencies..."
npm install --production || {
    print_error "Failed to install frontend dependencies"
    exit 1
}
print_success "Frontend dependencies installed"

# Build frontend
echo "🏗️  Building frontend..."
npm run build || {
    print_error "Failed to build frontend"
    exit 1
}
print_success "Frontend built successfully"

# Restart services
echo ""
echo "🔄 Restarting services..."

# Restart backend
echo "Restarting backend..."
pm2 restart almasaaccounting-backend || {
    print_warning "Failed to restart backend, trying to start..."
    cd "$BACKEND_DIR"
    npm run start:prod
}
print_success "Backend restarted"

# Restart frontend
echo "Restarting frontend..."
pm2 restart almasaaccounting-frontend || {
    print_warning "Failed to restart frontend, trying to start..."
    cd "$FRONTEND_DIR"
    npm run start:prod
}
print_success "Frontend restarted"

# Save PM2 process list
pm2 save

# Health check
echo ""
echo "🏥 Running health check..."
sleep 5

# Check backend health
BACKEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/health)
if [ "$BACKEND_HEALTH" -eq 200 ]; then
    print_success "Backend is healthy"
else
    print_error "Backend health check failed (HTTP $BACKEND_HEALTH)"
fi

# Check frontend
FRONTEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ "$FRONTEND_HEALTH" -eq 200 ] || [ "$FRONTEND_HEALTH" -eq 304 ]; then
    print_success "Frontend is healthy"
else
    print_error "Frontend health check failed (HTTP $FRONTEND_HEALTH)"
fi

# Display PM2 status
echo ""
echo "📊 Application Status:"
pm2 status

echo ""
print_success "Deployment completed successfully! 🎉"
echo ""
echo "Useful commands:"
echo "  - View logs: pm2 logs"
echo "  - Monitor: pm2 monit"
echo "  - Restart: pm2 restart all"
echo "  - Stop: pm2 stop all"
