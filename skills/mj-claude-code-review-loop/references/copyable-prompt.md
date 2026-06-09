# Copyable Prompt

Use this prompt in a repository where you want Codex to coordinate a Claude Code review loop.

```text
Use $mj-claude-code-review-loop in this repository.

Goal:
Call Claude Code CLI for a systematic codebase audit, then have Codex validate the report, apply the worthwhile fixes, verify them, and commit the accepted changes.

Claude Code command:
Use the standard Claude Code CLI if available:

```bash
claude --dangerously-skip-permissions --print "<prompt>"
```

`claude` by itself starts an interactive session, so use `--print` or `-p` for the one-shot report command. If this machine uses a local alias, shell function, wrapper, or full command string for Claude Code, ask me for it or use it only if I already provided it in this prompt.

Claude Code task:
Invoke Claude Code with a report-only prompt. Ask it to use multiple sub agents if available and systematically scan the code portions of this repository for:

- obvious bugs or correctness risks
- dead, leftover, unreachable, or unused code
- duplicated or redundant logic
- inconsistent frontend/backend behavior, naming, data shape, or error handling
- code that conflicts with framework or language best practices
- strange implementation choices that are likely to become maintenance problems
- performance issues
- fragile tests or missing tests around risky behavior
- security or data handling issues
- architecture problems, misplaced responsibilities, or avoidable coupling

Loop requirements:

1. Run at least 3 rounds.
2. Round 1: broad repository audit from Claude Code.
3. Codex reads the report, checks every finding against the actual code, rejects false positives, implements only high-confidence improvements, and runs the relevant checks.
4. Round 2: Claude Code reviews the Codex diff, triage decisions, and verification output.
5. Codex validates Round 2 findings, fixes accepted issues, and reruns checks.
6. Round 3: Claude Code performs a final audit of the final diff, remaining risks, and verification logs.
7. Codex applies only final high-confidence fixes, reruns checks, and commits the intended code changes.

Safety rules:

- Claude Code should produce reports only. It must not edit files, commit, push, delete files, or rewrite the repository.
- Codex owns all code changes and all commits.
- Preserve unrelated dirty files. Do not commit changes that existed before this workflow started.
- Store Claude reports outside the repo unless there is a clear reason to keep them.
- Use `--dangerously-skip-permissions` by default only for trusted local repositories. If the repo is untrusted or permission bypass is not acceptable, stop and ask for the preferred permission mode.
- If no Claude Code command is available, stop and report the issue.

Final output:

- summarize the accepted fixes
- list rejected or deferred Claude findings that matter
- show which checks passed or could not be run
- include the commit hash if a commit was created
- include the local path to the Claude Code reports
```
