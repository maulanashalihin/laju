# Deployment Guide

Complete guide for deploying Laju applications to production.

## Table of Contents

1. [Quick Start - First Time Deploy](#quick-start---first-time-deploy)
2. [Prerequisites](#prerequisites)
3. [Build Process](#build-process)
4. [Server Setup](#server-setup)
5. [Environment Configuration](#environment-configuration)
6. [Database Setup](#database-setup)
7. [PM2 Process Management](#pm2-process-management)
8. [HTTPS/SSL Setup](#httpsssl-setup)
9. [Performance Optimization](#performance-optimization)
10. [Monitoring & Logging](#monitoring--logging)
11. [Backup Strategy](#backup-strategy)
12. [CI/CD dengan GitHub Actions](#cicd-dengan-github-actions-recommended)

---

## Quick Start - First Time Deploy

Untuk deployment pertama kali, ikuti langkah-langkah berikut di server:

```bash
# 1. SSH ke server
ssh root@your-server-ip

# 2. Install Node.js via NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 22

# 3. Install PM2
npm install -g pm2

# 4. Clone repository
cd /root
git clone https://github.com/yourusername/your-app.git laju
cd laju

# 5. Install dependencies & build
npm install
npm run build

# 6. Setup environment (.env di root, bukan di build/)
cp .env.example .env
nano .env  # Edit sesuai kebutuhan

# 7. Run migrations & start PM2 (dari folder build/)
npx knex migrate:latest --env production

# 8. Start dengan PM2
pm2 start build/server.js --name laju
pm2 save
pm2 startup
```

**Setelah setup pertama selesai**, Anda bisa setup [GitHub Actions](#cicd-dengan-github-actions-recommended) untuk auto-deploy. Setiap push ke `main` akan otomatis deploy tanpa perlu SSH manual.

---

## Prerequisites

### System Requirements

- **Node.js:** Version 20 or 22 (LTS recommended)
- **Operating System:** Linux (Ubuntu 20.04+ recommended)
- **Memory:** Minimum 1GB RAM (2GB+ recommended)
- **Storage:** 10GB+ available disk space
- **Network:** Public IP or domain name

### Required Tools

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 22 (using nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 22
nvm use 22
node --version  # Should show v22.x.x

# Install PM2 globally
npm install -g pm2

# Install build tools
sudo apt install -y build-essential
```

---

## Build Process

### 1. Local Build

Build your application locally before deploying:

```bash
# Clean previous builds
rm -rf dist build

# Install dependencies
npm install

# Run production build
npm run build
```

**Build Output:**

```
build/
├── app/              # Compiled backend
├── dist/             # Frontend assets
├── migrations/       # Database migrations
├── public/           # Static files
├── server.js         # Entry point
└── package.json      # Production dependencies
```

### 2. Build Script Breakdown

```json
{
  "scripts": {
    "build": "mkdir dist && mkdir dist/views && cp -rf resources/views/* dist/views && vite build && tsc && tsc-alias -p tsconfig.json && cp -rf dist build && cp -rf public build && cp -rf resources/views/partials build/dist/views"
  }
}
```

**Steps:**
1. Create `dist/views` directory
2. Copy view templates
3. Build frontend with Vite
4. Compile TypeScript to JavaScript
5. Resolve TypeScript path aliases
6. Copy frontend assets to build
7. Copy public files to build
8. Copy view partials to build

---

## Server Setup

### 1. Create Deployment User (Optional)

```bash
# Create dedicated user for the app
sudo adduser laju
sudo usermod -aG sudo laju

# Switch to deployment user
su - laju
```

> **Note:** Anda juga bisa menggunakan user `root` langsung untuk setup yang lebih sederhana.

### 2. Clone Repository & Build di Server (Recommended)

Dengan pendekatan baru, Anda **tidak perlu build di local**. Clone repository dan build langsung di server:

```bash
# SSH ke server
ssh root@your-server-ip

# Clone repository
cd /root  # atau direktori pilihan Anda
git clone https://github.com/yourusername/your-app.git laju
cd laju

# Install dependencies
npm install

# Build aplikasi
npm run build

# Pindah ke folder build
cd build

# Install production dependencies
npm install 
```

**Struktur setelah build:**

```
/root/laju/              # Source code (git repository)
├── app/
├── resources/
├── node_modules/
├── build/               # Production build
│   ├── server.js
│   ├── dist/
│   ├── public/
│   └── node_modules/
└── ...
```

### 3. Alternative: Upload Build dari Local

Jika Anda prefer build di local, gunakan salah satu metode berikut:

**Option A: Using SCP**

```bash
# Build di local dulu
npm run build

# Upload ke server
scp -r build/ root@your-server:/root/laju/
```

**Option B: Using rsync**

```bash
# Build di local dulu
npm run build

# Sync ke server
rsync -avz --exclude 'node_modules' \
  build/ root@your-server:/root/laju/build/
```

### 4. Install Production Dependencies

```bash
# Di server, masuk ke folder build
cd /root/laju/build
npm install --production
```

---

## Environment Configuration

### 1. Create Production .env

File `.env` disimpan di **root folder** (bukan di `build/`):

```bash
cd /root/laju
nano .env
```

### 2. Production Environment Variables

```env
# Database
DB_CONNECTION=production
NODE_ENV=production

# Server
PORT=5555
VITE_PORT=5173
HAS_CERTIFICATE=false

# Logging
LOG_LEVEL=info

# Application
APP_URL=https://yourdomain.com
TITLE=Your App Name

# Google OAuth (if using)
GOOGLE_CLIENT_ID=your_production_client_id
GOOGLE_CLIENT_SECRET=your_production_secret
GOOGLE_REDIRECT_URI=https://yourdomain.com/google/callback

# S3/Wasabi Storage
WASABI_ACCESS_KEY=your_access_key
WASABI_SECRET_KEY=your_secret_key
WASABI_BUCKET=your-production-bucket
WASABI_REGION=ap-southeast-1
WASABI_ENDPOINT=https://s3.ap-southeast-1.wasabisys.com
CDN_URL=https://cdn.yourdomain.com

# Backup
BACKUP_ENCRYPTION_KEY=your_32_byte_encryption_key
BACKUP_SSE=true
BACKUP_RETENTION_DAYS=30

# Email (choose one)
# Option 1: Nodemailer (Gmail)
USER_MAILER=your.email@gmail.com
PASS_MAILER=your_app_password
MAIL_FROM_NAME=Your App
MAIL_FROM_ADDRESS=noreply@yourdomain.com

# Option 2: Resend
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Redis (optional)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
```

### 3. Secure Environment File

```bash
# Set proper permissions
chmod 600 .env
```

---

## Database Setup

### 1. Create Data Directory

```bash
cd /root/laju/build
mkdir -p data
```

### 2. Run Migrations

```bash
# Run all migrations
npx knex migrate:latest --env production

# Verify database
ls -lh data/
# Should show: production.sqlite3
```

### 3. Database Permissions

```bash
# Set proper permissions
chmod 644 data/production.sqlite3
```

### 4. Verify WAL Mode

```bash
sqlite3 data/production.sqlite3 "PRAGMA journal_mode;"
# Should return: wal
```

---

## PM2 Process Management

### 1. Start Application

```bash
cd /root/laju

# Start with PM2
pm2 start build/server.js --name laju

# View logs
pm2 logs your-app

# Check status
pm2 status
```

### 2. PM2 Configuration File

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'your-app',
    script: './build/server.js',
    instances: 'max',  // Use all CPU cores
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5555
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '1G',
    watch: false,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
```

Start with config:

```bash
pm2 start ecosystem.config.js
```

### 3. PM2 Commands

```bash
# Start application
pm2 start your-app

# Stop application
pm2 stop your-app

# Restart application
pm2 restart your-app

# Reload (zero-downtime)
pm2 reload your-app

# Delete from PM2
pm2 delete your-app

# View logs
pm2 logs your-app
pm2 logs your-app --lines 100

# Monitor resources
pm2 monit

# List all apps
pm2 list

# Save PM2 configuration
pm2 save

# Setup startup script
pm2 startup
# Follow the instructions to enable PM2 on system boot
```

### 4. Log Rotation

```bash
# Install PM2 log rotate
pm2 install pm2-logrotate

# Configure log rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true
```

---

## HTTPS/SSL Setup

### Option 1: Using Nginx as Reverse Proxy (Recommended)

#### 1. Install Nginx

```bash
sudo apt install -y nginx
```

#### 2. Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/your-app
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    # SSL certificates (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Proxy to Node.js app
    location / {
        proxy_pass http://localhost:5555;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Static files caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:5555;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml+rss;
}
```

#### 3. Enable Site

```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/your-app /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

#### 4. Install SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

### Option 2: Direct HTTPS in Node.js

#### 1. Generate SSL Certificate

```bash
# Using mkcert for local development
brew install mkcert  # macOS
mkcert -install
mkcert localhost 127.0.0.1 ::1

# For production, use Let's Encrypt
```

#### 2. Update server.ts

```typescript
const option = {
  max_body_length: 10 * 1024 * 1024,
  key_file_name: path.join(process.cwd(), 'localhost+1-key.pem'),
  cert_file_name: path.join(process.cwd(), 'localhost+1.pem'),
};
```

#### 3. Set Environment Variable

```env
HAS_CERTIFICATE=true
```

---

## Performance Optimization

### 1. Database Optimization

```bash
# Verify WAL mode
sqlite3 data/production.sqlite3 "PRAGMA journal_mode;"

# Optimize database
sqlite3 data/production.sqlite3 "VACUUM;"
sqlite3 data/production.sqlite3 "ANALYZE;"

# Check database size
du -h data/production.sqlite3
```

### 2. Node.js Optimization

```bash
# Use production mode
export NODE_ENV=production

# Increase memory limit if needed
node --max-old-space-size=2048 server.js
```

### 3. PM2 Cluster Mode

```javascript
// ecosystem.config.js
{
  instances: 'max',      // Use all CPU cores
  exec_mode: 'cluster'   // Enable cluster mode
}
```

### 4. Enable Compression

Already configured in Nginx (gzip). For direct Node.js:

```typescript
// Add to server.ts
import compression from 'compression';
webserver.use(compression());
```

### 5. Static File Caching

Nginx configuration already includes:

```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

---

## Monitoring & Logging

### 1. PM2 Monitoring

```bash
# Real-time monitoring
pm2 monit

# Web dashboard
pm2 install pm2-server-monit
```

### 2. Application Logs

```bash
# View logs
pm2 logs your-app

# Save logs to file
pm2 logs your-app > /var/log/your-app.log

# Clear logs
pm2 flush
```

### 3. System Monitoring

```bash
# Install monitoring tools
sudo apt install -y htop iotop

# Monitor resources
htop
iotop
```

### 4. Nginx Logs

```bash
# Access logs
tail -f /var/log/nginx/access.log

# Error logs
tail -f /var/log/nginx/error.log
```

---

## Backup Strategy

### 1. Database Backup

```bash
# Manual backup
sqlite3 data/production.sqlite3 ".backup data/backup-$(date +%Y%m%d).sqlite3"

# Automated backup script
node backup.js
```

### 2. Automated Backups with Cron

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * cd /home/laju/app/build && node backup.js >> /var/log/backup.log 2>&1

# Weekly cleanup at 3 AM on Sunday
0 3 * * 0 cd /home/laju/app/build && node clean-backup.js >> /var/log/cleanup.log 2>&1
```

### 3. Backup to S3

The built-in `backup.js` script:
- Creates SQLite backup
- Compresses with Gzip
- Encrypts with AES-256-GCM
- Uploads to Wasabi/S3
- Stores metadata in database

### 4. Restore from Backup

```bash
# List available backups
node restore.js --list

# Restore latest backup
node restore.js

# Restore specific backup
node restore.js --key backups/2024-01-10T23:33-uuid.db.gz.enc
```

---

## Deployment Checklist

### Pre-Deployment

- [ ] Run tests locally (`npm test`)
- [ ] Build application (`npm run build`)
- [ ] Review environment variables
- [ ] Update database migrations
- [ ] Test build locally
- [ ] Backup current production database

### Deployment

- [ ] Upload build files to server
- [ ] Install production dependencies
- [ ] Configure environment variables
- [ ] Run database migrations
- [ ] Start application with PM2
- [ ] Verify application is running
- [ ] Test all critical features

### Post-Deployment

- [ ] Monitor logs for errors
- [ ] Check application performance
- [ ] Verify SSL certificate
- [ ] Test backup system
- [ ] Update documentation
- [ ] Notify team of deployment

---

## Troubleshooting

### Application Won't Start

```bash
# Check PM2 logs
pm2 logs your-app --lines 50

# Check environment variables
cat .env

# Verify Node.js version
node --version

# Check port availability
sudo lsof -i :5555
```

### Database Errors

```bash
# Check database file
ls -lh data/production.sqlite3

# Verify WAL mode
sqlite3 data/production.sqlite3 "PRAGMA journal_mode;"

# Check permissions
ls -l data/
```

### High Memory Usage

```bash
# Check memory usage
pm2 monit

# Restart application
pm2 restart your-app

# Increase memory limit
pm2 delete your-app
pm2 start server.js --name your-app --max-memory-restart 2G
```

### SSL Certificate Issues

```bash
# Test SSL
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Check Nginx configuration
sudo nginx -t
```

---

---

## CI/CD dengan GitHub Actions (Recommended)

Laju menyediakan template GitHub Actions untuk auto-deployment. Setiap push ke branch `main` akan otomatis deploy ke server produksi.

**Keuntungan:**
- **Tidak perlu build di local** - cukup push source code
- Server yang melakukan build, install, dan deploy
- Konsisten environment antara build dan runtime
- Workflow development lebih cepat

### Quick Setup

1. Copy workflow file:
   ```bash
   cp -r github-workflow-sample/workflows .github/
   ```

2. Setup GitHub Secrets:
   - `SSH_HOST` - IP server
   - `SSH_USER` - Username SSH
   - `SSH_PRIVATE_KEY` - Private key SSH

3. Push ke GitHub - deployment otomatis berjalan!

```bash
git add .
git commit -m "Update feature"
git push origin main
# Server otomatis: pull → install → build → migrate → reload
```

**Panduan lengkap:** [GitHub Actions Auto Deploy](07-GITHUB-ACTIONS-DEPLOY.md)

---

## Next Steps

- [GitHub Actions Auto Deploy](07-GITHUB-ACTIONS-DEPLOY.md) - Setup CI/CD
- [Best Practices](06-BEST-PRACTICES.md)
- [API Reference](04-API-REFERENCE.md)
