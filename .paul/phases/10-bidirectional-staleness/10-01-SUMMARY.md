---
phase: 10-bidirectional-staleness
plan: 01
subsystem: workspace-orchestration
tags: [satellite-detection, groom, staleness, paul-json, workspace-json, timestamps]

requires:
  - phase: 09-groom-satellite-health
    provides: groom_satellites step and groom_check field that this plan extends

provides:
  - last_activity field on satellite entries in workspace.json (ISO timestamp from paul.json)
  - satellite-detection.py refreshes last_activity on every session start
  - groom_satellites uses last_activity (PRIMARY) with STATE.md parse (FALLBACK)

affects: [phase-11-framework-global-migration, groom-workflow, satellite-health]

tech-stack:
  added: []
  patterns:
    - "Bidirectional staleness: paul.json timestamps.updated_at → workspace.json last_activity via session-start hook"
    - "PRIMARY/FALLBACK timestamp pattern: structured field first, text parse fallback for pre-v1.1 satellites"

key-files:
  created: []
  modified:
    - .base/hooks/satellite-detection.py
    - .claude/skills/base/tasks/groom.md
    - apps/base/src/hooks/satellite-detection.py
    - apps/base/src/tasks/groom.md

key-decisions:
  - "last_activity written silently — no output change to hook for existing satellites"
  - "Fallback to STATE.md parse for pre-v1.1 satellites (no paul.json) — zero regression"
  - "Hook writes last_activity only when value changes — avoids unnecessary manifest writes"

patterns-established:
  - "Session-start hook as the staleness refresh mechanism — data flows paul.json → workspace.json each session"

duration: 5min
started: 2026-03-17T16:24:00-05:00
completed: 2026-03-17T16:27:00-05:00
---

# Phase 10 Plan 01: Bidirectional Staleness Summary

**satellite-detection.py now refreshes last_activity from paul.json timestamps on every session start; groom_satellites reads structured ISO timestamp (PRIMARY) with STATE.md text parse fallback.**

## Performance

| Metric | Value |
|--------|-------|
| Duration | ~5 min |
| Started | 2026-03-17 16:24 CDT |
| Completed | 2026-03-17 16:27 CDT |
| Tasks | 3 completed |
| Files modified | 4 |

## Acceptance Criteria Results

| Criterion | Status | Notes |
|-----------|--------|-------|
| AC-1: last_activity written on session start | Pass | casegate-v2 and hunter-exotics populated (only 2 with paul.json) |
| AC-2: last_activity refreshed silently for existing satellites | Pass | Hook runs silent, no output for refreshes |
| AC-3: groom_satellites uses last_activity from workspace.json | Pass | PRIMARY path reads satellite.last_activity |
| AC-4: Fallback to STATE.md parse if last_activity absent | Pass | FALLBACK path handles 6 pre-v1.1 satellites |
| AC-5: Source syncs identical | Pass | Both diffs returned clean |

## Accomplishments

- satellite-detection.py extended: on each session, reads `timestamps.updated_at` from paul.json for ALL satellites (new and existing), writes `last_activity` to workspace.json when value changes
- groom_satellites step updated with PRIMARY/FALLBACK timestamp pattern — structured data first, text parse as safety net
- 2/8 satellites immediately populated (casegate-v2, hunter-exotics — the only ones with paul.json). Remaining 6 use fallback path, will auto-populate as they get paul.json over time
- Both source files synced to apps/base/src/

## Files Created/Modified

| File | Change | Purpose |
|------|--------|---------|
| `.base/hooks/satellite-detection.py` | Modified | Adds last_activity refresh loop for existing satellites |
| `.claude/skills/base/tasks/groom.md` | Modified | PRIMARY/FALLBACK timestamp logic in groom_satellites step |
| `apps/base/src/hooks/satellite-detection.py` | Modified | Source sync |
| `apps/base/src/tasks/groom.md` | Modified | Source sync |

## Decisions Made

| Decision | Rationale | Impact |
|----------|-----------|--------|
| Write last_activity only when value changes | Avoids manifest rewrites every session for static satellites | Cleaner — workspace.json only changes when projects actually update |
| Silent refresh (no output) | Existing behavior: print only for new registrations. Staleness refresh is internal plumbing, not user-facing | No context noise every session |
| Pre-v1.1 fallback to STATE.md parse | 6/8 satellites have no paul.json — can't leave them with zero health data | Groom still works for all satellites; fallback degrades gracefully |

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## Next Phase Readiness

**Ready:**
- workspace.json satellite entries have structured last_activity for paul.json-enabled projects
- Groom health checks now use machine-readable timestamps where available
- Phase 11 (BASE framework global migration) can proceed — no dependencies on Phases 9-10 data

**Concerns:**
- 6 satellites still using STATE.md fallback — they'll auto-populate once they get paul.json (paul:register or new paul:init)

**Blockers:**
- global-004 decision (BASE framework → ~/.claude/base-framework/) still pending final confirmation from Chris. Phase 11 plan should surface this as a checkpoint.

---
*Phase: 10-bidirectional-staleness, Plan: 01*
*Completed: 2026-03-17*
