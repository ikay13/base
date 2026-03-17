---
phase: 03-base-mcp
plan: 01
subsystem: infra

requires:
  - phase: 01-data-reorg
    provides: .base/data/ directory for surface JSON files
provides:
  - BASE MCP server with 7 generic surface CRUD tools
  - Surface registration schema in workspace.json
  - Server registered in .mcp.json
  - Source package mirror for distribution
affects: [04-surface-conversion, 05-extensibility, 06-scaffold]

key-files:
  created:
    - .base/base-mcp/index.js
    - .base/base-mcp/package.json
    - .base/base-mcp/tools/surfaces.js
    - .claude/skills/base/packages/base-mcp/index.js
    - .claude/skills/base/packages/base-mcp/package.json
    - .claude/skills/base/packages/base-mcp/tools/surfaces.js
  modified:
    - .base/workspace.json
    - .mcp.json

key-decisions:
  - "Single tool module (surfaces.js) over per-tool files — 7 related tools don't justify 7 files"
  - "Schema-driven validation via workspace.json registration — BASE MCP doesn't know what a 'backlog' is, just enforces declared schema"
  - "generateId uses zero-padded 3-digit suffix (prefix-001) for clean sorting"

patterns-established:
  - "Surface registration in workspace.json: file, description, hook, silent, schema"
  - "Generic envelope format: { surface, version, last_modified, items: [], archived: [] }"
  - "handleTool dispatch pattern matches carl-mcp exactly — switch on name, return null for unknown"
  - "Source packages at .claude/skills/base/packages/{server}/ mirror installed versions minus node_modules"

tech-stack:
  added: ["@modelcontextprotocol/sdk (base-mcp instance)"]
  patterns: ["Generic surface CRUD via workspace.json registration"]

duration: ~10min
started: 2026-03-17T10:06:00-05:00
completed: 2026-03-17T10:10:00-05:00
---

# Phase 3 Plan 01: BASE MCP Server Summary

**Built BASE MCP server with 7 generic CRUD tools (list, get_surface, get_item, add, update, archive, search) operating on any workspace.json-registered data surface.**

## Performance

| Metric | Value |
|--------|-------|
| Duration | ~10 min |
| Started | 2026-03-17T10:06:00-05:00 |
| Completed | 2026-03-17T10:10:00-05:00 |
| Tasks | 3 completed |
| Files created | 6 (3 installed + 3 source packages) |
| Files modified | 2 (workspace.json, .mcp.json) |

## Acceptance Criteria Results

| Criterion | Status | Notes |
|-----------|--------|-------|
| AC-1: Server structure exists and starts cleanly | Pass | index.js, package.json, tools/surfaces.js, node_modules installed, reports 7 tools |
| AC-2: All 7 tools defined with correct schemas | Pass | All tool names present with inputSchema definitions |
| AC-3: Surface registration schema in workspace.json | Pass | surfaces: {} added, all existing content preserved |
| AC-4: Server registered in .mcp.json | Pass | base-mcp entry added, all existing entries preserved |
| AC-5: Source package mirror exists | Pass | 3 files identical to installed versions |

## Accomplishments

- Built complete MCP server following carl-mcp patterns (index.js, package.json, tool module)
- Implemented 7 tools: base_list_surfaces, base_get_surface, base_get_item, base_add_item, base_update_item, base_archive_item, base_search
- Schema-driven validation — base_add_item checks required_fields from registration, auto-generates IDs from id_prefix
- Search works across all surfaces or filtered to one, case-insensitive substring matching
- Archive pattern moves items to archived array with timestamp

## Files Created/Modified

| File | Change | Purpose |
|------|--------|---------|
| `.base/base-mcp/index.js` | Created | MCP server entry point (follows carl-mcp pattern) |
| `.base/base-mcp/package.json` | Created | ES module config with SDK dependency |
| `.base/base-mcp/tools/surfaces.js` | Created | 7 CRUD tools with helpers |
| `.base/workspace.json` | Modified | Added surfaces: {} registration section |
| `.mcp.json` | Modified | Added base-mcp server entry |
| `.claude/skills/base/packages/base-mcp/*` | Created | Source package mirror (3 files) |

## Decisions Made

| Decision | Rationale | Impact |
|----------|-----------|--------|
| Single surfaces.js module | 7 closely related tools sharing helpers don't justify per-file split | Simpler to maintain, follows psmm.js precedent |
| Zero-padded 3-digit IDs | ACT-001, BL-003 sort cleanly, readable | Consistent ID format across all surfaces |
| Shallow merge for updates | Prevents accidental data loss — only explicitly passed fields change | Users must pass full nested objects if updating nested fields |

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

| Issue | Resolution |
|-------|------------|
| debugLog used %d format specifier instead of comma | Fixed inline — changed to comma-separated args |

## Next Phase Readiness

**Ready:**
- BASE MCP server is operational with 7 tools
- workspace.json has empty surfaces: {} ready for Phase 4 registrations
- .mcp.json has base-mcp registered (available after session restart)
- Hook template from Phase 2 ready for hook generation

**Concerns:**
- None

**Blockers:**
- None

---
*Phase: 03-base-mcp, Plan: 01*
*Completed: 2026-03-17*
