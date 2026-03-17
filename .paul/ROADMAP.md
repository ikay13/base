# Roadmap: BASE

## Overview

BASE v2 evolves from a workspace state tracker into a full workspace orchestration platform with data surfaces, dual MCP architecture, and extensibility for any Claude Code user. The build path moves from foundational reorganization through new infrastructure to user-facing extensibility.

## Current Milestone

**v2.0 Data Surfaces & Extensibility** (v2.0.0)
Status: COMPLETE
Phases: 7 of 7 complete

## Phases

| Phase | Name | Plans | Status | Completed |
|-------|------|-------|--------|-----------|
| 1 | Data Directory Reorganization | 1/1 | Complete | 2026-03-17 |
| 2 | Hook Template & Contract | 1/1 | Complete | 2026-03-17 |
| 3 | BASE MCP Server | 1/1 | Complete | 2026-03-17 |
| 4 | Active + Backlog Surface Conversion | 1/1 | Complete | 2026-03-17 |
| 5 | Surface Extensibility | 1/1 | Complete | 2026-03-17 |
| 6 | Package BASE as Distributable App | 1/1 | Complete | 2026-03-17 |
| 7 | Command Wrappers & Source Sync | 1/1 | Complete | 2026-03-17 |

## Phase Details

### Phase 1: Data Directory Reorganization

**Goal:** Move all JSON data files into .base/data/, update all references, verify nothing breaks.
**Depends on:** Nothing (foundation)
**Research:** Unlikely (internal file moves and path updates)

**Scope:**
- Create .base/data/ and .base/hooks/ directories
- Move psmm.json and staging.json into .base/data/
- Update carl-mcp tool files (psmm.js, staging.js) with new data paths
- Update source packages (.claude/skills/base/packages/carl-mcp/)
- Update psmm-injector.py hook
- Update CARL rule 12 fallback path reference
- Verify all CARL MCP tools still work after move
- Verify PSMM hook injection still works

### Phase 2: Hook Template & Contract

**Goal:** Create the canonical hook template that defines best practices for all surface injection hooks.
**Depends on:** Phase 1 (hooks directory exists)
**Research:** Unlikely (codifying existing patterns)

**Scope:**
- Design and write .base/hooks/_template.py with full contract documentation
- Document DOs and DONTs as inline comments
- Include behavioral directive template (passive awareness, 24h deadline exception)
- Create source package copy at .claude/skills/base/packages/hooks/_template.py
- Test by manually generating a sample hook from the template

### Phase 3: BASE MCP Server

**Goal:** Build the generic surface CRUD MCP server that operates on any registered data surface.
**Depends on:** Phase 1 (data directory structure), Phase 2 (hook template for reference)
**Research:** Unlikely (follows carl-mcp patterns exactly)

**Scope:**
- Build .base/base-mcp/ with surfaces.js tool module
- Implement: base_list_surfaces, base_get_surface, base_get_item, base_add_item, base_update_item, base_archive_item, base_search
- Add surface registration schema to workspace.json
- Register in .mcp.json
- Create source package at .claude/skills/base/packages/base-mcp/
- Test all tools with a dummy surface registration

### Phase 4: Active + Backlog Surface Conversion

**Goal:** Convert ACTIVE.md and BACKLOG.md into structured JSON data surfaces with hooks and MCP tool access.
**Depends on:** Phase 3 (BASE MCP operational)
**Research:** Unlikely (analyzing existing markdown to design schemas)

**Scope:**
- Design active.json schema from ACTIVE.md content analysis
- Design backlog.json schema from BACKLOG.md content analysis
- Migrate ACTIVE.md content into active.json
- Migrate BACKLOG.md content into backlog.json
- Generate active-hook.py and backlog-hook.py from template
- Register hooks in .claude/settings.json
- Register surfaces in workspace.json
- Test: hook injection, MCP CRUD, passive behavioral compliance
- Decide fate of markdown files (keep as generated views, archive, or delete)

### Phase 5: Surface Extensibility

**Goal:** Build /base:surface commands so any user can create custom data surfaces without manual wiring.
**Depends on:** Phase 4 (proven surface pattern from active + backlog)
**Research:** Unlikely (templating existing patterns)

**Scope:**
- Build /base:surface create task file (guided schema builder → JSON + hook + registration)
- Build /base:surface convert task file (markdown analysis → schema proposal → migration)
- Build /base:surface list task file
- Update base.md entry point with new commands
- End-to-end test: create a custom surface from scratch
- End-to-end test: convert a sample @-mentioned markdown file

### Phase 6: Scaffold v2 & Documentation

**Goal:** Update scaffold to install the full v2 structure and document everything for distribution.
**Depends on:** Phase 5 (all surface infrastructure complete)
**Research:** Unlikely (updating existing scaffold)

