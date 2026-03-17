<purpose>
Structured weekly maintenance cycle. Walk through each workspace area, review with operator, enforce backlog time-based rules, graduate ready items, and log the groom.
</purpose>

<user-story>
As an AI builder, I want a guided workspace maintenance session, so that my context documents stay current, my backlog items graduate when ready, and my workspace doesn't drift.
</user-story>

<when-to-use>
- Weekly (on configured groom day)
- When pulse reports overdue grooming
- When user says "base groom", "let's groom", "workspace maintenance"
- Entry point routes here via /base:groom
</when-to-use>

<steps>

<step name="assess_scope" priority="first">
Determine what needs grooming.

1. Read `.base/workspace.json` manifest
2. Read `.base/STATE.md` for last groom dates per area
3. Identify which areas are due for grooming (past their cadence)
4. Sort by staleness (most overdue first)
5. Present: "Groom session starting. {N} areas due for review: {list}. Estimated time: {N*5} minutes."

**Wait for operator confirmation before proceeding.**
</step>

<step name="groom_active">
Review ACTIVE.md — the working memory for projects and tasks.

1. Read `.base/ACTIVE.md`
2. Present summary: "{N} projects, {N} tasks, last updated {date}"
3. For each project: "Still active? Status changed? Next action current?"
4. For each task in TASKS section: "Done? Still in progress? Blocked?"
5. Close completed tasks (move to DONE/CLOSED with outcome + date)
6. Ask: "Anything new to add?"
7. Update timestamp

Voice-friendly: walk through one entry at a time, wait for response.
</step>

<step name="groom_backlog">
Review BACKLOG.md — enforce time-based rules AND handle graduation.

**Time-based enforcement:**
1. For each item, check Added date against review-by threshold:
   - High priority: 7 days
   - Medium priority: 14 days
   - Low priority: 30 days
2. Items past review-by → surface: "These items need a decision: {list}"
3. Items past staleness (2x review-by) → "Auto-archiving: {list} (past {N} days without action)"
4. Process operator decisions on each flagged item

**Graduation check:**
5. For each remaining item, ask: "Ready to work on any of these?"
6. If yes — determine destination:
   - **As a TASK:** Item is bounded, standalone work. Move to ACTIVE.md → TASKS section.
     Format: `### {Task Name}` with Status, Next, Blocked, Notes fields.
   - **As a PROJECT:** Item is complex enough to warrant its own project entry.
     Move to ACTIVE.md under appropriate priority section with full project format.
   - **Stay in backlog:** Not ready yet. Keep with updated review-by date.
7. For graduated items: remove from BACKLOG.md, add to ACTIVE.md in correct section
8. Update BACKLOG.md timestamp

**The graduation question is explicit every groom.** Items don't graduate silently — the operator decides.
</step>

<step name="groom_directories">
Review directory-type areas (projects/, clients/, tools/).

For each directory area due for grooming:
1. List contents
2. Flag anything that looks orphaned or new since last groom
3. Ask: "Anything to archive, delete, or reclassify?"
4. Execute approved changes
</step>

<step name="groom_system">
Review system layer areas (hooks, commands, skills, CARL).

1. Quick scan for obvious dead items
2. Only flag if something clearly wrong
3. Ask: "Any system changes to note?"
4. If CARL hygiene is enabled (workspace.json `carl_hygiene.proactive: true`):
   - Check `.carl/staging/` for pending proposals
   - Check rule timestamps for staleness
   - Surface: "{N} staged proposals, {N} stale rules — run /base:carl-hygiene?"
</step>

<step name="log_groom">
Record the groom session.

1. Update `.base/STATE.md` with new timestamps for all groomed areas
2. Reset drift score
3. Write groom summary to `.base/grooming/{YYYY}-W{NN}.md`:
   ```markdown
   # Groom Summary — Week {NN}, {YYYY}

   **Date:** {YYYY-MM-DD}
   **Areas Reviewed:** {list}
   **Drift Score:** {before} → 0

   ## Changes
   - {what changed}

   ## Graduated from Backlog
   - {item} → ACTIVE.md TASKS / PROJECT

   ## Archived / Killed
   - {item} (reason)

   ## Next Groom Due
   {YYYY-MM-DD}
   ```
4. Report: "Groom complete. Drift score: 0. Next groom due: {date}."
</step>

</steps>

<output>
Updated workspace state. All due areas reviewed and current. Backlog time-based rules enforced. Ready items graduated. Groom summary logged.
</output>

<acceptance-criteria>
- [ ] All overdue areas reviewed with operator
- [ ] ACTIVE.md and BACKLOG.md timestamps updated
- [ ] Backlog time-based rules enforced (review-by, staleness)
- [ ] Graduation question asked explicitly for backlog items
- [ ] Graduated items properly moved to ACTIVE.md (TASKS or PROJECT)
- [ ] STATE.md updated with new groom date
- [ ] Groom summary written to grooming/ directory
- [ ] Drift score reset to 0
- [ ] Operator confirmed completion of each area
</acceptance-criteria>
