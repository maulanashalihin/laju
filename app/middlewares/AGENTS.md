# Laju Middlewares

## CRITICAL: Middleware Pattern

**NO `next()` - Different from Express.js!**

In HyperExpress middleware:
- **No return** = continue to next handler
- **`return response.xxx()`** = stop execution

```typescript
export default async (request: Request, response: Response) => {
   if (!authenticated) return response.redirect("/login");
   request.user = user; // continues to handler
}
```

## Common Middleware Patterns

### Authentication Middleware
```typescript
export default async (request: Request, response: Response) => {
   if (!request.cookies.auth_id) {
      return response.cookie("auth_id", "", 0).redirect("/login");
   }
   
   // Set request.user
   request.user = user;
};
```

### CSRF Middleware
```typescript
export default async (request: Request, response: Response) => {
   // Validate CSRF token
   const token = request.headers['x-csrf-token'] || request.body._csrf;
   if (!token || !CSRF.validate(token)) {
      return response.status(403).json({ error: 'Invalid CSRF token' });
   }
};
```

### Inertia Middleware
```typescript
export default async (request: Request, response: Response) => {
   response.inertia = (component, inertiaProps = {}, viewProps = {}) => {
      // Return Inertia response
   };
   // No return - let request pass through
};
```

## Error Handling

Always wrap middleware logic in try-catch:

```typescript
export default async (request: Request, response: Response) => {
   try {
      // middleware logic
   } catch (error) {
      console.error("Middleware error:", error);
      return response.status(500).send("Internal server error");
   }
};
```

## Response Modification

Middlewares can modify the request or response objects:

```typescript
// Add data to request
request.user = user;
request.share = { user };

// Add headers to response
response.setHeader("X-Custom-Header", "value");
```

## Order Matters

Middlewares run in the order they are registered. Ensure proper order:

1. Security headers
2. CSRF protection
3. Authentication
4. Inertia
5. Route-specific middlewares
