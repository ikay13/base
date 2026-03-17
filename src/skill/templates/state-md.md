# STATE.md Template

Output file: `.base/STATE.md`

```template
# BASE — Workspace State

**Workspace:** {workspace-name}
**Last Groom:** {YYYY-MM-DD}
**Groom Cadence:** {cadence} ({day})
**Next Groom Due:** {YYYY-MM-DD}
**Drift Score:** {0-N}

## Health

| Area | Status | Last Touched | Groom Due |
|------|--------|-------------|-----------|
| {area-name} | {Current|Stale|Critical} | {YYYY-MM-DD} | {YYYY-MM-DD} |

## Satellites

| Project | Engine | Phase | Last Activity |
|---------|--------|-------|--------------|
| {project-name} | {paul|custom} | {current-phase} | {YYYY-MM-DD} |

## Drift Indicators

- ACTIVE.md age: {N} days
- BACKLOG.md age: {N} days
- Backlog items past review-by: {N}
- Orphaned session contexts: {N}
- Untracked root files: {N}
- Satellites with stale state: {N}

## Last Audit

**Date:** {YYYY-MM-DD}
**Phases:** {N}
**Outcome:** [Brief summary of what was cleaned/changed]
```

## Status Values

| Status | Meaning | Drift Contribution |
|--------|---------|-------------------|
| Current | Within groom cadence | 0 |
| Stale | Past groom cadence by 1-2x | Days overdue |
| Critical | Past groom cadence by 2x+ | Days overdue (weighted 2x) |
