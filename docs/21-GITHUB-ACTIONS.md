# GitHub Actions Auto Deploy

Complete guide for setting up auto-deployment using GitHub Actions for Laju applications.

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

Laju provides a GitHub Actions workflow template in the `github-workflow-sample/` folder to simplify auto-deployment setup. With this workflow, every time you push to the `main` branch, the application will automatically deploy to your production server.

**Deployment Flow:**

```
Push to GitHub → GitHub Actions triggered → SSH to server → Pull code → Install deps → Build on server → Migrate → Reload PM2
```

**Benefits of Building on Server:**
- No need to build locally before pushing
- Just push source code, server handles the build
- Consistent environment between build and runtime
- Faster development workflow

---

## Prerequisites

### On Production Server

- **Node.js** installed (via NVM recommended)
- **PM2** installed globally
- **Git** installed
- Repository already cloned to server
- SSH access configured
- **Sufficient RAM** for build (minimum 1GB, recommended 2GB+)

### On GitHub

- Repository already pushed to GitHub
- Access to repository Settings (for Secrets setup)

### On Local (Development)

- No need to build before pushing
- Just push source code to GitHub
- Server will handle the build

---

## Quick Start

### 1. Move Workflow File

Move the `workflows` folder from `github-workflow-sample` to your project root and rename it to `.github`:

```bash
# From project root
mv github-workflow-sample/workflows .github/
```

### 2. Edit Workflow Configuration

Edit `.github/workflows/deploy.yml` and customize these lines:

| Line | Setting | Default | Change To |
|------|---------|---------|-----------|
| 68 | Branch name | `main` | Your branch name |
| 97 | Project path | `/root/laju` | Your server path |
| 100 | Git pull branch | `main` | Your branch name |
| 124 | PM2 process name | `laju` | Your PM2 name |

Example:
```yaml
# Line 68 - Change branch
  push:
    branches:
      - production  # Your branch

# Line 97 - Change project path
          cd /var/www/myapp  # Your path

# Line 100 - Change branch
          git pull origin production  # Your branch

# Line 124 - Change PM2 name
          pm2 reload myapp  # Your PM2 name
```

### 3. Setup GitHub Secrets

Open your GitHub repository:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add the following 3 secrets:

| Secret Name       | Value                                      |
| ----------------- | ------------------------------------------ |
| `SSH_HOST`        | Server IP address or domain                |
| `SSH_USER`        | SSH username (e.g., `root`, `ubuntu`)      |
| `SSH_PRIVATE_KEY` | Complete SSH private key content           |

### 3. Customize Configuration

Edit `.github/workflows/deploy.yml`:

```yaml
# Change project path
cd /root/laju  # → Change to your project path

# Change PM2 process name
pm2 reload laju  # → Change to your PM2 process name
```

### 4. Push and Deploy

```bash
git add .
git commit -m "Add GitHub Actions workflow"
git push origin main
```

The workflow will run automatically. Check progress in the **Actions** tab in your GitHub repository.

> **Note:** You don't need to run `npm run build` locally. Just push source code, the server will handle the build.

---

## Setup GitHub Secrets

### Detailed Steps

1. **Open GitHub Repository**
   
   Go to `https://github.com/username/repository`

2. **Go to Settings**
   
   Click the **Settings** tab at the top of the repository

3. **Navigate to Secrets**
   
   In the left sidebar, click **Secrets and variables** → **Actions**

4. **Add Secrets**

   Click **New repository secret** for each secret:

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
   Secret: [paste entire private key content]
   ```

### SSH Private Key Format

The private key must be pasted completely including header and footer:

```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
... (key lines) ...
QyMDI0MDEwMQAAAAtzc2gtZWQyNTUxOQAAACBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
-----END OPENSSH PRIVATE KEY-----
```

---

## Generate SSH Key

### On Local Machine

```bash
# Generate a new key specifically for GitHub Actions
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions

# This will generate 2 files:
# ~/.ssh/github_actions       (private key - for GitHub Secret)
# ~/.ssh/github_actions.pub   (public key - for server)
```

### Copy Public Key to Server

```bash
# Method 1: Using ssh-copy-id
ssh-copy-id -i ~/.ssh/github_actions.pub user@server-ip

# Method 2: Manual
cat ~/.ssh/github_actions.pub
# Copy output, then on server:
# nano ~/.ssh/authorized_keys
# Paste on a new line
```

### Copy Private Key for GitHub Secret

```bash
cat ~/.ssh/github_actions
# Copy the ENTIRE output (including -----BEGIN and -----END)
# Paste into GitHub Secret SSH_PRIVATE_KEY
```

### Verify Connection

```bash
# Test SSH with the new key
ssh -i ~/.ssh/github_actions user@server-ip

# If successful, you will be logged into the server
```

---

## Server Configuration

### 1. Initial Server Setup

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
cd /root  # or your preferred directory
git clone https://github.com/username/repository.git laju
cd laju

# Install dependencies & first build
npm install
npm run build

# Setup PM2
cd build
pm2 start server.js --name laju
pm2 save
pm2 startup
```

### 2. Git Configuration on Server

```bash
# Set git config (optional but recommended)
git config --global user.email "deploy@server"
git config --global user.name "Deploy Bot"

# Make sure you can pull without password
# (use SSH key or token)
```

### 3. Directory Structure on Server

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

### Change Target Branch

```yaml
on:
  push:
    branches:
      - production  # Change from 'main' to another branch
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

### Add Slack Notification

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

Add `[skip ci]` to your commit message to skip deployment:

```bash
git commit -m "Update README [skip ci]"
```

---

## Troubleshooting

### Error: "Permission denied (publickey)"

**Cause:** SSH key is invalid or not registered on the server.

**Solution:**
```bash
# Verify public key exists on server
cat ~/.ssh/authorized_keys

# Make sure permissions are correct
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

### Error: "npm: command not found"

**Cause:** NVM is not loaded in non-interactive shell.

**Solution:** Make sure the script loads NVM:
```yaml
script: |
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
  npm install
```

### Error: "pm2: command not found"

**Cause:** PM2 is not in PATH.

**Solution:**
```yaml
script: |
  export PATH="$PATH:$(npm bin -g)"
  pm2 reload laju
```

### Error: "Host key verification failed"

**Cause:** Server is not in known_hosts.

**Solution:** Add parameter to workflow:
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

### Deployment Succeeded but Application Error

**Debug Steps:**
```bash
# On server, check PM2 logs
pm2 logs laju --lines 100

# Check status
pm2 status

# Manual restart if needed
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

### Health Check After Deploy

```yaml
    - name: Health Check
      run: |
        sleep 10
        curl -f https://yourdomain.com/health || exit 1
```

### Automatic Rollback

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

1. **Use Dedicated SSH Key**
   - Create a dedicated SSH key for GitHub Actions
   - Don't use personal keys

2. **Limit SSH Key Access**
   - On server, limit commands that can be executed:
   ```bash
   # In ~/.ssh/authorized_keys
   command="/root/deploy.sh",no-port-forwarding,no-X11-forwarding ssh-ed25519 AAAA...
   ```

3. **Rotate Secrets Regularly**
   - Change SSH key every 6-12 months

4. **Use Environment Protection**
   - On GitHub: Settings → Environments → Add protection rules

5. **Audit Logs**
   - Check GitHub Actions logs regularly
   - Monitor SSH access on server (`/var/log/auth.log`)

---

## Next Steps

- [Deployment Guide](20-DEPLOYMENT.md) - Manual deployment guide
- [Best Practices](09-BEST-PRACTICES.md) - Development best practices
- [API Reference](07-API-REFERENCE.md) - API documentation
