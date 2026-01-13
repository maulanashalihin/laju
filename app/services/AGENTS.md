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
