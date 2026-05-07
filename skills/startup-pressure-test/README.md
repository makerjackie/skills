# startup-pressure-test

一个用来给创业想法做高压测试的 skill。

它会从早期创业视角检查一个 idea，帮你快速看清核心假设、致命风险、真实竞品、前 10 个客户怎么找，以及 2 周内应该做什么最小 MVP 测试。

## 安装

```bash
npx skills add makerjackie/skills --skill startup-pressure-test
```

## 快速使用

安装后，对 Codex 说：

```text
Use $startup-pressure-test to pressure-test this startup idea:

我想做一个工具，帮独立开发者把本地产品演示视频自动剪成短视频，并自动生成字幕。
```

如果你的工具支持 slash skill，也可以这样调用：

```text
/startup-pressure-test to pressure-test this startup idea:

我想做一个工具，帮独立开发者把本地产品演示视频自动剪成短视频，并自动生成字幕。
```

你也可以直接指定模式：

```text
Use $startup-pressure-test to validate whether this startup idea solves a real problem:

...
```

## 支持的模式

- `pressure-test`，找核心假设、致命问题，并给出 strong / weak / pivot required 判断
- `problem-validation`，验证问题是不是真痛、谁最痛、应该问哪些用户问题
- `competition-map`，整理直接竞品、间接竞品、用户当前做法和切换成本
- `first-10-customers`，设计手动找到前 10 个客户的行动方案
- `mvp-plan`，定义 2 周内能验证关键假设的最小 MVP
- `full`，默认模式，做一份紧凑的全量诊断

## 输出内容

默认输出会比较短，适合快速判断一个 idea 是否值得继续投入：

- Verdict
- Scorecard
- Core Assumption
- Fatal Flaws
- Problem Reality
- Competition
- First 10 Customers
- MVP

## 来源与改造说明

本 skill 改造自开源项目 [opcop/codex-startup-pressure-test-skill](https://github.com/opcop/codex-startup-pressure-test-skill)。

上游仓库版本：

- Commit: `f5ab5213189de1fdf7f159fab94b255454c11a82`
- License: MIT
- 原作者信息见本目录的 [LICENSE](./LICENSE)

本仓库做了这些调整：

- 转换为 `makerjackie/skills` 仓库可安装格式
- 安装方式改为 `npx skills add makerjackie/skills --skill startup-pressure-test`
- 去掉上游 npm installer，只保留 skill 本体、playbook 和许可证
- README 改为中英文双语，默认中文在前

## 安全审查

已审查上游仓库内容。结论如下：

- `SKILL.md` 和 `references/playbooks.md` 是纯 Markdown 指令，不会自动执行命令
- 原仓库的 `scripts/install.js` 会写入本机 `~/.codex/skills` / `~/.claude/skills`，并会覆盖同名 `startup-pressure-test` 目录；这是安装器的正常行为，但本次转换没有引入这个脚本
- 未发现读取环境变量中的 API Key、上传文件、联网请求、执行 shell、删除任意目录等高风险逻辑
- 使用时仍需注意，它会给出商业判断建议，但不会替你验证真实市场数据；涉及最新竞品、价格、市场规模时应该联网核实

---

# startup-pressure-test

A skill for pressure-testing startup ideas before spending too much time building the wrong thing.

It evaluates an idea through an early-stage startup lens: core assumption, fatal flaws, real competition, first customer moves, and a 2-week MVP test.

## Installation

```bash
npx skills add makerjackie/skills --skill startup-pressure-test
```

## Quick Start

After installation, ask Codex:

```text
Use $startup-pressure-test to pressure-test this startup idea:

A tool that turns local product demo videos into short clips with local captions for indie hackers.
```

If your tool supports slash skills, you can also invoke it like this:

```text
/startup-pressure-test to pressure-test this startup idea:

A tool that turns local product demo videos into short clips with local captions for indie hackers.
```

You can also request a specific mode:

```text
Use $startup-pressure-test to build a 2-week MVP plan for this startup idea:

...
```

## Modes

- `pressure-test`: core assumption, fatal flaws, and a strong / weak / pivot required verdict
- `problem-validation`: pain, early adopters, customer discovery questions, and validation criteria
- `competition-map`: direct competitors, indirect competitors, current behavior, and switching cost
- `first-10-customers`: a manual plan to find and convert the first 10 customers
- `mvp-plan`: the smallest 2-week MVP test for the riskiest assumption
- `full`: the default compact all-in-one diagnosis

## Output

The default output is compact:

- Verdict
- Scorecard
- Core Assumption
- Fatal Flaws
- Problem Reality
- Competition
- First 10 Customers
- MVP

## Source And Changes

This skill is adapted from [opcop/codex-startup-pressure-test-skill](https://github.com/opcop/codex-startup-pressure-test-skill).

Upstream version:

- Commit: `f5ab5213189de1fdf7f159fab94b255454c11a82`
- License: MIT
- Original author information is preserved in [LICENSE](./LICENSE)

Changes in this repository:

- Converted to the `makerjackie/skills` install format
- Installation command changed to `npx skills add makerjackie/skills --skill startup-pressure-test`
- Removed the upstream npm installer from this package
- Rewrote the README as bilingual documentation, with Chinese first

## Safety Review

The upstream repository has been reviewed:

- `SKILL.md` and `references/playbooks.md` are Markdown-only instructions and do not execute commands
- The original `scripts/install.js` writes to `~/.codex/skills` / `~/.claude/skills` and overwrites the same `startup-pressure-test` target directory; that is expected installer behavior, but this converted skill does not include that script
- No high-risk logic was found for reading API keys, uploading files, making network requests, executing shell commands, or deleting arbitrary directories
- The skill can give business judgment, but it does not verify live market facts by itself; current competitors, pricing, and market-size claims should still be checked with up-to-date sources
