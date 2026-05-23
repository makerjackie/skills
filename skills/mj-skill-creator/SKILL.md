---
name: mj-skill-creator
description: Use when creating, updating, packaging, documenting, committing, pushing, or globally installing a MakerJackie skill in ~/code/makerjackie/skills, especially when the user wants to solidify a repeated workflow into a reusable skill, update the repository README skill list, add install commands and usage examples, and run npx skills add after publishing.
---

# MJ Skill Creator

Use this skill to turn a repeated MakerJackie workflow into an installable skill in `/Users/jackiexiao/code/makerjackie/skills`.

This skill wraps the system `skill-creator` process with MakerJackie repository conventions: create the skill under `skills/`, add UI metadata, write a reader-facing README, update the root catalog, commit, push, and refresh the global install.

## First Move

Clarify only if the skill's purpose, name, or trigger is genuinely unclear. Otherwise infer a conservative skill name and proceed.

Before editing:

```bash
cd /Users/jackiexiao/code/makerjackie/skills
git status --short --branch
```

Preserve existing dirty files. Do not revert unrelated work.

## Repository Contract

Create or update:

- `skills/<skill-name>/SKILL.md`
- `skills/<skill-name>/README.md`
- `skills/<skill-name>/agents/openai.yaml`
- optional `references/`, `scripts/`, or `assets/` only when they remove real repetition
- root `README.md` skill table

Skill names use lowercase letters, digits, and hyphens only. Active MakerJackie-owned skills must start with `mj-`; if an old workflow should not be globally installed, move it under `backup_skills/` and disable its `SKILL.md`/`skill.md` entrypoint.

## Creation Workflow

### 1. Use The Base Skill-Creator Rules

Use the available `skill-creator` guidance for core skill format:

- frontmatter has only `name` and `description`
- description explains when to use the skill
- `SKILL.md` stays concise and operational
- no unnecessary extra files inside the skill

If the official init script is available, initialize with:

```bash
python /Users/jackiexiao/.codex/skills/.system/skill-creator/scripts/init_skill.py <skill-name> \
  --path /Users/jackiexiao/code/makerjackie/skills/skills \
  --resources references \
  --interface display_name='<display name>' \
  --interface short_description='<25-64 char description>' \
  --interface default_prompt='Use $<skill-name> to ...'
```

If metadata generation fails, finish `SKILL.md` and `agents/openai.yaml` manually.

### 2. Write The Skill

Include only reusable procedural knowledge:

- triggers and prerequisites
- concrete workflow
- exact commands that are safe to reuse
- validation steps
- common pitfalls

Move long command snippets or examples to `references/` and link them from `SKILL.md`.

### 3. Write The Skill README

Use this structure:

1. short Chinese-first overview
2. installation command
3. usage examples
4. brief workflow or requirements
5. article-style explanation for normal readers

Always include:

```bash
npx skills add makerjackie/skills --skill <skill-name>
```

and at least one invocation example:

```text
Use $<skill-name> to ...
```

### 4. Update Root README

Add one row to the root `README.md` skill table:

```markdown
| [<skill-name>](./skills/<skill-name>/README.md) | `npx skills add makerjackie/skills --skill <skill-name>` | <short Chinese description> |
```

Keep existing table rows and user edits.

### 5. Validate

Run:

```bash
python /Users/jackiexiao/.codex/skills/.system/skill-creator/scripts/quick_validate.py skills/<skill-name>
git diff --check
```

If the skill has scripts, run at least one representative script command.

### 6. Commit, Push, Install

After validation succeeds:

```bash
git add README.md skills/<skill-name>
git commit -m "feat(skills): add <skill-name>"
git push
npx skills add makerjackie/skills --skill <skill-name> -g --yes
```

If the user asked to refresh all skills after a broader update:

```bash
npx skills add makerjackie/skills --yes -g --all
```

Inspect the installed directory under `~/.agents/skills/<skill-name>` after installation.

## Common Pitfalls

| Pitfall | Fix |
| --- | --- |
| Creating a skill but not updating README | Add the root README table row before commit. |
| Installing before push | Push first when installing from `makerjackie/skills`. |
| README only says what the skill is | Include install command and usage examples. |
| Skill accumulates process diary | Keep process notes out; include only reusable instructions. |
| Existing dirty files are present | Preserve them and stage deliberately. |
