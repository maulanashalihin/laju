# Testing Guide - Comprehensive Testing Reference

## Purpose

This guide provides comprehensive testing strategies for Laju Framework. It serves as a reference for TASK_AGENT (which implements features) and MANAGER_AGENT (which manages changes) to maintain high-quality standards throughout the development lifecycle.

**Note:** Testing runs automatically via GitHub Actions CI. You don't need to mention it manually. This guide is for reference when writing tests.

---

## Core Responsibilities

1. **Create Test Plans** - Define testing strategy for new features
2. **Write Unit Tests** - Test individual components in isolation
3. **Write Integration Tests** - Test how components work together
4. **Write E2E Tests** - Test complete user flows
5. **Run Automated Tests** - Execute test suites and verify results
6. **Generate Test Reports** - Document test coverage and results
7. **Verify Bug Fixes** - Ensure fixes actually resolve issues
8. **Regression Testing** - Ensure new code doesn't break existing functionality

---

## Testing Workflow

### Step 1: Create Test Plan

Before writing tests, create a comprehensive test plan:

**Test Plan Template:**
```markdown
## Test Plan: [Feature Name]

### Testing Scope
- Unit tests: [List components to test]
- Integration tests: [List API endpoints to test]
- E2E tests: [List user flows to test]

### Test Cases
1. [Test case 1]
   - Input: [description]
   - Expected output: [description]
   - Priority: [Critical/High/Medium/Low]

2. [Test case 2]
   - Input: [description]
   - Expected output: [description]
   - Priority: [Critical/High/Medium/Low]

### Edge Cases
- [Edge case 1]
- [Edge case 2]

### Test Data
- [Sample data for testing]
```

### Step 2: Write Unit Tests

Unit tests test individual components in isolation.

**Tech Stack:**
- **Vitest** - Unit testing framework (built-in with Vite)
- **Testing Library** - Component testing utilities

**Controller Unit Tests:**
```typescript
// tests/controllers/PostController.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PostController } from '../../app/controllers/PostController'
import { DB } from '../../app/services/DB'
import { Validator } from '../../app/services/Validator'

describe('PostController', () => {
  let controller: PostController
  let mockRequest: any
  let mockResponse: any

  beforeEach(() => {
    controller = new PostController()
    mockRequest = {
      user: { id: 1 },
      json: vi.fn(),
      params: { id: 1 }
    }
    mockResponse = {
      inertia: vi.fn(),
      flash: vi.fn(() => mockResponse),
      redirect: vi.fn(() => mockResponse)
    }
  })

  describe('index', () => {
    it('should return all posts with user names', async () => {
      const mockPosts = [
        { id: 1, title: 'Test Post', name: 'John Doe', created_at: 1234567890 }
      ]

      vi.spyOn(DB, 'from').mockReturnValue({
        join: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockResolvedValue(mockPosts)
      } as any)

      await controller.index()

      expect(mockResponse.inertia).toHaveBeenCalledWith('posts/index', { posts: mockPosts })
    })
  })

  describe('store', () => {
    it('should create a new post with valid data', async () => {
      const validData = { title: 'New Post', content: 'Content' }
      mockRequest.json.mockResolvedValue(validData)

      vi.spyOn(Validator, 'validate').mockReturnValue({
        success: true,
        data: validData
      })

      vi.spyOn(DB, 'table').mockReturnValue({
        insert: vi.fn().mockResolvedValue([])
      } as any)

      await controller.store()

      expect(DB.table).toHaveBeenCalledWith('posts')
      expect(mockResponse.flash).toHaveBeenCalledWith('success', 'Post berhasil dibuat')
    })

    it('should return error with invalid data', async () => {
      const invalidData = { title: '', content: '' }
      mockRequest.json.mockResolvedValue(invalidData)

      vi.spyOn(Validator, 'validate').mockReturnValue({
        success: false,
        errors: { title: ['Title is required'] }
      })

      await controller.store()

      expect(mockResponse.flash).toHaveBeenCalledWith('error', 'Title is required')
    })
  })

  describe('update', () => {
    it('should update an existing post', async () => {
      const validData = { title: 'Updated Post', content: 'Updated content' }
      mockRequest.json.mockResolvedValue(validData)

      vi.spyOn(Validator, 'validate').mockReturnValue({
        success: true,
        data: validData
      })

      vi.spyOn(DB, 'from').mockReturnValue({
        where: vi.fn().mockReturnValue({
          update: vi.fn().mockResolvedValue([])
        })
      } as any)

      await controller.update()

      expect(DB.from).toHaveBeenCalledWith('posts')
      expect(mockResponse.flash).toHaveBeenCalledWith('success', 'Post berhasil diupdate')
    })
  })

  describe('destroy', () => {
    it('should delete a post', async () => {
      vi.spyOn(DB, 'from').mockReturnValue({
        where: vi.fn().mockReturnValue({
          delete: vi.fn().mockResolvedValue([])
        })
      } as any)

      await controller.destroy()

      expect(DB.from).toHaveBeenCalledWith('posts')
      expect(mockResponse.flash).toHaveBeenCalledWith('success', 'Post berhasil dihapus')
    })
  })
})
```

