---
phase: 07-command-wrappers
plan: 01
subsystem: commands

requires:
  - phase: 06-package-distributable
    provides: apps/base/src/ structure
provides:
  - 11 slash command wrappers (8 new + 3 existing)
  - All BASE commands invocable as /base:{name}
affects: [distribution, user onboarding]

key-files:
  created:
    - apps/base/src/commands/pulse.md
    - apps/base/src/commands/groom.md
    - apps/base/src/commands/audit.md
    - apps/base/src/commands/audit-claude-md.md
    - apps/base/src/commands/scaffold.md
    - apps/base/src/commands/status.md
    - apps/base/src/commands/history.md
    - apps/base/src/commands/carl-hygiene.md
    - ~/.claude/commands/base/ (11 real copies)

key-decisions:
  - "No symlinks — real copies everywhere. Symlinks break Python path resolution in hooks and add complexity for marginal benefit."
  - "apps/base/src/commands/ is source of truth, workspace gets real copies via installer"

duration: ~15min
started: 2026-03-17T13:07:00-05:00
completed: 2026-03-17T13:12:00-05:00
---

# Phase 7 Plan 01: Command Wrappers & Source Sync Summary

**Created 8 command wrappers for all existing BASE commands, bringing total to 11 slash commands. Attempted and reverted symlink approach — real copies used throughout.**

## Acceptance Criteria Results

| Criterion | Status | Notes |
|-----------|--------|-------|
| AC-1: All 11 command wrappers in src/commands/ | Pass | 11 .md files, all with Follow task pattern |
| AC-2: Symlinks for dev workflow | Scrapped | Symlinks break hook path resolution, reverted to real copies |
| AC-3: Existing functionality preserved | Pass | Hooks, MCP tools, surfaces all working |

## Deviations

| Deviation | Reason |
|-----------|--------|
| Symlink approach abandoned | Python hooks use Path(__file__).resolve() for workspace root detection — symlinks resolve to apps/base/src/ instead of .base/. User decided real copies are simpler. |

## Files

| File | Change |
|------|--------|
| `apps/base/src/commands/` | 8 new wrappers (pulse, groom, audit, audit-claude-md, scaffold, status, history, carl-hygiene) |
| `~/.claude/commands/base/` | 11 real copies installed |
| `.claude/skills/base/` | Real copy from apps/base/src/skill/ |
| `.base/hooks/` | Real copies from apps/base/src/hooks/ |

---
*Phase: 07-command-wrappers, Plan: 01*
*Completed: 2026-03-17*
