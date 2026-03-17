---
name: base:groom
description: Weekly workspace maintenance cycle
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash, AskUserQuestion]
---

<objective>
Structured weekly maintenance — review each workspace area, update statuses, archive stale items, reduce drift.

**When to use:** Weekly maintenance, "groom my workspace", "run grooming".
</objective>

<execution_context>
@.claude/skills/base/tasks/groom.md
@.claude/skills/base/context/base-principles.md
@.claude/skills/base/frameworks/audit-strategies.md
</execution_context>

<context>
$ARGUMENTS

@.base/workspace.json
@.base/STATE.md
</context>

<process>
Follow task: @.claude/skills/base/tasks/groom.md
</process>

<success_criteria>
- [ ] All workspace areas reviewed
- [ ] Stale items addressed
- [ ] STATE.md updated with groom results
- [ ] Drift score recalculated
</success_criteria>
