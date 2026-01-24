# Panduan Lengkap Menggunakan Semua Agent

## Overview

Laju Framework memiliki 3 agent yang bekerja sama untuk membangun aplikasi dengan kualitas tinggi:

1. **INIT_AGENT** - Memulai project baru
2. **TASK_AGENT** - Implementasi fitur
3. **MANAGER_AGENT** - Manajemen perubahan dan release notes

**Note:** Testing dan deployment berjalan otomatis via GitHub Actions CI. Referensi:
- `skills/testing-guide.md` - Panduan menulis test (unit, integration, E2E)
- `skills/deployment-guide.md` - Panduan deployment ke production

---

## 1. INIT_AGENT - Memulai Project Baru

### Kapan Menggunakan?

Gunakan **INIT_AGENT** saat:
- Memulai project Laju baru
- Setup infrastructure awal
- Inisialisasi GitHub Actions

### Workflow

```bash
# 1. Mention INIT_AGENT
"Hai @workflow/INIT_AGENT.md, yuk kita mulai project baru"

# 2. Ikuti step-by-step:
# - Buat README.md
# - Buat PRD.md (requirements, design specifications)
# - Buat TDD.md (technical design)
# - Buat ui-kit.html (UI design system)
# - Buat PROGRESS.md (tracking template)
# - Setup GitHub Actions workflow
# - Setup migrations
# - Setup design system
# - Buat layout components
# - Customize auth pages
# - Git init & first commit
# - Start dev server

# 3. Setelah selesai:
# Tutup session ini
# Buka session baru dengan: "Hai @workflow/TASK_AGENT.md yuk kita kerja"
```

### Output

- Project infrastructure siap
- GitHub Actions workflow ter-setup
- Testing infrastructure (Vitest, Playwright, Supertest) ter-setup
- Dev server berjalan di http://localhost:5555

---

## 2. TASK_AGENT - Implementasi Fitur

### Kapan Menggunakan?

Gunakan **TASK_AGENT** saat:
- Ingin implementasi fitur baru
- Ingin modifikasi fitur yang ada
- Ingin fix bug
- Selesai dengan INIT_AGENT

### Workflow

```bash
# 1. Mention TASK_AGENT
"Hai @workflow/TASK_AGENT.md, yuk kita kerja"

# 2. TASK_AGENT akan:
# - Baca PROGRESS.md untuk lihat task pending
# - Tampilkan top 3 tasks dengan priority [HIGH], [MEDIUM], [LOW]
# - Tanya mau kerja task apa

# 3. Pilih task dan implementasi:
# - Buat/modify controller
# - Buat/modify page
# - Tambah route
# - Tambah validator (jika perlu)

# 4. Test lokal (opsional tapi recommended):
npm run test:unit
npm run test:integration
npm run test:e2e

# 5. Update PROGRESS.md:
# - Mark task sebagai [x] completed
# - Tambah completion date

# 6. Commit & push:
git add .
git commit -m "feat: add feature"
git push origin feature/your-feature

# 7. GitHub Actions run tests otomatis
# - Jika pass → Lanjut
# - Jika fail → Fix → Re-push
```

### Best Practices

- ✅ Cek existing files dulu (jangan duplicate)
- ✅ Gunakan built-in controllers/services
- ✅ Match UI kit dari `ui-kit.html`
- ✅ Test lokal sebelum push
- ✅ Update PROGRESS.md setelah selesai

---

## 3. MANAGER_AGENT - Manajemen Perubahan

### Kapan Menggunakan?

Gunakan **MANAGER_AGENT** saat:
- Menerima change request (bug, feature, modification)
- Perlu update dokumentasi (PRD, TDD, PROGRESS)
- Approve deployment
- Create release notes

### Workflow

```bash
# 1. Receive change request:
# SOURCE: [Client/QA/Developer]
# TYPE: [Bug/Feature/Modification]
# REQUEST: [Deskripsi]

# 2. Analyze impact:
# - Apakah ini critical/high/medium/low priority?
# - Apakah feasible?
# - Apakah out of scope?

# 3. Make decision:
# - Accept → Update dokumentasi
# - Reject → Beri alasan
# - Defer → Simpan untuk nanti

# 4. Update dokumentasi (jika accept):
# - Update PRD.md (requirements, design)
# - Update TDD.md (technical specs)
# - Update PROGRESS.md (tasks)

# 5. Approve deployment:
# - Review test results
# - Update package.json version
# - Create release notes di CHANGELOG.md
```

### Change Request Template

```markdown
SOURCE: [Client/QA/Developer]
TYPE: [Bug/Feature/Modification]

REQUEST:
[Deskripsi singkat]

EXAMPLE:
"Tolong tambah fitur kirim notifikasi WhatsApp ke warga yang belum bayar iuran"
```

### Priority Guidelines

- **Critical** - Security vulnerabilities, data loss, payment errors (immediate action)
- **High** - Important features, major UX issues (next sprint)
- **Medium** - Nice-to-have features, minor improvements (backlog)
- **Low** - Experimental features, low business value (future)

