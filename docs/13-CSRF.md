# CSRF Protection

Laju includes built-in CSRF (Cross-Site Request Forgery) protection for state-changing requests.

## How It Works

1. **Token Generation**: A signed token is generated and stored in a cookie
2. **Token Validation**: On POST/PUT/PATCH/DELETE requests, the token is validated
3. **Token Rotation**: After successful validation, a new token is generated

## Configuration

CSRF protection is enabled by default in `server.ts`:

```typescript
import csrf from "./app/middlewares/csrf";

webserver.use(csrf());
```

### Options

```typescript
webserver.use(csrf({
  excludePaths: ['/webhooks'],  // Paths to skip CSRF check
  excludeAPIs: true             // Skip /api/* routes (default: true)
}));
```

## Usage in Forms

### Inertia.js Forms (Automatic)

Inertia.js automatically handles CSRF for form submissions. No extra setup needed:

```svelte
<script>
  import { useForm } from '@inertiajs/svelte'
  
  const form = useForm({
    email: '',
    password: ''
  })
  
  function submit() {
    $form.post('/login')
  }
</script>

<form on:submit|preventDefault={submit}>
  <input bind:value={$form.email} />
  <button type="submit">Login</button>
</form>
```

### Manual Fetch Requests

Use the `fetchWithCsrf` helper for AJAX requests:

```javascript
import { fetchWithCsrf, getCsrfToken } from '../Components/helper.js'

// Option 1: Use the helper
const response = await fetchWithCsrf('/api/data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'John' })
})

// Option 2: Manual header
const token = getCsrfToken()
fetch('/api/data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': token
  },
  body: JSON.stringify({ name: 'John' })
})
```

### Hidden Input in Forms

For traditional form submissions:

```html
<form method="POST" action="/submit">
  <input type="hidden" name="_csrf" id="csrf-token" />
  <button type="submit">Submit</button>
</form>

<script>
  document.getElementById('csrf-token').value = 
    document.cookie.match(/csrf_token=([^;]+)/)?.[1] || '';
</script>
```

## API Routes

By default, `/api/*` routes are **excluded** from CSRF protection. This is because:

1. API routes typically use token-based authentication (JWT, API keys)
2. They're often called from external services or mobile apps

To enable CSRF for API routes:

```typescript
webserver.use(csrf({
  excludeAPIs: false
}));
```

## Per-Route CSRF Check

For routes that need CSRF but aren't covered by global middleware:

```typescript
import { csrfCheck } from "../app/middlewares/csrf";

Route.post("/sensitive-action", [Auth, csrfCheck], Controller.action);
```

## Error Response

When CSRF validation fails:

```json
{
  "success": false,
  "error": {
    "message": "Invalid CSRF token",
    "code": "CSRF_INVALID"
  }
}
```

HTTP Status: `403 Forbidden`

## Security Notes

1. **Token Expiry**: Tokens expire after 1 hour
2. **Token Rotation**: New token generated after each successful POST
3. **SameSite Cookie**: Cookie uses `SameSite=Strict` for additional protection
4. **HTTPS in Production**: Cookie is `Secure` in production

## Environment Variables

Optional: Set a custom CSRF secret (auto-generated if not set):

```env
CSRF_SECRET=your-32-character-secret-key
```

## Troubleshooting

### "Invalid CSRF token" Error

1. **Check cookie exists**: Ensure `csrf_token` cookie is set
2. **Token mismatch**: Make sure you're sending the same token from cookie
3. **Token expired**: Refresh the page to get a new token
4. **Wrong header**: Use `X-CSRF-Token` header for AJAX

### Token Not Set

If the token cookie isn't being set:

1. Make a GET request first (tokens are set on GET requests)
2. Check that CSRF middleware is registered before routes
