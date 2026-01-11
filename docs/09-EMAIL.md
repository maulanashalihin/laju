# Email Guide

Complete guide for email services in Laju framework.

## Table of Contents

1. [Overview](#overview)
2. [Nodemailer (SMTP)](#nodemailer-smtp)
3. [Resend (API)](#resend-api)
4. [Switching Providers](#switching-providers)
5. [Email Templates](#email-templates)
6. [Best Practices](#best-practices)

---

## Overview

Laju provides two email services with identical interfaces:

| Service | Type | Use Case |
|---------|------|----------|
| **Nodemailer** | SMTP | Gmail, custom SMTP servers |
| **Resend** | API | Modern API-based email |

Both use the same `MailTo` interface for easy switching.

---

## Nodemailer (SMTP)

### Configuration

```env
# .env
USER_MAILER=your.email@gmail.com
PASS_MAILER=your-app-password
```

### Gmail Setup

1. Enable **2-Step Verification** in Google Account
2. Go to **Security → App passwords**
3. Generate password for "Mail"
4. Use the 16-character password in `.env`

### Usage

```typescript
import { MailTo } from "app/services/Mailer";

await MailTo({
  to: "user@example.com",
  subject: "Welcome to Laju!",
  text: "Thank you for signing up..."
});
```

### Custom SMTP Server

```typescript
// app/services/Mailer.ts
const transporter = nodemailer.createTransport({
  host: "smtp.example.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.USER_MAILER,
    pass: process.env.PASS_MAILER
  }
});
```

---

## Resend (API)

### Configuration

```env
# .env
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

Get API key from [resend.com](https://resend.com)

### Usage

```typescript
import { MailTo } from "app/services/Resend";

await MailTo({
  to: "user@example.com",
  subject: "Welcome to Laju!",
  text: "Thank you for signing up..."
});
```

### Benefits

- No SMTP configuration needed
- Better deliverability
- Built-in analytics
- Webhook support

---

## Switching Providers

Both services use the same interface:

```typescript
// Option 1: Use Nodemailer
import { MailTo } from "app/services/Mailer";

// Option 2: Use Resend
import { MailTo } from "app/services/Resend";

// Same usage for both
await MailTo({
  to: "user@example.com",
  subject: "Hello",
  text: "Message content"
});
```

---

## Email Templates

### Password Reset

```typescript
import { MailTo } from "app/services/Mailer";

const resetLink = `${process.env.APP_URL}/reset-password/${token}`;

await MailTo({
  to: user.email,
  subject: "Reset Your Password",
  text: `
You requested a password reset.

Click here to reset: ${resetLink}

This link expires in 24 hours.

If you didn't request this, ignore this email.
  `.trim()
});
```

### Email Verification

```typescript
const verifyLink = `${process.env.APP_URL}/verify/${token}`;

await MailTo({
  to: user.email,
  subject: "Verify Your Email",
  text: `
Welcome to Laju!

Please verify your email address by clicking:
${verifyLink}

This link expires in 24 hours.
  `.trim()
});
```

### Welcome Email

```typescript
await MailTo({
  to: user.email,
  subject: "Welcome to Laju!",
  text: `
Hi ${user.name},

Thank you for signing up!

Get started by visiting your dashboard:
${process.env.APP_URL}/dashboard

Need help? Reply to this email.

Best regards,
The Laju Team
  `.trim()
});
```

### Order Confirmation

```typescript
const orderDetails = items.map(item => 
  `${item.name} - $${item.price}`
).join('\n');

await MailTo({
  to: user.email,
  subject: `Order Confirmation #${orderId}`,
  text: `
Hi ${user.name},

Your order has been confirmed!

Order #${orderId}
${orderDetails}

Total: $${total}

Track your order: ${process.env.APP_URL}/orders/${orderId}

Thank you for your purchase!
  `.trim()
});
```

---

## Best Practices

### 1. Use Environment Variables

```typescript
// Good
const appUrl = process.env.APP_URL;

// Bad
const appUrl = "https://myapp.com";
```

### 2. Handle Errors Gracefully

```typescript
try {
  await MailTo({
    to: user.email,
    subject: "Welcome",
    text: "Hello"
  });
} catch (error) {
  console.error("Failed to send email:", error);
  // Don't block user registration if email fails
}
```

### 3. Use Queues for Bulk Emails

```typescript
// For sending many emails, use a queue
import Bull from 'bull';

const emailQueue = new Bull('email');

emailQueue.process(async (job) => {
  await MailTo(job.data);
});

// Add to queue
await emailQueue.add({
  to: user.email,
  subject: "Newsletter",
  text: "Content..."
});
```

### 4. Validate Email Addresses

```typescript
function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

if (!isValidEmail(email)) {
  return response.status(400).json({ error: "Invalid email" });
}
```

### 5. Rate Limit Email Sending

```typescript
import { passwordResetRateLimit } from "../app/middlewares/rateLimit";

Route.post("/forgot-password", [passwordResetRateLimit], PasswordController.sendReset);
```

### 6. Use Plain Text

For better deliverability, use plain text emails. HTML emails are more likely to be marked as spam.

```typescript
// Good - Plain text
text: "Click here: https://example.com/verify"

// Avoid - HTML (unless necessary)
html: "<a href='https://example.com/verify'>Click here</a>"
```

### 7. Test Email Sending

```typescript
// Test in development
if (process.env.NODE_ENV === 'development') {
  console.log('Email would be sent:', { to, subject, text });
  return;
}

await MailTo({ to, subject, text });
```

---

## Next Steps

- [Storage Guide](05-STORAGE.md)
- [API Reference](07-API-REFERENCE.md)
- [Authentication Guide](04-AUTHENTICATION.md)
