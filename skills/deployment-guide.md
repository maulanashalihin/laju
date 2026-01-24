# Deployment Guide - Production Deployment Reference

## Purpose

This guide provides comprehensive reference for deploying applications to production. It serves as documentation for deployment workflow, monitoring, troubleshooting, and rollback procedures.

**Note:** Deployment runs automatically via GitHub Actions CI when you merge to main branch. This guide is for reference when monitoring or troubleshooting deployment.

---

## Deployment Workflow

### Step 1: Pre-Deployment Checklist (Simplified)

Most checks are now automated via GitHub Actions. Verify:

**Code Quality:**
- [ ] All features in PROGRESS.md marked as completed
- [ ] No debug code or console.log statements left

**Documentation:**
- [ ] README.md is up to date
- [ ] PROGRESS.md reflects current state

**Git Status:**
- [ ] All changes committed
- [ ] Commit messages are clear (use semantic commits)
- [ ] No uncommitted changes

**Note:** Tests, build, and most checks are automated via GitHub Actions CI.

### Step 2: Merge to Main

```bash
# 1. Switch to main branch
git checkout main
git pull origin main

# 2. Merge feature branch
git merge feature/your-feature

# 3. Push to main (triggers automated deployment)
git push origin main
```

**What happens next:**
1. GitHub Actions runs automated tests (unit, integration, E2E)
2. If tests pass → Deployment proceeds
3. If tests fail → Deployment blocked, fix required
4. Deployment to production server
5. Automated smoke tests run
6. If smoke tests pass → Deployment successful
7. If smoke tests fail → Auto-rollback

### Step 3: Monitor Deployment

**Check GitHub Actions:**
1. Go to repository on GitHub
2. Click "Actions" tab
3. Select the latest workflow run
4. Monitor the deployment progress

**Expected workflow steps:**
1. ✅ Test job runs (unit, integration, E2E tests)
2. ✅ Build application
3. ✅ Checkout code
4. ✅ Setup Node.js
5. ✅ Install dependencies
6. ✅ SSH to server
7. ✅ Pull latest changes
8. ✅ Install dependencies on server
9. ✅ Build on server
10. ✅ Run migrations
11. ✅ Reload PM2
12. ✅ Run smoke tests (health check, login page)
13. ✅ Notify success/failure

**If deployment fails:**
- Check error logs in GitHub Actions
- GitHub Actions auto-rollbacks if smoke tests fail
- SSH to server to investigate (if needed)
- Check PM2 logs: `pm2 logs laju`
- Fix the issue
- Push again

### Step 4: Post-Deployment Verification

After deployment completes, verify:

**Application Status:**
```bash
# SSH to server
ssh root@your-server-ip

# Check PM2 status
pm2 status

# Check recent logs
pm2 logs laju --lines 50

# Check application is running
curl http://localhost:5555
```

**Functionality Tests (Manual):**
- [ ] Application loads in browser
- [ ] Login works
- [ ] Key features work
- [ ] No console errors in browser

### Step 5: Update PROGRESS.md (Post-Deployment)

After successful deployment, update `workflow/PROGRESS.md`:

```markdown
## Deployment Approval

### Current Status: Not Ready for Deployment
**Last Updated:** 2025-01-19
**Version:** v1.2.0

**Checklist:**
- [ ] All Phase 3 features completed
- [ ] Documentation verified (PRD, TDD, PROGRESS)
- [ ] No blocking issues
- [ ] Approved by MANAGER_AGENT
- [ ] Version updated in package.json

**Previous Deployment:** v1.1.0 (2025-01-19) ✅ Deployed successfully
```

**What to update:**
1. Reset status to "Not Ready for Deployment"
2. Update version to next version number
3. Reset all checklist items to unchecked
4. Update "Previous Deployment" with:
   - Version number
   - Date
   - Status: ✅ Deployed successfully

---

## Quick Deployment Commands

### Local Commands

```bash
# Build and test locally
npm run build
npm run start

# Push to GitHub (triggers auto-deploy)
git add .
git commit -m "feat: description"
git push origin main
```

### Server Commands (SSH)

```bash
# Check application status
pm2 status

# View logs
pm2 logs laju

# Restart application
pm2 restart laju

# Reload (zero-downtime)
pm2 reload laju

# Monitor resources
pm2 monit
```

### Troubleshooting Commands

```bash
# Check if port is in use
sudo lsof -i :5555

# Check database
ls -lh data/production.sqlite3

# Check environment variables
cat .env

# Check Node version
node --version
```

---

## Common Deployment Issues

### Issue 1: Pre-Deployment Checks Fail

**Symptoms:** Checklist items fail during pre-deployment verification

**Solutions:**
1. **Stop deployment process** - Don't proceed to GitHub
2. **Document the issue** - Note which checklist item failed and why
3. **Report to MANAGER_AGENT** with details:
   ```
   ❌ Pre-deployment check failed:
   - Failed item: [specific checklist item]
   - Reason: [what's wrong]
   - Severity: [Critical/High/Medium/Low]
   ```
