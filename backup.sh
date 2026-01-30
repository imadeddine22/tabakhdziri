#!/bin/bash

# Tabakh Dziri Backup Script
# This script creates backups of MongoDB database and uploaded files

# Configuration
BACKUP_DIR="/var/backups/tabakhdziri"
PROJECT_DIR="/var/www/tabakhdziri"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=7

# MongoDB Configuration
DB_NAME="tabakh-dziri"
# For local MongoDB:
MONGO_URI="mongodb://localhost:27017/$DB_NAME"
# For MongoDB Atlas (uncomment and update):
# MONGO_URI="mongodb+srv://username:password@cluster.mongodb.net/$DB_NAME"

# Create backup directories
mkdir -p "$BACKUP_DIR/mongodb"
mkdir -p "$BACKUP_DIR/uploads"
mkdir -p "$BACKUP_DIR/logs"

# Log file
LOG_FILE="$BACKUP_DIR/logs/backup_$DATE.log"

echo "========================================" | tee -a "$LOG_FILE"
echo "Tabakh Dziri Backup - $DATE" | tee -a "$LOG_FILE"
echo "========================================" | tee -a "$LOG_FILE"

# Backup MongoDB
echo "" | tee -a "$LOG_FILE"
echo "1. Backing up MongoDB database..." | tee -a "$LOG_FILE"
MONGO_BACKUP_DIR="$BACKUP_DIR/mongodb/backup_$DATE"

if mongodump --uri="$MONGO_URI" --out="$MONGO_BACKUP_DIR" >> "$LOG_FILE" 2>&1; then
    echo "✓ MongoDB backup completed successfully" | tee -a "$LOG_FILE"
    
    # Compress the backup
    cd "$BACKUP_DIR/mongodb"
    tar -czf "backup_$DATE.tar.gz" "backup_$DATE"
    rm -rf "backup_$DATE"
    echo "✓ MongoDB backup compressed" | tee -a "$LOG_FILE"
else
    echo "✗ MongoDB backup failed!" | tee -a "$LOG_FILE"
fi

# Backup uploaded files
echo "" | tee -a "$LOG_FILE"
echo "2. Backing up uploaded files..." | tee -a "$LOG_FILE"
UPLOADS_DIR="$PROJECT_DIR/food-delivery-backend/uploads"

if [ -d "$UPLOADS_DIR" ]; then
    tar -czf "$BACKUP_DIR/uploads/uploads_$DATE.tar.gz" -C "$PROJECT_DIR/food-delivery-backend" uploads >> "$LOG_FILE" 2>&1
    
    if [ $? -eq 0 ]; then
        echo "✓ Uploads backup completed successfully" | tee -a "$LOG_FILE"
    else
        echo "✗ Uploads backup failed!" | tee -a "$LOG_FILE"
    fi
else
    echo "⚠ Uploads directory not found: $UPLOADS_DIR" | tee -a "$LOG_FILE"
fi

# Backup environment files
echo "" | tee -a "$LOG_FILE"
echo "3. Backing up environment files..." | tee -a "$LOG_FILE"
ENV_BACKUP_DIR="$BACKUP_DIR/env/backup_$DATE"
mkdir -p "$ENV_BACKUP_DIR"

cp "$PROJECT_DIR/food-delivery-backend/.env" "$ENV_BACKUP_DIR/backend.env" 2>/dev/null
cp "$PROJECT_DIR/food-delivery-app/.env.local" "$ENV_BACKUP_DIR/frontend.env" 2>/dev/null

if [ -f "$ENV_BACKUP_DIR/backend.env" ] || [ -f "$ENV_BACKUP_DIR/frontend.env" ]; then
    echo "✓ Environment files backed up" | tee -a "$LOG_FILE"
else
    echo "⚠ No environment files found" | tee -a "$LOG_FILE"
fi

# Clean old backups (older than RETENTION_DAYS)
echo "" | tee -a "$LOG_FILE"
echo "4. Cleaning old backups (older than $RETENTION_DAYS days)..." | tee -a "$LOG_FILE"

find "$BACKUP_DIR/mongodb" -name "backup_*.tar.gz" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR/uploads" -name "uploads_*.tar.gz" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR/env" -type d -mtime +$RETENTION_DAYS -exec rm -rf {} + 2>/dev/null
find "$BACKUP_DIR/logs" -name "backup_*.log" -mtime +$RETENTION_DAYS -delete

echo "✓ Old backups cleaned" | tee -a "$LOG_FILE"

# Calculate backup sizes
echo "" | tee -a "$LOG_FILE"
echo "5. Backup Summary:" | tee -a "$LOG_FILE"
echo "========================================" | tee -a "$LOG_FILE"

if [ -f "$BACKUP_DIR/mongodb/backup_$DATE.tar.gz" ]; then
    MONGO_SIZE=$(du -h "$BACKUP_DIR/mongodb/backup_$DATE.tar.gz" | cut -f1)
    echo "MongoDB backup: $MONGO_SIZE" | tee -a "$LOG_FILE"
fi

if [ -f "$BACKUP_DIR/uploads/uploads_$DATE.tar.gz" ]; then
    UPLOADS_SIZE=$(du -h "$BACKUP_DIR/uploads/uploads_$DATE.tar.gz" | cut -f1)
    echo "Uploads backup: $UPLOADS_SIZE" | tee -a "$LOG_FILE"
fi

TOTAL_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)
echo "Total backup size: $TOTAL_SIZE" | tee -a "$LOG_FILE"

echo "========================================" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"
echo "✓ Backup completed successfully!" | tee -a "$LOG_FILE"
echo "Backup location: $BACKUP_DIR" | tee -a "$LOG_FILE"
echo "========================================" | tee -a "$LOG_FILE"

# Optional: Send notification (uncomment if you have mail configured)
# echo "Backup completed at $(date)" | mail -s "Tabakh Dziri Backup - $DATE" admin@tabakhdziri.com

exit 0
