# Troubleshooting Guide

Common issues and their solutions when working with Laju Framework.

---

## 🔥 Critical Errors

### "database is locked" (SQLITE_BUSY)

**Cause:** Another process is accessing the SQLite database.

**Solutions:**
```bash
# 1. Just retry the operation — WAL mode handles this automatically
# 2. If persistent, restart dev server:
npm run dev

# 3. Last resort — reset database:
npm run refresh
```

**Prevention:**
- Laju already enables WAL mode by default (19.9x faster, no locking issues)
- Don't open the `.sqlite3` file in external tools while app is running

---

### "Cannot find module 'xxx'"

**Cause:** Dependencies not installed or TypeScript path resolution issue.

**Solutions:**
```bash
# 1. Install dependencies
npm install

# 2. Check tsconfig.json paths are correct
# 3. Restart TypeScript server in your editor (VSCode: Cmd+Shift+P → "Restart TS Server")
```

---

### Port 5555 already in use

**Error:** `Error: listen EADDRINUSE: address already in use :::5555`

**Solutions:**
```bash
# Find and kill process
lsof -ti:5555 | xargs kill -9

# Or change port in .env
PORT=3000
```

---

### "Migration failed"

**Common causes:**
1. Syntax error in migration file
2. Table already exists
3. Foreign key constraint issue

**Solutions:**
```bash
# Reset database (DEVELOPMENT ONLY!)
npm run refresh

# Or rollback specific migration
npm run migrate:down
```

**Debug:**
```bash
# Check migration status
npx tsx commands/native/Migrator.ts status
```

---

## 🤖 AI Development Issues

### AI Not Following Laju Conventions

**Symptom:** AI generates code that doesn't match Laju patterns.

**Solution:**
Always mention the workflow file at the start:
```
@workflow/INIT_AGENT.md
# or
@workflow/TASK_AGENT.md
```

This loads AGENTS.md context with all conventions.

---

### AI Creates Wrong File Structure

**Symptom:** Files created in wrong directories.

**Solution:**
Be specific in your prompt:
```
Create a blog controller in app/controllers/BlogController.ts
Create the index page in resources/js/Pages/blog/index.svelte
```

---

### AI Uses Wrong Syntax

**Symptom:** AI uses `this` in controllers or wrong response methods.

**Solution:**
Remind AI of Laju patterns:
```
Remember: Laju controllers don't use "this". 
Use: export default new ControllerName()
```

---

## 💻 Development Issues

### Hot Reload Not Working

**Solutions:**
```bash
# 1. Check Vite is running (should be on port 5173 by default)
# 2. Check browser console for WebSocket errors
# 3. Restart dev server
npm run dev

# 4. Check .env
VITE_PORT=5173
```

---

### TypeScript Errors in Editor

**Symptoms:**
- Red squiggly lines on valid imports
- "Cannot find module" errors
- Type definitions not loading

**Solutions:**
```bash
# 1. Restart TypeScript server (VSCode)
Cmd+Shift+P → "TypeScript: Restart TS Server"

# 2. Check tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "app/*": ["app/*"],
      "type/*": ["type/*"]
    }
  }
}

# 3. Regenerate types (if using custom types)
npm run build
```

---

### CSS Changes Not Reflecting

**Cause:** TailwindCSS not rebuilding or browser cache.

**Solutions:**
```bash
# 1. Hard refresh browser (Cmd+Shift+R on Mac)
# 2. Check Tailwind config changes need server restart
npm run dev

# 3. Check content paths in tailwind.config.js
```

---

### "response.inertia is not a function"

**Cause:** Inertia middleware not applied or wrong import.

**Solutions:**
```typescript
// Check you're using the right response object
public async index(request: Request, response: Response) {
  // ✅ Correct
  return response.inertia("page", { data });
}

// Check middleware in routes/web.ts
Route.get("/posts", [Auth, inertia], PostController.index);
```

---

### Session/Auth Not Working

**Symptoms:**
- `request.user` is undefined
- Login works but user not persisted
- Flash messages not showing

**Checklist:**
1. ✅ Auth middleware applied to route
2. ✅ `SESSION_SECRET` set in `.env`
3. ✅ Cookies enabled in browser
4. ✅ Correct import: `import Auth from "../app/middlewares/auth"`

**Debug:**
```typescript
public async debug(request: Request, response: Response) {
  console.log("Cookies:", request.cookies);
  console.log("User:", request.user);
  console.log("Session:", request.session);
}
```

---

## 🗄️ Database Issues

### "no such table: users"

**Cause:** Migrations not run.

**Solution:**
```bash
npm run migrate
```

---

### "FOREIGN KEY constraint failed"

**Cause:** Referenced record doesn't exist.

**Example:**
```typescript
// ❌ Wrong — user_id doesn't exist
await DB.insertInto("posts").values({
  user_id: "invalid-id",
  title: "Test"
}).execute();

// ✅ Correct — use valid user_id
```

---

### Slow Queries

**Check:**
1. Missing index on foreign keys
2. N+1 query problem
3. Not using WAL mode

**Solutions:**
```typescript
// ✅ Use joins to avoid N+1
const posts = await DB.selectFrom("posts")
  .innerJoin("users", "posts.user_id", "users.id")
  .select(["posts.id", "posts.title", "users.name"])
  .execute();

// ✅ Add index in migration
.addColumn("user_id", "text", (col) => 
  col.references("users.id").onDelete("cascade")
)
```

---

### Database Corruption

**Symptoms:** 
- "database disk image is malformed"
- Strange errors that persist after restart

