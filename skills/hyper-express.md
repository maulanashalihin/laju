# HyperExpress Reference

Quick reference for HyperExpress Request and Response objects in Laju Framework.

## Request

### Body & Data

```typescript
// Parse JSON body (async)
const body = await request.json()

// URL parameters
const { id } = request.params

// Query string
const { page, search } = request.query

// Headers
const authHeader = request.headers['authorization']
const contentType = request.header('content-type') // case-insensitive
```

### URL & Path

```typescript
request.url        // Full URL string
request.path       // Path without query string
request.method     // HTTP method (GET, POST, etc.)
request.hostname   // Hostname
request.ip         // Client IP address
```

### Cookies

```typescript
// Get cookie
const token = request.cookies['token']

// Get signed cookie
const userId = request.unsignCookie('user_id')
```

### Laju Custom Properties

```typescript
// Authenticated user (set by Auth middleware)
request.user?.id
request.user?.email
request.user?.is_admin

// Shared data across middlewares
request.share = { ...request.share, customData: value }
```

## Response

### Standard Methods

```typescript
// Send text/HTML
response.send('Hello World')
response.type('html').send('<h1>HTML content</h1>')

// Send JSON
response.json({ success: true, data: {} })

// Set status code
response.status(404).send('Not found')
response.status(200).json({ ok: true })
```

### Headers & Cookies

```typescript
// Set header
response.header('X-Custom-Header', 'value')

// Set cookie
response.cookie('token', value, { 
  maxAge: 86400000,  // 1 day in ms
  httpOnly: true,
  secure: true,
  sameSite: 'strict'
})

// Clear cookie
response.clearCookie('token')

// Signed cookie
response.cookie('user_id', value, { signed: true })
```

### Laju Custom Methods

```typescript
// Inertia.js render
response.inertia('posts/index', { posts: [] })
response.inertia('posts/form', { post: null })

// SSR template render (Eta)
response.type('html').send(view('emails/welcome', { name: 'John' }))

// Flash message + redirect
response.flash('success', 'Berhasil disimpan').redirect('/posts', 302)
response.flash('error', 'Validasi gagal').redirect('/posts/create', 302)
response.flash('info', 'Info message').redirect('/dashboard')
response.flash('warning', 'Warning message')

// Redirect only
response.redirect('/path')              // 302 default
response.redirect('/path', 302)         // POST success
response.redirect('/path', 303)         // PUT/DELETE success
```

## HTTP Status Codes

| Action | Method | Status | Pattern |
|--------|--------|--------|---------|
| Create | POST | 302 | `response.redirect('/list', 302)` |
| Update | PUT | 303 | `response.redirect('/list', 303)` |
| Delete | DELETE | 303 | `response.redirect('/list', 303)` |
| Read | GET | 200 | `response.inertia()` / `response.send()` |

## Complete Controller Examples

### Index (GET /resources)

```typescript
async index(request: Request, response: Response) {
  const { search, page } = request.query
  const currentPage = parseInt(page as string) || 1
  
  let query = DB.selectFrom('posts').selectAll()
  
  if (search) {
    query = query.where('title', 'like', `%${search}%`)
  }
  
  const posts = await query
    .orderBy('created_at', 'desc')
    .limit(20)
    .offset((currentPage - 1) * 20)
    .execute()
  
  return response.inertia('posts/index', { posts, search })
}
```

### Store (POST /resources)

```typescript
async store(request: Request, response: Response) {
  const body = await request.json()
  const validationResult = Validator.validate(storeSchema, body)
  
  if (!validationResult.success) {
    const firstError = Object.values(validationResult.errors || {})[0]?.[0]
    return response.flash('error', firstError).redirect('/posts/create', 302)
  }
  
  const { title, content } = validationResult.data!
  
  await DB.insertInto('posts').values({
    id: uuidv7(),
    user_id: request.user!.id,
    title,
    content,
    created_at: Date.now(),
    updated_at: Date.now()
  }).execute()
  
  return response.flash('success', 'Post berhasil dibuat').redirect('/posts', 302)
}
```

### Update (PUT /resources/:id)

```typescript
async update(request: Request, response: Response) {
  const { id } = request.params
  const body = await request.json()
  
  const validationResult = Validator.validate(updateSchema, body)
  if (!validationResult.success) {
    const firstError = Object.values(validationResult.errors || {})[0]?.[0]
    return response.flash('error', firstError).redirect(`/posts/${id}/edit`, 303)
  }
  
  await DB.updateTable('posts')
    .set({ 
      ...validationResult.data!,
      updated_at: Date.now()
    })
    .where('id', '=', id)
    .execute()
  
  return response.flash('success', 'Berhasil diupdate').redirect('/posts', 303)
}
```

### Destroy (DELETE /resources/:id)

```typescript
async destroy(request: Request, response: Response) {
  const { id } = request.params
  
  await DB.deleteFrom('posts')
    .where('id', '=', id)
    .execute()
  
  return response.flash('success', 'Berhasil dihapus').redirect('/posts', 303)
}
```

### Show (GET /resources/:id)

```typescript
async show(request: Request, response: Response) {
  const { id } = request.params
  
  const post = await DB.selectFrom('posts')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()
  
  if (!post) {
    return response.status(404).inertia('errors/404')
  }
  
  return response.inertia('posts/show', { post })
}
```

## File Upload

```typescript
async upload(request: Request, response: Response) {
  // Access uploaded files
  const { image } = await request.files
  
  if (Array.isArray(image)) {
    // Multiple files
    for (const file of image) {
      await file.mv(`./storage/${file.name}`)
    }
  } else {
    // Single file
    await image.mv(`./storage/${image.name}`)
  }
  
  return response.flash('success', 'File uploaded').redirect('/uploads')
}
```

## Error Handling Patterns

```typescript
try {
  // Business logic
} catch (error: any) {
  console.error('Error:', error)
  
  if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
    return response.flash('error', 'Data sudah ada').redirect('/path', 302)
  }
  
  if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
    return response.flash('error', 'Data terkait tidak ditemukan').redirect('/path', 302)
  }
  
  return response.flash('error', 'Terjadi kesalahan').redirect('/path', 302)
}
```

## Common Patterns

### Conditional Response

```typescript
if (request.headers['accept']?.includes('application/json')) {
  return response.json({ data: posts })
} else {
  return response.inertia('posts/index', { posts })
}
```

### Download File

```typescript
response.download('/path/to/file.pdf', 'document.pdf')
```

### Stream Response

```typescript
const stream = fs.createReadStream('/path/to/file')
response.type('application/pdf').stream(stream)
```

## See Also

- [HyperExpress Documentation](https://github.com/kartikk221/hyper-express)
- `skills/create-controller.md` - Controller patterns
- `skills/feature-implementation-patterns.md` - Complete feature patterns
