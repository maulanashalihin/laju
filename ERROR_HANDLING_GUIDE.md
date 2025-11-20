# Error Handling & Logging Guide

## 📚 Overview

Laju.dev sekarang memiliki **production-ready error handling** dan **structured logging** menggunakan Winston.

---

## 🎯 Features

### 1. **Structured Logging**
- ✅ Multiple log levels (error, warn, info, http, debug)
- ✅ File-based logging dengan rotation
- ✅ Console logging di development
- ✅ Structured JSON format
- ✅ Request/Response logging
- ✅ Error stack traces

### 2. **Error Handling**
- ✅ Custom error classes
- ✅ Automatic error mapping
- ✅ SQLite error handling
- ✅ Validation error handling
- ✅ Production-safe error messages
- ✅ Development-friendly error details

### 3. **Request Logging**
- ✅ Auto-log semua HTTP requests
- ✅ Response time tracking
- ✅ IP address logging
- ✅ User agent tracking

---

## 📁 File Structure

```
app/
├── services/
│   └── Logger.ts              # Winston logger service
└── middlewares/
    ├── errorHandler.ts        # Global error handler
    └── requestLogger.ts       # Request logging middleware

logs/                          # Log files (auto-created)
├── combined.log              # All logs
├── error.log                 # Error logs only
├── exceptions.log            # Uncaught exceptions
└── rejections.log            # Unhandled rejections
```

---

## 🚀 Usage

### 1. Logging

#### Import Logger
```typescript
import logger, { logInfo, logError, logWarn, logDebug } from 'app/services/Logger';
```

#### Basic Logging
```typescript
// Info log
logInfo('User registered successfully', { userId: 123, email: 'user@example.com' });

// Error log
logError('Failed to send email', error, { userId: 123 });

// Warning log
logWarn('Rate limit approaching', { ip: '192.168.1.1', requests: 95 });

// Debug log (only in development)
logDebug('Processing payment', { amount: 100, currency: 'USD' });
```

#### HTTP Request Logging
```typescript
import { logRequest, logResponse } from 'app/services/Logger';

// Log request
logRequest(request, { userId: request.user?.id });

// Log response (with duration)
logResponse(request, response, 150); // 150ms
```

#### Database Query Logging
```typescript
import { logQuery } from 'app/services/Logger';

const startTime = Date.now();
const result = await DB('users').where('id', userId);
const duration = Date.now() - startTime;

logQuery('SELECT * FROM users WHERE id = ?', duration, { userId });
```

---

### 2. Error Handling

#### Using Custom Error Classes

```typescript
import { 
  AppError, 
  ValidationError, 
  NotFoundError, 
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  DatabaseError
} from 'app/middlewares/errorHandler';

// In your controller
public async getUser(request: Request, response: Response) {
  const { id } = request.params;
  
  const user = await DB('users').where('id', id).first();
  
  if (!user) {
    throw new NotFoundError('User not found');
  }
  
  return response.json({ success: true, data: user });
}
```

#### Available Error Classes

```typescript
// 400 Bad Request
throw new ValidationError('Invalid email format');

// 401 Unauthorized
throw new UnauthorizedError('Please login to continue');

// 403 Forbidden
throw new ForbiddenError('You do not have permission');

// 404 Not Found
throw new NotFoundError('Resource not found');

// 409 Conflict
throw new ConflictError('Email already exists');

// 500 Internal Server Error
throw new DatabaseError('Failed to connect to database');

// Custom error
throw new AppError('Custom error message', 418, 'CUSTOM_CODE');
```

#### Async Handler Wrapper

```typescript
import { asyncHandler } from 'app/middlewares/errorHandler';

// Wrap async route handlers
public getUsers = asyncHandler(async (request: Request, response: Response) => {
  const users = await DB('users').select('*');
  return response.json({ success: true, data: users });
});
```

---

## 📊 Log Levels

### Available Levels
```typescript
error   // 0 - Errors only
warn    // 1 - Warnings + errors
info    // 2 - Info + warnings + errors (default)
http    // 3 - HTTP requests + above
debug   // 4 - Debug info + all above
```

### Set Log Level
```bash
# In .env
LOG_LEVEL=debug  # Development
LOG_LEVEL=info   # Production
LOG_LEVEL=error  # Production (minimal)
```

---

## 🎨 Log Format

### Console (Development)
```
2025-01-20 10:30:45 [info]: Server started successfully
{
  "port": 5555,
  "environment": "development",
  "url": "http://localhost:5555"
}
```

### File (JSON)
```json
{
  "level": "info",
  "message": "Server started successfully",
  "service": "laju-app",
  "environment": "development",
  "port": 5555,
  "url": "http://localhost:5555",
  "timestamp": "2025-01-20 10:30:45"
}
```

---

## 🔍 Error Response Format

### Development
```json
{
  "success": false,
  "error": {
    "message": "User not found",
    "code": "NOT_FOUND",
    "statusCode": 404,
    "stack": "Error: User not found\n    at ..."
  }
}
```

### Production
```json
{
  "success": false,
  "error": {
    "message": "User not found",
    "code": "NOT_FOUND",
    "statusCode": 404
  }
}
```

### Validation Error
```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "statusCode": 422,
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

---

## 💡 Best Practices

### 1. Always Use Structured Logging
```typescript
// ❌ Bad
console.log('User created');

