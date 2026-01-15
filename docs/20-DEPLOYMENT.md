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

# 6. Run migrations (data folder already exists with .gitkeep)
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

1. **Move workflow file:**
   ```bash
   mv github-workflow-sample/workflows .github/
   ```

2. **Edit workflow configuration** (`.github/workflows/deploy.yml`):
   - Line 68: Change branch name (default: `main`)
   - Line 97: Change project path (default: `/root/laju`)
   - Line 100: Change branch name in `git pull` command
   - Line 124: Change PM2 process name (default: `laju`)

3. **Setup GitHub Secrets** (Repository → Settings → Secrets → Actions):
   - `SSH_HOST` - Server IP (e.g., `123.45.67.89`)
   - `SSH_USER` - SSH username (e.g., `root`)
   - `SSH_PRIVATE_KEY` - SSH private key (including `-----BEGIN...` and `-----END...`)

4. **Push to GitHub:**
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

## HTTPS with Caddy

Caddy is simpler - it handles automatic HTTPS with Let's Encrypt out of the box.

### Install & Configure

```bash
# Install Caddy
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

Create `/etc/caddy/Caddyfile`:

```caddy
yourdomain.com {
    reverse_proxy localhost:5555
}
```

```bash
# Test configuration
sudo caddy validate --config /etc/caddy/Caddyfile

# Start Caddy
sudo systemctl enable caddy
sudo systemctl start caddy

# Caddy automatically obtains and renews SSL certificates!
```

### Caddy vs Nginx

| Feature | Caddy | Nginx |
|---------|-------|-------|
| HTTPS Setup | Automatic (zero config) | Manual (certbot) |
| SSL Renewal | Automatic | Automatic (certbot) |
| Configuration | Simple | More complex |
| Performance | Good | Excellent |
| Learning Curve | Easy | Moderate |

---

## HTTPS with Cloudflare (Direct Access)

Skip Nginx/Caddy entirely - use Cloudflare as reverse proxy with SSL termination.

### Setup

1. **Point domain to Cloudflare:**
   - Change nameservers to Cloudflare
   - Add A record pointing to your server IP

2. **Enable Cloudflare Proxy:**
   - Set DNS record to **Proxied** (orange cloud)
   - Cloudflare handles SSL termination automatically

3. **Configure Laju for Cloudflare:**

Update `.env`:
```env
# Trust Cloudflare headers
TRUST_PROXY=true
```

Update `server.ts`:
```typescript
const option = {
  max_body_length: 10 * 1024 * 1024,
  key_file_name : "",
  cert_file_name : "",
  trust_proxy: process.env.TRUST_PROXY === 'true',
};
```

4. **Setup Cloudflare DNS & Rules:**

**Step 1: Add DNS Record**
- Go to **DNS** → **Records**
- Click **Add Record**
- Type: `A`
- Name: `@` (or subdomain like `www`)
- IPv4 address: `YOUR_SERVER_IP`
- Proxy status: **Proxied** (orange cloud)
- Click **Save**

**Step 2: Create Origin Rule (to route to port 5555)**
- Go to **Rules** → **Origin Rules**
- Click **Create Rule**
- Rule name: `Route to Laju App Port 5555`
- Field: **Hostname** → Operator: **equals** → Value: `yourdomain.com`
- Then add setting:
  - Setting: **Port** → Value: `5555`
- Click **Deploy**

**Alternative: Use Workers**
If Origin Rules don't work, use Cloudflare Workers:

Create `worker.js`:
```javascript
export default {
  async fetch(request) {
    const url = new URL(request.url);
    url.hostname = 'YOUR_SERVER_IP';
    url.port = '5555';

    const newRequest = new Request(url, {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: 'manual'
    });

    return fetch(newRequest);
  }
};
```

Then route your domain to this Worker in **Workers Routes**.

### Cloudflare vs Nginx/Caddy

| Feature | Cloudflare | Nginx | Caddy |
|---------|-----------|-------|-------|
| HTTPS Setup | Automatic (DNS) | Manual (certbot) | Automatic |
| SSL Termination | Yes | Yes | Yes |
| DDoS Protection | Built-in | No | No |
| CDN | Global | No | No |
| Configuration | Web UI | Config file | Config file |
| Cost | Free tier available | Free | Free |

### Benefits

- **No web server needed** - Cloudflare handles everything
- **Global CDN** - Faster content delivery worldwide
- **DDoS protection** - Included for free
- **Automatic SSL** - No certificate management
- **Web UI** - Easy configuration

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

## Docker Deployment

Laju includes a production-ready `Dockerfile` for containerized deployment.

### Build & Run

```bash
# Build image
docker build -t laju-app .

# Run container with environment file
docker run -d \
  -p 5555:5555 \
  -v $(pwd)/.env:/app/.env \
  -v $(pwd)/data:/app/data \
  --name laju \
  laju-app

# View logs
docker logs -f laju

# Stop container
docker stop laju

# Remove container
docker rm laju
```

### Docker Compose (Optional)

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  laju:
    build: .
    ports:
      - "5555:5555"
    volumes:
      - ./.env:/app/.env
      - ./data:/app/data
    restart: unless-stopped
```

```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# View logs
docker-compose logs -f
```

### What the Dockerfile Does

1. Uses `node:22-slim` base image
2. Installs build dependencies
3. Runs `npm ci` for deterministic installs
4. Builds application with `npm run build`
5. Runs migrations on container start
6. Starts app with PM2

---

## Next Steps

- [GitHub Actions Deploy Details](21-GITHUB-ACTIONS.md)
- [Backup & Restore](12-BACKUP-RESTORE.md)
- [Best Practices](09-BEST-PRACTICES.md)
