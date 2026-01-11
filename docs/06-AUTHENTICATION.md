# Authentication Guide

Complete guide for authentication in Laju framework.

## Table of Contents

1. [Overview](#overview)
2. [Authenticate Service](#authenticate-service)
3. [Auth Middleware](#auth-middleware)
4. [Session Management](#session-management)
5. [Google OAuth](#google-oauth)
6. [Password Reset](#password-reset)
7. [Email Verification](#email-verification)

---

## Overview

Laju provides a complete authentication system:

- **Password hashing** with PBKDF2 (100,000 iterations)
- **Session-based auth** with secure cookies
- **Google OAuth** integration
- **Password reset** via email
- **Email verification**

---

## Authenticate Service

### Configuration

```typescript
// app/services/Authenticate.ts
const ITERATIONS = 100000;  // 100,000 iterations (OWASP recommended)
const KEYLEN = 64;          // 64-byte key
const DIGEST = 'sha512';    // SHA-512 hashing
const SALT_SIZE = 16;       // 16-byte random salt
```

### Methods

```typescript
import Authenticate from "app/services/Authenticate";

// Hash password
const hashedPassword = await Authenticate.hash("mypassword123");
// Returns: "salt:hash" format
// Example: "a1b2c3d4e5f6:9f8e7d6c5b4a3..."

// Verify password
const isValid = await Authenticate.compare("mypassword123", hashedPassword);
// Returns: true or false

// Create session (login)
await Authenticate.process(user, request, response);
// - Generates UUID session token
// - Stores in sessions table
// - Sets auth_id cookie (60-day expiration)
// - Redirects to /home

// Destroy session (logout)
await Authenticate.logout(request, response);
// - Deletes session from database
// - Clears auth_id cookie
// - Redirects to /login
```

### Registration Example

```typescript
// app/controllers/RegisterController.ts
public async processRegister(request: Request, response: Response) {
  const { name, email, password } = await request.json();
  
  // Hash password
  const hashedPassword = await Authenticate.hash(password);
  
  // Create user
  const user = {
    id: randomUUID(),
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    created_at: Date.now(),
    updated_at: Date.now()
  };
  
  try {
    await DB.table("users").insert(user);
    return Authenticate.process(user, request, response);
  } catch (error) {
    // Handle duplicate email
    return response
      .cookie("error", "Email already registered", 3000)
      .redirect("/register");
  }
}
```

### Login Example

```typescript
// app/controllers/LoginController.ts
public async processLogin(request: Request, response: Response) {
  const { email, password } = await request.json();
  
  // Find user
  const user = await DB.from("users")
    .where("email", email.toLowerCase())
    .first();
  
  if (!user) {
    return response
      .cookie("error", "Email not registered", 3000)
      .redirect("/login");
  }
  
  // Verify password
  const valid = await Authenticate.compare(password, user.password);
  
  if (!valid) {
    return response
      .cookie("error", "Invalid password", 3000)
      .redirect("/login");
  }
  
  // Create session
  return Authenticate.process(user, request, response);
}
```

---

## Auth Middleware

### How It Works

```typescript
// app/middlewares/auth.ts
import SQLite from "../services/SQLite";
import { Request, Response } from "../../type";

export default async (request: Request, response: Response) => {
  if (request.cookies.auth_id) {
    // Validate session and load user
    const user = SQLite.get(`
      SELECT u.id, u.name, u.email, u.phone, u.is_admin, u.is_verified 
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.id = ?
    `, [request.cookies.auth_id]);

    if (user) {
      // Convert SQLite 0/1 to boolean
      user.is_admin = !!user.is_admin;
      user.is_verified = !!user.is_verified;
      
      request.user = user;
      // No return = continue to handler
    } else {
      return response.cookie("auth_id", "", 0).redirect("/login");
    }
  } else {
    return response.redirect("/login");
  }
}
```

### Usage in Routes

```typescript
// routes/web.ts
import Auth from "../app/middlewares/auth";

// Public routes
Route.get("/", HomeController.index);
Route.get("/login", LoginController.loginPage);

// Protected routes
Route.get("/home", [Auth], ProfileController.homePage);
Route.get("/profile", [Auth], ProfileController.profilePage);
Route.post("/posts", [Auth], PostController.store);
```

### Access User in Controller

```typescript
public async store(request: Request, response: Response) {
  // Access authenticated user
  const userId = request.user.id;
  const userName = request.user.name;
  const isAdmin = request.user.is_admin;
  
  await DB.table("posts").insert({
    title: "New Post",
    user_id: userId,
    created_at: Date.now()
  });
  
  return response.redirect("/posts");
}
```

### Access User in Svelte

User is automatically passed to all Inertia pages:

```svelte
<script>
  let { user } = $props();
</script>

{#if user?.id}
  <p>Welcome, {user.name}!</p>
  {#if user.is_admin}
    <a href="/admin">Admin Panel</a>
  {/if}
{:else}
  <a href="/login">Login</a>
{/if}
```

---

## Session Management

### Sessions Table

```typescript
// migrations/20230514062913_sessions.ts
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('sessions', (table) => {
    table.string('id').primary();  // UUID token
    table.integer('user_id').unsigned().references('id').inTable('users');
    table.string('user_agent');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}
```

### Cookie Settings

- **Name**: `auth_id`
- **Expiration**: 60 days
- **HttpOnly**: Yes (prevents XSS)

### Logout

```typescript
public async logout(request: Request, response: Response) {
  if (request.cookies.auth_id) {
    await Authenticate.logout(request, response);
  }
}
```

---

## Google OAuth

### Configuration

```env
# .env
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5555/google/callback
```

### Setup Google Console

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add redirect URI: `http://localhost:5555/google/callback`
4. Copy Client ID and Secret to `.env`

### OAuth Flow

```typescript
// app/controllers/OAuthController.ts
import { redirectParamsURL } from "../services/GoogleAuth";

class OAuthController {
  // Step 1: Redirect to Google
  public async redirect(request: Request, response: Response) {
    const params = redirectParamsURL();
    const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
    return response.redirect(googleLoginUrl);
  }

  // Step 2: Handle callback
  public async googleCallback(request: Request, response: Response) {
    const { code } = request.query;

    // Exchange code for tokens
    const { data } = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code",
      code,
    });

    // Get user info
    const result = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${data.access_token}` }
    });

    const { email, name, verified_email } = result.data;

    // Find or create user
    let user = await DB.from("users").where("email", email.toLowerCase()).first();

    if (!user) {
      user = {
        id: randomUUID(),
        email: email.toLowerCase(),
        name,
        password: await Authenticate.hash(email),
        is_verified: verified_email,
        created_at: Date.now(),
        updated_at: Date.now()
      };
      await DB.table("users").insert(user);
    }

    return Authenticate.process(user, request, response);
  }
}
```

### Routes

```typescript
Route.get("/google/redirect", OAuthController.redirect);
Route.get("/google/callback", OAuthController.googleCallback);
```

---

## Password Reset

### Flow

1. User requests password reset
2. Generate token, store in DB with expiry
3. Send reset link via email
4. User clicks link, enters new password
5. Verify token, update password, delete token

### Controller

```typescript
// app/controllers/PasswordController.ts
public async sendResetPassword(request: Request, response: Response) {
  const { email } = await request.json();
  
  const user = await DB.from("users").where("email", email).first();
  if (!user) {
    return response.status(404).send("Email not found");
  }

  const token = randomUUID();
  
  await DB.from("password_reset_tokens").insert({
    email: user.email,
    token: token,
    expires_at: dayjs().add(24, 'hours').toDate()
  });

  await MailTo({
    to: email,
    subject: "Reset Password",
    text: `Reset your password: ${process.env.APP_URL}/reset-password/${token}`
  });

  return response.send("OK");
}

public async resetPassword(request: Request, response: Response) {
  const { id, password } = await request.json();

  const token = await DB.from("password_reset_tokens")
    .where("token", id)
    .where("expires_at", ">", new Date())
    .first();

  if (!token) {
    return response.status(404).send("Invalid or expired link");
  }

  const user = await DB.from("users").where("email", token.email).first();

  await DB.from("users")
    .where("id", user.id)
    .update({ password: await Authenticate.hash(password) });

  await DB.from("password_reset_tokens").where("token", id).delete();

  return Authenticate.process(user, request, response);
}
```

---

## Email Verification

### Flow

1. After registration, generate verification token
2. Send verification link via email
3. User clicks link
4. Verify token, mark user as verified

### Controller

```typescript
// app/controllers/VerificationController.ts
public async verify(request: Request, response: Response) {
  const token = randomUUID();

  await DB.from("email_verification_tokens")
    .where("user_id", request.user.id)
    .delete();

  await DB.from("email_verification_tokens").insert({
    user_id: request.user.id,
    token: token,
    expires_at: dayjs().add(24, 'hours').toDate()
  });

  await MailTo({
    to: request.user.email,
    subject: "Verify Your Email",
    text: `Verify: ${process.env.APP_URL}/verify/${token}`
  });

  return response.redirect("/home");
}

public async verifyPage(request: Request, response: Response) {
  const { id } = request.params;

  const verificationToken = await DB.from("email_verification_tokens")
    .where({ user_id: request.user.id, token: id })
    .where("expires_at", ">", new Date())
    .first();

  if (verificationToken) {
    await DB.from("users")
      .where("id", request.user.id)
      .update({ is_verified: true });

    await DB.from("email_verification_tokens")
      .where("id", verificationToken.id)
      .delete();
  }

  return response.redirect("/home?verified=true");
}
```

---

## Security Best Practices

1. **Always hash passwords** - Never store plaintext
2. **Use HTTPS in production** - Protect cookies in transit
3. **Rate limit auth endpoints** - Prevent brute force
4. **Validate email format** - Before sending emails
5. **Short token expiry** - 24 hours for reset/verification
6. **Delete used tokens** - Prevent reuse

---

## Next Steps

- [Storage & Email Guide](05-STORAGE.md)
- [API Reference](07-API-REFERENCE.md)
- [Best Practices](09-BEST-PRACTICES.md)
