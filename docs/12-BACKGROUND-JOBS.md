# Background Jobs & Task Scheduling

Complete guide to running background tasks, cron jobs, and scheduled commands in Laju Framework.

## Table of Contents

1. [Introduction](#introduction)
2. [Command System](#command-system)
3. [Creating Commands](#creating-commands)
4. [Cron Job Setup](#cron-job-setup)
5. [Common Use Cases](#common-use-cases)
6. [Process Management](#process-management)
7. [Error Handling & Logging](#error-handling--logging)
8. [Best Practices](#best-practices)

---

## Introduction

Background jobs are tasks that run independently of your web server, typically on a schedule. Common use cases include:

- Sending scheduled emails
- Database cleanup
- Report generation
- Data synchronization
- Cache warming
- Backup automation
- API polling

### Architecture

```
┌─────────────────┐
│   Web Server    │  (HyperExpress - handles HTTP requests)
│   Port 5555     │
└─────────────────┘

┌─────────────────┐
│  Cron Jobs      │  (Scheduled tasks - run independently)
│  Commands       │
└─────────────────┘
```

**Key Points:**
- Commands run **separately** from the web server
- No HTTP overhead - direct database/service access
- Can be scheduled with cron or run manually
- Must be compiled before execution

---

## Command System

### How Commands Work

Laju uses a simple command system located in the `commands/` directory.

**Structure:**
```
commands/
├── index.ts              # Command loader
├── native/               # Built-in commands
│   ├── MakeCommand.ts    # Generate new commands
│   └── MakeController.ts # Generate controllers
└── YourCommand.ts        # Your custom commands
```

### Running Commands

```bash
# Development (TypeScript)
npx tsx commands/YourCommand.ts

# Production (Compiled JavaScript)
node build/commands/YourCommand.js
```

---

## Creating Commands

### Method 1: Using CLI Generator

```bash
node laju make:command SendDailyEmails
```

This creates `commands/SendDailyEmails.ts`:

```typescript
import DB from "../app/services/DB";

(async () => {
  
  const users = await DB.from("users").select("*");

  console.log(users);
  
  process.exit(1);
})()
```

### Method 2: Manual Creation

Create `commands/MyCommand.ts`:

```typescript
import DB from "../app/services/DB";
import { logInfo, logError } from "../app/services/Logger";

(async () => {
  try {
    logInfo("Command started");
    
    // Your logic here
    
    logInfo("Command completed");
    process.exit(0); // Success
  } catch (error) {
    logError("Command failed", { error: error.message });
    process.exit(1); // Failure
  }
})()
```

---

## Common Use Cases

### 1. Send Daily Email Digest

```typescript
// commands/SendDailyDigest.ts
import DB from "../app/services/DB";
import Mailer from "../app/services/Mailer";
import { logInfo, logError } from "../app/services/Logger";

(async () => {
  try {
    logInfo("Starting daily digest");
    
    // Get users who opted in
    const users = await DB.from("users")
      .where("email_digest", true)
      .where("is_verified", true);
    
    logInfo(`Found ${users.length} users`);
    
    // Get yesterday's posts
    const yesterday = Date.now() - (24 * 60 * 60 * 1000);
    const posts = await DB.from("posts")
      .where("created_at", ">=", yesterday)
      .orderBy("created_at", "desc");
    
    // Send emails
    for (const user of users) {
      await Mailer.send({
        to: user.email,
        subject: "Your Daily Digest",
        html: generateDigestHTML(posts)
      });
      
      logInfo(`Sent digest to ${user.email}`);
    }
    
    logInfo(`Daily digest completed: ${users.length} emails sent`);
    process.exit(0);
    
  } catch (error) {
    logError("Daily digest failed", { error: error.message });
    process.exit(1);
  }
})();

function generateDigestHTML(posts: any[]) {
  return `
    <h1>Your Daily Digest</h1>
    <ul>
      ${posts.map(p => `<li><strong>${p.title}</strong></li>`).join('')}
    </ul>
  `;
}
```

**Cron schedule (daily at 8 AM):**
```bash
0 8 * * * cd /path/to/app/build && node commands/SendDailyDigest.js >> /var/log/digest.log 2>&1
```

---

### 2. Database Cleanup

```typescript
// commands/CleanupOldData.ts
import DB from "../app/services/DB";
import { logInfo, logError } from "../app/services/Logger";

(async () => {
  try {
    logInfo("Starting database cleanup");
    
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    
    // Delete old sessions
    const deletedSessions = await DB.from("sessions")
      .where("updated_at", "<", thirtyDaysAgo)
      .delete();
    
    logInfo(`Deleted ${deletedSessions} old sessions`);
    
    // Delete expired password reset tokens
    const deletedTokens = await DB.from("password_reset_tokens")
      .where("expires_at", "<", Date.now())
      .delete();
    
    logInfo(`Deleted ${deletedTokens} expired tokens`);
    
    // Delete unverified users older than 7 days
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const deletedUsers = await DB.from("users")
      .where("is_verified", false)
      .where("created_at", "<", sevenDaysAgo)
      .delete();
    
    logInfo(`Deleted ${deletedUsers} unverified users`);
    
    logInfo("Database cleanup completed");
    process.exit(0);
    
  } catch (error) {
    logError("Database cleanup failed", { error: error.message });
    process.exit(1);
  }
})();
```

**Cron schedule (daily at 2 AM):**
```bash
0 2 * * * cd /path/to/app/build && node commands/CleanupOldData.js >> /var/log/cleanup.log 2>&1
```

---

### 3. Generate Reports

```typescript
// commands/GenerateMonthlyReport.ts
import DB from "../app/services/DB";
import Mailer from "../app/services/Mailer";
import { logInfo, logError } from "../app/services/Logger";

(async () => {
  try {
    logInfo("Generating monthly report");
    
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    // Get statistics
    const newUsers = await DB.from("users")
      .where("created_at", ">=", startOfMonth.getTime())
      .count("* as count")
      .first();
    
    const newPosts = await DB.from("posts")
      .where("created_at", ">=", startOfMonth.getTime())
      .count("* as count")
      .first();
    
    const activeUsers = await DB.from("sessions")
      .where("updated_at", ">=", startOfMonth.getTime())
      .countDistinct("user_id as count")
      .first();
    
    const report = {
      month: startOfMonth.toISOString().slice(0, 7),
      newUsers: newUsers.count,
      newPosts: newPosts.count,
      activeUsers: activeUsers.count
    };
    
    logInfo("Report generated", report);
    
    // Send to admin
    const admins = await DB.from("users").where("is_admin", true);
    
    for (const admin of admins) {
      await Mailer.send({
        to: admin.email,
        subject: `Monthly Report - ${report.month}`,
        html: `
          <h1>Monthly Report</h1>
          <ul>
            <li>New Users: ${report.newUsers}</li>
            <li>New Posts: ${report.newPosts}</li>
            <li>Active Users: ${report.activeUsers}</li>
          </ul>
        `
      });
    }
    
    logInfo("Monthly report sent");
    process.exit(0);
    
  } catch (error) {
    logError("Report generation failed", { error: error.message });
    process.exit(1);
  }
})();
```

**Cron schedule (1st of month at 9 AM):**
```bash
0 9 1 * * cd /path/to/app/build && node commands/GenerateMonthlyReport.js >> /var/log/reports.log 2>&1
```

---

### 4. Cache Warming

```typescript
// commands/WarmCache.ts
import DB from "../app/services/DB";
import Redis from "../app/services/Redis";
import { logInfo, logError } from "../app/services/Logger";

(async () => {
  try {
    logInfo("Starting cache warming");
    
    // Cache popular posts
    const popularPosts = await DB.from("posts")
      .orderBy("views", "desc")
      .limit(100);
    
    await Redis.set(
      "cache:popular_posts",
      JSON.stringify(popularPosts),
      "EX",
      3600 // 1 hour
    );
    
    logInfo(`Cached ${popularPosts.length} popular posts`);
    
    // Cache active users count
    const activeCount = await DB.from("sessions")
      .where("updated_at", ">", Date.now() - (24 * 60 * 60 * 1000))
      .countDistinct("user_id as count")
      .first();
    
    await Redis.set(
      "cache:active_users_count",
      activeCount.count.toString(),
      "EX",
      300 // 5 minutes
    );
    
    logInfo("Cache warming completed");
    process.exit(0);
    
  } catch (error) {
    logError("Cache warming failed", { error: error.message });
    process.exit(1);
  }
})();
```

**Cron schedule (every 30 minutes):**
```bash
*/30 * * * * cd /path/to/app/build && node commands/WarmCache.js >> /var/log/cache.log 2>&1
```

---

### 5. External API Sync

```typescript
// commands/SyncExternalData.ts
import DB from "../app/services/DB";
import { logInfo, logError } from "../app/services/Logger";

(async () => {
  try {
    logInfo("Starting external data sync");
    
    // Fetch from external API
    const response = await fetch("https://api.example.com/data", {
      headers: {
        "Authorization": `Bearer ${process.env.EXTERNAL_API_KEY}`
      }
    });
    
    const data = await response.json();
    
    logInfo(`Fetched ${data.length} records`);
    
    // Update database
    for (const item of data) {
      await DB.table("external_data")
        .insert({
          external_id: item.id,
          data: JSON.stringify(item),
          synced_at: Date.now()
        })
        .onConflict("external_id")
        .merge();
    }
    
    logInfo("External data sync completed");
    process.exit(0);
    
  } catch (error) {
    logError("External sync failed", { error: error.message });
    process.exit(1);
  }
})();
```

**Cron schedule (every 15 minutes):**
```bash
*/15 * * * * cd /path/to/app/build && node commands/SyncExternalData.js >> /var/log/sync.log 2>&1
```

---

### 6. Automated Backup

```typescript
// commands/BackupDatabase.ts
import { execSync } from "child_process";
import { logInfo, logError } from "../app/services/Logger";

(async () => {
  try {
    logInfo("Starting database backup");
    
    // Run backup script
    execSync("node build/backup.js", { stdio: "inherit" });
    
    logInfo("Database backup completed");
    process.exit(0);
    
  } catch (error) {
    logError("Database backup failed", { error: error.message });
    process.exit(1);
  }
})();
```

**Cron schedule (daily at 1 AM):**
```bash
0 1 * * * cd /path/to/app/build && node commands/BackupDatabase.js >> /var/log/backup.log 2>&1
```

---

## Cron Job Setup

### Cron Syntax

```
* * * * * command
│ │ │ │ │
│ │ │ │ └─── Day of week (0-7, Sunday = 0 or 7)
│ │ │ └───── Month (1-12)
│ │ └─────── Day of month (1-31)
│ └───────── Hour (0-23)
└─────────── Minute (0-59)
```

### Common Schedules

```bash
# Every minute
* * * * * command

# Every 5 minutes
*/5 * * * * command

# Every hour
0 * * * * command

# Every day at 2 AM
0 2 * * * command

# Every Monday at 9 AM
0 9 * * 1 command

# First day of month at 8 AM
0 8 1 * * command

# Every weekday at 6 PM
0 18 * * 1-5 command
```

### Setting Up Crontab

**1. Edit crontab:**
```bash
crontab -e
```

**2. Add your jobs:**
```bash
# Daily digest at 8 AM
0 8 * * * cd /var/www/myapp/build && node commands/SendDailyDigest.js >> /var/log/laju/digest.log 2>&1

# Cleanup at 2 AM
0 2 * * * cd /var/www/myapp/build && node commands/CleanupOldData.js >> /var/log/laju/cleanup.log 2>&1

# Cache warming every 30 minutes
*/30 * * * * cd /var/www/myapp/build && node commands/WarmCache.js >> /var/log/laju/cache.log 2>&1

# Backup daily at 1 AM
0 1 * * * cd /var/www/myapp/build && node commands/BackupDatabase.js >> /var/log/laju/backup.log 2>&1
```

**3. View active cron jobs:**
```bash
crontab -l
```

**4. Remove all cron jobs:**
```bash
crontab -r
```

### Important Notes

- **Always use absolute paths** in cron jobs
- **Redirect output** to log files (`>> /var/log/app.log 2>&1`)
- **Change directory** to your app (`cd /path/to/app/build`)
- **Set environment variables** if needed
- **Test commands manually** before scheduling

---

## Process Management

### Using PM2 for Long-Running Tasks

For tasks that need to run continuously (not scheduled):

```bash
# Start worker process
pm2 start build/commands/Worker.js --name worker

# Start multiple workers
pm2 start build/commands/Worker.js -i 4 --name worker

# View logs
pm2 logs worker

# Restart
pm2 restart worker

# Stop
pm2 stop worker
```

### Worker Example

```typescript
// commands/Worker.ts
import DB from "../app/services/DB";
import { logInfo, logError } from "../app/services/Logger";

async function processQueue() {
  while (true) {
    try {
      // Get pending jobs
      const job = await DB.from("jobs")
        .where("status", "pending")
        .orderBy("created_at", "asc")
        .first();
      
      if (!job) {
        // No jobs, wait 5 seconds
        await new Promise(resolve => setTimeout(resolve, 5000));
        continue;
      }
      
      logInfo(`Processing job ${job.id}`);
      
      // Mark as processing
      await DB.from("jobs")
        .where("id", job.id)
        .update({ status: "processing" });
      
      // Process job
      await processJob(job);
      
      // Mark as completed
      await DB.from("jobs")
        .where("id", job.id)
        .update({ 
          status: "completed",
          completed_at: Date.now()
        });
      
      logInfo(`Job ${job.id} completed`);
      
    } catch (error) {
      logError("Worker error", { error: error.message });
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

async function processJob(job: any) {
  // Your job processing logic
  const data = JSON.parse(job.data);
  
  switch (job.type) {
    case "send_email":
      // Send email
      break;
    case "generate_report":
      // Generate report
      break;
    default:
      throw new Error(`Unknown job type: ${job.type}`);
  }
}

processQueue();
```

---

## Error Handling & Logging

### Comprehensive Error Handling

```typescript
// commands/RobustCommand.ts
import DB from "../app/services/DB";
import { logInfo, logError, logWarn } from "../app/services/Logger";

(async () => {
  const startTime = Date.now();
  let successCount = 0;
  let errorCount = 0;
  
  try {
    logInfo("Command started");
    
    const items = await DB.from("items").where("processed", false);
    
    for (const item of items) {
      try {
        // Process item
        await processItem(item);
        
        await DB.from("items")
          .where("id", item.id)
          .update({ processed: true });
        
        successCount++;
        
      } catch (itemError) {
        logError(`Failed to process item ${item.id}`, {
          error: itemError.message,
          itemId: item.id
        });
        errorCount++;
        
        // Continue with next item
        continue;
      }
    }
    
    const duration = Date.now() - startTime;
    
    logInfo("Command completed", {
      duration: `${duration}ms`,
      successCount,
      errorCount,
      totalItems: items.length
    });
    
    // Exit with error if any items failed
    process.exit(errorCount > 0 ? 1 : 0);
    
  } catch (error) {
    logError("Command failed", {
      error: error.message,
      stack: error.stack,
      duration: `${Date.now() - startTime}ms`
    });
    process.exit(1);
  }
})();

async function processItem(item: any) {
  // Processing logic
}
```

### Logging Best Practices

```typescript
import { logInfo, logError, logWarn } from "../app/services/Logger";

// ✅ Good - Structured logging
logInfo("Processing started", {
  itemCount: items.length,
  batchSize: 100
});

logError("Processing failed", {
  error: error.message,
  itemId: item.id,
  retryCount: 3
});

// ❌ Bad - Unstructured logging
console.log("Processing started with " + items.length + " items");
```

---

## Best Practices

### ✅ DO

**1. Always exit with proper code**
```typescript
// ✅ Good
process.exit(0); // Success
process.exit(1); // Failure
```

**2. Use try-catch blocks**
```typescript
// ✅ Good
try {
  await doWork();
  process.exit(0);
} catch (error) {
  logError("Failed", { error: error.message });
  process.exit(1);
}
```

**3. Log important events**
```typescript
// ✅ Good
logInfo("Command started");
logInfo(`Processed ${count} items`);
logInfo("Command completed");
```

**4. Handle partial failures**
```typescript
// ✅ Good - Continue on item errors
for (const item of items) {
  try {
    await processItem(item);
  } catch (error) {
    logError(`Item ${item.id} failed`, { error: error.message });
    continue; // Process next item
  }
}
```

**5. Use transactions for data consistency**
```typescript
// ✅ Good
await DB.transaction(async (trx) => {
  await trx.from("orders").insert(order);
  await trx.from("inventory").decrement("stock", 1);
});
```

**6. Set timeouts for external calls**
```typescript
// ✅ Good
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 30000);

try {
  const response = await fetch(url, { signal: controller.signal });
} finally {
  clearTimeout(timeout);
}
```

---

### ❌ DON'T

**1. Don't forget to exit**
```typescript
// ❌ Bad - Process hangs
(async () => {
  await doWork();
  // Missing process.exit()
})();
```

**2. Don't use console.log in production**
```typescript
// ❌ Bad
console.log("Processing...");

// ✅ Good
logInfo("Processing...");
```

**3. Don't run long tasks synchronously**
```typescript
// ❌ Bad - Blocks event loop
for (let i = 0; i < 1000000; i++) {
  processSync(i);
}

// ✅ Good - Batch with async
for (let i = 0; i < items.length; i += 100) {
  const batch = items.slice(i, i + 100);
  await Promise.all(batch.map(processAsync));
}
```

**4. Don't ignore errors silently**
```typescript
// ❌ Bad
try {
  await doWork();
} catch (error) {
  // Silent failure
}

// ✅ Good
try {
  await doWork();
} catch (error) {
  logError("Work failed", { error: error.message });
  process.exit(1);
}
```

---

## Summary

### Key Takeaways

1. **Commands are standalone scripts** - Run independently from web server
2. **Must be compiled** - Use `npm run build` before running
3. **Use cron for scheduling** - Standard Unix cron syntax
4. **Always log and exit properly** - Use Logger service and exit codes
5. **Handle errors gracefully** - Try-catch and continue on partial failures

### Quick Reference

```bash
# Create command
node laju make:command MyCommand

# Run command (development)
npx tsx commands/MyCommand.ts

# Run command (production)
node build/commands/MyCommand.js

# Schedule with cron
crontab -e
0 2 * * * cd /path/to/app/build && node commands/MyCommand.js >> /var/log/app.log 2>&1
```

---

## Next Steps

- [Backup & Restore](13-BACKUP-RESTORE.md) - Database backup automation
- [Deployment Guide](08-DEPLOYMENT.md) - Production setup with PM2
- [Logging Guide](24-LOGGING.md) - Structured logging patterns
- [Testing Guide](14-TESTING.md) - Testing background jobs