// ✅ Good
logInfo('User created', { userId: user.id, email: user.email });
```

### 2. Log Errors with Context
```typescript
// ❌ Bad
logError('Error occurred', error);

// ✅ Good
logError('Failed to create user', error, {
  email: userData.email,
  ip: request.ip,
  userId: request.user?.id
});
```

### 3. Use Appropriate Error Classes
```typescript
// ❌ Bad
throw new Error('User not found');

// ✅ Good
throw new NotFoundError('User not found');
```

### 4. Don't Expose Sensitive Data
```typescript
// ❌ Bad
logInfo('User login', { password: user.password });

// ✅ Good
logInfo('User login', { userId: user.id, email: user.email });
```

### 5. Use Async Handler for Routes
```typescript
// ❌ Bad - errors not caught
Route.get('/users', async (req, res) => {
  const users = await DB('users');
  res.json(users);
});

// ✅ Good - errors automatically caught
Route.get('/users', asyncHandler(async (req, res) => {
  const users = await DB('users');
  res.json({ success: true, data: users });
}));
```

---

## 🛠️ Example: Complete Controller

```typescript
import { Request, Response } from '../../type';
import DB from '../services/DB';
import { logInfo, logError } from '../services/Logger';
import { 
  asyncHandler, 
  NotFoundError, 
  ValidationError 
} from '../middlewares/errorHandler';

class UserController {
  // Get all users
  public index = asyncHandler(async (request: Request, response: Response) => {
    logInfo('Fetching users', { userId: request.user?.id });
    
    const users = await DB('users').select('id', 'name', 'email');
    
    return response.json({
      success: true,
      data: users
    });
  });

  // Get single user
  public show = asyncHandler(async (request: Request, response: Response) => {
    const { id } = request.params;
    
    const user = await DB('users').where('id', id).first();
    
    if (!user) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }
    
    logInfo('User retrieved', { userId: id });
    
    return response.json({
      success: true,
      data: user
    });
  });

  // Create user
  public store = asyncHandler(async (request: Request, response: Response) => {
    const { name, email } = await request.json();
    
    // Validation
    if (!email || !email.includes('@')) {
      throw new ValidationError('Invalid email format');
    }
    
    try {
      const [id] = await DB('users').insert({
        name,
        email,
        created_at: Date.now(),
        updated_at: Date.now()
      });
      
      logInfo('User created', { userId: id, email });
      
      return response.status(201).json({
        success: true,
        data: { id, name, email }
      });
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new ConflictError('Email already exists');
      }
      throw error;
    }
  });

  // Update user
  public update = asyncHandler(async (request: Request, response: Response) => {
    const { id } = request.params;
    const { name, email } = await request.json();
    
    const updated = await DB('users')
      .where('id', id)
      .update({ name, email, updated_at: Date.now() });
    
    if (!updated) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }
    
    logInfo('User updated', { userId: id });
    
    return response.json({
      success: true,
      message: 'User updated successfully'
    });
  });

  // Delete user
  public destroy = asyncHandler(async (request: Request, response: Response) => {
    const { id } = request.params;
    
    const deleted = await DB('users').where('id', id).delete();
    
    if (!deleted) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }
    
    logInfo('User deleted', { userId: id });
    
    return response.json({
      success: true,
      message: 'User deleted successfully'
    });
  });
}

export default new UserController();
```

---

## 📈 Monitoring Logs

### View Logs in Real-time
```bash
# All logs
tail -f logs/combined.log

# Errors only
tail -f logs/error.log

# HTTP requests
tail -f logs/combined.log | grep "HTTP"
```

### Search Logs
```bash
# Find specific user actions
grep "userId.*123" logs/combined.log

# Find errors
grep "level.*error" logs/combined.log

# Find slow requests (>1000ms)
grep "duration.*[0-9]{4,}ms" logs/combined.log
```

---

## 🔧 Configuration

### Log File Rotation
```typescript
// In app/services/Logger.ts
new winston.transports.File({ 
  filename: 'logs/error.log',
  maxsize: 5242880,  // 5MB
  maxFiles: 5,       // Keep 5 files
})
```

### Custom Log Format
```typescript
// Add custom fields
logger.defaultMeta = {
  service: 'laju-app',
  environment: process.env.NODE_ENV,
  version: '1.0.0'
};
```

---

## ✅ Checklist

- [x] Winston logger installed
- [x] Error handler middleware created
- [x] Request logger middleware created
- [x] Custom error classes defined
- [x] Server.ts updated with error handling
- [x] Logs directory added to .gitignore
- [x] LOG_LEVEL environment variable added
- [x] Documentation created

---

## 🎉 Summary

Laju.dev sekarang memiliki:
- ✅ **Production-ready error handling**
- ✅ **Structured logging dengan Winston**
- ✅ **Automatic request/response logging**
- ✅ **Custom error classes**
- ✅ **SQLite error mapping**
- ✅ **Development-friendly debugging**
- ✅ **Production-safe error messages**

**Next Steps:**
1. Test error handling dengan berbagai scenarios
2. Monitor logs di production
3. Setup log aggregation (optional: ELK, Datadog, etc.)
4. Add alerting untuk critical errors

---

**Happy Logging! 📊**
