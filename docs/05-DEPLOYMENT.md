# Deployment Guide

Deploy Laju applications with **build on server** and **auto-deploy via GitHub Actions**.

## Quick Start - First Time Deploy

First time server setup:

```bash
# 1. SSH to server
ssh root@your-server-ip

# 2. Install Node.js via NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 22

# 3. Install PM2
npm install -g pm2

# 4. Clone repository & build
cd /root
git clone https://github.com/yourusername/your-app.git laju
cd laju
npm install
npm run build

# 5. Setup environment
cp .env.example .env
nano .env  # Edit as needed

# 6. Create data directory & run migrations
mkdir -p data
npx knex migrate:latest --env production

# 7. Start with PM2
pm2 start build/server.js --name laju
pm2 save
pm2 startup
```

**After setup is complete**, enable GitHub Actions for auto-deploy.

---

## Auto Deploy with GitHub Actions

Every push to `main` will automatically deploy to server.

### Setup

1. **Copy workflow file:**
   ```bash
   cp -r github-workflow-sample/workflows .github/
   ```

2. **Setup GitHub Secrets** (Repository → Settings → Secrets → Actions):
   - `SSH_HOST` - Server IP (e.g., `123.45.67.89`)
   - `SSH_USER` - SSH username (e.g., `root`)
   - `SSH_PRIVATE_KEY` - SSH private key (including `-----BEGIN...` and `-----END...`)

3. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```

### Flow Deployment

```
Push code → GitHub Actions → SSH to server → Pull → Install → Build → Migrate → Reload
```

### Generate SSH Key

```bash
# On local machine
ssh-keygen -t ed25519 -C "github-actions-deploy"

# Copy public key to server
ssh-copy-id -i ~/.ssh/id_ed25519.pub root@your-server-ip

# Copy private key for GitHub Secret
cat ~/.ssh/id_ed25519
```

---

## Environment Configuration

The `.env` file is stored in the **root folder** (not in `build/`):

```env
# Database & Server
DB_CONNECTION=production
NODE_ENV=production
PORT=5555

# Application
APP_URL=https://yourdomain.com
TITLE=Your App Name

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_secret
GOOGLE_REDIRECT_URI=https://yourdomain.com/google/callback

# S3/Wasabi Storage
WASABI_ACCESS_KEY=your_access_key
WASABI_SECRET_KEY=your_secret_key
WASABI_BUCKET=your-bucket
WASABI_REGION=ap-southeast-1
WASABI_ENDPOINT=https://s3.ap-southeast-1.wasabisys.com

# Email
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

```bash
chmod 600 .env  # Secure permissions
```

---

## PM2 Commands

```bash
pm2 logs laju        # View logs
pm2 restart laju     # Restart
pm2 reload laju      # Zero-downtime reload
pm2 status           # Status
pm2 monit            # Monitor resources
```

---

## HTTPS with Nginx

### Install & Configure

```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

Create `/etc/nginx/sites-available/laju`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:5555;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/laju /etc/nginx/sites-enabled/
sudo certbot --nginx -d yourdomain.com
sudo nginx -t && sudo systemctl reload nginx
```

---

## Troubleshooting

### Application Won't Start

```bash
pm2 logs laju --lines 50    # Check logs
cat .env                     # Verify env
node --version               # Check Node version
sudo lsof -i :5555           # Check port
```

### Database Errors

```bash
ls -lh data/production.sqlite3                           # Check file
sqlite3 data/production.sqlite3 "PRAGMA journal_mode;"   # Verify WAL
```

### NVM Not Found (GitHub Actions)

Make sure the script loads NVM:
```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

---

## Next Steps

- [GitHub Actions Deploy Details](07-GITHUB-ACTIONS-DEPLOY.md)
- [Backup & Restore](10-BACKUP-RESTORE.md)
- [Best Practices](06-BEST-PRACTICES.md)
