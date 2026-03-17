# Workspace Manifest Template

Output file: `.base/workspace.json`

```template
{
  "workspace": "{workspace-name}",
  "created": "{YYYY-MM-DD}",
  "groom_cadence": "{weekly|bi-weekly|monthly}",
  "groom_day": "{day-of-week}",
  "areas": {
    "{area-name}": {
      "type": "{working-memory|directory|config-cross-ref|system-layer|custom}",
      "description": "[Human-readable purpose of this area]",
      "paths": ["{file-or-directory-paths}"],
      "groom": "{weekly|bi-weekly|monthly}",
      "audit": {
        "strategy": "{staleness|classify|cross-reference|dead-code|pipeline-status}",
        "config": {}
      }
    }
  },
  "satellites": {
    "{project-name}": {
      "path": "{relative-path-to-project}",
      "engine": "{paul|custom|none}",
      "state": "{path-to-state-file}",
      "registered": "{YYYY-MM-DD}"
    }
  }
}
```

## Field Documentation

| Field | Type | Description |
|-------|------|------------|
| workspace | string | Name of this workspace (typically the directory name) |
| created | date | When BASE was initialized in this workspace |
| groom_cadence | enum | Default grooming frequency for the workspace |
| groom_day | string | Preferred day for weekly grooming |
| areas | object | Map of tracked workspace areas |
| areas.*.type | enum | Classification of the area for audit strategy selection |
| areas.*.paths | array | Files or directories this area tracks |
| areas.*.groom | enum | Grooming frequency for this specific area (overrides default) |
| areas.*.audit.strategy | enum | Which audit strategy to apply (see audit-strategies.md) |
| areas.*.audit.config | object | Strategy-specific configuration |
| satellites | object | External projects tracked by BASE but managed by their own engines |
| satellites.*.engine | enum | What orchestration tool manages this project |
| satellites.*.state | string | Path to the project's state file for health checks |
