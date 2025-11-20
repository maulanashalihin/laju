# Testing Guide untuk Laju.dev

## 📁 Struktur Testing

```
tests/
├── setup.ts                    # Setup file untuk semua tests
├── unit/                       # Unit tests
│   ├── services/
│   │   ├── DB.test.ts         # Test Knex query builder
│   │   ├── SQLite.test.ts     # Test native SQLite
│   │   └── Authenticate.test.ts # Test password hashing
│   └── controllers/
│       └── AuthController.test.ts
├── integration/                # Integration tests
│   └── auth.test.ts           # Test complete auth flow
└── fixtures/                   # Test data & mocks
```

## 🚀 Cara Menjalankan Tests

### Run All Tests (Watch Mode)
```bash
npm test
```

### Run Tests Sekali (CI Mode)
```bash
npm run test:run
```

### Run dengan UI Interface
```bash
npm run test:ui
```
Buka browser di `http://localhost:51204/__vitest__/`

### Run dengan Coverage Report
```bash
npm run test:coverage
```

### Run Specific Test File
```bash
npx vitest tests/unit/services/DB.test.ts
```

### Run Tests yang Match Pattern
```bash
npx vitest --grep "should insert"
```

## 📝 Menulis Test Baru

### 1. Unit Test Template

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import ServiceName from '../../../app/services/ServiceName';

describe('ServiceName', () => {
  beforeEach(() => {
    // Setup sebelum setiap test
  });

  afterEach(() => {
    // Cleanup setelah setiap test
  });

  describe('Feature Name', () => {
    it('should do something', () => {
      // Arrange
      const input = 'test';
      
      // Act
      const result = ServiceName.method(input);
      
      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

### 2. Integration Test Template

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import DB from '../../app/services/DB';

describe('Feature Integration Tests', () => {
  let testId: number;

  beforeEach(async () => {
    // Setup test data
    const [id] = await DB('table').insert({ data });
    testId = id;
  });

  afterEach(async () => {
    // Cleanup
    await DB('table').where('id', testId).delete();
  });

  it('should complete full workflow', async () => {
    // Test complete feature flow
  });
});
```

## 🎯 Best Practices

### 1. Test Naming
- **Descriptive**: `should create user with valid data`
- **Not**: `test1`, `user test`

### 2. AAA Pattern
```typescript
it('should calculate total price', () => {
  // Arrange - Setup
  const items = [{ price: 100 }, { price: 200 }];
  
  // Act - Execute
  const total = calculateTotal(items);
  
  // Assert - Verify
  expect(total).toBe(300);
});
```

### 3. Cleanup
Selalu cleanup data setelah test:
```typescript
afterEach(async () => {
  if (userId) {
    await DB('users').where('id', userId).delete();
  }
});
```

### 4. Isolasi Test
Setiap test harus independen:
```typescript
// ❌ Bad - Tests depend on each other
it('should create user', () => { /* creates user */ });
it('should update user', () => { /* assumes user exists */ });

// ✅ Good - Each test is independent
it('should create user', () => {
  // Create and cleanup
});

it('should update user', () => {
  // Create user first, then update, then cleanup
});
```

## 🔍 Assertions Umum

### Basic Assertions
```typescript
expect(value).toBe(expected);           // Strict equality
expect(value).toEqual(expected);        // Deep equality
expect(value).toBeTruthy();             // Truthy value
expect(value).toBeFalsy();              // Falsy value
expect(value).toBeNull();               // Null
expect(value).toBeUndefined();          // Undefined
expect(value).toBeDefined();            // Not undefined
```

### Number Assertions
```typescript
expect(number).toBeGreaterThan(3);
expect(number).toBeGreaterThanOrEqual(3);
expect(number).toBeLessThan(5);
expect(number).toBeLessThanOrEqual(5);
expect(number).toBeCloseTo(0.3, 5);     // Floating point
```

### String Assertions
```typescript
expect(string).toMatch(/pattern/);
expect(string).toContain('substring');
expect(string).toHaveLength(10);
```

### Array/Object Assertions
```typescript
expect(array).toContain(item);
expect(array).toHaveLength(3);
expect(object).toHaveProperty('key');
expect(object).toMatchObject({ key: 'value' });
```

### Async Assertions
```typescript
await expect(asyncFn()).resolves.toBe(value);
await expect(asyncFn()).rejects.toThrow();
```

## 🐛 Debugging Tests

### 1. Run Single Test
```bash
npx vitest tests/unit/services/DB.test.ts
```

### 2. Use console.log
```typescript
it('should debug', () => {
  console.log('Debug value:', value);
  expect(value).toBe(expected);
});
```

### 3. Use .only untuk Focus
```typescript
it.only('should run only this test', () => {
  // Only this test will run
});
```

### 4. Skip Tests
```typescript
it.skip('should skip this test', () => {
  // This test will be skipped
});
```

## 📊 Coverage

Lihat coverage report:
```bash
npm run test:coverage
```

Coverage report akan tersimpan di `coverage/index.html`

Target coverage yang baik:
- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

## 🔧 Troubleshooting

### Error: Database locked
```typescript
// Pastikan cleanup di afterEach
afterEach(async () => {
  await DB('table').where('id', testId).delete();
});
```

### Error: Module not found
```bash
# Check tsconfig paths di vitest.config.ts
resolve: {
  alias: {
    'app': path.resolve(__dirname, './app'),
  }
}
```

### Tests timeout
```typescript
// Increase timeout di vitest.config.ts
test: {
  testTimeout: 10000, // 10 seconds
}
```

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [Knex Testing Guide](https://knexjs.org/guide/migrations.html)

## 🎓 Contoh Test Cases

### Test CRUD Operations
```typescript
describe('User CRUD', () => {
  it('should create user', async () => { /* ... */ });
  it('should read user', async () => { /* ... */ });
  it('should update user', async () => { /* ... */ });
  it('should delete user', async () => { /* ... */ });
});
```

### Test Edge Cases
```typescript
describe('Edge Cases', () => {
  it('should handle empty input', () => { /* ... */ });
  it('should handle null values', () => { /* ... */ });
  it('should handle very long strings', () => { /* ... */ });
  it('should handle special characters', () => { /* ... */ });
});
```

### Test Error Handling
```typescript
describe('Error Handling', () => {
  it('should throw on invalid input', () => {
    expect(() => fn(invalid)).toThrow();
  });
  
  it('should return error message', async () => {
    await expect(asyncFn()).rejects.toThrow('Error message');
  });
});
```

---

Happy Testing! 🧪
