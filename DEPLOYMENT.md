# Linux Server Deployment Guide

Complete guide for deploying AlmasaAccounting on a Linux server.

## 📋 Prerequisites

### Server Requirements

- **OS**: Ubuntu 20.04+ or Debian 11+ (recommended)
- **RAM**: Minimum 2GB (4GB recommended)
- **Storage**: 20GB+ available
- **CPU**: 2+ cores recommended
- **Network**: Public IP address and domain name (for SSL)

### Required Software

- Node.js 18+ and npm
- MySQL 8.0+
- Nginx
- PM2 (will be installed)
- Git
- Certbot (for SSL certificates)

## 🚀 Step-by-Step Deployment

### 1. Initial Server Setup

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y git nginx mysql-server curl build-essential

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installations
node --version  # Should be v18.x or higher
npm --version
mysql --version
nginx -v
```

### 2. Configure MySQL Database

```bash
# Secure MySQL installation
sudo mysql_secure_installation

# Login to MySQL
sudo mysql

# Create database and user
CREATE DATABASE accounting_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'accounting_user'@'localhost' IDENTIFIED BY 'YOUR_STRONG_PASSWORD';
GRANT ALL PRIVILEGES ON accounting_db.* TO 'accounting_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

> **Important**: Replace `YOUR_STRONG_PASSWORD` with a strong, unique password.

### 3. Create Application User

```bash
# Create www-data user if it doesn't exist
sudo useradd -r -s /bin/bash -d /var/www www-data || true

# Create application directory
sudo mkdir -p /var/www/AlmasaAccounting
sudo chown -R www-data:www-data /var/www/AlmasaAccounting
```

### 4. Clone and Setup Application

```bash
# Switch to www-data user
sudo su - www-data

# Navigate to app directory
cd /var/www/AlmasaAccounting

# Clone repository (replace with your repo URL)
git clone https://github.com/yourusername/accounting-app.git .

# Or upload your files via SCP/SFTP
```

### 5. Backend Configuration

```bash
cd /var/www/AlmasaAccounting/backend

# Install dependencies
npm install

# Copy environment template
cp env.production.template .env

# Edit environment file
nano .env
```

**Update `.env` file:**
```env
DATABASE_URL="mysql://accounting_user:YOUR_STRONG_PASSWORD@localhost:3306/accounting_db"
JWT_SECRET="your-random-secret-key-at-least-32-characters-long"
PORT=5000
NODE_ENV="production"
FRONTEND_URL="https://yourdomain.com"
```

**Generate JWT Secret:**
```bash
# Generate a strong random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

```bash
# Generate Prisma Client
npm run db:generate

# Run database migrations (creates tables automatically)
npm run db:migrate:prod

# Seed initial data
npm run db:seed

# Build backend
npm run build

# Create logs directory
mkdir -p logs
```

### 6. Frontend Configuration

```bash
cd /var/www/AlmasaAccounting/frontend

# Install dependencies
npm install

# Copy environment template
cp env.production.template .env.local

# Edit environment file
nano .env.local
```

**Update `.env.local` file:**
```env
NEXT_PUBLIC_API_URL="https://api.yourdomain.com"
# Or if using same domain: https://yourdomain.com
```

```bash
# Build frontend
npm run build

# Create logs directory
mkdir -p logs
```

### 7. Install and Configure PM2

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start backend
cd /var/www/AlmasaAccounting/backend
pm2 start ecosystem.config.js --env production

# Start frontend
cd /var/www/AlmasaAccounting/frontend
pm2 start ecosystem.config.js --env production

# Save PM2 process list
pm2 save

# Setup PM2 startup script
pm2 startup systemd -u www-data --hp /var/www
# Run the command that PM2 outputs

# Check status
pm2 status
pm2 logs
```

### 8. Configure Nginx

```bash
# Exit from www-data user
exit

# Copy Nginx configuration
sudo cp /var/www/AlmasaAccounting/nginx.conf /etc/nginx/sites-available/accounting

# Update domain name in config
sudo nano /etc/nginx/sites-available/accounting
# Replace 'yourdomain.com' with your actual domain

# Create symbolic link
sudo ln -s /etc/nginx/sites-available/accounting /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 9. Configure SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow the prompts:
# - Enter email address
# - Agree to terms
# - Choose whether to redirect HTTP to HTTPS (recommended: yes)

# Verify auto-renewal
sudo certbot renew --dry-run
```

### 10. Configure Systemd Services (Optional)

If you prefer systemd over PM2 startup:

```bash
# Copy service files
sudo cp /var/www/AlmasaAccounting/almasaaccounting-backend.service /etc/systemd/system/
sudo cp /var/www/AlmasaAccounting/almasaaccounting-frontend.service /etc/systemd/system/

# Update paths in service files if needed
sudo nano /etc/systemd/system/almasaaccounting-backend.service
sudo nano /etc/systemd/system/almasaaccounting-frontend.service

# Reload systemd
sudo systemctl daemon-reload

# Enable services
sudo systemctl enable almasaaccounting-backend
sudo systemctl enable almasaaccounting-frontend

# Start services
sudo systemctl start almasaaccounting-backend
sudo systemctl start almasaaccounting-frontend

# Check status
sudo systemctl status almasaaccounting-backend
sudo systemctl status almasaaccounting-frontend
```

### 11. Configure Firewall

