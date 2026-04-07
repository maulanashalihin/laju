# 5-Minute Quick Start

Build your first Laju application in 5 minutes — with or without AI assistance.

---

## 🚀 Option 1: AI-Assisted (Recommended)

Let AI handle the coding. You just describe what you want.

### Step 1: Create Project (30 seconds)

```bash
npx create-laju-app my-app && cd my-app
npm run migrate && npm run dev
```

Visit `http://localhost:5555` — you should see the welcome page.

### Step 2: Initialize with AI (1 minute)

Open your AI assistant (Claude, ChatGPT, etc.) and type:

```
@workflow/INIT_AGENT.md

I want to build a blog system with:
- Posts with title, content, and cover image
- Categories for organizing posts
- Comments system (users must login)
- Clean, modern design with blue accents
- Mobile responsive
```

**What AI will do:**
- Create README, PRD, TDD, PROGRESS documents
- Setup design system (Tailwind config, colors)
- Create database migrations
- Prepare project structure
- Initialize git

### Step 3: Build Features (2 minutes)

After AI finishes initialization, mention:

```
@workflow/TASK_AGENT.md

Create the blog index page showing:
- List of posts with pagination
- Category filter sidebar
- Search functionality
- "New Post" button for authenticated users
```

**What AI will do:**
- Create `BlogHandler.ts`
- Create `resources/js/Pages/blog/index.svelte`
- Add routes to `routes/web.ts`
- Run migrations
- Test the feature

### Step 4: Review & Continue (1 minute)

Open `http://localhost:5555/blog` — your blog is live!

Continue building:
```
@workflow/TASK_AGENT.md
"Now create the individual post page with comments section"
```

**Total time: 5 minutes** ⏱️

---

## 💻 Option 2: Manual Coding

Prefer to write code yourself? Follow this path.

### Step 1: Create Project

```bash
npx create-laju-app my-app
cd my-app
npm install
cp .env.example .env
npm run migrate
npm run dev
```

### Step 2: Create Your First Handler

```bash
node laju make:controller PostHandler
```

Edit `app/handlers/PostHandler.ts`:

```typescript
import { Request, Response } from "../../type";
import DB from "../services/DB";

export const PostHandler = {
  async index(request: Request, response: Response) {
    const posts = await DB.selectFrom("posts")
      .selectAll()
      .orderBy("created_at", "desc")
      .limit(10)
      .execute();
    
    return response.inertia("posts/index", { posts });
  }
};

export default PostHandler;
```

### Step 3: Create Database Migration

Create `migrations/20250130000000_create_posts.ts`:

```typescript
import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("posts")
    .addColumn("id", "text", (col) => col.primaryKey().notNull())
    .addColumn("title", "text", (col) => col.notNull())
    .addColumn("content", "text")
    .addColumn("user_id", "text", (col) => col.references("users.id"))
    .addColumn("created_at", "integer")
    .addColumn("updated_at", "integer")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("posts").execute();
}
```

Run migration:
```bash
npm run migrate
```

### Step 4: Create Svelte Page

Create `resources/js/Pages/posts/index.svelte`:

```svelte
<script>
  let { posts } = $props()
</script>

<div class="max-w-4xl mx-auto p-6">
  <h1 class="text-3xl font-bold mb-6">Blog Posts</h1>
  
  <div class="space-y-4">
    {#each posts as post}
      <div class="bg-slate-800 rounded-lg p-4">
        <h2 class="text-xl font-semibold text-white">{post.title}</h2>
        <p class="text-slate-400 mt-2">{post.content}</p>
      </div>
    {/each}
  </div>
</div>
```

### Step 5: Add Route

Edit `routes/web.ts`:

```typescript
import PostHandler from "../app/handlers/PostHandler";

// Add this line
Route.get("/posts", PostHandler.index);
```

Visit `http://localhost:5555/posts` — your blog is live!

**Total time: 15-20 minutes** ⏱️

---

## 🎯 Next Steps

Choose your path:

### AI Path
- [Learn AI Agent Workflows](24-ai-development.md) — Deep dive into INIT_AGENT, TASK_AGENT, MANAGER_AGENT
- [AI Best Practices](24-ai-development.md#tips-for-non-coders) — Get better results from AI

### Manual Path
- [Routing & Handlers](04-routing-controllers.md) — Full routing guide
- [Frontend (Svelte 5)](05-frontend-svelte.md) — Build interactive UIs
- [Database Guide](03-database.md) — Master Kysely queries
- [Authentication](06-authentication.md) — Add login/register

### Both Paths
- [Testing Guide](20-testing.md) — Write tests for your app
- [Deployment Guide](21-deployment.md) — Deploy to production
- [GitHub Actions](22-github-actions.md) — Setup CI/CD

---

## 💡 Pro Tips

### For AI Users
1. **Be specific** — "Create a blog" is vague. "Create a blog with posts, categories, comments" is better.
2. **Mention workflows** — Always start with `@workflow/INIT_AGENT.md` or `@workflow/TASK_AGENT.md`
3. **Review before continuing** — Check AI's work before asking for next feature
4. **Use PROGRESS.md** — Check this file to see what's been built

### For Manual Coders
1. **Use absolute imports** — `import DB from "app/services/DB"` (not `../../app/services/DB`)
2. **Follow conventions** — Handlers use `PascalCase`, pages use `kebab-case.svelte`
3. **Check existing code** — Laju has built-in auth, storage, email — reuse them!
4. **Use `response.inertia()`** — For authenticated pages (SPA feel)
5. **Use `view()`** — For public/SEO pages (server-side rendered)

---

## 🆘 Stuck?

| Problem | Solution |
|---------|----------|
| AI not responding correctly | Make sure you mentioned `@workflow/INIT_AGENT.md` first |
| Database errors | Run `npm run refresh` to reset database |
| Port already in use | Change `PORT` in `.env` file |
| Module not found | Run `npm install` |
| TypeScript errors | Check `tsconfig.json` paths configuration |

[Full Troubleshooting →](99-troubleshooting.md)

---

**Ready to build?** Choose your path above and start creating! 🚀