---
phase: 06-package-distributable
plan: 01
subsystem: distribution

requires:
  - phase: 01-05
    provides: All BASE source files across workspace
provides:
  - apps/base/ as standalone distributable package
  - package.json for npm distribution
  - bin/install.js installer following PAUL pattern
  - Single src/ directory as source of truth for all BASE files
affects: [v2.1 milestone, GitHub distribution, Skool community]

key-files:
  created:
    - apps/base/src/ (36 source files)
    - apps/base/package.json
    - apps/base/bin/install.js

key-decisions:
  - "Single src/hooks/ directory — installer routes surface hooks to .base/hooks/ and session hooks to .claude/hooks/"
  - "carl-mcp ships with BASE (not standalone) — per architectural decision #2"
  - "get-backlog-stale.py excluded — redundant, replaced by backlog-hook.py"
  - ".carl/ excluded — CARL is its own project, not a BASE dependency"

patterns-established:
  - "PAUL pattern for distribution: src/{type}/ + bin/install.js + package.json"
  - "Install modes: --global (commands to ~/.claude), --local (to ./.claude), --workspace (.base/ layer)"
  - "Source of truth is apps/base/src/ — workspace installation is a consumer"

duration: ~12min
started: 2026-03-17T12:38:00-05:00
completed: 2026-03-17T12:49:00-05:00
---

# Phase 6 Plan 01: Package BASE as Distributable App Summary

**Copied all 36 BASE source files into apps/base/src/ organized by type, created package.json and install.js following the PAUL framework distribution pattern.**

## Performance

| Metric | Value |
|--------|-------|
| Duration | ~12 min |
| Tasks | 3 completed (including human verification checkpoint) |
| Files copied | 36 (pure copy, zero modifications) |
| Files created | 2 (package.json, install.js) |

## Acceptance Criteria Results

| Criterion | Status | Notes |
|-----------|--------|-------|
| AC-1: All source files in src/ | Pass | 36 files, 6 spot-check diffs identical |
| AC-2: package.json correct | Pass | Valid JSON, correct metadata, files array |
| AC-3: File count matches | Pass | find src/ -type f = 36 |

## Structure

```
apps/base/
├── .paul/                    (build history)
├── bin/install.js            (installer — PAUL pattern)
├── package.json              (npm distribution)
├── src/
│   ├── commands/    (3)      slash command wrappers
│   ├── hooks/       (5)      all hooks (installer routes to correct location)
│   ├── packages/    (9)      MCP server sources (base-mcp, carl-mcp)
│   └── skill/      (19)     entry point, tasks, templates, frameworks, context
├── *.md                      (specs — design documentation)
```

## Deviations

| Deviation | Reason |
|-----------|--------|
| Consolidated two hooks directories into one | User flagged redundancy via screenshot — installer handles routing |

---
*Phase: 06-package-distributable, Plan: 01*
*Completed: 2026-03-17*
