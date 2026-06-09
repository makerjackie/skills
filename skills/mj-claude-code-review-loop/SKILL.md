---
name: mj-claude-code-review-loop
description: Use when the user asks Codex to coordinate Claude Code CLI for systematic repository audits, multi-agent code review, multi-round cleanup loops, bug/performance/architecture scans, or "Claude Code reviews, Codex judges, fixes, verifies, and commits".
---

# Claude Code Review Loop

## Overview

Use this skill to run Claude Code as an external reviewer while Codex remains the owner of judgment, edits, verification, and commits. Default loop: 3 rounds of Claude review -> Codex triage -> Codex fixes -> verification -> commit.

## Hard Rules

- Use this only when the user explicitly asks to involve Claude Code, a Claude Code CLI command, or this skill.
- Treat Claude Code as a reviewer, not the authority. Validate every finding against the repo before changing code.
- Ask Claude Code to produce reports only. Do not ask it to edit files, commit, push, delete, or rewrite the repo.
- Before starting, record `git status --short --branch`. Preserve unrelated dirty files and never commit them.
- Store Claude reports outside the repo by default, for example under `/tmp/claude-code-review-<repo>-<timestamp>/`.
- If the Claude Code command unexpectedly changes files, stop, inspect the diff, and report it. Do not discard user or tool changes blindly.
- Run at least 3 review rounds unless the user requests fewer, the repo has no code, or the CLI is unavailable.
- Stop after round 3 unless there is a concrete verified blocker. Do not create an open-ended agent loop.

## Prerequisites

- Claude Code CLI is installed and authenticated.
- A Claude Code command is available. Prefer the standard `claude` binary when present.
- `claude` starts an interactive session by default. For this skill, use non-interactive print mode: `claude --dangerously-skip-permissions --print "<prompt>"`.
- `-p` is equivalent to `--print`.
- Use `--dangerously-skip-permissions` by default for this autonomous review loop, but only in trusted local repositories. If the repo is untrusted or the user forbids bypass mode, stop and ask for the preferred permission mode.
- If the user provides a local alias, shell function, wrapper, or full command string, use that exact command only for this run.
- In non-interactive shells, aliases may not load. Verify user-provided aliases with an interactive shell such as `zsh -ic 'type <command>'`.

If no Claude Code command is available, report that clearly and either stop or ask the user whether to proceed with a normal Codex-only review.

## Workflow

### Step 1: Baseline

Run:

```bash
git status --short --branch
git rev-parse --show-toplevel
rg --files | sed -n '1,200p'
```

Detect project checks from `package.json`, lockfiles, config files, test folders, CI config, and framework files. Keep a list of files that were dirty before this skill started.

Create a report directory:

```bash
REPO_NAME="$(basename "$(git rev-parse --show-toplevel)")"
REPORT_DIR="/tmp/claude-code-review-${REPO_NAME}-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$REPORT_DIR"
```

Discover the Claude Code command:

```bash
if command -v claude >/dev/null 2>&1; then
  CLAUDE_CODE_COMMAND="claude --dangerously-skip-permissions"
else
  echo "Claude Code CLI not found. If the user has a local alias or wrapper, ask for the exact command."
fi
```

### Step 2: Round 1 Broad Audit

Write a Claude prompt to `$REPORT_DIR/round-1-prompt.md`. Use `references/copyable-prompt.md` as the base prompt and add repo-specific context such as stack, package manager, known user goal, and current dirty files.

Run Claude Code in report-only mode. Use non-interactive print mode:

```bash
claude --dangerously-skip-permissions --print "$(cat "$REPORT_DIR/round-1-prompt.md")" \
  | tee "$REPORT_DIR/round-1-report.md"
```

The short equivalent is:

```bash
claude --dangerously-skip-permissions -p "$(cat "$REPORT_DIR/round-1-prompt.md")" \
  | tee "$REPORT_DIR/round-1-report.md"
```

If the installed CLI does not support `--print` or `-p`, adapt to the local Claude Code syntax, but still capture the output into `round-1-report.md`. If the user supplied a custom command, substitute it for `claude --dangerously-skip-permissions` without assuming that command exists globally.

### Step 3: Codex Triage

Read the report and classify findings:

- `accept`: verified issue, scoped fix, clear benefit.
- `reject`: false positive, style-only churn, conflicts with repo conventions, or too broad.
- `defer`: plausible but needs product input, large refactor, or risky migration.

Implement only accepted fixes. Prefer small, related batches. Do not reformat or refactor unrelated code.

### Step 4: Verify

Run the strongest available checks, usually in this order:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Adapt to the repo's package manager and scripts. If a check cannot run, record the exact reason for the final report.

### Step 5: Round 2 Diff Review

Ask Claude Code to review only:

- Round 1 accepted/rejected/deferred triage.
- Current `git diff`.
- Verification output.

Prompt goal: find mistaken fixes, missed high-confidence issues, regressions, and overreach. Save output as `round-2-report.md`.

After the report, Codex validates each finding, applies only accepted fixes, and reruns relevant checks.

### Step 6: Round 3 Final Audit

Ask Claude Code for a final pass over:

- Current full repo context.
- Final diff.
- Remaining deferred items.
- Verification logs.

Prompt goal: identify release-blocking bugs or obvious cleanup left by the loop. Save output as `round-3-report.md`.

Codex applies only high-confidence final fixes, reruns checks, and prepares the commit.

### Step 7: Commit

Before committing:

```bash
git status --short
git diff --stat
git diff --check
```

Stage only files intentionally changed by this loop. Use a Conventional Commit message, usually:

```bash
git commit -m "refactor: address claude code review findings"
```

If the changes are mostly bug fixes, use `fix:`. If no code changes survived triage, do not create an empty commit.

## Final Response

Report:

- Commit hash, if created.
- What changed.
- Which checks passed or failed.
- Claude report directory.
- Any rejected or deferred findings that matter.

Keep the final summary short. Do not paste entire Claude reports unless the user asks.

## Reference

- `references/copyable-prompt.md`: prompt the user can paste into Codex to run this whole workflow in another repo.
