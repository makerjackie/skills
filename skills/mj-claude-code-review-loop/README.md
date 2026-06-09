# mj-claude-code-review-loop

## Part 1: GitHub README

Coordinate Claude Code as an external reviewer while Codex keeps control of validation, edits, tests, and commits.

### Installation

```bash
npx skills add makerjackie/skills --skill mj-claude-code-review-loop
```

### Usage

```text
Use $mj-claude-code-review-loop to run a 3-round Claude Code review, validate findings, apply fixes, and commit the accepted improvements.
```

See [`references/copyable-prompt.md`](references/copyable-prompt.md) for a full prompt you can paste into Codex in any target repository.

### What It Does

This skill turns Claude Code CLI into a structured review source:

- Round 1 scans the repository broadly.
- Codex validates findings and applies accepted fixes.
- Round 2 reviews the Codex diff and triage decisions.
- Codex fixes any verified follow-up issues.
- Round 3 checks the final diff and remaining risk.
- Codex verifies and commits only the intended changes.

Claude Code is instructed to output reports only. Codex remains responsible for code changes and commits.

Default non-interactive invocation:

```bash
claude --dangerously-skip-permissions --print "<prompt>"
```

`claude -p "<prompt>"` is the short one-shot form. Plain `claude` starts an interactive session.

## Part 2: Article-Style Content

代码仓库越长越大，最容易堆出几类问题：旧逻辑没删干净、相似代码到处复制、命名和数据结构前后不一致、性能隐患没人专门看、架构边界慢慢变糊。

这个 skill 的目标是把 Claude Code CLI 当成一个外部审查团队来用。它会通过 `claude --dangerously-skip-permissions --print` 这种非交互命令进行三轮系统性扫描，每一轮都产出报告；Codex 负责逐条核实，筛掉误报，只改确实值得改的部分，再运行检查并提交。

适合这些场景：

- 发版前想做一次仓库体检。
- 接手一个项目，想快速找出明显债务。
- 功能做完后，希望另一个模型从架构、性能、重复代码和 bug 风险上补一遍审查。
- 想让 Claude Code 多 agent 扫描，但不希望它直接改仓库。

推荐用法很简单：在目标仓库里把 `references/copyable-prompt.md` 的 prompt 发给 Codex。Codex 会调用这个 skill，组织 Claude Code 审查、判断报告、修代码、跑检查，并在有有效改动时提交。
