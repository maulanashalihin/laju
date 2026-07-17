# LLM Wiki Schema

## Ownership Rules

| Path | Owner | Rule |
|------|-------|------|
| raw/** | extension | immutable after capture |
| wiki/** | model + user | editable knowledge pages |
| meta/* | extension | auto-generated |
| . | human + explicit request | operating rules |

## Source Packet Format

```
raw/sources/SRC-YYYY-MM-DD-NNN/
  manifest.json
  original/
  extracted.md
  attachments/
```

## Page Types

- **source** — what this specific source says
- **entity** — people, orgs, tools, products
- **concept** — ideas, patterns, frameworks
- **synthesis** — cross-source theses and tensions
- **analysis** — durable filed answers from queries
- **requirement** — atomic requirements with status, priority, and traceability

## Linking Style

- Internal: [[folder/page-name]]
- Citation: [[sources/SRC-YYYY-MM-DD-NNN]]
