# Testing Guide

Complete guide for testing Laju applications with Vitest and Playwright.

## Table of Contents

1. [Setup](#setup)
2. [Unit Tests](#unit-tests)
3. [Integration Tests](#integration-tests)
4. [E2E Tests](#e2e-tests)
5. [Component Tests](#component-tests)
6. [Test Utilities](#test-utilities)
7. [Best Practices](#best-practices)

---

## Setup

### Configuration

Laju uses Vitest for testing with the following setup:

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html']
    }
  }
});
```

### Test Database

```typescript
// tests/setup.ts
import DB from '../app/services/DB';

beforeAll(async () => {
  // Use test database
  process.env.DB_CONNECTION = 'test';
  
  // Run migrations
  await DB.migrate.latest();
});

afterAll(async () => {
  await DB.destroy();
});

beforeEach(async () => {
  // Clean tables before each test
  await DB('users').truncate();
  await DB('posts').truncate();
});
```

### Commands

```bash
# Unit & Integration Tests (Vitest)
npm run test:run              # Run all tests
npm run test:ui               # Run with UI mode
npm run test:coverage         # Run with coverage report
npx vitest                    # Watch mode

# E2E Tests (Playwright)
npm run test:e2e               # Run all E2E tests
npm run test:e2e:ui            # Run with UI mode (recommended)
npm run test:e2e:debug         # Run with debug mode
npm run test:e2e:install        # Install Playwright browsers
```

---

## Unit Tests

### Testing Services

```typescript
// tests/unit/services/Authenticate.test.ts
import { describe, it, expect } from 'vitest';
import Authenticate from '../../app/services/Authenticate';

describe('Authenticate', () => {
  describe('hash', () => {
    it('should hash password with salt', async () => {
      const password = 'mypassword123';
      const hashed = await Authenticate.hash(password);
      
      expect(hashed).toContain(':');
      expect(hashed.split(':').length).toBe(2);
    });

    it('should generate different hashes for same password', async () => {
      const password = 'mypassword123';
      const hash1 = await Authenticate.hash(password);
      const hash2 = await Authenticate.hash(password);
      
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('compare', () => {
    it('should return true for matching password', async () => {
      const password = 'mypassword123';
      const hashed = await Authenticate.hash(password);
      
      const result = await Authenticate.compare(password, hashed);
      
      expect(result).toBe(true);
    });

    it('should return false for wrong password', async () => {
      const password = 'mypassword123';
      const hashed = await Authenticate.hash(password);
      
      const result = await Authenticate.compare('wrongpassword', hashed);
      
      expect(result).toBe(false);
    });
  });
});
```

### Testing Utilities

```typescript
// tests/unit/utils/validation.test.ts
import { describe, it, expect } from 'vitest';

function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

describe('isValidEmail', () => {
  it('should return true for valid emails', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('user.name@domain.co.id')).toBe(true);
  });

  it('should return false for invalid emails', () => {
    expect(isValidEmail('invalid')).toBe(false);
    expect(isValidEmail('invalid@')).toBe(false);
    expect(isValidEmail('@domain.com')).toBe(false);
  });
});
```

---

## Integration Tests

### Testing API Endpoints

```typescript
// tests/integration/auth.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import supertest from 'supertest';
import DB from '../../app/services/DB';
import Authenticate from '../../app/services/Authenticate';

// Note: You'll need to export your app/server for testing
// This is a simplified example

describe('Authentication API', () => {
  beforeEach(async () => {
    await DB('users').truncate();
    await DB('sessions').truncate();
  });

  describe('POST /register', () => {
    it('should create new user with valid data', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      // Create user directly for testing
      const hashedPassword = await Authenticate.hash(userData.password);
      await DB('users').insert({
        id: 'test-id',
        name: userData.name,
        email: userData.email,
        password: hashedPassword
      });

      const user = await DB('users').where('email', userData.email).first();
      
      expect(user).toBeDefined();
      expect(user.name).toBe(userData.name);
      expect(user.email).toBe(userData.email);
    });

    it('should reject duplicate email', async () => {
      const email = 'duplicate@example.com';
      
      await DB('users').insert({
        id: 'user-1',
        name: 'User 1',
        email: email,
        password: await Authenticate.hash('password')
      });

      // Attempt to insert duplicate should fail
      await expect(
        DB('users').insert({
          id: 'user-2',
          name: 'User 2',
          email: email,
          password: await Authenticate.hash('password')
        })
      ).rejects.toThrow();
    });
  });

  describe('Login Flow', () => {
    it('should verify correct password', async () => {
      const password = 'correctpassword';
      const hashedPassword = await Authenticate.hash(password);

      await DB('users').insert({
        id: 'test-user',
        name: 'Test',
        email: 'test@example.com',
        password: hashedPassword
      });

      const user = await DB('users').where('email', 'test@example.com').first();
      const isValid = await Authenticate.compare(password, user.password);
      
      expect(isValid).toBe(true);
    });

    it('should reject wrong password', async () => {
      const hashedPassword = await Authenticate.hash('correctpassword');

      await DB('users').insert({
        id: 'test-user',
        name: 'Test',
        email: 'test@example.com',
        password: hashedPassword
      });

      const user = await DB('users').where('email', 'test@example.com').first();
      const isValid = await Authenticate.compare('wrongpassword', user.password);
      
      expect(isValid).toBe(false);
    });
  });
});
```

### Testing Database Operations

```typescript
// tests/integration/posts.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import DB from '../../app/services/DB';

describe('Posts CRUD', () => {
  beforeEach(async () => {
    await DB('posts').truncate();
  });

  it('should create a post', async () => {
    const post = {
      id: 1,
      title: 'Test Post',
      content: 'Test content',
      created_at: Date.now(),
      updated_at: Date.now()
    };

    await DB('posts').insert(post);
    
    const saved = await DB('posts').where('id', 1).first();
    
    expect(saved.title).toBe('Test Post');
    expect(saved.content).toBe('Test content');
  });

  it('should update a post', async () => {
    await DB('posts').insert({
      id: 1,
      title: 'Original',
      content: 'Content',
      created_at: Date.now(),
      updated_at: Date.now()
    });

    await DB('posts').where('id', 1).update({
      title: 'Updated',
      updated_at: Date.now()
    });
    
    const post = await DB('posts').where('id', 1).first();
    
    expect(post.title).toBe('Updated');
  });

  it('should delete a post', async () => {
    await DB('posts').insert({
      id: 1,
      title: 'To Delete',
      content: 'Content',
      created_at: Date.now(),
      updated_at: Date.now()
    });

    await DB('posts').where('id', 1).delete();
    
    const post = await DB('posts').where('id', 1).first();
    
    expect(post).toBeUndefined();
  });
});
```

---

## E2E Tests

End-to-end testing with Playwright for testing user flows in real browsers.

### Setup

#### Installation

```bash
# Install Playwright
npm install -D @playwright/test

# Install browsers (only required once)
npm run test:e2e:install
```

#### Configuration

Playwright is configured in `playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false, // Run tests sequentially for E2E
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Run tests one at a time
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:5555',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Uncomment after installing browsers:
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  // Auto-start server in CI
  webServer: process.env.CI ? {
    command: 'npm run build && npm run start',
    url: 'http://localhost:5553',
    timeout: 120 * 1000,
  } : undefined,
});
```

### Commands

```bash
# Run all E2E tests
npm run test:e2e

# Run with UI mode (recommended for debugging)
npm run test:e2e:ui

# Run with debug mode (step-by-step)
npm run test:e2e:debug

# Run specific test file
npx playwright test homepage.spec.ts

# Run in specific browser
npx playwright test --project=chromium
```

### Local Development

For local development, start the server manually before running tests:

**Terminal 1:**
```bash
npm run dev
```

**Terminal 2:**
```bash
npm run test:e2e:ui
```

### Test Structure

```
tests/e2e/
├── homepage.spec.ts     # Homepage tests
├── login.spec.ts        # Login page tests
├── register.spec.ts     # Registration page tests
└── README.md           # E2E documentation
```

### Testing Authentication Flows

```typescript
// tests/e2e/login.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login form', async ({ page }) => {
    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');
    const submitButton = page.locator('button[type="submit"]');

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
  });

  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.locator('input[name="password"]');
    const toggleButton = passwordInput.locator('xpath=../button');

    // Initially password should be hidden
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Click toggle button
    await toggleButton.click();

    // Password should now be visible
    await expect(passwordInput).toHaveAttribute('type', 'text');
  });

  test('should disable submit button during submission', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]');

    // Fill form with credentials
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');

    // Submit form
    await submitButton.click();

    // Button should be disabled during submission
    await expect(submitButton).toBeDisabled();

    // Check for loading text
    await expect(submitButton).toContainText('Signing in');
  });

  test('should navigate to register page', async ({ page }) => {
    // Use text-based selector for Inertia links
    const registerLink = page.getByText('Create one');

    // Click register link
    await registerLink.click();

    // Should navigate to register page
    await page.waitForURL('**/register', { timeout: 5000 });
    expect(page.url()).toContain('/register');
  });
});
```

### Testing Forms

```typescript
// tests/e2e/register.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Registration Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
  });

  test('should validate password mismatch', async ({ page }) => {
    const passwordInput = page.locator('input[name="password"]');
    const confirmPasswordInput = page.locator('input[name="confirm-password"]');
    const submitButton = page.locator('button[type="submit"]');

    // Fill with mismatched passwords
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await passwordInput.fill('password123');
    await confirmPasswordInput.fill('different123');

    // Submit form
    await submitButton.click();

    // Check for password mismatch error
    const errorText = page.locator('.text-red-400');
    await expect(errorText.first()).toBeVisible();
    await expect(errorText.first()).toContainText('do not match');
  });

  test('should generate password', async ({ page }) => {
    const generateButton = page.locator('button:has-text("Generate secure password")');
    const passwordInput = page.locator('input[name="password"]');
    const confirmPasswordInput = page.locator('input[name="confirm-password"]');

    // Click generate button
    await generateButton.click();

    // Password fields should be filled
    const passwordValue = await passwordInput.inputValue();
    const confirmValue = await confirmPasswordInput.inputValue();

    expect(passwordValue.length).toBeGreaterThan(0);
    expect(confirmValue).toBe(passwordValue);
  });

  test('should show loading state during submission', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]');

    // Fill form with valid data
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirm-password"]', 'password123');

    // Submit form
    await submitButton.click();

    // Button should be disabled during submission
    await expect(submitButton).toBeDisabled();

    // Check for loading text
    await expect(submitButton).toContainText('Creating account');
  });
});
```

### Testing Inertia.js Applications

When testing Inertia.js applications, use text-based selectors for links:

```typescript
// ❌ Bad - href selector may not work with Inertia
const link = page.locator('a[href="/login"]');

