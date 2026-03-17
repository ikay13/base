# BACKLOG.md Template

Output file: `.base/BACKLOG.md`

Symlink at workspace root: `BACKLOG.md → .base/BACKLOG.md` (for backward compatibility)

```template
# Backlog

> **Future work, ideas, and deferred tasks.** Not actively working on these - they're queued.
> For active work, see `ACTIVE.md`. For project details, see `projects/{name}/PLANNING.md`.
>
> **Graduation:** Items move to ACTIVE.md (as TASKS or PROJECTS) during groom when ready to work on.
> **Time-based rules:** Items have review-by dates. Past review-by = "decide or kill." Past staleness = auto-archive.

**Last reviewed:** {YYYY-MM-DD}

---

## Quick Capture

> Raw ideas. Process into proper entries during groom.

- {idea}

---

## High Priority Queue

> Next up when capacity opens. Ready to start. Review-by: 7 days.

### {Item Name}
**Priority:** High
**Location:** `{path/}` (if applicable)
**Planning:** `{projects/{name}/PLANNING.md}` (if complex)
**Context:** [Why this matters, background info]
**Next Steps:**
- [ ] [First action]
- [ ] [Second action]
**Added:** {YYYY-MM-DD}
**Notes:** [Additional context]

---

## Medium Priority

> Important but not urgent. Review-by: 14 days.

### {Item Name}
**Priority:** Medium
**Location:** `{path/}`
**Context:** [Why this matters]
**Next Steps:**
- [ ] [First action]
**Added:** {YYYY-MM-DD}

---

## Low Priority / Someday

> Nice to have. May never happen. Review-by: 30 days.

---

## Processing Rules

1. **Quick Capture** → dump raw idea, process during groom
2. **Groom Review** → convert captures to proper entries with context
3. **Time-based enforcement:**
   - High: review-by 7 days from Added date
   - Medium: review-by 14 days from Added date
   - Low: review-by 30 days from Added date
   - Staleness = 2x review-by → auto-archive with note
4. **Graduate** → move to ACTIVE.md TASKS (bounded) or PROJECT (complex)
5. **Kill** → delete if no longer relevant
6. **Archive** → keep for reference but remove from active backlog
```

## Field Documentation

| Field | Purpose | Required? |
|-------|---------|-----------|
| Priority | Determines review-by threshold (H:7d, M:14d, L:30d) | Yes |
| Location | Path to relevant code/docs | If applicable |
| Planning | Link to PLANNING.md if complex | If applicable |
| Context | Why this matters — enough for a fresh session to understand | Yes |
| Next Steps | Concrete actions, not vague goals | Yes (at least 1) |
| Added | Date item entered backlog — drives time-based rules | Yes |
| Blocked by | Other backlog items or projects this depends on | If applicable |
| Notes | Extra context, links, decisions | Optional |

## Graduation Criteria

An item is ready to graduate from backlog when:
- It has clear next steps defined
- The operator has capacity to work on it
- Any blockers have been resolved
- The operator explicitly says "let's do this" during groom

**Graduation is never automatic.** The groom flow asks: "Ready to work on any of these?" The operator decides.
