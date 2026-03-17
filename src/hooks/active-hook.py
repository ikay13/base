#!/usr/bin/env python3
"""
BASE Hook: active-hook.py
Surface: active (Active work items, projects, and tasks)
Source: .base/data/active.json
Output: <active-awareness> compact summary grouped by priority
"""

import sys
import json
from pathlib import Path
from datetime import date

SURFACE_NAME = "active"

HOOK_DIR = Path(__file__).resolve().parent
WORKSPACE_ROOT = HOOK_DIR.parent.parent
DATA_FILE = WORKSPACE_ROOT / ".base" / "data" / f"{SURFACE_NAME}.json"

BEHAVIOR_DIRECTIVE = f"""BEHAVIOR: This context is PASSIVE AWARENESS ONLY.
Do NOT proactively mention these items unless:
  - User explicitly asks (e.g., "what should I work on?", "what's next?")
  - A deadline is within 24 hours AND user hasn't acknowledged it this session
For details on any item, use base_get_item("{SURFACE_NAME}", id)."""

PRIORITY_ORDER = ["urgent", "high", "medium", "ongoing", "deferred"]

# Staleness thresholds (days since last update)
STALE_THRESHOLDS = {
    "urgent": 3,
    "high": 5,
    "medium": 7,
    "ongoing": 14,
    "deferred": 30,
}


def days_since_update(item):
    """Calculate days since last update. Uses 'updated' if present, else 'added'."""
    ts = item.get("updated") or item.get("added")
    if not ts:
        return None
    try:
        d = date.fromisoformat(ts[:10])
        return (date.today() - d).days
    except (ValueError, TypeError):
        return None


def main():
    try:
        input_data = json.loads(sys.stdin.read())
    except (json.JSONDecodeError, OSError):
        pass

    if not DATA_FILE.exists():
        sys.exit(0)

    try:
        data = json.loads(DATA_FILE.read_text())
    except (json.JSONDecodeError, OSError):
        sys.exit(0)

    items = data.get("items", [])
    if not items:
        sys.exit(0)

    # Group by priority
    groups = {}
    for item in items:
        p = item.get("priority", "medium")
        groups.setdefault(p, []).append(item)

    lines = []
    for priority in PRIORITY_ORDER:
        group = groups.get(priority, [])
        if not group:
            continue
        lines.append(f"[{priority.upper()}]")
        for item in group:
            item_id = item.get("id", "?")
            title = item.get("title", "untitled")
            status = item.get("status", "")
            parts = [f"- [{item_id}] {title}"]
            if status:
                parts[0] += f" ({status})"
            blocked = item.get("blocked")
            if blocked:
                parts.append(f"  BLOCKED: {blocked}")
            deadline = item.get("deadline")
            if deadline:
                parts.append(f"  DUE: {deadline}")
            days = days_since_update(item)
            threshold = STALE_THRESHOLDS.get(priority, 7)
            if days is not None:
                if days >= threshold:
                    parts.append(f"  STALE: {days}d since update (threshold: {threshold}d)")
                else:
                    parts.append(f"  updated: {days}d ago")
            lines.append("\n".join(parts))

    if lines:
        count = len(items)
        summary = "\n".join(lines)
        print(f"""<{SURFACE_NAME}-awareness items="{count}">
{summary}

{BEHAVIOR_DIRECTIVE}
</{SURFACE_NAME}-awareness>""")

    sys.exit(0)


if __name__ == "__main__":
    main()