**Service Unit Tests:**
```typescript
// tests/services/Validator.test.ts
import { describe, it, expect } from 'vitest'
import { Validator } from '../../app/services/Validator'
import { z } from 'zod'

describe('Validator', () => {
  const schema = z.object({
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(1, 'Content is required')
  })

  describe('validate', () => {
    it('should return success with valid data', () => {
      const data = { title: 'Test', content: 'Content' }
      const result = Validator.validate(schema, data)

      expect(result.success).toBe(true)
      expect(result.data).toEqual(data)
    })

    it('should return errors with invalid data', () => {
      const data = { title: '', content: '' }
      const result = Validator.validate(schema, data)

      expect(result.success).toBe(false)
      expect(result.errors).toBeDefined()
    })
  })
})
```

### Step 3: Write Integration Tests

Integration tests test how components work together.

**API Integration Tests:**
```typescript
// tests/integration/api.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { app } from '../../server'
import request from 'supertest'

describe('API Integration Tests', () => {
  let authToken: string

  beforeAll(async () => {
    // Setup: Create test user and get auth token
    const response = await request(app)
      .post('/api/login')
      .send({ email: 'test@example.com', password: 'password' })

    authToken = response.body.token
  })

  afterAll(async () => {
    // Cleanup: Delete test data
  })

  describe('POST /posts', () => {
    it('should create a new post', async () => {
      const response = await request(app)
        .post('/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Test Post', content: 'Test content' })

      expect(response.status).toBe(302)
      expect(response.headers.location).toContain('/posts')
    })

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/posts')
        .send({ title: 'Test Post', content: 'Test content' })

      expect(response.status).toBe(401)
    })

    it('should return validation errors with invalid data', async () => {
      const response = await request(app)
        .post('/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: '', content: '' })

      expect(response.status).toBe(302)
    })
  })

  describe('GET /posts', () => {
    it('should return all posts', async () => {
      const response = await request(app)
        .get('/posts')
        .set('Authorization', `Bearer ${authToken}`)

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body.posts)).toBe(true)
    })
  })
})
```

### Step 4: Write E2E Tests

E2E tests test complete user flows using Playwright.

**E2E Test Setup:**
```typescript
// tests/e2e/posts.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Posts E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
  })

  test('should create a new post', async ({ page }) => {
    await page.goto('/posts')
    await page.click('text=Buat Post')

    await page.fill('input[name="title"]', 'Test Post')
    await page.fill('textarea[name="content"]', 'Test content')
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL('/posts')
    await expect(page.locator('text=Post berhasil dibuat')).toBeVisible()
    await expect(page.locator('text=Test Post')).toBeVisible()
  })

  test('should edit an existing post', async ({ page }) => {
    await page.goto('/posts')
    await page.click('text=Edit')

    await page.fill('input[name="title"]', 'Updated Post')
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL('/posts')
    await expect(page.locator('text=Post berhasil diupdate')).toBeVisible()
    await expect(page.locator('text=Updated Post')).toBeVisible()
  })

  test('should delete a post', async ({ page }) => {
    await page.goto('/posts')
    const postCount = await page.locator('.post-card').count()

    await page.click('text=Hapus')
    await page.on('dialog', dialog => dialog.accept())

    await expect(page.locator('text=Post berhasil dihapus')).toBeVisible()
    await expect(page.locator('.post-card')).toHaveCount(postCount - 1)
  })

  test('should show validation errors', async ({ page }) => {
    await page.goto('/posts/create')
    await page.click('button[type="submit"]')

    await expect(page.locator('text=Title is required')).toBeVisible()
    await expect(page.locator('text=Content is required')).toBeVisible()
  })
})
```

### Step 5: Run Automated Tests

**Run all tests:**
```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

**Run specific tests:**
```bash
# Controller tests
npm run test tests/controllers

