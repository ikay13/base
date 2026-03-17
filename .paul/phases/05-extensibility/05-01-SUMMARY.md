---
phase: 05-extensibility
plan: 01
subsystem: skill

requires:
  - phase: 02-hook-template
    provides: Hook template for generating new hooks
  - phase: 03-base-mcp
    provides: BASE MCP auto-discovers surfaces from workspace.json
  - phase: 04-surface-conversion
    provides: Proven surface pattern (active + backlog as examples)
provides:
  - /base:surface-create slash command (guided surface creation)
  - /base:surface-convert slash command (markdown to surface conversion)
  - /base:surface-list slash command (display surfaces)
  - Updated base.md skill entry point with surface routing
affects: [06-scaffold]

key-files:
  created:
    - .claude/skills/base/tasks/surface-create.md
    - .claude/skills/base/tasks/surface-convert.md
    - .claude/skills/base/tasks/surface-list.md
    - ~/.claude/commands/base/surface-create.md
    - ~/.claude/commands/base/surface-convert.md
    - ~/.claude/commands/base/surface-list.md
  modified:
    - .claude/skills/base/base.md

key-decisions:
  - "Skill IS the framework for BASE — no separate ~/.claude/base-framework/ needed (unlike PAUL) — pending reconsideration for global migration"
  - "Thin command wrappers at ~/.claude/commands/base/ mirror PAUL pattern — load skill task files via @"
  - "paul.json satellite manifest in .paul/ for machine-readable BASE registration (v2.1)"
  - "Session-start satellite detection hook scans for .paul/paul.json, auto-registers (v2.1)"
  - "BASE groom satellite health checks with configurable per-project boolean, default active (v2.1)"
  - "Bidirectional staleness: PAUL updates → BASE timestamps for cross-system awareness (v2.1)"
  - "BASE framework may move to global ~/.claude/base-framework/ — supports multi-workspace users (pending confirmation)"

patterns-established:
  - "BASE commands: ~/.claude/commands/base/{name}.md → @.claude/skills/base/tasks/{name}.md"
  - "Surface creation is a guided 5-step conversation, not a form"
  - "Surface conversion reads markdown structure, proposes schema, user confirms"

duration: ~25min (including architectural discussion)
started: 2026-03-17T11:42:00-05:00
completed: 2026-03-17T12:26:00-05:00
---

# Phase 5 Plan 01: Surface Extensibility Summary

**Built /base:surface-create, /base:surface-convert, and /base:surface-list as skill task files with global command wrappers. Identified and logged v2.1 architectural decisions for PAUL→BASE satellite integration.**

## Performance

| Metric | Value |
|--------|-------|
| Duration | ~25 min (including architectural discussion) |
| Started | 2026-03-17T11:42:00-05:00 |
| Completed | 2026-03-17T12:26:00-05:00 |
| Tasks | 4 completed + command wrapper addition |
| Files created | 7 (3 task files + 3 command wrappers + base.md update) |

## Acceptance Criteria Results

| Criterion | Status | Notes |
|-----------|--------|-------|
| AC-1: surface-create.md 5-step workflow | Pass | Define, Schema, Injection, Tools, Generate steps |
| AC-2: surface-convert.md markdown conversion | Pass | 6-step: Read, Propose, Confirm, Generate, Migrate, Cleanup |
| AC-3: surface-list.md display command | Pass | Uses base_list_surfaces, table format |
| AC-4: base.md routes new commands | Pass | 3 surface commands added to commands table, routing, greeting |

## Accomplishments

- Created 3 skill task files following existing base skill patterns
- Created 3 global command wrappers at ~/.claude/commands/base/ following PAUL pattern
- Updated base.md with surface command routing + "surface" activation keyword
- Identified nested project portability gap (BASE skill not reachable from apps/ subdirectories)
- Logged 4 CARL decisions for v2.1 PAUL→BASE integration architecture
- Tracked 6 new deferred issues in STATE.md for v2.1 milestone

## Files Created/Modified

| File | Change | Purpose |
|------|--------|---------|
| `.claude/skills/base/tasks/surface-create.md` | Created | 5-step guided surface creation |
| `.claude/skills/base/tasks/surface-convert.md` | Created | 6-step markdown to surface conversion |
| `.claude/skills/base/tasks/surface-list.md` | Created | Surface status display |
| `~/.claude/commands/base/surface-create.md` | Created | Global slash command wrapper |
| `~/.claude/commands/base/surface-convert.md` | Created | Global slash command wrapper |
| `~/.claude/commands/base/surface-list.md` | Created | Global slash command wrapper |
| `.claude/skills/base/base.md` | Modified | Added surface routing + activation keywords |

## Decisions Made

| Decision | Rationale | Impact |
|----------|-----------|--------|
| Global command wrappers | PAUL pattern proven — thin wrappers in ~/.claude/commands/ load skill task files | Commands available from any directory |
| paul.json satellite manifest (v2.1) | Standardized file for BASE to detect PAUL projects | Enables auto-registration on session start |
| Configurable groom health checks (v2.1) | Not everyone wants every project groomed every cycle | Per-project boolean, default active |
| BASE framework global migration (pending) | Multi-workspace support, less to manage | Needs confirmation before implementation |

## Deviations from Plan

| Deviation | Reason |
|-----------|--------|
| Added global command wrappers | Plan only had skill task files — Chris identified that slash commands need ~/.claude/commands/ entry points |
| Extensive v2.1 architectural discussion | Nested project portability gap led to PAUL→BASE integration design session |

## Issues Encountered

| Issue | Resolution |
|-------|------------|
| Skill task files not invocable as slash commands | Added ~/.claude/commands/base/ wrappers (PAUL pattern) |
| BASE skill unreachable from nested app directories | Identified as v2.1 gap — global framework migration pending |

## Next Phase Readiness

**Ready:**
- All 3 surface commands invocable via /base:surface-create, /base:surface-convert, /base:surface-list
- Phase 6 (Scaffold v2) can reference these commands in scaffold workflow

**Concerns:**
- Command wrappers reference .claude/skills/base/ which is workspace-relative — won't work from nested app directories until global migration

**Blockers:**
- None for Phase 6

---
*Phase: 05-extensibility, Plan: 01*
*Completed: 2026-03-17*
