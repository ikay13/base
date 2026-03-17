# ACTIVE.md Template

Output file: `.base/ACTIVE.md`

Symlink at workspace root: `ACTIVE.md → .base/ACTIVE.md` (for backward compatibility with hooks and rules that reference root-level ACTIVE.md)

```template
# Active Work

> **Working memory for Claude Code sessions.** Read at session start, update as work progresses.
> This is NOT documentation - it's task tracking. Obsidian handles the knowledge graph.
>
> **Update workflow:** Claude asks status questions → User responds via voice → Claude updates this file.
> **Not active?** → Move to `BACKLOG.md` for future work queue.
> **Graduation:** Backlog items move here (as TASKS or under a PROJECT) when they get attention.

---

## URGENT

[Projects with hard deadlines or critical momentum. Max 2-3 at a time.]

### {Project Name}
**Status:** [Current state — be specific]
**Location:** `{path/to/project/}`
**Deadline:** {YYYY-MM-DD}
**Next:** [Single most important next action]
**Blocked:** [What's preventing progress, or "None"]
**Notes:** [Context that helps a fresh session understand this project]

---

## HIGH PRIORITY

[Projects in active development without hard deadlines.]

### {Project Name}
**Status:** [Current state]
**Location:** `{path/to/project/}`
**Target:** [Target date or milestone, if any]
**Next:** [Single most important next action]
**Blocked:** [What's preventing progress, or "None"]
**Notes:** [Context]

---

## ONGOING

[Always-running work. No end date. Check in during groom.]

### {Project Name}
**Status:** [Current state]
**Location:** `{path/to/project/}`
**Next:** [What to do next or maintain]
**Notes:** [Context]

---

## TASKS

> Standalone work items graduated from backlog. Bounded, not ongoing. Close when done.

### {Task Name}
**Status:** [In Progress | Blocked | Ready]
**Next:** [What needs to happen]
**Blocked:** [Dependencies, or "None"]
**Notes:** [Context. Include backlog origin if relevant.]

---

## DEFERRED

[Paused work. Revisit during groom.]

---

## DONE / CLOSED

| Project/Task | Outcome | Date |
|-------------|---------|------|
| {name} | {what happened} | {YYYY-MM-DD or Mon YYYY} |

---

## Quick Reference

| Project | Status | Priority |
|---------|--------|----------|
| {name} | {status} | **{URGENT/HIGH/MEDIUM/ONGOING}** |
```

## Field Documentation

| Field | Purpose | Update Cadence |
|-------|---------|---------------|
| Status | Current state of the project — be specific, not generic | Every session or when it changes |
| Location | Path to project folder or app directory | Set once, update on moves |
| Deadline | Hard deadline if one exists | Set once, update if it moves |
| Target | Soft target or milestone | Set once, update as needed |
| Next | THE single next action. Not a list. One thing. | Every session |
| Blocked | What's preventing progress. Forces clarity. | Update when blockers change |
| Notes | Context for a fresh Claude session to understand the project | Update when major shifts happen |

## Section Rules

| Section | What Goes Here | Graduation Path |
|---------|---------------|----------------|
| URGENT | Hard deadlines, critical momentum | → DONE when shipped |
| HIGH | Active development, no hard deadline | → DONE when shipped, or → DEFERRED if paused |
| ONGOING | No end date, maintain indefinitely | Never closes, just evolves |
| TASKS | Bounded work from backlog. Has a finish line. | → DONE when complete |
| DEFERRED | Paused. Revisit during groom. | → Back to active, or → DONE/killed |
