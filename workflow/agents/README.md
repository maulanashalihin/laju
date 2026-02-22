# Agents

Template instruksi untuk setiap agent.

---

## Cara Panggil

Format lengkap:
```
@workflow/agents/[nama-file].md [instruksi]
```

---

## Mapping

| File | Panggil Sebagai | Deskripsi |
|------|-----------------|-----------|
| `product.md` | `@workflow/agents/product.md` | Define requirements |
| `tech-lead.md` | `@workflow/agents/tech-lead.md` | Design system |
| `developer.md` | `@workflow/agents/developer.md` | Implement code |
| `qa.md` | `@workflow/agents/qa.md` | Test & review |
| `devops.md` | `@workflow/agents/devops.md` | Deploy & ops |

---

## Contoh

```
@workflow/agents/product.md

Saya mau bikin aplikasi todolist.
Fitur: create todo, set deadline, mark complete.
```

```
@workflow/agents/developer.md

Implement modul authentication.
```

```
@workflow/agents/qa.md

Test aplikasi.
```

---

## Catatan

- Setiap file di folder ini adalah **self-contained** - berisi instruksi lengkap untuk agent
- File-file ini **independen** satu sama lain
- Untuk referensi workflow, lihat `workflow/README.md` dan `workflow/examples.md`
