# Project Workflow & Management

## How to Work with AI

### 1. Describe What You Want
Tell the AI in plain language what you want to build:
```
I want a [type of app] where users can [main features]
```

### 2. Review and Approve
The AI will show you what it created. Review it and:
- Say "yes" if it looks good
- Ask for changes if needed
- Be specific about what to change

### 3. Test in Browser
Always test your changes:
```
Open http://localhost:5555 and try the new feature
```

### 4. Ask for Fixes
If something doesn't work:
```
The [feature] doesn't work. [Describe what happens]
```

---

## When to Commit Changes

### Commit After Each Feature
When a feature is complete and working:
```bash
git add .
git commit -m "feat: [describe what you added]"
```

**Example:**
```bash
git add .
git commit -m "feat: add user registration"
```

### Commit After Bug Fixes
When you fix a problem:
```bash
git add .
git commit -m "fix: [describe what you fixed]"
```

**Example:**
```bash
git add .
git commit -m "fix: resolve login error"
```

### Commit Message Format
Use these prefixes:
- `feat:` - New feature
- `fix:` - Bug fix
- `update:` - Update to existing feature
- `style:` - Visual changes only

---

## Project Management

### Start with README.md
Put your project details in README.md:
```markdown
# [Project Name]

## What This Does
[Describe your app in 1-2 sentences]

## Main Features
- Feature 1
- Feature 2
- Feature 3

## Who It's For
[Describe your target users]
```

### Keep Features Small
Don't try to build everything at once. Start simple:
1. Build the most important feature first
2. Test it thoroughly
3. Add the next feature
4. Repeat

### Track Your Progress
Keep a simple list of what you've done:
```
✓ User registration
✓ Login system
✓ Dashboard
○ User profile (next)
○ Settings (later)
```

---

## Common Patterns

### Adding a New Feature
1. Describe the feature to AI
2. Review what AI creates
3. Test in browser
4. Ask for changes if needed
5. Commit when working

### Fixing a Problem
1. Describe the problem to AI
2. AI will investigate and fix
3. Test the fix
4. Commit the fix

### Making Changes
1. Describe what you want to change
2. AI will update the code
3. Test the changes
4. Commit the update

---

## Tips for Success

### Be Specific
Instead of: "Make it better"
Say: "Make the buttons bigger and easier to click"

### Test Often
Test every feature after it's built. Don't wait until the end.

### Commit Frequently
Commit after each working feature. Don't wait too long.

### Ask Questions
If you don't understand something, ask the AI to explain in simple terms.

### Take Breaks
If you get stuck, take a break. Come back with fresh eyes.

---

## Getting Unstuck

### If AI Makes a Mistake
```
That's not what I wanted. I need [describe what you actually want]
```

### If You Don't Understand
```
I don't understand. Can you explain in simpler terms?
```

### If Something Doesn't Work
```
[Feature] isn't working. When I [what you did], [what happened]
```

### If You Want to Start Over
```
Let's remove [feature] and try a different approach
```

---

## Remember

- You don't need to code - just describe what you want
- Test everything in your browser
- Commit after each working feature
- Be specific about what you want
- Ask for help when you need it

The AI is here to help you build your app. Just describe, review, test, and iterate!