# Laju Services

## Service Pattern

Services are exported as **singleton instances**:

```typescript
class MyService {
   public async myMethod() {
      // implementation
   }
}

export default new MyService();
```

## When to Create a Service

Create a service for:
- Business logic that's reused across multiple controllers
- External API integrations
- Complex computations or transformations
- Stateful operations (caching, sessions)

**Note**: Database operations should be done directly in controllers using `DB` or `SQLite`.

## Service Structure

```typescript
class MyService {
   // Public methods are the interface
   public async getData(id: number): Promise<Data> {
      try {
         const data = SQLite.get("SELECT * FROM table WHERE id = ?", [id]);
         return data;
      } catch (error) {
         console.error("MyService.getData error:", error);
         throw error;
      }
   }

   // Private methods are internal helpers
   private validateInput(input: any): boolean {
      return input && typeof input === "object";
   }
}

export default new MyService();
```

## Using Other Services

Services can use other services:

```typescript
import Cache from "./CacheService";

class ProductService {
   public async getProducts() {
      return await Cache.remember("products", 60, async () => {
         return SQLite.all("SELECT * FROM products");
      });
   }
}

export default new ProductService();
```

## Error Handling

Always wrap service methods in try-catch:

```typescript
class MyService {
   public async myMethod() {
      try {
         // implementation
      } catch (error) {
         console.error("Service error:", error);
         throw error; // Re-throw for controller to handle
      }
   }
}
```

## Async/Await

All service methods should be async when dealing with I/O:

```typescript
public async myMethod(): Promise<Result> {
   // async operations
}
```

## Type Safety

Use TypeScript interfaces for return types:

```typescript
interface User {
   id: number;
   name: string;
   email: string;
}

class UserService {
   public async findById(id: number): Promise<User | undefined> {
      return SQLite.get("SELECT * FROM users WHERE id = ?", [id]);
   }
}
```

## Validator Service

The Validator service provides type-safe input validation using Zod.

### API Methods

#### `validate<T>(schema, data)`

Validate data and return result object.

```typescript
const result = Validator.validate(schema, data);

if (result.success) {
   console.log(result.data); // Typed data
} else {
   console.log(result.errors); // Error messages
}
```

#### `validateOrFail<T>(schema, data, response)`

Validate and automatically send error response if failed. Returns `null` on failure.

```typescript
const validatedData = Validator.validateOrFail(schema, data, response);
if (!validatedData) return; // Validation failed, response already sent

// Continue with validated data
```

#### `validateOrThrow<T>(schema, data)`

Validate and throw ZodError if validation fails.

```typescript
const data = Validator.validateOrThrow(schema, data);
```

### Common Schemas

Pre-built validation schemas available:

```typescript
Validator.schemas.email          // Email validation
Validator.schemas.password       // Password (min 8 chars, 1 number)
Validator.schemas.phone          // Indonesian phone format
Validator.schemas.requiredString('Name')  // Required string
Validator.schemas.optionalString // Optional string
Validator.schemas.positiveNumber // Positive number
Validator.schemas.url            // URL validation
Validator.schemas.date           // ISO date format
Validator.schemas.boolean        // Boolean
Validator.schemas.uuid           // UUID
```
