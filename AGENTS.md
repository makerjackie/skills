# Repository Guidelines

## Project Structure & Module Organization
This repository hosts reusable skills, with each skill self-contained under `skills/<skill-name>/`.

- Root: [`README.md`](README.md) lists install commands and the skill catalog.
- skills/ : skill directory, each skill is a subdirectory.

use `skills-creator` skill to create the new skill.
after add a new skill, update the root README table.

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
