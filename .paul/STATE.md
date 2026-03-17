# Project State

## Project Reference

See: .paul/PROJECT.md (updated 2026-03-17)

**Core value:** AI builders can maintain workspace health automatically, convert @-mentioned files into structured data surfaces, and extend their Claude Code environment — all without manual bookkeeping.
**Current focus:** v2.2 Groom & Sync — Phase 10 next

## Current Position

Milestone: v2.2 Groom & Sync (v2.2.0)
Phase: 10 of 11 (Bidirectional Staleness)
Plan: Not started
Status: Ready to plan
Last activity: 2026-03-17 16:17 — Phase 9 complete, transitioned to Phase 10

Progress:
- v2.0 Milestone: [██████████] 100% COMPLETE
- v2.1 Milestone: [██████████] 100% COMPLETE
- v2.2 Milestone: [███░░░░░░░] 33% (1/3 phases)
- Phase 9: [██████████] 100% COMPLETE
- Phase 10: [░░░░░░░░░░] 0%

## Loop Position

Current loop state:
```
PLAN ──▶ APPLY ──▶ UNIFY
  ○        ○        ○     [Ready for first PLAN]
```

## Accumulated Context

### Decisions
12 architectural decisions locked. Full list in PROJECT.md Key Decisions table.
- Phase 9: groom_check opt-out model (default true) on all satellites
- Phase 9: groom_satellites health check is report-only, no auto-fix
- Phase 9: health criteria — stuck loop (>7d), abandoned phase (>14d), milestone drift (>14d)

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
| Bidirectional staleness (PAUL→BASE timestamps) | Phase 5 discussion | M | v2.2 candidate |
| BASE framework to global (~/.claude/base-framework/) | CARL decision global-004 | L | Pending confirmation |

### Blockers/Concerns
None.

## Session Continuity

Last session: 2026-03-17 16:17
Stopped at: Phase 9 complete, transition done — ready to plan Phase 10
Next action: /paul:plan for Phase 10 (Bidirectional Staleness)
Resume file: .paul/ROADMAP.md

---
*STATE.md — Updated after every significant action*
