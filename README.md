# BASE — Builder's Automated State Engine

Workspace lifecycle management for Claude Code. Scaffold, audit, groom, and maintain AI builder workspaces. Manage structured data surfaces for persistent context injection.

---

## Install

```bash
npx base-framework --global --workspace
```

**Options:**

| Flag | What it does |
|------|-------------|
| `--global` | Install commands and framework to `~/.claude` |
| `--workspace` | Install workspace layer (`.base/`) in current directory |
| `--local` | Install commands to `./.claude` instead of global |
| `--config-dir <path>` | Custom Claude config directory |
| `--workspace-dir <path>` | Install workspace layer at a specific path |

**Common flows:**

```bash
# Full install: global commands + current workspace
npx base-framework --global --workspace

# Global commands only (then set up each workspace with /base:scaffold)
npx base-framework --global

# New workspace on existing global install
npx base-framework --workspace
```

---

## What Gets Installed

### `--global` installs to `~/.claude/`:
- `commands/base/` — Slash commands (`/base:surface-create`, etc.)
- `skills/base/` — Skill entry point (`base.md`)
- `base-framework/` — Task files, templates, context, frameworks
- `base-framework/hooks/` — Session hooks (for scaffold to copy into new workspaces)

### `--workspace` installs to `./.base/` and `./.claude/`:
- `.base/data/` — Data surface directory
- `.base/hooks/` — Surface injection hooks
- `.base/base-mcp/` — BASE MCP server (auto npm install)
- `.base/carl-mcp/` — CARL MCP server (auto npm install)
- `.claude/hooks/` — Session hooks (pulse, PSMM, satellite detection)
- `.mcp.json` — MCP server registrations (merged)

---

## Commands

After install, run `/base:scaffold` in Claude Code to complete workspace setup.

| Command | Description |
|---------|------------|
| `/base:scaffold` | Set up BASE in a new or existing workspace |
| `/base:pulse` | Daily workspace health briefing |
| `/base:groom` | Weekly maintenance cycle |
| `/base:audit` | Deep workspace optimization |
| `/base:status` | Quick health check |
| `/base:history` | Workspace evolution timeline |
| `/base:audit-claude-md` | Audit CLAUDE.md, generate recommended version |
| `/base:carl-hygiene` | CARL domain maintenance |
| `/base:surface create` | Create a new data surface (guided) |
| `/base:surface convert` | Convert a markdown file to a data surface |
| `/base:surface list` | Show all registered surfaces |

---

## Data Surfaces

Data surfaces are structured JSON files that get injected into Claude's context each session via lightweight Python hooks. Any data you want Claude to passively know about — active projects, backlog, contacts — can become a surface.

BASE ships with two built-in surfaces:

- **active** — Current projects, status, blockers, deadlines
- **backlog** — Future work queue, ideas, deferred items

Create custom surfaces with `/base:surface create`.

---

## Workspace Structure

After install and scaffold:

```
your-workspace/
├── .base/
│   ├── workspace.json     # Manifest: surfaces, satellites, groom config
│   ├── STATE.md           # Workspace health and drift score
│   ├── data/
│   │   ├── active.json    # Active projects surface
│   │   ├── backlog.json   # Backlog surface
│   │   └── *.json         # Custom surfaces
│   ├── hooks/
│   │   ├── _template.py   # Hook template for custom surfaces
│   │   ├── active-hook.py
│   │   └── backlog-hook.py
│   ├── base-mcp/          # BASE MCP server
│   └── carl-mcp/          # CARL MCP server
└── .claude/
    ├── hooks/
    │   ├── base-pulse-check.py    # Drift detection (fires every session)
    │   ├── psmm-injector.py       # Per-session meta memory
    │   └── satellite-detection.py # PAUL project auto-registration
    └── settings.json              # Hook registrations
```

---

## CARL & PAUL Integration

BASE is designed to work alongside [CARL](https://github.com/ChristopherKahler/carl) (dynamic rules engine) and [PAUL](https://github.com/ChristopherKahler/paul) (project orchestration).

- **CARL** — Just-in-time rule injection based on user intent keywords
- **PAUL** — Per-project plan/apply/unify loop. Satellite projects auto-register with BASE
- **BASE** — Workspace lifecycle, surfaces, grooming

Each system is independent. Use one, some, or all.

---

## Requirements

- Node.js >= 16.7.0
- Claude Code (claude.ai/code)
- Python 3 (for hooks)

---

## License

MIT — Chris Kahler
