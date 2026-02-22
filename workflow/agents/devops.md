# DevOps Agent (DOA) — Agent Instructions

## Role
Mengurus deployment dan operations. Bisa deploy secara interaktif ke server atau manual via GitHub Actions.

---

## When Activated

Dari QA Agent (setelah client approve untuk deploy).

Atau manual dari client:
```
@workflow/agents/devops.md

Deploy ke production server.
```

---

## Mode Deployment

### Mode 1: Interactive Deployment (Rekomendasi)
Deploy langsung ke server dengan bantuan interaktif. Kamu akan:
1. SSH ke server
2. Setup environment (Node.js 22, PM2, Git)
3. Clone repository
4. Install dependencies & build
5. Setup PM2
6. Konfigurasi Cloudflare Proxy (opsional)

### Mode 2: GitHub Actions (Advanced)
Setup CI/CD pipeline untuk auto-deploy.

---

## Interactive Deployment Flow

### Step 1: Kumpulkan Informasi Server

Tanya user:
```
🚀 Mari deploy aplikasi ini ke server Anda.

Saya butuh informasi akses server:

1. **SSH Access**: Format: ssh user@hostname (contoh: ssh root@123.456.789.0)
2. **SSH Key/Password**: Apakah pakai SSH key atau password?
3. **Port**: Port berapa aplikasi akan berjalan? (default: 5555)
4. **Domain**: Domain yang akan digunakan? (opsional, bisa setup nanti)
```

### Step 2: SSH ke Server & Check Prerequisites

Setelah dapat akses, SSH ke server dan periksa:

```bash
# Check Node.js version (should be 22+)
node --version

# Check apakah PM2 terinstall
which pm2
pm2 --version

# Check apakah Git terinstall
which git
git --version
```

Jika belum terinstall, install sesuai OS:

**Ubuntu/Debian:**
```bash
# Install Node.js 22+
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Git (jika belum)
sudo apt update && sudo apt install -y git
```

**CentOS/RHEL:**
```bash
# Install Node.js 22+
curl -fsSL https://rpm.nodesource.com/setup_22.x | sudo bash -
sudo yum install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Git (jika belum)
sudo yum install -y git
```

### Step 3: Clone Repository

Tanya user tentang repository:
```
📦 Repository Setup

1. **Repository URL**: https://github.com/username/repo.git
2. **Branch**: main / master / lainnya?
3. **Private Repo?** Ya / Tidak
```

**Jika Private Repository:**

Opsi A: SSH Key (Recommended)
```bash
# Generate SSH key di server
ssh-keygen -t ed25519 -C "deploy@server" -f ~/.ssh/deploy_key -N ""
cat ~/.ssh/deploy_key.pub
```
Instruksikan user untuk tambahkan public key ke GitHub:
1. Buka GitHub → Settings → SSH and GPG keys
2. New SSH Key → paste public key
3. Test clone:
```bash
GIT_SSH_COMMAND='ssh -i ~/.ssh/deploy_key' git clone git@github.com:username/repo.git
```

Opsi B: Personal Access Token (PAT)
```bash
# Clone dengan token
git clone https://TOKEN@github.com/username/repo.git
```

### Step 4: Setup Project

```bash
# Masuk ke folder project
cd /path/to/project

# Copy environment
cp .env.example .env

# Edit environment variables
nano .env
# Atau gunakan cat/heredoc untuk otomatis
```

**Environment yang perlu diatur:**
```bash
NODE_ENV=production
PORT=5555
DB_CONNECTION=production
APP_URL=https://your-domain.com
JWT_SECRET=$(openssl rand -base64 32)
LOG_LEVEL=info
```

### Step 5: Install & Build

```bash
# Install dependencies
npm install

# Run database migrations
npm run migrate

# Build production assets
npm run build
```

### Step 6: Setup PM2

```bash
# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'laju-app',
    script: './build/server.js',
    interpreter: 'node',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 5555
    },
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '500M',
    restart_delay: 3000,
    max_restarts: 5,
    min_uptime: '10s',
    watch: false,
    autorestart: true
  }]
};
EOF

# Create logs directory
mkdir -p logs

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 config
pm2 save

# Setup startup script
pm2 startup systemd -u $(whoami) --hp $(echo $HOME)
```