**Scope:**
- Update scaffold.md task file with v2 steps (data dir, hooks dir, MCP servers, default surfaces)
- Update base-principles.md with Data Surface concepts
- Update workspace-json.md template with surfaces schema
- Update CLAUDE.md references
- Create BASE teaching notes for "From Zero to Dangerous" course
- Document the Data Surface pattern as standalone concept
- Verify scaffold creates full v2 structure end-to-end

### Phase 7: Command Wrappers & Source Sync

**Goal:** Create slash command wrappers for all 8 existing BASE commands (pulse, groom, audit, scaffold, status, history, audit-claude-md, carl-hygiene) and sync everything to apps/base/src/commands/ as source of truth.
**Depends on:** Phase 6 (package structure exists)
**Research:** None (templating existing pattern from surface commands)

**Scope:**
- Create 8 command wrappers at ~/.claude/commands/base/ following surface-create.md pattern
- Copy all 11 command wrappers (8 new + 3 existing surface commands) to apps/base/src/commands/
- Update base.md entry point command table to reference slash commands
- Verify all 11 commands appear in Claude Code skill list after session restart

## Next Milestone

**v2.1 Satellite Intelligence** (v2.1.0)
Status: COMPLETE
Phases: 1 of 1 complete

| Phase | Name | Plans | Status | Completed |
|-------|------|-------|--------|-----------|
| 8 | Satellite Detection Hook | 1/1 | Complete | 2026-03-17 |

### Phase 8: Satellite Detection Hook

**Goal:** Session-start hook that scans for `.paul/paul.json` files across the workspace, compares against registered satellites in `workspace.json`, and auto-registers any new ones found. Silent when nothing new; injects notification when satellites are added.
**Depends on:** v2.0 complete (hook infrastructure, workspace.json satellites schema)
**Research:** None (extending existing pulse hook pattern)

**Scope:**
- Write `.base/hooks/satellite-detection.py` — scan satellite dirs for paul.json, auto-register new ones in workspace.json, silent unless new registrations
- Register hook in `.claude/settings.json` (UserPromptSubmit array)
- Copy hook to `apps/base/src/hooks/satellite-detection.py` (source sync)

## Next Milestone

**v2.2 Groom & Sync** (v2.2.0)
Status: COMPLETE
Phases: 3 of 3 complete

| Phase | Name | Plans | Status | Completed |
|-------|------|-------|--------|-----------|
| 9 | Groom Satellite Health Checks | 1/1 | Complete | 2026-03-17 |
| 10 | Bidirectional Staleness | 1/1 | Complete | 2026-03-17 |
| 11 | BASE Framework Global Migration | 1/1 | Complete | 2026-03-17 |

### Phase 9: Groom Satellite Health Checks

**Goal:** Add per-project satellite health checking to the groom cycle. Configurable boolean per project (default: active). Checks for stale loops, abandoned phases, overdue milestones.
**Depends on:** v2.1 (satellite registration exists)
**Research:** Unlikely (extending existing groom workflow)

**Scope:**
- Add `groom_check` boolean to satellite entries in workspace.json (default: true)
- Update groom workflow to read satellites and run health checks for enabled ones
- Define health check criteria: stale loop (>7d no activity), abandoned phase (>14d), overdue milestone
- Inject satellite health summary into groom output
- Source sync to apps/base/src/

### Phase 10: Bidirectional Staleness

**Goal:** Surface when PAUL satellites were last active by reading timestamps from paul.json into workspace.json. Lets BASE know a project is idle without reading its full state.
**Depends on:** Phase 9 (groom checks use this data)
**Research:** Unlikely (reading existing paul.json timestamps)

**Scope:**
- On satellite detection / groom cycle, read `timestamps.updated_at` from each satellite's paul.json
- Write `last_activity` field to satellite entry in workspace.json
- Use in groom health checks to determine staleness
- Source sync to apps/base/src/

### Phase 11: BASE Framework Global Migration

**Goal:** Move BASE framework files (task files, templates, principles) from workspace-local `.claude/skills/base/` to global `~/.claude/base-framework/`. Data stays in `.base/`.
**Depends on:** Phases 9-10 (all v2.2 feature work complete before structural change)
**Research:** None (decision already made pending confirmation — global-004)

**Scope:**
- Confirm decision: BASE framework → `~/.claude/base-framework/`
- Move task files, templates, principles to global location
- Update all references in CLAUDE.md, skill entry points, hooks
- Verify all commands still resolve correctly
- Update scaffold to install to global location
- Source sync to apps/base/src/

---
*Roadmap created: 2026-03-17*
*Last updated: 2026-03-17*
