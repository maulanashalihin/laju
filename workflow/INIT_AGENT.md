# Project Initialization Workflow

Panduan lengkap untuk memulai project baru dengan Laju Framework.

## Tech Stack

- **Svelte**: v5.41.3 (with runes `$state`, `$props`)
- **Tailwind CSS**: v3.4.17
- **Inertia.js**: v2.2.10
- **Vite**: v5.4.10
- **TypeScript**: v5.6.3 (backend only)
- **HyperExpress**: v6.17.3 (backend server)
- **Knex**: v3.1.0 (database query builder)
- **Zod**: v4.3.5 (validation)

## Initialization Steps

Ikuti urutan ini saat memulai project baru:

### 1. Initialize Project

Buat project Laju baru.

### 2. Create/Replace README.md

Tanyakan user untuk:
- Nama project
- Deskripsi project
- Fitur utama

Buat `README.md` dengan konten:
- Nama dan deskripsi project
- Quick start guide (installation, usage)
- Tech stack
- List fitur

### 3. Create workflow/PRD.md

Dokumen Product Requirements yang berisi:
- Objectives dan goals
- List fitur
- Success criteria
- **Design specifications** (branding colors, typography, design system, visual identity)

### 4. Create workflow/TDD.md

Dokumen Technical Design yang berisi:
- Technical architecture dan system design
- Database schema dan relationships
- API endpoints dan routes
- Data models dan flow
- Security considerations
- Technical specifications dari PRD.md

### 5. Create workflow/ui-kit.html

Dokumen UI Design System yang berisi:
- Color palette dan theme tokens
- Typography styles (headings, body text)
- Button styles dan variants
- Form input styles
- Card dan container styles
- Status badges dan feedback components
- Layout patterns dan spacing
- Icon usage guidelines

### 6. Create workflow/PROGRESS.md

Template tracking development:

```markdown
# Development Progress

## Completed
- [x] Initial setup
- [x] README.md created
- [x] workflow/PRD.md created
- [x] workflow/TDD.md created
- [x] workflow/ui-kit.html created

## In Progress
- [ ] Feature 1

## Pending
- [ ] Feature 2
```

### 7. Create DashboardLayout Component

Buat `resources/js/Components/DashboardLayout.svelte`:
- Ikuti design system dari `workflow/ui-kit.html`
- Gunakan sebagai main layout untuk aplikasi
- Include header, sidebar, dan main content area
- Apply branding colors, typography, dan design tokens dari PRD.md

### 8. Review Documentation

Minta user review dan approve:
- `README.md` - Project overview, features, tech stack
- `workflow/PRD.md` - Requirements, design specifications
- `workflow/TDD.md` - Technical design document (architecture, database, API)
- `workflow/ui-kit.html` - UI design system dan components
- `workflow/PROGRESS.md` - Development tracking template

**Tunggu konfirmasi user sebelum melanjutkan ke step berikutnya**

### 9. Setup Design System

Konfigurasi theme:
- Update `tailwind.config.js` dengan branding colors, typography, dan design tokens dari `workflow/PRD.md` dan `workflow/ui-kit.html`
- Import Tailwind directives di `resources/js/index.css`

### 10. Create Migrations

Buat migration files untuk database schema berdasarkan `workflow/TDD.md`.

### 11. Run Migrations

```bash
knex migrate:latest
```

### 12. Git Init and First Commit

```bash
git init
git add .
git commit -m "Initial commit: Project setup"
```

## Important Notes

- **Selalu ikuti urutan ini** - Jangan skip steps
- **Tunggu approval user** sebelum melanjutkan setelah step 8 (Review Documentation)
- **Gunakan built-in functionality** - Cek dulu apakah controller/page/service sudah ada sebelum membuat baru
- **Test sebelum commit** - Pastikan semua berjalan dengan baik sebelum commit

## Next Steps

Setelah project initialization selesai, lanjutkan dengan:
1. Implementasi fitur pertama sesuai `workflow/PROGRESS.md`
2. Gunakan `TASK_AGENT.md` untuk panduan implementasi fitur
3. Update `workflow/PROGRESS.md` setelah setiap fitur selesai