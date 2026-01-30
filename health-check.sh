#!/bin/bash

# Tabakh Dziri Health Check Script
# This script monitors the health of the application and can restart services if needed

# Configuration
BACKEND_URL="http://localhost:5000/api/health"
FRONTEND_URL="http://localhost:3000"
LOG_FILE="/var/log/tabakh-health-check.log"
MAX_RETRIES=3
RETRY_DELAY=5

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Function to log messages
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Function to check service health
check_service() {
    local service_name=$1
    local url=$2
    local retry_count=0
    
    while [ $retry_count -lt $MAX_RETRIES ]; do
        response=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 10 "$url")
        
        if [ "$response" = "200" ] || [ "$response" = "304" ]; then
            echo -e "${GREEN}✓${NC} $service_name is healthy (HTTP $response)"
            return 0
        fi
        
        retry_count=$((retry_count + 1))
        if [ $retry_count -lt $MAX_RETRIES ]; then
            echo -e "${YELLOW}⚠${NC} $service_name check failed (HTTP $response), retrying in ${RETRY_DELAY}s... ($retry_count/$MAX_RETRIES)"
            sleep $RETRY_DELAY
        fi
    done
    
    echo -e "${RED}✗${NC} $service_name is unhealthy (HTTP $response)"
    return 1
}

# Function to restart service
restart_service() {
    local service_name=$1
    log_message "Attempting to restart $service_name..."
    
    pm2 restart "$service_name"
    
    if [ $? -eq 0 ]; then
        log_message "$service_name restarted successfully"
        sleep 5  # Wait for service to start
        return 0
    else
        log_message "Failed to restart $service_name"
        return 1
    fi
}

# Function to send notification (optional)
send_notification() {
    local message=$1
    
    # Option 1: Send email (if mail is configured)
    # echo "$message" | mail -s "Tabakh Dziri Alert" admin@tabakhdziri.com
    
    # Option 2: Send to webhook (Slack, Discord, etc.)
    # curl -X POST -H 'Content-type: application/json' \
    #   --data "{\"text\":\"$message\"}" \
    #   YOUR_WEBHOOK_URL
    
    # For now, just log it
    log_message "ALERT: $message"
}

# Main health check
echo "========================================="
echo "Tabakh Dziri Health Check"
echo "========================================="
echo "Time: $(date)"
echo ""

# Check PM2 status
echo "PM2 Status:"
pm2 status
echo ""

# Check Backend
echo "Checking Backend..."
if ! check_service "Backend" "$BACKEND_URL"; then
    log_message "Backend health check failed"
    
    # Try to restart
    if restart_service "tabakh-backend"; then
        # Check again after restart
        sleep 5
        if check_service "Backend" "$BACKEND_URL"; then
            send_notification "Backend was down but has been restarted successfully"
        else
            send_notification "Backend is down and restart failed - manual intervention required!"
        fi
    else
        send_notification "Failed to restart Backend - manual intervention required!"
    fi
fi

echo ""

# Check Frontend
echo "Checking Frontend..."
if ! check_service "Frontend" "$FRONTEND_URL"; then
    log_message "Frontend health check failed"
    
    # Try to restart
    if restart_service "tabakh-frontend"; then
        # Check again after restart
        sleep 5
        if check_service "Frontend" "$FRONTEND_URL"; then
            send_notification "Frontend was down but has been restarted successfully"
        else
            send_notification "Frontend is down and restart failed - manual intervention required!"
        fi
    else
        send_notification "Failed to restart Frontend - manual intervention required!"
    fi
fi

echo ""

# Check disk space
echo "Disk Usage:"
df -h / | tail -1
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo -e "${YELLOW}⚠${NC} Disk usage is above 80%"
    log_message "WARNING: Disk usage is at ${DISK_USAGE}%"
    send_notification "Disk usage is at ${DISK_USAGE}% - consider cleaning up"
else
    echo -e "${GREEN}✓${NC} Disk usage is healthy (${DISK_USAGE}%)"
fi

echo ""

# Check memory usage
echo "Memory Usage:"
free -h | grep Mem
MEMORY_USAGE=$(free | grep Mem | awk '{print int($3/$2 * 100)}')
if [ $MEMORY_USAGE -gt 85 ]; then
    echo -e "${YELLOW}⚠${NC} Memory usage is above 85%"
    log_message "WARNING: Memory usage is at ${MEMORY_USAGE}%"
else
    echo -e "${GREEN}✓${NC} Memory usage is healthy (${MEMORY_USAGE}%)"
fi

echo ""

# Check MongoDB (if local)
echo "Checking MongoDB..."
if systemctl is-active --quiet mongod; then
    echo -e "${GREEN}✓${NC} MongoDB is running"
else
    echo -e "${RED}✗${NC} MongoDB is not running"
    log_message "WARNING: MongoDB is not running"
    send_notification "MongoDB is not running - manual intervention required!"
fi

echo ""

# Check Nginx
echo "Checking Nginx..."
if systemctl is-active --quiet nginx; then
    echo -e "${GREEN}✓${NC} Nginx is running"
else
    echo -e "${RED}✗${NC} Nginx is not running"
    log_message "WARNING: Nginx is not running"
    send_notification "Nginx is not running - attempting to restart"
    sudo systemctl start nginx
fi

echo ""
echo "========================================="
echo "Health check completed"
echo "========================================="

# Exit with appropriate code
if [ $? -eq 0 ]; then
    exit 0
else
    exit 1
fi
