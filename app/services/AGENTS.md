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

## Database Services

### DB Service (Knex)
Use for complex queries, joins, transactions:

```typescript
import DB from "./DB";

// Complex query with join
const result = await DB.from("users")
   .join("sessions", "users.id", "sessions.user_id")
   .where("users.active", true)
   .select("users.*", "sessions.id as session_id");

// Transaction
await DB.transaction(async (trx) => {
   await trx.from("users").insert(user);
   await trx.from("sessions").insert(session);
});
```

### SQLite Service
Use for simple reads (385% faster):

```typescript
import SQLite from "./SQLite";

const user = SQLite.get("SELECT * FROM users WHERE id = ?", [id]);
```

## Authentication Service

```typescript
import Authenticate from "./Authenticate";

// Hash password
const hashed = await Authenticate.hash(password);

// Compare password
const match = await Authenticate.compare(password, hashed);

// Create session
await Authenticate.process(user, request, response);

// Logout
await Authenticate.logout(request, response);

// Invalidate all user sessions
await Authenticate.invalidateUserSessions(userId);
```

## Cache Service

```typescript
import Cache from "./CacheService";

// Get from cache
const data = await Cache.get<MyType>("key");

// Put in cache (expires in minutes)
await Cache.put("key", value, 60);

// Remember pattern (get or compute)
const data = await Cache.remember("key", 60, async () => {
   return await expensiveOperation();
});

// Forget (delete)
await Cache.forget("key");
```

## Validation Service

```typescript
import Validator from "./Validator";
import { mySchema } from "../validators/MyValidator";

const validated = Validator.validateOrFail(mySchema, body, response);
if (!validated) return;
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
