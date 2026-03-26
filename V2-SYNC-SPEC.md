# BASE v2 Sync Spec

## Status: READY FOR IMPLEMENTATION

This spec documents the required changes to bring the BASE distributable repo current with the production system running on Chris's machine. BASE has evolved significantly beyond what the repo reflects.

---

## What Changed (repo → production)

### Data Model
- **Repo**: Markdown-based working memory (ACTIVE.md, BACKLOG.md, STATE.md)
- **Production**: JSON surfaces (data/active.json, data/backlog.json, data/projects.json, data/entities.json, data/state.json, data/psmm.json, data/staging.json)

### Hooks
- **Repo**: v1 hooks (active-hook.py, backlog-hook.py, base-pulse-check.py, psmm-injector.py, satellite-detection.py)
- **Production**: v2 hooks (active-hook-v2.py, backlog-hook-v2.py, base-pulse-check-v2.py) + new hooks (operator.py, apex-insights.py)

### MCP
- **Repo**: Old base-mcp + carl-mcp in `src/packages/`
- **Production**: `base-mcp` with tools: projects.js, entities.js, state.js, operator.js, surfaces.js

### New Concepts (not in repo)
- **Operator profile** (operator.json) — north star, values, vision, pitch
- **Apex insights** — workspace analytics (velocity, stalls, blocking, revenue exposure)
- **Projects as first-class JSON** — unified project tracking with PAUL integration
- **Entities** — people/org tracking separate from projects
- **Surfaces** — abstract data layer concept (hook-driven, schema-validated)

### workspace.json Evolution
- **Repo**: References ACTIVE.md/BACKLOG.md in working-memory paths
- **Production**: References JSON surfaces, has satellite registry with sync, has surfaces definition with schemas

---

## Files to Update in Repo

### Replace (src/hooks/)
| Current (v1) | Replace With (v2) | Source |
|---|---|---|
| `src/hooks/active-hook.py` | `src/hooks/active-hook.py` (v2) | `.base/hooks/active-hook-v2.py` |
| `src/hooks/backlog-hook.py` | `src/hooks/backlog-hook.py` (v2) | `.base/hooks/backlog-hook-v2.py` |
| `src/hooks/base-pulse-check.py` | `src/hooks/base-pulse-check.py` (v2) | `.base/hooks/base-pulse-check-v2.py` |
| `src/hooks/psmm-injector.py` | `src/hooks/psmm-injector.py` (current) | `.base/hooks/psmm-injector.py` |
| `src/hooks/satellite-detection.py` | `src/hooks/satellite-detection.py` (v2 + sync) | `.base/hooks/satellite-detection.py` |

### Add (src/hooks/)
| File | Purpose | Source |
|---|---|---|
| `src/hooks/operator.py` | Operator profile context injection | `.base/hooks/operator.py` |
| `src/hooks/apex-insights.py` | Workspace analytics engine | `.base/hooks/apex-insights.py` |

### Replace (src/packages/)
| Current | Replace With | Source |
|---|---|---|
| `src/packages/base-mcp/` | Complete rewrite | `.base/base-mcp/` |
| `src/packages/carl-mcp/` | REMOVE — carl-mcp belongs in carl-core repo | N/A |

### Add
| File | Purpose | Source |
|---|---|---|
| `schemas/projects.schema.json` | JSON schema for projects.json | `apps/apex/schemas/projects.schema.json` |
| `schemas/entities.schema.json` | JSON schema for entities.json | `apps/apex/schemas/entities.schema.json` |
| `schemas/state.schema.json` | JSON schema for state.json | `apps/apex/schemas/state.schema.json` |
| `src/templates/operator.json` | Template operator profile | `.base/operator.json` (sanitized) |
| `src/templates/workspace.json` | Template workspace manifest | Current template with JSON surface paths |

### Update
| File | Changes Needed |
|---|---|
| `README.md` | Document v2 architecture, JSON surfaces, operator, insights, MCP tools |
| `bin/install.sh` | Update installer for JSON data model, MCP wiring, operator setup |
| `package.json` | Version bump |
| `src/framework/` | Verify task/template files are current with production commands |

### Remove
| File | Reason |
|---|---|
| `src/packages/carl-mcp/` | Belongs in carl-core, not BASE |
| `src/templates/active-md.md` | Replaced by JSON surfaces |
| `src/templates/backlog-md.md` | Replaced by JSON surfaces |
| `src/templates/state-md.md` | Replaced by JSON surfaces |

---

## Installation Flow (v2)

1. Run `npx base init` or `bin/install.sh`
2. Creates `.base/` directory structure:
   - `data/` — JSON surfaces (active.json, backlog.json, projects.json, entities.json, state.json)
   - `hooks/` — v2 hooks + operator + insights
   - `base-mcp/` — MCP server with tools
   - `workspace.json` — manifest with JSON surface paths
   - `operator.json` — operator profile (guided setup)
3. Wires hooks in project `.claude/settings.json`
4. Wires MCP in `.mcp.json`
5. Runs initial operator profile questionnaire

---

## Apex Insights Documentation

### What It Does
`apex-insights.py` is a workspace analytics engine invoked by `/apex:insights`. It computes:

1. **Velocity** — PAUL projects sorted by plan age, phase progress, loop position
2. **Stalls** — Projects with plan age > 14 days (active, not completed/deferred)
3. **Blocking Analysis** — Groups blocked projects by blocker, flags revenue at risk
4. **Cross-Project Dependencies** — Visualizes dependency chains between projects
5. **Workload by Category** — Active project count by category
6. **Revenue Exposure** — All revenue-tied projects with blocked flags
7. **Pending Handoffs** — PAUL satellites awaiting handoff processing

### When to Use
- Weekly groom cycles — get the full picture before prioritizing
- When deciding what to work on next
- When a project feels stalled — check if it's actually blocked
- Before stakeholder updates — revenue exposure + velocity snapshot

### Data Sources
- `.base/data/projects.json` — all project data
- `.base/workspace.json` — satellite registry, handoff state