```bash
# Install UFW if not installed
sudo apt install -y ufw

# Allow SSH (important!)
sudo ufw allow OpenSSH

# Allow HTTP and HTTPS
sudo ufw allow 'Nginx Full'

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

### 12. Setup Database Backups

```bash
# Copy backup script
sudo cp /var/www/AlmasaAccounting/backup-db.sh /usr/local/bin/backup-almasaaccounting-db
sudo chmod +x /usr/local/bin/backup-almasaaccounting-db

# Create backup directory
sudo mkdir -p /var/backups/AlmasaAccounting
sudo chown www-data:www-data /var/backups/AlmasaAccounting

# Set database password environment variable
echo "export DB_PASSWORD='YOUR_MYSQL_PASSWORD'" | sudo tee -a /etc/environment

# Setup cron job for daily backups
sudo crontab -e -u www-data

# Add this line for daily backup at 2 AM:
0 2 * * * /usr/local/bin/backup-almasaaccounting-db >> /var/log/almasaaccounting-backup.log 2>&1
```

## ✅ Verification

### Test Application

1. **Access Frontend:**
   - Navigate to `https://yourdomain.com`
   - You should see the login page

2. **Test Login:**
   - Email: `admin@almasaaccounting.com`
   - Password: `admin123`

3. **Check Backend API:**
   ```bash
   curl https://yourdomain.com/api/health
   # Should return: {"status":"ok","message":"Accounting API is running"}
   ```

4. **Monitor Logs:**
   ```bash
   # PM2 logs
   sudo su - www-data
   pm2 logs
   
   # Nginx logs
   sudo tail -f /var/log/nginx/almasaaccounting_access.log
   sudo tail -f /var/log/nginx/almasaaccounting_error.log
   ```

## 🔄 Deployment Updates

When you need to deploy new changes:

```bash
# Switch to app user
sudo su - www-data

# Navigate to app directory
cd /var/www/AlmasaAccounting

# Run deployment script
bash deploy.sh
```

The deployment script will:
- Pull latest code
- Install dependencies
- Run migrations
- Build applications
- Restart services
- Run health checks

## 📊 Monitoring & Maintenance

### View Application Status

```bash
# PM2 status
pm2 status

# Real-time monitoring
pm2 monit

# View logs
pm2 logs almasaaccounting-backend
pm2 logs almasaaccounting-frontend

# Systemd services
sudo systemctl status almasaaccounting-backend
sudo systemctl status almasaaccounting-frontend
```

### Restart Services

```bash
# PM2
pm2 restart almasaaccounting-backend
pm2 restart almasaaccounting-frontend

# Or restart all
pm2 restart all

# Systemd
sudo systemctl restart almasaaccounting-backend
sudo systemctl restart almasaaccounting-frontend
```

### Database Management

```bash
# View database
sudo mysql almasaaccounting_db

# Manual backup
sudo -u www-data /usr/local/bin/backup-almasaaccounting-db

# Restore from backup
gunzip -c /var/backups/AlmasaAccounting/almasaaccounting_db_YYYYMMDD_HHMMSS.sql.gz | sudo mysql -u almasa_user -p almasaaccounting_db
```

## 🔒 Security Best Practices

1. **Change Default Credentials:**
   - Create new admin user
   - Delete or change default admin password

2. **Keep Software Updated:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

3. **Monitor Failed Login Attempts:**
   ```bash
   sudo apt install fail2ban
   sudo systemctl enable fail2ban
   ```

4. **Regular Backups:**
   - Verify backup cron job is running
   - Test backup restoration

5. **Use Strong Passwords:**
   - MySQL root and user passwords
   - JWT secret key
   - Application admin password

6. **Enable Automatic Security Updates:**
   ```bash
   sudo apt install unattended-upgrades
   sudo dpkg-reconfigure --priority=low unattended-upgrades
   ```

## 🐛 Troubleshooting

### Application Won't Start

```bash
# Check PM2 logs
pm2 logs --err

# Check database connection
mysql -u almasa_user -p almasaaccounting_db
```

### Database Connection Failed

- Verify MySQL is running: `sudo systemctl status mysql`
- Check credentials in `/var/www/AlmasaAccounting/backend/.env`
- Verify database exists: `mysql -u almasa_user -p -e "SHOW DATABASES;"`

### Nginx 502 Bad Gateway

- Check if backend is running: `pm2 status`
- Verify backend port: `curl http://localhost:5000/health`
- Check Nginx error logs: `sudo tail -f /var/log/nginx/almasaaccounting_error.log`

### SSL Certificate Issues

```bash
# Renew certificate manually
sudo certbot renew

# Check certificate status
sudo certbot certificates
```

### Permission Errors

```bash
# Fix ownership
sudo chown -R www-data:www-data /var/www/AlmasaAccounting

# Fix PM2 permissions
pm2 kill
pm2 start ecosystem.config.js --env production
pm2 save
```

## 📞 Support

For additional help:
- Check application logs: `pm2 logs`
- Review Nginx logs: `/var/log/nginx/`
- Check system logs: `sudo journalctl -xe`

## 🎉 Success!

Your Almasa Accounting App is now running on a production Linux server with:
- ✅ Automatic database setup
- ✅ SSL/HTTPS encryption
- ✅ Process management with PM2
- ✅ Reverse proxy with Nginx
- ✅ Automated backups
- ✅ Auto-restart on failure
- ✅ Production optimizations

Access your application at: `https://yourdomain.com`
