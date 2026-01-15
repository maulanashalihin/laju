# AI-Driven Development for Everyone

Build complete applications using AI - no coding experience required!

## What This Means

You can build real, working applications by simply **describing what you want** in plain language. The AI handles all the technical details.

![AI-Driven Development Workflow](/public/workflow.svg)

---

## Simple Workflow (Non-Coder Friendly)

### Step 1: Start Your Project

```bash
npx create-laju-app my-project
cd my-project
npm run dev
```

That's it! Your project is now running at `http://localhost:5555`

### Step 2: Set Up Your Project

The AI will help you set up your project in the right order:
 
**1. Describe Your App:**
```
AI: "What do you want to build? Please describe your app in simple terms."
```

**Important:** Describe ALL features you want upfront. We use the **Waterfall method** - define everything first, then build everything at once.

```
I want to build a simple task management app where:
- Users can create projects
- Each project has tasks
- Tasks can be marked as done or not done
- Show all tasks on a dashboard
- Users can assign tasks to people
- Users can add comments to tasks
- Users can filter tasks by status
```

**Optional:** If you have design references, mention them:
- Design system (e.g., "Use shadcn/ui components")
- UI kit (e.g., "I have a Figma design I can share")
- Branding preferences (e.g., "Use blue and purple colors")
- Similar apps (e.g., "Like Trello but simpler")

**Why Waterfall?**
- All features are built together concurrently
- No need to come back and add features later
- Faster overall development time
- Better integration between features

**2. Create Project Documentation:**
```
AI: "Let's set up your project properly.
- I'll create a README.md with your project details
- I'll create a PRD.md with your product requirements and design specifications
- I'll create a PROGRESS.md to track our development progress"
```

**3. Review Documentation:**
```
AI: "Please review the documentation I created:
- README.md - Project overview, features, tech stack
- PRD.md - Requirements, design specifications
- PROGRESS.md - Development tracking template

Let me know if you'd like any changes before I proceed."
```

**4. Setup Design System:**
```
AI: "Now I'll configure the design system.
- I'll set up your branding colors and typography in tailwind.config.js
- I'll import TailwindCSS 3 directives in your CSS file"
```

**5. Create Database:**
```
AI: "I'll create the database structure for your app.
- I'll create migration files for your data tables
- I'll run the migrations to set up your database"
```

**6. Initialize Git:**
```
AI: "Now let's set up git so we can save your progress.
I'll initialize the repository and make the first commit."
```

You don't need to do anything - the AI handles it automatically!

### Step 3: Let AI Build It (Concurrent Workflow)

After git init, your project is ready! The AI can now work on multiple features **simultaneously**:

