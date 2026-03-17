#!/usr/bin/env python3
"""
Hook: base-pulse-check.py
Purpose: BASE workspace health check on session start.
         Reads .base/STATE.md and workspace.json, calculates drift,
         injects warning if grooming is overdue.
Triggers: UserPromptSubmit (session context)
Output: Workspace health status or groom reminder
"""

import sys
import json
from datetime import datetime
from pathlib import Path

# Workspace root — find .base/ relative to this hook's location
HOOK_DIR = Path(__file__).resolve().parent
WORKSPACE_ROOT = HOOK_DIR.parent.parent  # .claude/hooks/ -> .claude/ -> workspace
BASE_DIR = WORKSPACE_ROOT / ".base"
STATE_FILE = BASE_DIR / "STATE.md"
MANIFEST_FILE = BASE_DIR / "workspace.json"


class WorkspaceState:
    """Parsed state from STATE.md."""
    def __init__(self):
        self.last_groom: datetime | None = None
        self.next_groom_due: datetime | None = None
        self.drift_score: int | None = None


def parse_state_md(content: str) -> WorkspaceState:
    """Extract key dates and drift info from STATE.md."""
    state = WorkspaceState()

    for line in content.split("\n"):
        if line.startswith("**Last Groom:**"):
            date_str = line.replace("**Last Groom:**", "").strip()
            try:
                state.last_groom = datetime.strptime(date_str, "%Y-%m-%d")
            except ValueError:
                pass
        elif line.startswith("**Next Groom Due:**"):
            date_str = line.replace("**Next Groom Due:**", "").strip()
            try:
                state.next_groom_due = datetime.strptime(date_str, "%Y-%m-%d")
            except ValueError:
                pass
        elif line.startswith("**Drift Score:**"):
            score_str = line.replace("**Drift Score:**", "").strip().split()[0]
            try:
                state.drift_score = int(score_str)
            except ValueError:
                pass

    return state


def check_file_staleness(workspace_root, manifest):
    """Check tracked files/directories for staleness based on manifest."""
    stale_areas = []
    now = datetime.now()

    areas = manifest.get("areas", {})
    for area_name, area_config in areas.items():
        groom_cadence = area_config.get("groom", "weekly")
        paths = area_config.get("paths", [])

        # Convert cadence to days
        cadence_days = {"weekly": 7, "bi-weekly": 14, "monthly": 30}.get(groom_cadence, 7)

        for p in paths:
            full_path = workspace_root / p
            if full_path.exists():
                if full_path.is_file():
                    mtime = datetime.fromtimestamp(full_path.stat().st_mtime)
                elif full_path.is_dir():
                    # Use most recent file modification in directory
                    try:
                        mtimes = [
                            f.stat().st_mtime
                            for f in full_path.iterdir()
                            if f.is_file() and not f.name.startswith(".")
                        ]
                        mtime = datetime.fromtimestamp(max(mtimes)) if mtimes else datetime.fromtimestamp(full_path.stat().st_mtime)
                    except (OSError, ValueError):
                        mtime = datetime.fromtimestamp(full_path.stat().st_mtime)
                else:
                    continue

                age_days = (now - mtime).days
                if age_days > cadence_days:
                    stale_areas.append({
                        "area": area_name,
                        "path": p,
                        "age_days": age_days,
                        "threshold": cadence_days,
                        "overdue_by": age_days - cadence_days,
                    })

    return stale_areas


def main():
    # Skip if BASE is not installed
    if not BASE_DIR.exists() or not MANIFEST_FILE.exists():
        # BASE not installed — silent exit
        sys.exit(0)

    try:
        with open(MANIFEST_FILE, "r") as f:
            manifest = json.load(f)
    except (json.JSONDecodeError, OSError):
        sys.exit(0)

    # Read STATE.md if it exists
    state = WorkspaceState()
    if STATE_FILE.exists():
        try:
            with open(STATE_FILE, "r") as f:
                state = parse_state_md(f.read())
        except OSError:
            pass

    now = datetime.now()
    groom_cadence = manifest.get("groom_cadence", "weekly")
    cadence_days = {"weekly": 7, "bi-weekly": 14, "monthly": 30}.get(groom_cadence, 7)

    # Check if groom is overdue
    groom_overdue = False
    days_since_groom = None
    if state.last_groom:
        days_since_groom = (now - state.last_groom).days
        groom_overdue = days_since_groom > cadence_days

    # Check file staleness
    stale_areas = check_file_staleness(WORKSPACE_ROOT, manifest)

    # Calculate drift score
    drift_score = sum(area["overdue_by"] for area in stale_areas if area["overdue_by"] > 0)

    # Check CARL hygiene (optional proactive reminder)
    carl_hygiene_reminder = None
    carl_hygiene_config = manifest.get("carl_hygiene", {})
    if carl_hygiene_config.get("proactive", False):
        hygiene_cadence = {"weekly": 7, "bi-weekly": 14, "monthly": 30}.get(
            carl_hygiene_config.get("cadence", "monthly"), 30
        )
        last_hygiene = carl_hygiene_config.get("last_run")
        if last_hygiene:
            try:
                last_hygiene_date = datetime.strptime(last_hygiene, "%Y-%m-%d")
                days_since_hygiene = (now - last_hygiene_date).days
                if days_since_hygiene > hygiene_cadence:
                    carl_hygiene_reminder = f"CARL hygiene overdue ({days_since_hygiene}d since last run). Run /base:carl-hygiene"
            except ValueError:
                carl_hygiene_reminder = "CARL hygiene: last_run date invalid. Run /base:carl-hygiene"
        else:
            carl_hygiene_reminder = "CARL hygiene never run. Run /base:carl-hygiene when ready"

        # Also check for staged proposals
        staging_file = BASE_DIR / "staging.json"
        if staging_file.exists():
            try:
                staging_data = json.loads(staging_file.read_text())
                pending = [p for p in staging_data.get("proposals", []) if p.get("status") == "pending"]
                if pending:
                    carl_hygiene_reminder = (carl_hygiene_reminder or "") + f" | {len(pending)} staged proposals pending"
            except (json.JSONDecodeError, OSError):
                pass

    # Build output
    output_parts = []

    if groom_overdue and days_since_groom is not None and state.last_groom is not None:
        output_parts.append(
            f"BASE: Workspace groom overdue by {days_since_groom - cadence_days} days "
            f"(last groom: {state.last_groom.strftime('%Y-%m-%d')}). "
            f"Run /base:groom to maintain workspace health."
        )

    if stale_areas:
        stale_names = [a["area"] for a in stale_areas]
        output_parts.append(
            f"BASE drift score: {drift_score} | Stale areas: {', '.join(stale_names)}"
        )
    elif not groom_overdue and state.last_groom is not None:
        # Everything is fine — minimal output
        output_parts.append(
            f"BASE: Drift 0 | Last groom: {state.last_groom.strftime('%Y-%m-%d')} | All areas current"
        )

    if carl_hygiene_reminder:
        output_parts.append(carl_hygiene_reminder)

    if output_parts:
        print(f"""<base-pulse>
{chr(10).join(output_parts)}
</base-pulse>""")
    # Silent if no state yet

    sys.exit(0)


if __name__ == "__main__":
    main()
