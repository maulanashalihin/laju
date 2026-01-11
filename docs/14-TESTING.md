# Testing Guide

Complete guide for testing Laju applications with Vitest.

## Table of Contents

1. [Setup](#setup)
2. [Unit Tests](#unit-tests)
3. [Integration Tests](#integration-tests)
4. [Component Tests](#component-tests)
5. [Test Utilities](#test-utilities)
6. [Best Practices](#best-practices)

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
# Run all tests
npm run test:run

# Run tests with UI
npm run test:ui

# Run with coverage
npm run test:coverage

# Watch mode
npx vitest
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

- [Best Practices](09-BEST-PRACTICES.md)
- [API Reference](07-API-REFERENCE.md)
- [Tutorials](11-TUTORIALS.md)