---

## Workflow Lengkap (End-to-End)

### Scenario: Implementasi Fitur Baru

```bash
# STEP 1: Mulai dengan TASK_AGENT
"Hai @workflow/TASK_AGENT.md, yuk kita kerja"

# TASK_AGENT:
- Baca PROGRESS.md
- Tampilkan tasks
- User pilih task
- Implementasi fitur
- Test lokal (referensi: skills/testing-guide.md)
- Update PROGRESS.md
- Commit & push ke feature branch

# GitHub Actions (Automated):
- Run tests (unit, integration, E2E)
- All pass ✅

# STEP 2: Merge ke main
git checkout main
git merge feature/your-feature
git push origin main

# GitHub Actions (Automated):
- Run tests lagi
- All pass ✅
- Deploy ke production
- Run smoke tests
- All pass ✅
- Deployment successful

# STEP 3: MANAGER_AGENT create release notes
# Update CHANGELOG.md
# Update version di package.json
```

### Scenario: Bug Report dari QA

```bash
# STEP 1: QA lapor bug
SOURCE: QA
TYPE: Bug
ISSUE: "Users can delete residents with payment history"

# STEP 2: MANAGER_AGENT analyze
- Priority: Critical (data integrity issue)
- Decision: Accept
- Update PROGRESS.md dengan bug fix task

# STEP 3: TASK_AGENT fix bug
- Implement fix
- Test lokal (referensi: skills/testing-guide.md)
- Update PROGRESS.md
- Commit & push

# GitHub Actions (Automated):
- Run tests
- All pass ✅
- Deploy ke production
- Run smoke tests
- All pass ✅
- Deployment successful

# STEP 4: MANAGER_AGENT create release notes
# Update CHANGELOG.md
# Update version di package.json
```

### Scenario: Feature Request dari Client

```bash
# STEP 1: Client request feature
SOURCE: Client
TYPE: Feature Request
REQUEST: "Tolong tambah fitur kirim notifikasi WhatsApp"

# STEP 2: MANAGER_AGENT analyze
- Priority: High (improves collection rates)
- Feasibility: Yes
- Decision: Accept
- Update PRD.md (add feature)
- Update TDD.md (add API specs)
- Update PROGRESS.md (add task)

# STEP 3: TASK_AGENT implement
- Implement feature
- Test lokal (referensi: skills/testing-guide.md)
- Update PROGRESS.md
- Commit & push

# GitHub Actions (Automated):
- Run tests
- All pass ✅
- Deploy ke production
- Run smoke tests
- All pass ✅
- Deployment successful

# STEP 4: MANAGER_AGENT create release notes
# Update CHANGELOG.md
# Update version di package.json
```

---

## Scope Enforcement

Each agent has a specific scope and will reject work outside their responsibilities:

### MANAGER_AGENT
**CAN:**
- ✅ Receive and document change requests
- ✅ Analyze impact on PRD, TDD, PROGRESS
- ✅ Update documentation (PRD, TDD, PROGRESS)
- ✅ Approve deployment readiness
- ✅ Update version in package.json
- ✅ Create release notes in CHANGELOG.md

**CANNOT:**
- ❌ Implement features or write code
- ❌ Modify code directly
- ❌ Run tests manually
- ❌ Deploy to production

### TASK_AGENT
**CAN:**
- ✅ Implement features (create/modify pages, controllers, routes, validators)
- ✅ Fix bugs
- ✅ Modify existing features
- ✅ Test locally
- ✅ Update PROGRESS.md

**CANNOT:**
- ❌ Manage changes or update PRD/TDD
- ❌ Create release notes
- ❌ Approve deployment
- ❌ Deploy to production

### DEPLOYMENT_AGENT
**CAN:**
- ✅ Monitor deployment progress
- ✅ Verify deployment success
- ✅ Handle rollback if needed
- ✅ Run smoke tests (automated)

**CANNOT:**
- ❌ Implement features or write code
- ❌ Modify code directly
- ❌ Manage changes or update PRD/TDD
- ❌ Run tests manually

**Note:** Deployment runs automatically via GitHub Actions. Reference: `skills/deployment-guide.md`

### INIT_AGENT
**CAN:**
- ✅ Create project infrastructure
- ✅ Setup GitHub Actions workflow
- ✅ Setup testing infrastructure
- ✅ Create documentation (README, PRD, TDD, PROGRESS, ui-kit)
- ✅ Setup design system

**CANNOT:**
- ❌ Implement features or write code
- ❌ Create controllers, pages, routes
- ❌ Manage changes after initialization

**Note:** Testing reference available at `skills/testing-guide.md`. Deployment reference available at `skills/deployment-guide.md`.

**If an agent is asked to do something outside scope:**
```
RESPONSE: "Saya tidak bisa [task]. 
Itu adalah tanggung jawab [CORRECT_AGENT]. 
Silakan mention @[workflow/CORRECT_AGENT.md] untuk [task]."
```

## Quick Reference

### Agent Responsibilities

