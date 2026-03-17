# Project State

## Project Reference

See: .paul/PROJECT.md (updated 2026-03-17)

**Core value:** AI builders can maintain workspace health automatically, convert @-mentioned files into structured data surfaces, and extend their Claude Code environment — all without manual bookkeeping.
**Current focus:** v2.2 COMPLETE — next milestone TBD

## Current Position

Milestone: v2.2 Groom & Sync (v2.2.0) — COMPLETE
Phase: 3 of 3 — MILESTONE COMPLETE
Plan: 11-01 unified
Status: v2.2 Groom & Sync — COMPLETE
Last activity: 2026-03-17 16:39 — Phase 11 complete, v2.2 milestone closed

Progress:
- v2.0 Milestone: [██████████] 100% COMPLETE
- v2.1 Milestone: [██████████] 100% COMPLETE
- v2.2 Milestone: [██████████] 100% COMPLETE

## Loop Position

Current loop state:
```
PLAN ──▶ APPLY ──▶ UNIFY
  ✓        ✓        ✓     [v2.2 MILESTONE COMPLETE]
```

## Accumulated Context

### Decisions
12 architectural decisions locked. Full list in PROJECT.md Key Decisions table.
- Phase 9: groom_check opt-out model (default true), report-only health surfacing, 3 criteria
- Phase 10: last_activity from paul.json timestamps.updated_at, PRIMARY/FALLBACK pattern
- Phase 11: framework → ~/.claude/base-framework/ (global), data stays .base/ (workspace-local)

### Deferred Issues
| Issue | Origin | Effort | Revisit |
|-------|--------|--------|---------|
| Migrate existing .claude/hooks/ to .base/hooks/ | Design session | M | **DONE** — .base/hooks/ has all BASE hooks; .claude/hooks/ has only CARL/session hooks (correct) |
| Decisions redesign (per-domain JSON in .carl/decisions/) | DECISIONS-REDESIGN-SPEC.md | L | After Phase 1 |
| CARL hygiene implementation | CARL-HYGIENE-SPEC.md | M | After Phase 1 |
| paul.json satellite manifest + PAUL init update | CARL decisions paul-012 | L | **DONE** — paul-framework v1.1.1 shipped |
| Session-start satellite detection hook | CARL decision global-002 | M | **DONE** — Phase 8 |
| Remove redundant get-backlog-stale.py hook | Phase 4 | S | **DONE** — already gone |
| BASE groom satellite health checks (configurable) | CARL decision global-003 | M | **DONE** — Phase 9 |
| Bidirectional staleness (PAUL→BASE timestamps) | Phase 5 discussion | M | **DONE** — Phase 10 |
| BASE framework to global (~/.claude/base-framework/) | CARL decision global-005 | L | **DONE** — Phase 11 |

### Blockers/Concerns
None.

## Session Continuity

Last session: 2026-03-17 16:17
Stopped at: Phase 9 complete, transition done — ready to plan Phase 10
Next action: Create next milestone or ship
Resume file: .paul/ROADMAP.md

---
*STATE.md — Updated after every significant action*
