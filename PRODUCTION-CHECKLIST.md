# Production Deployment Checklist

Use this checklist when deploying to a Linux production server.

## Pre-Deployment

- [ ] Server meets minimum requirements (2GB RAM, 20GB storage)
- [ ] Domain name is configured and pointing to server IP
- [ ] SSH access to server is working
- [ ] Backup plan is in place

## Server Setup

- [ ] Linux server is updated (`apt update && apt upgrade`)
- [ ] Node.js 18+ is installed
- [ ] MySQL 8.0+ is installed and secured
- [ ] Nginx is installed
- [ ] Git is installed
- [ ] Firewall (UFW) is configured

## Database Configuration

- [ ] MySQL database created (`accounting_db`)
- [ ] Database user created with strong password
- [ ] Database user has proper permissions
- [ ] Database connection tested

## Application Setup

### Backend

- [ ] Code deployed to `/var/www/accounting-app/backend`
- [ ] Dependencies installed (`npm install`)
- [ ] Environment file created (`.env`)
- [ ] Strong JWT secret generated
- [ ] Database URL configured correctly
- [ ] Prisma client generated (`npm run db:generate`)
- [ ] Migrations run (`npm run db:migrate:prod`)
- [ ] Seed data loaded (`npm run db:seed`)
- [ ] Application built (`npm run build`)
- [ ] Backend starts successfully

### Frontend

- [ ] Code deployed to `/var/www/accounting-app/frontend`
- [ ] Dependencies installed (`npm install`)
- [ ] Environment file created (`.env.local`)
- [ ] API URL configured correctly
- [ ] Application built (`npm run build`)
- [ ] Frontend starts successfully

## Process Management

- [ ] PM2 installed globally
- [ ] Backend running via PM2
- [ ] Frontend running via PM2
- [ ] PM2 process list saved
- [ ] PM2 startup script configured
- [ ] Services restart on server reboot

## Nginx Configuration

- [ ] Nginx config file created
- [ ] Domain name updated in config
- [ ] Config linked to sites-enabled
- [ ] Nginx configuration tested (`nginx -t`)
- [ ] Nginx restarted
- [ ] Application accessible via domain (HTTP)

## SSL/HTTPS

- [ ] Certbot installed
- [ ] SSL certificate obtained for domain
- [ ] Certificate auto-renewal configured
- [ ] HTTPS working correctly
- [ ] HTTP redirects to HTTPS

## Security

- [ ] Default admin password changed
- [ ] Strong MySQL passwords set
- [ ] JWT secret is random and secure
- [ ] Firewall configured (ports 22, 80, 443)
- [ ] SSH key authentication enabled
- [ ] Fail2ban installed (recommended)
- [ ] Regular security updates enabled

## Backups

- [ ] Backup script installed
- [ ] Backup directory created
- [ ] Cron job configured for daily backups
- [ ] Test backup created successfully
- [ ] Test restore from backup successful

## Monitoring

- [ ] Health endpoint accessible (`/health`)
- [ ] PM2 monitoring works (`pm2 monit`)
- [ ] Logs are accessible (`pm2 logs`)
- [ ] Nginx logs reviewed
- [ ] Database connection verified

## Final Verification

- [ ] Frontend loads in browser (HTTPS)
- [ ] Login works with default credentials
- [ ] Can create a test invoice
- [ ] Can create a test expense
- [ ] API endpoints responding
- [ ] Database persistence verified
- [ ] No errors in PM2 logs
- [ ] No errors in Nginx logs

## Post-Deployment

- [ ] Default admin user removed or password changed
- [ ] New admin user created with strong password
- [ ] Test data cleaned up (if any)
- [ ] Deployment script tested (`bash deploy.sh`)
- [ ] Documentation updated with server details
- [ ] Team notified of deployment
- [ ] Monitoring alerts configured (optional)

## Maintenance Tasks

### Daily
- [ ] Check PM2 status
- [ ] Review error logs

### Weekly
- [ ] Verify backups are running
- [ ] Check disk space
- [ ] Review access logs

### Monthly
- [ ] Update system packages
- [ ] Review and rotate logs
- [ ] Test backup restoration
- [ ] Review SSL certificate expiry

---

## Quick Commands Reference

```bash
# Check application status
pm2 status

# View logs
pm2 logs

# Restart applications
pm2 restart all

# Deploy updates
bash deploy.sh

# Manual backup
sudo -u www-data /usr/local/bin/backup-accounting-db

# Check Nginx status
sudo systemctl status nginx

# View Nginx logs
sudo tail -f /var/log/nginx/accounting_error.log
```

## Emergency Contacts

- Server Provider: _______________
- Domain Registrar: _______________
- Database Admin: _______________
- System Admin: _______________

## Notes

_Add any environment-specific notes here_
