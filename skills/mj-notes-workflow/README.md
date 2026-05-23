# mj-notes-workflow

Process unprocessed Get笔记 voice notes automatically — fetch, analyze, plan, and execute.

## Installation

```bash
npx skills add makerjackie/skills --skill mj-notes-workflow
```

Then invoke with:

```
/mj-notes-workflow
```

## How it works

1. **Fetch** — pulls new notes since last checkpoint (first run: last 3 days)
2. **Analyze** — reads your voice notes (audio type) in full, only scans titles for external references (link type); splits into parallel agents if content exceeds ~30k chars
3. **Plan** — cross-note extraction: tasks, diary, knowledge, references; merges related content across notes
4. **Confirm** — shows execution plan; waits for your approval before any action
5. **Execute** — parallel agents by theme group (diary → update Get笔记, docs → write to 01MVP, tasks → call relevant skills)
6. **Report** — saves progress state + summary note to Get笔记

## Requirements

- `getnote` CLI installed and authenticated
- `~/.agents/mj-notes-workflow/` for state storage

## State

Progress is tracked at `~/.agents/mj-notes-workflow/state.json` so each run only processes new notes.

---

# 语音笔记自动处理：让 AI 帮你整理那些「说过的话」

## 你有没有这样的困扰？

每天对着手机录一堆语音笔记——灵感、待办、日记、聊天记录，什么都有。但录完之后呢？

它们就躺在那裡，越来越多。

你想整理，但面对几十条混杂的语音笔记，光是看完就要半小时，更别说分类、执行了。

## 这个 Skill 帮你做什么

它像一个**语音笔记管家**，你只需要说 `/mj-notes-workflow`，它就会：

1. **自动拉取**你没处理过的新笔记
2. **跨笔记分析**——不管一条笔记里混了多少种内容，它都能拆清楚
3. **生成执行计划**给你确认——不会自作主张
4. **按主题分组并行执行**——日记润色回 Get笔记、教程写成文档、待办直接执行

## 核心设计

**智能读取策略**：你自己的语音录音（audio 类型）会全文阅读；外部收藏的文章（link 类型）只看标题就够，不浪费 token。

**动态分拆**：内容少就一个 Agent 搞定，内容多就自动拆分并行处理，不矫情。

**记住进度**：每次处理到哪里都存着，下次只处理新的。

## 适用场景

- 每天或隔几天集中处理一次语音笔记
- 语音里记录了待办事项想自动执行
- 日记感想想被整理和反馈
- 收藏的文章/视频想自动归档