The AI will:
1. Ask you clarifying questions (answer them in plain language)
2. Create all necessary files **in parallel** - controllers, pages, migrations, routes
3. Build the user interface for all features at once
4. Make everything work together
5. **Auto-save your progress** (you don't need to worry about git)

**Key benefit:** All phases happen concurrently - the AI doesn't wait for one feature to finish before starting the next. Everything gets built together!

**Test & Review During Development:**
As the AI builds each feature, you can:
- **Test** - Open `http://localhost:5555` and try out each feature as it's built
- **Review** - Check if the feature works as you described
- **Give feedback** - Tell the AI what to change: "The button should be blue" or "Add a confirmation dialog"

The AI will adjust based on your feedback immediately while continuing to build other features in parallel.

You just need to review and say "yes" or "make changes".

### Step 4: Test Your App

Open `http://localhost:5555` in your browser and try it out!

If something doesn't work right, just tell the AI:
```
The create project button doesn't work, please fix it
```

The AI will fix it and save the changes automatically.

### Step 5: Deployment

When all features are working as expected, deploy your app:

```
How do I deploy this app so others can use it?
```

The AI will guide you through the deployment process.

**Note:** We use the Waterfall development method - all features are defined upfront in Step 2 and built together. If you discover you need additional features later, you'll need to start a new development cycle from Step 2.

---

## Resuming Work on Your Project

If you need to take a break and come back later, here's how to continue:

### Check Your Progress First

Always start by checking `PROGRESS.md` to see what's been completed:

```
AI: "Let me check PROGRESS.md to see where we left off..."
```

The AI will read your progress and show you:
- What's already been built
- What's currently in progress
- What's still pending

### Continue Building

The AI will automatically continue with pending items from PROGRESS.md:

```
AI: "I see from PROGRESS.md that we have these pending items:
- User authentication
- Task creation form
- Dashboard with task list

Let's continue building these features."
```

The AI will:
1. Read PROGRESS.md to see pending items
2. Start building the pending features concurrently
3. Test and review as features are completed
4. Auto-save progress after each working feature

### Example: Resuming After a Break

**You:**
```
I'm back. Let's continue where we left off.
```

**AI:**
```
I checked PROGRESS.md. Here's our current status:

✅ Completed:
- Initial setup
- README.md created
- PRD.md created
- Design system configured
- Database migrations

🔄 In Progress:
- User authentication (login page)

⏳ Pending:
- User registration
- Task creation
- Dashboard

Let's continue with user authentication. I'll complete the login page and start on registration.
```

---

## Tips for Non-Coders

### Be Specific About Features

**Good:**
```
Users can create projects with a name and description
```

**Too Vague:**
```
Make a project management thing
```

### Describe in Business Terms, Not Technical

**Good:**
```
When a user creates a task, it should show up on their dashboard
```

**Too Technical:**
```
Create a task table with foreign key to users and render on dashboard
```

### Think About the User Experience

Describe what happens step by step:
```
1. User clicks "New Project" button
2. A form appears asking for project name and description
3. User fills in the form and clicks "Create"
4. The project is saved and appears in the project list
```

### Be Thorough in Your Description

With the Waterfall method, it's important to describe all features upfront:

**Good (Complete Description):**
```
I want a task management app where:
- Users can create projects with name and description
- Each project has tasks
- Tasks can be marked as done or not done
- Users can assign tasks to people
- Users can add comments to tasks
- Show all tasks on a dashboard
```

**Incomplete (Will Need Another Cycle):**
```
I want a task management app with projects and tasks.
```

**Tip:** Take time to think through all the features you need before starting. The AI will ask clarifying questions to help you be thorough.

---

## Common Questions

### Do I need to know any programming?

**No!** You just need to be able to:
- Describe what you want in plain language
- Use a computer
- Browse the web

### What if the AI makes a mistake?

Just tell it:
```
This doesn't work as expected. [Describe what's wrong]
```

The AI will fix it.

### Can I change my mind later?

Yes! Just tell the AI:
```
I want to change how the dashboard looks. Show tasks grouped by project instead of a list
```

### How do I deploy my app?

When you're happy with your app, ask the AI:
```
How do I deploy this app so others can use it?
```

The AI will guide you through the process.

### What if I don't understand something the AI says?

Ask the AI to explain:
```
I don't understand what you mean by [technical term]. Please explain in simple terms.
```

---

## Practical Tips from Practitioners

### Use Different AI Models for Different Phases

**Before Starting Your Project:**
- Use **Gemini 3 Pro** (via Gemini Web) for:
  - Creating complete PRD (Product Requirements Document)
  - Designing landing page
  - Creating design system and UI-kit
  - Gemini 3 Pro excels at visual design and comprehensive documentation

**During Development:**
- Use **GLM 4.7** or similar cost-effective AI models for:
  - Writing code and implementing features
  - Debugging and fixing issues
  - More affordable for extended development sessions

**Why This Approach?**
- Saves money - use expensive AI only for design/planning phase
- Better results - leverage each AI's strengths
- Faster development - design is ready before coding starts

### AGENT.md Configuration

The AGENT.md file in this project is designed for **Windsurf** editor structure. If you're using a different AI editor (Cursor, Claude Code, etc.), you may need to adjust the configuration to match your editor's specific requirements and conventions.

---

## Getting Started Checklist

- [ ] Have an idea for an app
- [ ] Install Node.js (if not already installed)
- [ ] Choose an AI assistant (Claude Code, Cursor, Windsurf, etc.)
- [ ] Create your project: `npx create-laju-app my-project`
- [ ] Describe ALL features you want (be thorough!)
- [ ] Review and approve documentation (README, PRD, PROGRESS)
- [ ] Test it in your browser
- [ ] Deploy when ready

---

## Advanced: When You Want More Control

As you get more comfortable, you can start learning the technical details. But you don't have to - the simple workflow works perfectly fine for building complete applications.

If you're curious, you can ask the AI:
```
Can you explain how the database works?
```
```
What files were created for the project feature?
```

The AI will teach you at your own pace.

---

## Summary

**To build an app with Laju + AI:**

1. Create project (1 command)
2. Set up project with AI (describe ALL features upfront)
3. Let AI build everything concurrently
4. Test in browser
5. Deploy

**No coding required. Just describe thoroughly and let AI build it.**

---

## Need Help?

If you get stuck, just ask the AI:
```
I'm having trouble with [describe the problem]. Can you help me fix it?
```

The AI is there to help you every step of the way.

Happy building! 🚀