# Integration tests
npm run test tests/integration

# E2E tests
npm run test:e2e
```

**Run tests with coverage:**
```bash
npm run test:coverage
```

This generates a coverage report in `coverage/` directory showing:
- Percentage of code covered
- Which lines are not covered
- Branch coverage
- Function coverage

### Step 6: Generate Test Reports

**Test Report Template:**
```markdown
## Test Report: [Feature Name]

**Date:** YYYY-MM-DD
**Tested By:** TASK_AGENT

### Summary
- Total Tests: 25
- Passed: 23
- Failed: 2
- Coverage: 85%

### Unit Tests
- ✅ PostController.index
- ✅ PostController.store
- ✅ PostController.update
- ✅ PostController.destroy
- ✅ Validator.validate

### Integration Tests
- ✅ POST /posts (authenticated)
- ✅ POST /posts (unauthenticated)
- ✅ GET /posts
- ❌ PUT /posts/:id (expected 303, got 302)

### E2E Tests
- ✅ Create post flow
- ✅ Edit post flow
- ✅ Delete post flow
- ❌ Delete post confirmation (dialog not handled)

### Failed Tests
1. PUT /posts/:id
   - Expected: 303 status code
   - Got: 302 status code
   - Severity: Medium
   - Action: Update controller to return 303

2. Delete post confirmation
   - Issue: Dialog not handled properly
   - Severity: Low
   - Action: Add dialog handler to test

### Recommendations
- Fix status code issue in PostController.update
- Add dialog handler to delete test
- Increase coverage to 90%+

### Next Steps
1. Fix failed tests
2. Re-run tests
3. Verify all pass
4. Report to MANAGER_AGENT
```

### Step 7: Verify Bug Fixes

When a bug is reported and fixed:

**Bug Verification Workflow:**
1. **Read bug report** - Understand the issue
2. **Write reproduction test** - Test that fails with the bug
3. **Verify fix** - Run test and ensure it passes
4. **Regression test** - Ensure fix doesn't break other features

**Example:**
```typescript
// tests/bugs/delete-residents-with-payments.test.ts
import { describe, it, expect } from 'vitest'
import { DB } from '../../app/services/DB'

describe('Bug: Users can delete residents with payment history', () => {
  it('should prevent deletion of residents with payments', async () => {
    // Setup: Create resident with payment history
    const residentId = 1

    // Attempt to delete
    try {
      await DB.from('residents').where('id', residentId).delete()
      expect.fail('Should have thrown an error')
    } catch (error) {
      expect(error.message).toContain('Cannot delete resident with payment history')
    }
  })

  it('should allow deletion of residents without payments', async () => {
    // Setup: Create resident without payment history
    const residentId = 2

    // Attempt to delete
    await DB.from('residents').where('id', residentId).delete()

    // Verify deleted
    const resident = await DB.from('residents').where('id', residentId).first()
    expect(resident).toBeUndefined()
  })
})
```

### Step 8: Regression Testing

After new features or bug fixes, run regression tests:

**Regression Testing Checklist:**
- [ ] Run all unit tests
- [ ] Run all integration tests
- [ ] Run all E2E tests
- [ ] Check test coverage hasn't decreased
- [ ] Verify no new console errors
- [ ] Test critical user flows manually

**Regression Test Report:**
```markdown
## Regression Test Report

**Date:** YYYY-MM-DD
**Changes:** [List of changes]

### Test Results
- Unit Tests: ✅ All pass (25/25)
- Integration Tests: ✅ All pass (15/15)
- E2E Tests: ✅ All pass (10/10)
- Coverage: 85% (no decrease)

### Manual Testing
- ✅ Login flow
- ✅ Create post
- ✅ Edit post
- ✅ Delete post
- ✅ Navigation
- ✅ Mobile responsive

### Issues Found
- None

### Conclusion
✅ Ready for deployment
```

---

## Best Practices

### 1. Test Pyramid

```
    /\
   /E2E\      - Few tests, slow, expensive
  /------\
 /        \