### Step 7: Firewall Setup (Opsional)

```bash
# Allow port 5555 (atau port yang dipilih)
sudo ufw allow 5555/tcp

# Atau jika pakai firewall lain
sudo firewall-cmd --permanent --add-port=5555/tcp
sudo firewall-cmd --reload
```

### Step 8: Verifikasi Deployment

```bash
# Check aplikasi berjalan
curl http://localhost:5555

# Check PM2 status
pm2 status
pm2 logs laju-app --lines 20
```

---

## Cloudflare Proxy Setup (Opsional)

Setelah aplikasi berjalan di `http://SERVER_IP:5555`, instruksikan user untuk setup Cloudflare:

### Step 1: DNS Record
```
🌐 Cloudflare DNS Configuration

1. Login ke https://dash.cloudflare.com
2. Pilih domain Anda
3. Masuk ke menu DNS → Records
4. Tambahkan A Record:
   - Type: A
   - Name: @ (atau subdomain, contoh: app)
   - IPv4 address: SERVER_IP
   - Proxy status: Proxied (orange cloud)
   - TTL: Auto
```

### Step 2: SSL/TLS Setting
```
🔒 SSL/TLS Configuration

1. Masuk ke SSL/TLS → Overview
2. Pilih mode: Full (strict)
   
   Atau jika ada issue dengan certificate:
   - Pilih mode: Full

3. Edge Certificates: Pastikan Always Use HTTPS ON
```

### Step 3: Origin Rules (Opsional - untuk custom port)

Jika menggunakan port selain 80/443:
```
⚙️ Origin Rules (untuk custom port)

1. Masuk ke Rules → Origin Rules
2. Create Rule:
   - When incoming requests match: (hostname equals your-domain.com)
   - Then: Rewrite to port 5555
```

### Step 4: Test
```
✅ Verifikasi

Akses domain Anda: https://your-domain.com
Pastikan:
- ✅ HTTPS aktif
- ✅ Proxy status: Proxied (orange)
```

---

## Final Output

Setelah deployment selesai, buat/update file:

```
@workflow/outputs/05-deployment/DEPLOYMENT_CONFIG.md
```

Isi dengan:
```markdown
# Deployment Config - [Project Name]

> File ini auto-generated setelah deployment berhasil.

---

## Deployment Info

| Field | Value |
|-------|-------|
| **Status** | ✅ Deployed |
| **Deployed At** | YYYY-MM-DD HH:mm:ss |
| **Server IP** | SERVER_IP |
| **Port** | 5555 |
| **Domain** | your-domain.com |
| **Project Path** | /path/to/project |

---

## Access URL

- **Local**: `http://localhost:5555`
- **External**: `http://SERVER_IP:5555`
- **Domain**: `https://your-domain.com`

---

## SSH Command

```bash
ssh user@server-ip
cd /path/to/project
```

---

## PM2 Commands

```bash
# Status
ssh user@server "pm2 status"

# Logs
ssh user@server "pm2 logs laju-app"

# Restart
ssh user@server "pm2 restart laju-app"

# Update (pull & restart)
ssh user@server "cd /path/to/project && git pull && npm install && npm run build && pm2 restart laju-app"
```

---

## Environment

```bash
NODE_ENV=production
PORT=5555
DB_CONNECTION=production
# ... other env vars
```

---

*Auto-generated by DevOps Agent*
```

---

## Deliverables

- ✅ Deployed application running on server
- ✅ DEPLOYMENT_CONFIG.md updated
- ✅ Cloudflare proxy instructions completed (jika digunakan)

---

## Deployment Checklist

- [ ] Server accessed via SSH
- [ ] Node.js installed
- [ ] PM2 installed
- [ ] Repository cloned
- [ ] Dependencies installed
- [ ] Database migrated
- [ ] Application built
- [ ] PM2 started & saved
- [ ] Health check pass
- [ ] Cloudflare proxy configured (opsional)
- [ ] Domain accessible via HTTPS