4. **Wait for MANAGER_AGENT decision** - They will:
   - Evaluate severity
   - Decide if fix needed before deploy
   - Update PROGRESS.md with fix task (if needed)
5. **Fix the issue** (if required) - Either:
   - Fix yourself (if simple)
   - Wait for TASK_AGENT to fix (if complex)
6. **Re-run checks** - Verify all checklist items pass
7. **Proceed to deployment** - Only after MANAGER_AGENT approves

**Example:**
```
DEPLOYMENT_AGENT:
❌ Pre-deployment check failed:
- Failed item: No console errors in dev server
- Reason: Found 3 console errors in Residents page
- Severity: High

MANAGER_AGENT:
📝 Decision: Fix required before deployment
🔄 Update PROGRESS.md: Add bug fix to In Progress

TASK_AGENT:
🔧 Fix console errors in Residents page
✅ Update PROGRESS.md: [x] Bug fixed

MANAGER_AGENT:
✅ Update Deployment Approval: Ready for Deployment

DEPLOYMENT_AGENT:
✅ Re-run checks → All pass → Deploy
```

### Issue 2: Build Fails on Server

**Symptoms:** GitHub Actions shows build errors

**Solutions:**
1. Check error logs in GitHub Actions
2. Verify dependencies in `package.json`
3. Check TypeScript errors
4. Test build locally: `npm run build`

### Issue 3: Migration Fails

**Symptoms:** Migrations don't run or show errors

**Solutions:**
1. SSH to server
2. Check migration status: `npx knex migrate:status --env production`
3. Run migrations manually: `npx knex migrate:latest --env production`
4. Check database file: `ls -lh data/production.sqlite3`

### Issue 4: Application Won't Start

**Symptoms:** PM2 shows app as "errored" or "stopped"

**Solutions:**
1. Check PM2 logs: `pm2 logs laju --lines 50`
2. Verify `.env` file exists and is correct
3. Check port 5555 is available: `sudo lsof -i :5555`
4. Restart PM2: `pm2 restart laju`

### Issue 5: Database Connection Error

**Symptoms:** Application can't connect to database

**Solutions:**
1. Check `.env` file has correct database settings
2. Verify database file exists: `ls -lh data/production.sqlite3`
3. Check file permissions
4. Restart application

---

## Rollback Procedure

### Auto-Rollback (Automated)

GitHub Actions now includes auto-rollback functionality:

**When auto-rollback triggers:**
- Smoke tests fail after deployment
- Deployment encounters critical errors

**Auto-rollback process:**
1. GitHub Actions detects failure
2. Automatically reverts last commit
3. Pushes revert to main
4. Reloads PM2 on server
5. Sends notification (if Slack webhook configured)

### Manual Rollback (If Needed)

**Option 1: Revert Commit**

```bash
# 1. Revert the problematic commit
git revert <commit-hash>

# 2. Push to trigger auto-deploy
git push origin main

# 3. Monitor GitHub Actions
# 4. Verify rollback successful
```

**Option 2: Manual Rollback on Server**

```bash
# 1. SSH to server
ssh root@your-server-ip
cd /root/laju

# 2. Checkout previous commit
git checkout <previous-commit-hash>

# 3. Rebuild
npm install
npm run build

# 4. Restart
pm2 restart laju

# 5. Verify
pm2 logs laju --lines 50
```

### After Rollback

1. Verify application works
2. Investigate the issue
3. Fix the problem
4. Test thoroughly
5. Deploy again

---

## Deployment Best Practices

### Before Deploying

1. **Test locally first** - Always build and test before pushing
2. **Review changes** - Check what you're about to deploy
3. **Backup database** - If making major changes
4. **Notify users** - If deployment affects users

### During Deployment

1. **Monitor GitHub Actions** - Watch the deployment progress
2. **Check logs** - Look for errors in real-time
3. **Be patient** - Deployment takes a few minutes

### After Deployment

1. **Verify functionality** - Test key features
2. **Check logs** - Look for errors
3. **Update documentation** - Record what was deployed
4. **Monitor for issues** - Watch for user reports

---

## Related Documentation

For detailed technical setup and configuration:

- **`docs/20-DEPLOYMENT.md`** - Complete deployment guide (server setup, HTTPS, Docker)
- **`docs/21-GITHUB-ACTIONS.md`** - GitHub Actions workflow details
- **`docs/12-BACKUP-RESTORE.md`** - Backup and restore procedures

---

## Summary

Deployment workflow handles the **routine deployment** of pushing updates to production:

1. **Pre-deployment checks** - Simplified (most checks automated)
2. **Merge to main** - Triggers automated testing & deployment
3. **Monitor deployment** - Watch GitHub Actions
4. **Verify deployment** - Test application on server
5. **Update documentation** - Record deployment

This is a **reference guide** for monitoring and troubleshooting deployment. Deployment runs automatically via GitHub Actions CI when you merge to main branch.