| Agent | Responsibilities | When Involved |
|-------|----------------|---------------|
| **INIT_AGENT** | Project initialization, setup infrastructure | Memulai project baru |
| **TASK_AGENT** | Implement features, fix bugs | Implementasi fitur |
| **MANAGER_AGENT** | Manage changes, create release notes | Change requests, deployment approval |

**Reference Guides:**
- `skills/testing-guide.md` - Panduan menulis test (unit, integration, E2E)
- `skills/deployment-guide.md` - Panduan deployment ke production

### Workflow Commands

```bash
# Start new project
"Hai @workflow/INIT_AGENT.md, yuk kita mulai project baru"

# Implement features
"Hai @workflow/TASK_AGENT.md, yuk kita kerja"

# Manage changes
"Hai @workflow/MANAGER_AGENT.md, ada change request"

# Deploy to production
git checkout main
git merge feature/your-feature
git push origin main
# GitHub Actions handles the rest
```

### MANAGER_AGENT Usage Examples

**Bug Report:**
```bash
"Hai @workflow/MANAGER_AGENT.md, ada bug report:
SOURCE: QA
TYPE: Bug
ISSUE: Users can delete residents with payment history"
```

**Feature Request:**
```bash
"Hai @workflow/MANAGER_AGENT.md, ada feature request:
SOURCE: Client
TYPE: Feature Request
REQUEST: Tolong tambah fitur kirim notifikasi WhatsApp"
```

**Deployment Approval:**
```bash
"Hai @workflow/MANAGER_AGENT.md, tolong approve deployment v1.2.0"
```

**Code Review:**
```bash
"Hai @workflow/MANAGER_AGENT.md, tolong code review:
- Code quality check
- Test coverage review
- Documentation verification
- Deployment readiness approval"
```

### Code Review Checklist

**Code Quality:**
- [ ] No debug code or console.log statements
- [ ] Code follows Laju patterns
- [ ] No security vulnerabilities
- [ ] Proper error handling
- [ ] Clean, readable code

**Testing:**
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Test coverage meets goals (70%+)
- [ ] No failing tests

**Documentation:**
- [ ] PROGRESS.md updated
- [ ] README.md up to date
- [ ] Code comments where needed
- [ ] No outdated comments

**Deployment Readiness:**
- [ ] All changes committed
- [ ] Version updated in package.json
- [ ] Release notes ready in CHANGELOG.md

### Important Notes

1. **Testing runs automatically** - GitHub Actions CI runs unit, integration, E2E tests
2. **Deployment only if tests pass** - GitHub Actions won't deploy if tests fail
3. **Auto-rollback on failure** - GitHub Actions akan auto-rollback jika deployment fail
4. **Branching is automatic** - TASK_AGENT auto-creates feature branches
5. **Testing reference** - skills/testing-guide.md untuk panduan menulis test
6. **Deployment reference** - skills/deployment-guide.md untuk panduan deployment
7. **Release notes by MANAGER_AGENT** - Setelah deployment success

---

## Troubleshooting

### Tests Fail

```bash
# 1. Check GitHub Actions logs
# 2. Identify error
# 3. Fix locally
# 4. Re-push
git add .
git commit -m "fix: resolve test failure"
git push origin feature/your-feature
```

### Deployment Fails

```bash
# 1. Check GitHub Actions logs
# 2. GitHub Actions auto-rollback (otomatis)
# 3. Fix issue
# 4. Re-push
git add .
git commit -m "fix: resolve deployment issue"
git push origin main
```

### Smoke Tests Fail

```bash
# 1. GitHub Actions auto-rollback (otomatis)
# 2. Check logs
# 3. Fix issue
# 4. Re-push
git add .
git commit -m "fix: resolve smoke test failure"
git push origin main
```

---

## Summary

3 Agent Laju Framework bekerja sama untuk membangun aplikasi dengan kualitas tinggi:

1. **INIT_AGENT** - Setup project infrastructure
2. **TASK_AGENT** - Implementasi fitur
3. **MANAGER_AGENT** - Manajemen perubahan

**Workflow:**
```
INIT_AGENT → TASK_AGENT → GitHub Actions CI → MANAGER_AGENT
```

**GitHub Actions CI:**
- Automated testing (unit, integration, E2E)
- Automated deployment (only if tests pass)
- Auto-rollback on failure

**Key Features:**
- ✅ Automated testing via GitHub Actions
- ✅ Automated deployment (only if tests pass)
- ✅ Auto-rollback on failure
- ✅ Simplified pre-deployment checklist
- ✅ Industry-standard GitHub Flow
- ✅ Cocok untuk solo developer

**Testing Reference:**
- `skills/testing-guide.md` - Panduan menulis test (unit, integration, E2E)

**Deployment Reference:**
- `skills/deployment-guide.md` - Panduan deployment ke production

**Best Practices:**
- Gunakan feature branches
- Test lokal sebelum push
- Update PROGRESS.md setelah selesai
- Monitor GitHub Actions
- Review release notes
