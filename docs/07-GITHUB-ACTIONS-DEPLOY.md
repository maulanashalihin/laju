# GitHub Actions Auto Deploy

Panduan lengkap untuk setup auto-deployment menggunakan GitHub Actions pada aplikasi Laju.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Quick Start](#quick-start)
4. [Setup GitHub Secrets](#setup-github-secrets)
5. [Generate SSH Key](#generate-ssh-key)
6. [Server Configuration](#server-configuration)
7. [Customization](#customization)
8. [Troubleshooting](#troubleshooting)
9. [Advanced Configuration](#advanced-configuration)

---

## Overview

Laju menyediakan template GitHub Actions workflow di folder `github-workflow-sample/` untuk memudahkan setup auto-deployment. Dengan workflow ini, setiap kali Anda push ke branch `main`, aplikasi akan otomatis di-deploy ke server produksi.

**Alur Deployment:**

```
Push ke GitHub → GitHub Actions triggered → SSH ke server → Pull code → Install deps → Build di server → Migrate → Reload PM2
```

**Keuntungan Build di Server:**
- Tidak perlu build di local sebelum push
- Cukup push source code, server yang build
- Konsisten environment antara build dan runtime
- Lebih cepat untuk development workflow

---

## Prerequisites

### Di Server Produksi

- **Node.js** terinstall (via NVM recommended)
- **PM2** terinstall global
- **Git** terinstall
- Repository sudah di-clone ke server
- SSH access sudah dikonfigurasi
- **Cukup RAM** untuk build (minimal 1GB, recommended 2GB+)

### Di GitHub

- Repository sudah di-push ke GitHub
- Akses ke Settings repository (untuk setup Secrets)

### Di Local (Development)

- Tidak perlu build sebelum push
- Cukup push source code ke GitHub
- Server yang akan melakukan build

---

## Quick Start

### 1. Copy Workflow File

Copy folder `workflows` dari `github-workflow-sample` ke root project dan rename menjadi `.github`:

```bash
# Dari root project
cp -r github-workflow-sample/workflows .github/
```

Struktur akhir:

```
your-project/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── app/
├── resources/
└── ...
```

### 2. Setup GitHub Secrets

Buka repository GitHub Anda:

1. Pergi ke **Settings** → **Secrets and variables** → **Actions**
2. Klik **New repository secret**
3. Tambahkan 3 secrets berikut:

| Secret Name       | Value                                      |
| ----------------- | ------------------------------------------ |
| `SSH_HOST`        | IP address atau domain server              |
| `SSH_USER`        | Username SSH (contoh: `root`, `ubuntu`)    |
| `SSH_PRIVATE_KEY` | Isi lengkap private key SSH                |

### 3. Sesuaikan Konfigurasi

Edit `.github/workflows/deploy.yml`:

```yaml
# Ganti path project
cd /root/laju  # → Ganti dengan path project Anda

# Ganti nama PM2 process
pm2 reload laju  # → Ganti dengan nama PM2 process Anda
```

### 4. Push dan Deploy

```bash
git add .
git commit -m "Add GitHub Actions workflow"
git push origin main
```

Workflow akan otomatis berjalan. Cek progress di tab **Actions** di repository GitHub.

> **Note:** Anda tidak perlu menjalankan `npm run build` di local. Cukup push source code, server yang akan melakukan build.

---

## Setup GitHub Secrets

### Langkah Detail

1. **Buka Repository GitHub**
   
   Pergi ke `https://github.com/username/repository`

2. **Masuk ke Settings**
   
   Klik tab **Settings** di bagian atas repository

3. **Navigasi ke Secrets**
   
   Di sidebar kiri, klik **Secrets and variables** → **Actions**

4. **Tambahkan Secrets**

   Klik **New repository secret** untuk setiap secret:

   **SSH_HOST:**
   ```
   Name: SSH_HOST
   Secret: 123.45.67.89
   ```
   
   **SSH_USER:**
   ```
   Name: SSH_USER
   Secret: root
   ```
   
   **SSH_PRIVATE_KEY:**
   ```
   Name: SSH_PRIVATE_KEY
   Secret: [paste seluruh isi private key]
   ```

### Format SSH Private Key

Private key harus di-paste lengkap termasuk header dan footer:

```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
... (baris-baris key) ...
QyMDI0MDEwMQAAAAtzc2gtZWQyNTUxOQAAACBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
-----END OPENSSH PRIVATE KEY-----
```

---

## Generate SSH Key

### Di Local Machine

```bash
# Generate key baru khusus untuk GitHub Actions
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions

# Akan menghasilkan 2 file:
# ~/.ssh/github_actions       (private key - untuk GitHub Secret)
# ~/.ssh/github_actions.pub   (public key - untuk server)
```

### Copy Public Key ke Server

```bash
# Metode 1: Menggunakan ssh-copy-id
ssh-copy-id -i ~/.ssh/github_actions.pub user@server-ip

# Metode 2: Manual
cat ~/.ssh/github_actions.pub
# Copy output, lalu di server:
# nano ~/.ssh/authorized_keys
# Paste di baris baru
```

### Copy Private Key untuk GitHub Secret

```bash
cat ~/.ssh/github_actions
# Copy SELURUH output (termasuk -----BEGIN dan -----END)
# Paste ke GitHub Secret SSH_PRIVATE_KEY
```

### Verifikasi Koneksi

```bash
# Test SSH dengan key baru
ssh -i ~/.ssh/github_actions user@server-ip

# Jika berhasil, Anda akan masuk ke server
```

---

## Server Configuration

### 1. Setup Awal Server

```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# Install Node.js
nvm install 22
nvm use 22

# Install PM2
npm install -g pm2

# Clone repository
cd /root  # atau direktori pilihan Anda
git clone https://github.com/username/repository.git laju
cd laju

# Install dependencies & build pertama kali
npm install
npm run build

# Setup PM2
cd build
pm2 start server.js --name laju
pm2 save
pm2 startup
```

### 2. Konfigurasi Git di Server

```bash
# Set git config (opsional tapi recommended)
git config --global user.email "deploy@server"
git config --global user.name "Deploy Bot"

# Pastikan bisa pull tanpa password
# (gunakan SSH key atau token)
```

### 3. Struktur Direktori di Server

```
/root/laju/           # Source code (git repository)
├── app/
├── resources/
├── build/            # Production build
│   ├── server.js
│   ├── .env
│   └── data/
└── ...
```

---

## Customization

### Ganti Branch Target

```yaml
on:
  push:
    branches:
      - production  # Ganti dari 'main' ke branch lain
```

### Multiple Environments

```yaml
name: Deploy to Staging

on:
  push:
    branches:
      - develop

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Deploy to Staging
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.STAGING_SSH_HOST }}
        username: ${{ secrets.STAGING_SSH_USER }}
        key: ${{ secrets.STAGING_SSH_PRIVATE_KEY }}
        script: |
          cd /root/laju-staging
          git pull origin develop
          # ... rest of commands
```

### Tambah Notifikasi Slack

```yaml
    - name: Notify Slack
      if: always()
      uses: 8398a7/action-slack@v3
      with:
        status: ${{ job.status }}
        fields: repo,message,commit,author
      env:
        SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

### Skip Deployment

Tambahkan `[skip ci]` di commit message untuk skip deployment:

```bash
git commit -m "Update README [skip ci]"
```

---

## Troubleshooting

### Error: "Permission denied (publickey)"

**Penyebab:** SSH key tidak valid atau tidak terdaftar di server.

**Solusi:**
```bash
# Verifikasi public key sudah ada di server
cat ~/.ssh/authorized_keys

# Pastikan permission benar
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

### Error: "npm: command not found"

**Penyebab:** NVM tidak ter-load di non-interactive shell.

**Solusi:** Pastikan script memuat NVM:
```yaml
script: |
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
  npm install
```

### Error: "pm2: command not found"

**Penyebab:** PM2 tidak ada di PATH.

**Solusi:**
```yaml
script: |
  export PATH="$PATH:$(npm bin -g)"
  pm2 reload laju
```

### Error: "Host key verification failed"

**Penyebab:** Server belum ada di known_hosts.

**Solusi:** Tambahkan parameter di workflow:
```yaml
- name: SSH and deploy
  uses: appleboy/ssh-action@master
  with:
    host: ${{ secrets.SSH_HOST }}
    username: ${{ secrets.SSH_USER }}
    key: ${{ secrets.SSH_PRIVATE_KEY }}
    script_stop: true
    script: |
      # commands
```

### Deployment Berhasil tapi Aplikasi Error

**Langkah Debug:**
```bash
# Di server, cek logs PM2
pm2 logs laju --lines 100

# Cek status
pm2 status

# Restart manual jika perlu
pm2 restart laju
```

---

## Advanced Configuration

### Caching Dependencies

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Cache node modules
      uses: actions/cache@v3
      with:
        path: ~/.npm
        key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
        restore-keys: |
          ${{ runner.os }}-node-
```

### Health Check Setelah Deploy

```yaml
    - name: Health Check
      run: |
        sleep 10
        curl -f https://yourdomain.com/health || exit 1
```

### Rollback Otomatis

```yaml
    - name: Deploy with Rollback
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.SSH_HOST }}
        username: ${{ secrets.SSH_USER }}
        key: ${{ secrets.SSH_PRIVATE_KEY }}
        script: |
          cd /root/laju
          
          # Backup current version
          cp -r build build_backup_$(date +%Y%m%d_%H%M%S)
          
          # Deploy
          git pull origin main
          npm install
          npm run build
          
          cd build
          npx knex migrate:latest --env production
          pm2 reload laju
          
          # Health check
          sleep 5
          if ! curl -f http://localhost:5555/health; then
            echo "Health check failed, rolling back..."
            pm2 stop laju
            rm -rf build
            mv build_backup_* build
            pm2 start laju
            exit 1
          fi
          
          # Cleanup old backups (keep last 3)
          ls -dt build_backup_* | tail -n +4 | xargs rm -rf
```

### Matrix Deployment (Multiple Servers)

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        server: [server1, server2, server3]
    steps:
    - name: Deploy to ${{ matrix.server }}
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets[format('{0}_SSH_HOST', matrix.server)] }}
        username: ${{ secrets[format('{0}_SSH_USER', matrix.server)] }}
        key: ${{ secrets[format('{0}_SSH_KEY', matrix.server)] }}
        script: |
          # deployment commands
```

---

## Security Best Practices

1. **Gunakan SSH Key Dedicated**
   - Buat SSH key khusus untuk GitHub Actions
   - Jangan gunakan key personal

2. **Batasi Akses SSH Key**
   - Di server, batasi command yang bisa dijalankan:
   ```bash
   # Di ~/.ssh/authorized_keys
   command="/root/deploy.sh",no-port-forwarding,no-X11-forwarding ssh-ed25519 AAAA...
   ```

3. **Rotate Secrets Secara Berkala**
   - Ganti SSH key setiap 6-12 bulan

4. **Gunakan Environment Protection**
   - Di GitHub: Settings → Environments → Add protection rules

5. **Audit Logs**
   - Cek GitHub Actions logs secara berkala
   - Monitor akses SSH di server (`/var/log/auth.log`)

---

## Next Steps

- [Deployment Guide](05-DEPLOYMENT.md) - Panduan deployment manual
- [Best Practices](06-BEST-PRACTICES.md) - Best practices development
- [API Reference](04-API-REFERENCE.md) - Dokumentasi API