/  Integration\ - Moderate tests, medium speed
/            \
/   Unit Tests\  - Many tests, fast, cheap
/______________\
```

**Guidelines:**
- 70% Unit tests (fast, isolated)
- 20% Integration tests (medium speed, test interactions)
- 10% E2E tests (slow, test critical user flows)

### 2. Test Naming

**Good test names:**
```typescript
it('should create a new post with valid data')
it('should return error when title is empty')
it('should prevent deletion of residents with payment history')
```

**Bad test names:**
```typescript
it('test1')
it('it works')
it('check post')
```

### 3. Test Isolation

Each test should be independent:
- Setup data in `beforeEach`
- Cleanup data in `afterEach`
- Don't rely on test execution order
- Use mock data, not production data

### 4. Arrange-Act-Assert Pattern

```typescript
it('should create a new post', async () => {
  // Arrange
  const validData = { title: 'Test', content: 'Content' }
  mockRequest.json.mockResolvedValue(validData)

  // Act
  await controller.store()

  // Assert
  expect(mockResponse.flash).toHaveBeenCalledWith('success', 'Post berhasil dibuat')
})
```

### 5. Mock External Dependencies

```typescript
// Mock database calls
vi.spyOn(DB, 'from').mockReturnValue({...})

// Mock validator
vi.spyOn(Validator, 'validate').mockReturnValue({...})

// Mock file system
vi.mock('fs')
```

### 6. Test Coverage Goals

- **Minimum:** 70% coverage
- **Good:** 80% coverage
- **Excellent:** 90%+ coverage

Focus on:
- Critical business logic
- Error handling
- Edge cases
- Security-related code

---

## Common Testing Patterns

### Pattern 1: Controller Testing

```typescript
describe('ControllerName', () => {
  beforeEach(() => {
    // Setup mocks
  })

  describe('methodName', () => {
    it('should return success with valid input', async () => {
      // Arrange
      const validData = { ... }

      // Act
      await controller.methodName()

      // Assert
      expect(result).toBe(...)
    })

    it('should return error with invalid input', async () => {
      // Arrange
      const invalidData = { ... }

      // Act
      await controller.methodName()

      // Assert
      expect(error).toBe(...)
    })
  })
})
```

### Pattern 2: API Testing

```typescript
describe('API Endpoint', () => {
  let authToken: string

  beforeAll(async () => {
    // Get auth token
  })

  it('should return 200 with authentication', async () => {
    const response = await request(app)
      .get('/endpoint')
      .set('Authorization', `Bearer ${authToken}`)

    expect(response.status).toBe(200)
  })

  it('should return 401 without authentication', async () => {
    const response = await request(app).get('/endpoint')

    expect(response.status).toBe(401)
  })
})
```

### Pattern 3: E2E Testing

```typescript
test('user flow description', async ({ page }) => {
  // Navigate to page
  await page.goto('/url')

  // Perform actions
  await page.fill('selector', 'value')
  await page.click('button')

  // Wait for result
  await page.waitForURL('/expected-url')

  // Assert
  await expect(page.locator('text')).toBeVisible()
})
```

---

## Test File Structure

```
tests/
├── unit/
│   ├── controllers/
│   │   └── PostController.test.ts
│   ├── services/
│   │   └── Validator.test.ts
│   └── utils/
│       └── helpers.test.ts
├── integration/
│   └── api.test.ts
├── e2e/
│   └── posts.spec.ts
├── bugs/
│   └── delete-residents-with-payments.test.ts
└── setup.ts
```

---

## Configuration

### Vitest Configuration (vitest.config.ts)

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'tests/']
    }
  }
})
```

### Playwright Configuration (playwright.config.ts)

```typescript
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5555',
    trace: 'on-first-retry'
  }
})
```

---

## Quick Reference

### Run Tests
```bash
npm run test              # All tests
npm run test:unit        # Unit tests only
npm run test:integration # Integration tests only
npm run test:e2e         # E2E tests only
npm run test:coverage    # With coverage report
npm run test:watch       # Watch mode
```

### Test Commands
```bash
# Run specific test file
npm run test PostController.test.ts

# Run tests matching pattern
npm run test -- --grep "should create"

# Run tests in specific directory
npm run test tests/controllers
```

### Coverage Commands
```bash
# View coverage report
open coverage/index.html

# Check coverage threshold
npm run test:coverage
```

---

## Summary

This guide ensures code quality through:

1. **Test Planning** - Create comprehensive test plans
2. **Unit Testing** - Test individual components
3. **Integration Testing** - Test component interactions
4. **E2E Testing** - Test complete user flows
5. **Test Execution** - Run automated tests (via GitHub Actions CI)
6. **Test Reporting** - Document results and coverage
7. **Bug Verification** - Ensure fixes work
8. **Regression Testing** - Prevent breaking changes

**Note:** Tests run automatically via GitHub Actions CI when you push to GitHub. This guide is for reference when writing tests.
