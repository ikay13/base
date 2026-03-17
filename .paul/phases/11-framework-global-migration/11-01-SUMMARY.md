---
phase: 11-framework-global-migration
plan: 01
subsystem: workspace-orchestration
tags: [framework, global, migration, skills, commands, distribution]

requires:
  - phase: 09-groom-satellite-health
    provides: groom.md task file (migrated to global)
  - phase: 10-bidirectional-staleness
    provides: updated groom.md and satellite-detection.py (migrated to global)

provides:
  - ~/.claude/base-framework/ global directory (tasks, context, frameworks, templates)
  - Updated base.md entry point with global @-references
  - Updated 11 command wrappers with global @-references
  - apps/base/src/framework/ distribution copy

affects: [scaffold-v2, distribution-packaging, teaching-notes]

tech-stack:
  added: []
  patterns:
    - "Global framework + local data: ~/.claude/base-framework/ (framework) + .base/ (data per workspace)"
    - "Skill entry point stays at ~/.claude/skills/base/base.md, references global framework via absolute @~ paths"

key-files:
  created: [~/.claude/base-framework/, apps/base/src/framework/]
  modified: [~/.claude/skills/base/base.md, ~/.claude/commands/base/*.md]

key-decisions:
  - "Skill entry point stays at ~/.claude/skills/base/base.md — Claude Code skill loader expects this location"
  - "Framework @-references use @~/.claude/base-framework/ absolute paths — works from any workspace"
  - "Old framework dirs removed from ~/.claude/skills/base/ and apps/base/src/skill/"

patterns-established:
  - "Global framework pattern: framework files at ~/.claude/{tool}-framework/, skill entry at ~/.claude/skills/{tool}/{tool}.md"

duration: 6min
started: 2026-03-17T16:36:00-05:00
completed: 2026-03-17T16:39:00-05:00
---

# Phase 11 Plan 01: BASE Framework Global Migration Summary

**BASE framework files migrated from workspace-local ~/.claude/skills/base/ to global ~/.claude/base-framework/. Entry point and 11 command wrappers updated. Zero old references remain.**

## Performance

| Metric | Value |
|--------|-------|
| Duration | ~6 min |
| Started | 2026-03-17 16:36 CDT |
| Completed | 2026-03-17 16:39 CDT |
| Tasks | 3 completed |
| Files modified | 13+ (base.md + 11 commands + src sync) |

## Acceptance Criteria Results

| Criterion | Status | Notes |
|-----------|--------|-------|
| AC-1: Framework files at global location | Pass | 11 tasks, 1 context, 2 frameworks, 4 templates |
| AC-2: Old dirs removed from skills/base/ | Pass | Only base.md remains |
| AC-3: base.md references updated | Pass | All @~ paths point to base-framework/ |
| AC-4: All 11 command wrappers updated | Pass | grep returns zero old references |
| AC-5: Source syncs complete | Pass | diff -r framework/ clean, diff base.md clean |

## Accomplishments

- Created ~/.claude/base-framework/ with full directory tree (tasks/, context/, frameworks/, templates/)
- Updated base.md: relative @tasks/ → absolute @~/.claude/base-framework/tasks/ (and context, frameworks, templates)
- Updated all 11 command wrappers: @.claude/skills/base/ → @~/.claude/base-framework/
- Removed old framework subdirs from ~/.claude/skills/base/ (only base.md remains)
- Created apps/base/src/framework/ as new dist copy location
- Removed old framework subdirs from apps/base/src/skill/ (only base.md remains)

## Files Created/Modified

| File | Change | Purpose |
|------|--------|---------|
| `~/.claude/base-framework/**` | Created | Global framework location — 18 files across 4 subdirs |
| `~/.claude/skills/base/base.md` | Modified | @-references now point to global base-framework/ |
| `~/.claude/commands/base/*.md` | Modified | All 11 wrappers reference global base-framework/ |
| `apps/base/src/framework/**` | Created | Distribution copy of global framework |
| `apps/base/src/skill/base.md` | Modified | Mirrors updated entry point |

## Decisions Made

None beyond plan — executed exactly as specified.

## Deviations from Plan

None.

## Issues Encountered

None.

## Next Phase Readiness

**This is the LAST phase in v2.2 — milestone complete.**

**Ready for future work:**
- Global framework pattern established — can be replicated for CARL, PAUL
- Scaffold needs updating to install framework to ~/.claude/base-framework/ (currently workspace-local)
- Distribution packaging can now ship from apps/base/src/framework/ + src/skill/

**Concerns:**
- Scaffold.md still installs to workspace-local paths — needs updating in a future milestone

**Blockers:**
- None

---
*Phase: 11-framework-global-migration, Plan: 01*
*Completed: 2026-03-17*