**Solutions:**
```bash
# 1. Delete and recreate (DEVELOPMENT ONLY!)
rm data/dev.sqlite3
npm run migrate

# 2. Backup first if you have data to keep:
cp data/dev.sqlite3 data/dev-backup.sqlite3
```

---

## 🚀 Production Issues

### Build Fails

**Common causes:**
1. TypeScript errors
2. Missing environment variables
3. Out of memory

**Solutions:**
```bash
# Check TypeScript errors first
npx tsc --noEmit

# Build with more memory
node --max-old-space-size=4096 node_modules/.bin/tsc
```

---

### "Cannot find module 'xxx'" in Production

**Cause:** Production dependencies not installed or wrong NODE_ENV.

**Solutions:**
```bash
# Install production dependencies only
npm ci --production

# Or copy all dependencies
npm install
```

---

### PM2 Errors

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs laju --lines 100

# Restart
pm2 restart laju

# Reset (if stuck)
pm2 delete laju
pm2 start build/server.js --name laju
```

---

### HTTPS Not Working

**Checklist:**
1. ✅ SSL certificates exist and are valid
2. ✅ `SSL_KEY` and `SSL_CERT` paths correct in `.env`
3. ✅ Port 443 open in firewall
4. ✅ Domain points to server IP

**Debug:**
```bash
# Test certificate
openssl x509 -in localhost+1.pem -text -noout

# Check port
sudo lsof -i :443
```

---

## 🧪 Testing Issues

### Tests Failing

**Common causes:**
1. Test database not set up
2. Environment variables missing
3. Tests running in wrong order

**Solutions:**
```bash
# Setup test database
NODE_ENV=test npm run migrate

# Run tests with environment
npm run test:run

# Check .env.test exists
cp .env.example .env.test
```

---

### "Cannot find module '../build/app/...'"

**Cause:** Tests need compiled TypeScript.

**Solution:**
```bash
# Build first
npm run build

# Then test
npm run test:run
```

---

## 🎨 Frontend Issues

### Svelte Errors

**"Cannot find module '@/Components/...'"**

Check `vite.config.mjs`:
```javascript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './resources/js'),
  }
}
```

---

### Inertia "Page not found"

**Cause:** Page file doesn't exist or wrong path.

**Solutions:**
```typescript
// Check exact file exists:
resources/js/Pages/blog/index.svelte

// Check case sensitivity (Linux is case-sensitive!)
// ❌ Blog/Index.svelte
// ✅ blog/index.svelte

// Check import in controller
return response.inertia("blog/index", { data }); // .svelte not needed
```

---

### Flash Messages Not Showing

**In Controller:**
```typescript
return response.flash("success", "Post created!").redirect("/posts");
```

**In Page:**
```svelte
<script>
  let { flash } = $props()
</script>

{#if flash?.success}
  <div class="alert alert-success">{flash.success}</div>
{/if}
```

---

## 📧 Email Issues

### "Authentication failed" (Resend)

**Cause:** Invalid API key.

**Solutions:**
1. Check `RESEND_API_KEY` in `.env`
2. Verify key at https://resend.com/api-keys
3. Ensure "sending" domain is verified

---

### "Connection refused" (SMTP)

**Checklist:**
1. ✅ SMTP host and port correct
2. ✅ Username/password correct
3. ✅ Less secure apps enabled (for Gmail)
4. ✅ Not blocked by firewall

---

## ☁️ S3/Storage Issues

### "Access Denied"

**Causes:**
1. Wrong credentials
2. Bucket policy doesn't allow access
3. CORS not configured

**Solutions:**
```bash
# Check credentials
aws s3 ls s3://your-bucket --profile your-profile

# Check CORS policy in S3 console
```

---

### Presigned URL Not Working

**Check:**
1. URL not expired
2. Correct HTTP method (GET vs PUT)
3. Same headers used when generating and requesting

---

## 🔍 Debugging Tips

### Enable Debug Logging

```typescript
// In controller or service
import Logger from "../services/Logger";

Logger.logDebug("Debug info", { userId: request.user?.id });
```

### Check Logs

```bash
# Development
npm run dev
# Logs show in terminal

# Production
pm2 logs laju --lines 50

# Or check log files
tail -f logs/app.log
```

### Database Queries

```typescript
// Log all queries (development only)
const posts = await DB.selectFrom("posts")
  .selectAll()
  .$call((qb) => {
    console.log("Query:", qb.compile());
    return qb;
  })
  .execute();
```

---

## 🆘 Still Stuck?

1. **Check GitHub Issues:** https://github.com/maulanashalihin/laju/issues
2. **Review Documentation:** Start with [README](README.md)
3. **Check Examples:** Look at built-in controllers for patterns
4. **Ask AI:** Mention `@workflow/TASK_AGENT.md` with your error

---

## 📝 Error Message Reference

| Error | Meaning | Quick Fix |
|-------|---------|-----------|
| `ECONNREFUSED` | Can't connect to service | Check if service is running |
| `ENOENT` | File not found | Check file path |
| `EACCES` | Permission denied | Check file permissions |
| `ETIMEDOUT` | Connection timeout | Check network/firewall |
| `ER_NO_SUCH_TABLE` | Table doesn't exist | Run migrations |
| `SQLITE_CONSTRAINT` | Constraint violation | Check foreign keys/unique |

---

**Remember:** Most issues can be solved by:
1. Restarting dev server (`npm run dev`)
2. Running migrations (`npm run migrate`)
3. Installing dependencies (`npm install`)
4. Checking `.env` configuration