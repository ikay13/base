---
phase: 02-hook-template
plan: 01
subsystem: infra

requires:
  - phase: 01-data-reorg
    provides: .base/data/ and .base/hooks/ directories
provides:
  - Canonical hook template for generating conformant surface hooks
  - Source package mirror for distribution
affects: [04-surface-conversion, 05-extensibility, 06-scaffold]

key-files:
  created:
    - .base/hooks/_template.py
    - .claude/skills/base/packages/hooks/_template.py

key-decisions:
  - "Template uses SURFACE_NAME variable at top, not argparse — hooks are copy-and-customize, not parameterized"
  - "session_id extracted but unused in template — shows the pattern for hooks that need it"

patterns-established:
  - "All surface hooks follow the _template.py contract: one JSON, one XML block, passive behavioral directive"
  - "CUSTOMIZE markers in templates indicate what to change when copying"
  - "Source packages mirror installed files at .claude/skills/base/packages/"

duration: ~5min
started: 2026-03-17T09:52:00-05:00
completed: 2026-03-17T09:56:00-05:00
---

# Phase 2 Plan 01: Hook Template & Contract Summary

**Created canonical hook template (.base/hooks/_template.py) encoding the complete data surface injection contract with DO/DON'T rules, behavioral directive, and CUSTOMIZE markers.**

## Performance

| Metric | Value |
|--------|-------|
| Duration | ~5 min |
| Started | 2026-03-17T09:52:00-05:00 |
| Completed | 2026-03-17T09:56:00-05:00 |
| Tasks | 2 completed |
| Files created | 2 |

## Acceptance Criteria Results

| Criterion | Status | Notes |
|-----------|--------|-------|
| AC-1: Template exists with complete contract documentation | Pass | Full docstring + inline comments covering contract, DO, DO NOT rules |
| AC-2: Template follows psmm-injector pattern | Pass | Same structure: shebang, imports, path resolution, JSON read, XML output, exit 0 |
| AC-3: Template includes configurable placeholders | Pass | SURFACE_NAME variable + 4 CUSTOMIZE markers for customization points |
| AC-4: Source package mirror exists | Pass | Identical copy at .claude/skills/base/packages/hooks/_template.py |

## Accomplishments

- Created complete hook contract template with DO/DON'T rules as inline documentation
- Generalized psmm-injector.py pattern into reusable SURFACE_NAME-driven template
- Established CUSTOMIZE marker convention for future template-based generation
- Source package mirror ready for distribution via scaffold

## Files Created/Modified

| File | Change | Purpose |
|------|--------|---------|
| `.base/hooks/_template.py` | Created | Canonical hook template with full contract |
| `.claude/skills/base/packages/hooks/_template.py` | Created | Source package mirror for distribution |

## Decisions Made

| Decision | Rationale | Impact |
|----------|-----------|--------|
| SURFACE_NAME variable over argparse | Hooks are copy-and-customize files, not CLI tools. Simpler, more readable. | Phase 5 surface generator copies and sed-replaces SURFACE_NAME |
| session_id extracted but unused | Template shows hooks receive it via stdin even if not needed | Future hooks that need session context have the pattern ready |

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## Next Phase Readiness

**Ready:**
- Hook template exists for Phase 4 (surface conversion) and Phase 5 (extensibility) to reference
- Source package ready for Phase 6 (scaffold) to install during workspace setup
- Behavioral directive pattern locked (passive awareness, 24h deadline exception)

**Concerns:**
- None

**Blockers:**
- None

---
*Phase: 02-hook-template, Plan: 01*
*Completed: 2026-03-17*
