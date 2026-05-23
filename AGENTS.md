# Repository Guidelines

## Project Structure & Module Organization
This repository hosts makerjackie's reusable skills, with each skill self-contained under `skills/<skill-name>/`.

- Root: [`README.md`](README.md) lists install commands and the skill catalog.
- skills/ : active skill directory, each skill is a subdirectory.
- backup_skills/ : deprecated, merged, or local-only skill archive. Skill entrypoints here should be disabled by renaming `SKILL.md` or `skill.md` to `.bak`.

Do not rely on a standalone MakerJackie skill-creator skill in this repo. Use the rules in this `AGENTS.md` file when creating, updating, packaging, documenting, committing, pushing, or globally installing MakerJackie skills.

Before editing:

```bash
cd /Users/jackiexiao/code/makerjackie/skills
git status --short --branch
```

Preserve existing dirty files. Do not revert unrelated work.

All active MakerJackie-owned skills under `skills/` must use the `mj-` prefix. Put deprecated or merged skills under `backup_skills/` instead of leaving them installable.

Active skills should be broadly useful enough for global install. Project-specific skills belong in the target repo's `.agents/skills/` folder, not in this global repo.

When creating a new skill, create or update:

- `skills/<skill-name>/SKILL.md`
- `skills/<skill-name>/README.md`
- `skills/<skill-name>/agents/openai.yaml` when interface metadata is needed
- optional `references/`, `scripts/`, or `assets/` only when they remove real repetition
- root `README.md` skill table

Skill names use lowercase letters, digits, and hyphens only.

Use the official skill format rules:

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

Write each skill with only reusable procedural knowledge:

- triggers and prerequisites
- concrete workflow
- exact commands that are safe to reuse
- validation steps
- common pitfalls

Move long command snippets or examples to `references/` and link them from `SKILL.md`.

Validate changed active skills with:

```bash
python /Users/jackiexiao/.codex/skills/.system/skill-creator/scripts/quick_validate.py skills/<skill-name>
git diff --check
```

If the skill has scripts, run at least one representative script command.

## Creating Beginner-Friendly Skills

When creating skills for beginners, include these sections:

### Prerequisites (前提条件)
- List all required accounts, services, and tools
- Explain where to get credentials (API keys, tokens, IDs)
- Include step-by-step instructions for obtaining credentials
- Specify minimum versions for dependencies

### Quick Workflow / Getting Started
- Provide numbered steps for first-time users
- Use "Step 1, Step 2..." format for clarity
- Include example commands with placeholders
- Show expected output or results
- Add validation steps at the end

### Common Pitfalls
- Document common errors and solutions
- Explain what to do if something goes wrong

## README Format for Skills

Each skill's README.md should contain two parts:

### Part 1: GitHub README (Traditional Format)
- Brief, technical overview
- Installation command
- Quick configuration steps
- Link to detailed documentation (skill.md)

### Part 2: Article-Style Content (公众号推文风格)
- Start with pain points (痛点) - what problems does this solve?
- Present the solution and benefits
- Use natural, engaging language
- Include real-world examples
- Make it relatable and attractive to readers

## Commit & Pull Request Guidelines
Use Conventional Commit prefixes as seen in history (`feat:`, `docs:`).

## 我说帮我更新一下的时候指的是：
按顺序执行下面的步骤：

- git commit 和 push 
- npx skills add makerjackie/skills --yes -g --all

这样可以保证我的 skill 同步到全局中
