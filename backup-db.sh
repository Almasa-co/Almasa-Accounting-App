#!/bin/bash

# Almasa Accounting App - Database Backup Script
# Run this script regularly via cron for automated backups

set -e

# Configuration
BACKUP_DIR="/var/backups/AlmasaAccounting"
DB_NAME="almasaaccounting_db"
DB_USER="almasa_user"
DB_PASSWORD="${DB_PASSWORD:-}"  # Set via environment variable
RETENTION_DAYS=30

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Generate backup filename with timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/almasaaccounting_db_$TIMESTAMP.sql"
COMPRESSED_FILE="$BACKUP_FILE.gz"

echo "🗄️  Starting database backup..."
echo "Database: $DB_NAME"
echo "Backup file: $COMPRESSED_FILE"

# Perform backup
if [ -z "$DB_PASSWORD" ]; then
    # No password (for local development)
    mysqldump -u "$DB_USER" "$DB_NAME" > "$BACKUP_FILE"
else
    # With password (for production)
    mysqldump -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" > "$BACKUP_FILE"
fi

# Compress backup
gzip "$BACKUP_FILE"

# Check if backup was successful
if [ -f "$COMPRESSED_FILE" ]; then
    BACKUP_SIZE=$(du -h "$COMPRESSED_FILE" | cut -f1)
    echo "✅ Backup completed successfully!"
    echo "Size: $BACKUP_SIZE"
    echo "Location: $COMPRESSED_FILE"
else
    echo "❌ Backup failed!"
    exit 1
fi

# Remove old backups (older than RETENTION_DAYS)
echo ""
echo "🧹 Cleaning up old backups (older than $RETENTION_DAYS days)..."
find "$BACKUP_DIR" -name "almasaaccounting_db_*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete
echo "✅ Cleanup completed"

# List recent backups
echo ""
echo "📋 Recent backups:"
ls -lh "$BACKUP_DIR"/almasaaccounting_db_*.sql.gz | tail -5

echo ""
echo "💡 To restore from backup:"
echo "   gunzip -c $COMPRESSED_FILE | mysql -u $DB_USER -p $DB_NAME"