// ✅ Good - text-based selector works with Inertia
const link = page.getByText('Sign in').or(page.locator('a[href="/login"]'));
await expect(link.first()).toBeVisible();
```

### Best Practices for E2E

1. **Test Critical User Flows**
   - Focus on important user journeys (login, registration, checkout)
   - Test success paths AND error paths
   - Verify form validation

2. **Use Selective Testing**
   - Don't test every single field
   - Test key interactions and edge cases
   - Prioritize critical functionality

3. **Wait Properly**
   - ❌ `await page.waitForTimeout(5000)` - flaky
   - ✅ `await page.waitForURL('**/dashboard')` - reliable
   - ✅ `await expect(element).toBeVisible()` - auto-waiting

4. **Use Descriptive Test Names**
   ```typescript
   // Good
   test('should redirect to dashboard after successful login', () => {});

   // Bad
   test('test login redirect', () => {});
   ```

5. **Test Real Scenarios**
   - Use realistic data
   - Test like a real user would interact
   - Include edge cases (empty fields, invalid data)

6. **Keep Tests Independent**
   - Each test should work alone
   - Don't rely on state from previous tests
   - Use `beforeEach` to set up fresh state

### Debugging E2E Tests

**Run with UI Mode:**
```bash
npm run test:e2e:ui
```

**Run with Debug Mode:**
```bash
npm run test:e2e:debug
```

**Run Specific Test:**
```bash
npx playwright test --grep "should display login form"
```

**View Test Reports:**
```bash
npx playwright show-report
```

**Screenshots and Videos:**
- Screenshots are captured automatically on test failure
- Videos are recorded for failed tests
- Check `test-results/` directory after test runs

### CI/CD Integration

E2E tests run automatically in GitHub Actions CI:
- Tests run after unit and integration tests
- Server is auto-started before tests
- Tests run in Chromium (can be extended to Firefox and WebKit)
- Deployment only proceeds if all tests pass
- Failed tests include screenshots and video for debugging

---

## Component Tests

### Testing Svelte Components

```typescript
// tests/components/Button.test.ts
import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import Button from '../../resources/js/Components/Button.svelte';

