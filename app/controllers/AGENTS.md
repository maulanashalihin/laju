# Laju Controllers

## Controller Structure

Controllers are exported as **instances**, not classes. Never use `this` inside controllers.

```typescript
class MyController {
   public async myMethod(request: Request, response: Response) {
      // ❌ WRONG: this.anotherMethod()
      // ✅ CORRECT: MyController.anotherMethod() or extract to utility function
   }
}

export default new MyController();
```

## Response Patterns

### Inertia Responses
```typescript
return response.inertia("PageName", { prop1, prop2 });
```

### JSON Responses
```typescript
return response.json({ success: true, data: result });
```

### Redirects
```typescript
return response.redirect("/path");
```

### Error Responses
```typescript
return response.status(401).json({ error: 'Unauthorized' });
return response.status(404).send("Not found");
```

## Authentication Check

Always check if user is authenticated:

```typescript
if (!request.user) {
   return response.status(401).json({ error: 'Unauthorized' });
}
```

## Input Validation

Always validate input before processing:

```typescript
const body = await request.json();
const validated = Validator.validateOrFail(schema, body, response);
if (!validated) return;
```

## Database Operations

- Use `DB` from `../services/DB` for database operations
- Use Knex for complex queries, joins, transactions
- Use native SQLite for simple reads (via `SQLite` service)

## User Data Updates

When updating user data, always invalidate cache:

```typescript
import Authenticate from "../services/Authenticate";

await DB.from("users").where("id", userId).update({ name: "New Name" });
await Authenticate.invalidateUserSessions(userId);
```

## Error Handling

Always wrap async operations in try-catch:

```typescript
try {
   // operations
} catch (error) {
   console.error("Error:", error);
   return response.status(500).json({ error: "Internal server error" });
}
```
