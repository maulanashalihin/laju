# Quick Reference

Cheat sheet untuk multi-agent workflow.

---

## Cara Panggil Agent

```
@workflow/agents/[nama-file].md [instruksi]
```

| Panggil | Fungsi |
|---------|--------|
| `@workflow/agents/product.md` | Define product requirements |
| `@workflow/agents/tech-lead.md` | Design technical architecture |
| `@workflow/agents/developer.md` | Implement code |
| `@workflow/agents/qa.md` | Test and review |
| `@workflow/agents/devops.md` | Deploy to production |

---

## Workflow dengan Mandatory Review

```
Client: @workflow/agents/product.md Saya mau aplikasi X...
    ↓
PA: Selesai - REVIEW REQUIRED
    ↓ Client: "Approve"
@workflow/agents/tech-lead.md Lanjutkan dari Product Agent
    ↓
TLA: Selesai - REVIEW REQUIRED
    ↓ Client: "Approve"
@workflow/agents/developer.md Implement fitur...
    ↓
DevA: Selesai - REVIEW REQUIRED
    ↓ Client: "Approve"
@workflow/agents/qa.md Test aplikasi
    ↓
QA: Selesai - REVIEW REQUIRED
    ↓ Client: "Approve"
@workflow/agents/devops.md Deploy ke production
    ↓
DOA: Deployed! 🎉
```

---

## Contoh Penggunaan

### Start New Project
```
@workflow/agents/product.md

Saya mau bikin aplikasi todolist.
Kebutuhan: [deskripsikan].
```

### Approve & Continue
```
Client: "Approve" atau "Lanjutkan"
```

### Request Changes
```
Client: "Revisi: [detail perubahan]"
```

### Fix Bug
```
@workflow/agents/developer.md

Fix: [deskripsi bug]
```

### Deploy
```
@workflow/agents/devops.md

Deploy ke production.
```

---

## Review Checklist per Tahap

| Tahap | Client Check |
|-------|--------------|
| **PRD** | Fitur lengkap? Timeline ok? |
| **Tech Design** | Stack sesuai? Architecture scalable? |
| **Implementation** | Fitur berfungsi? UI acceptable? |
| **QA** | All tests pass? Ready for production? |

---

## Developer Modes

| Mode | Trigger | When to Use |
|------|---------|-------------|
| **One-Shot** | Default | Small project, quick result |
| **Per Feature** | Request "per fitur" | Large project, gradual review |
| **Auto-Prioritize** | "Bingung mulai dari mana" | Non-technical client |

---

## Document Locations

```
workflow/outputs/
├── 01-product/       # Product Agent output
├── 02-engineering/   # Tech Lead Agent output
├── 03-tasks/         # Tasks
└── 04-reports/       # QA Agent output
```

---

## ⚠️ Important Rules

1. **Panggil agent dengan full path:** `@workflow/agents/[file].md`
2. **Every stage has mandatory review** - tunggu client approve
3. **No auto-skip** - client harus eksplisit approve
4. **README dan examples hanya referensi** - agent files yang self-contained

---

## Laju Patterns

### Handler Pattern
```typescript
// app/handlers/[domain].handler.ts
export const [Domain]Handler = {
  async methodName(request: Request, response: Response) {
    // Handler logic
  }
};
```

### Route Pattern
```typescript
// routes/web.ts
import [Domain]Handler from "../app/handlers/[domain].handler";

Route.get("/path", [Domain]Handler.method);
```

### File Naming
- Handlers: `kebab-case.handler.ts` (e.g., `auth.handler.ts`)
- Middlewares: `kebab-case.middleware.ts` (e.g., `auth.middleware.ts`)
- Repositories: `kebab-case.repository.ts` (e.g., `user.repository.ts`)
- Validators: `kebab-case.validator.ts` (e.g., `auth.validator.ts`)