describe('Button Component', () => {
  it('should render with text', () => {
    const { getByText } = render(Button, {
      props: { label: 'Click Me' }
    });
    
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('should call onClick when clicked', async () => {
    let clicked = false;
    
    const { getByRole } = render(Button, {
      props: {
        label: 'Click',
        onClick: () => { clicked = true; }
      }
    });
    
    await fireEvent.click(getByRole('button'));
    
    expect(clicked).toBe(true);
  });

  it('should be disabled when loading', () => {
    const { getByRole } = render(Button, {
      props: { label: 'Submit', loading: true }
    });
    
    expect(getByRole('button')).toHaveAttribute('disabled');
  });
});
```

---

## Test Utilities

### Factory Functions

```typescript
// tests/factories/user.ts
import { randomUUID } from 'crypto';
import Authenticate from '../../app/services/Authenticate';
import DB from '../../app/services/DB';

export async function createUser(overrides = {}) {
  const defaults = {
    id: randomUUID(),
    name: 'Test User',
    email: `test-${Date.now()}@example.com`,
    password: await Authenticate.hash('password123'),
    is_admin: false,
    is_verified: false,
    created_at: Date.now(),
    updated_at: Date.now()
  };

  const user = { ...defaults, ...overrides };
  await DB('users').insert(user);
  
  return user;
}

export async function createPost(userId: string, overrides = {}) {
  const defaults = {
    id: randomUUID(),
    user_id: userId,
    title: 'Test Post',
    content: 'Test content',
    status: 'draft',
    created_at: Date.now(),
    updated_at: Date.now()
  };

  const post = { ...defaults, ...overrides };
  await DB('posts').insert(post);
  
  return post;
}
```

### Using Factories

```typescript
import { createUser, createPost } from '../factories/user';

describe('Post with User', () => {
  it('should associate post with user', async () => {
    const user = await createUser({ name: 'Author' });
    const post = await createPost(user.id, { title: 'My Post' });
    
    const result = await DB('posts')
      .join('users', 'posts.user_id', 'users.id')
      .where('posts.id', post.id)
      .select('posts.*', 'users.name as author_name')
      .first();
    
    expect(result.author_name).toBe('Author');
    expect(result.title).toBe('My Post');
  });
});
```

---

## Best Practices

### 1. Isolate Tests

```typescript
// Each test should be independent
beforeEach(async () => {
  await DB('users').truncate();
});
```

### 2. Use Descriptive Names

```typescript
// Good
it('should return 401 when password is incorrect', () => {});

// Bad
it('test login', () => {});
```

### 3. Test Edge Cases

```typescript
describe('validateEmail', () => {
  it('should handle empty string', () => {});
  it('should handle null', () => {});
  it('should handle very long email', () => {});
  it('should handle unicode characters', () => {});
});
```

### 4. Mock External Services

```typescript
import { vi } from 'vitest';

// Mock email service
vi.mock('../../app/services/Resend', () => ({
  MailTo: vi.fn().mockResolvedValue({ success: true })
}));
```

### 5. Use Arrange-Act-Assert

```typescript
it('should update user profile', async () => {
  // Arrange
  const user = await createUser({ name: 'Old Name' });
  
  // Act
  await DB('users').where('id', user.id).update({ name: 'New Name' });
  
  // Assert
  const updated = await DB('users').where('id', user.id).first();
  expect(updated.name).toBe('New Name');
});
```

---

## Next Steps

- [E2E Testing Guide](../../tests/e2e/README.md) - Detailed E2E testing documentation
- [Best Practices](09-BEST-PRACTICES.md)
- [API Reference](07-API-REFERENCE.md)
- [Tutorials](11-TUTORIALS.md)
