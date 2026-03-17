# Project State

## Project Reference

See: .paul/PROJECT.md (updated 2026-03-17)

**Core value:** AI builders can maintain workspace health automatically, convert @-mentioned files into structured data surfaces, and extend their Claude Code environment — all without manual bookkeeping.
**Current focus:** v2.2 Groom & Sync — Phase 11 next (pending global-004 confirmation)

## Current Position

Milestone: v2.2 Groom & Sync (v2.2.0)
Phase: 11 of 11 (BASE Framework Global Migration)
Plan: Not started
Status: Ready to plan
Last activity: 2026-03-17 16:27 — Phase 10 complete, transitioned to Phase 11

Progress:
- v2.0 Milestone: [██████████] 100% COMPLETE
- v2.1 Milestone: [██████████] 100% COMPLETE
- v2.2 Milestone: [██████░░░░] 67% (2/3 phases)
- Phase 9: [██████████] 100% COMPLETE
- Phase 10: [██████████] 100% COMPLETE
- Phase 11: [░░░░░░░░░░] 0%

## Loop Position

Current loop state:
```
PLAN ──▶ APPLY ──▶ UNIFY
  ○        ○        ○     [Ready for first PLAN]
```

## Accumulated Context

### Decisions
12 architectural decisions locked. Full list in PROJECT.md Key Decisions table.
- Phase 9: groom_check opt-out model (default true), report-only health surfacing, 3 criteria
- Phase 10: last_activity from paul.json timestamps.updated_at, PRIMARY/FALLBACK pattern
- Phase 10: hook writes last_activity only on value change (no unnecessary manifest writes)

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
| BASE framework to global (~/.claude/base-framework/) | CARL decision global-004 | L | Pending confirmation |

### Blockers/Concerns
None.

## Session Continuity

Last session: 2026-03-17 16:17
Stopped at: Phase 9 complete, transition done — ready to plan Phase 10
Next action: /paul:plan for Phase 11 (BASE Framework Global Migration) — needs global-004 confirmation first
Resume file: .paul/ROADMAP.md

---
*STATE.md — Updated after every significant action*
