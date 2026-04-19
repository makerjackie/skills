---
name: "01mvp-content-repurposer"
description: "基于 Dan Koe 体系的内容裂变引擎。将母内容 (Guide) 转化为推文、小红书、视频脚本等分发素材，并自动调用 Short Creator 生成短教程。"
---

# 01MVP 内容裂变引擎 (Content Repurposing Engine)

此技能是 01MVP 内容系统的**分发终端**（对应 Dan Koe 体系的 Skill 4）。
它的核心理念是：**"不是多写，而是把写过的用到极致"**。
它负责将一篇深度“母内容 (Mother Content)”裂变为多种分发格式，并归档到 `output/` 目录。

## 核心能力

1.  **多维裂变**: 基于同一篇 Guide，生成推文 (Tweets)、小红书笔记 (Posts)、视频脚本 (Scripts)。
2.  **联动生成**: 自动调用（或模拟）`01mvp-short-creator` 的能力，生成/更新 `docs/mvp/` 下的 Cheatsheet。
3.  **分发归档**: 将生成的社交媒体素材结构化地保存在 `output/<date>-<topic>/` 目录下。

## 适用场景

-   `docs/guide/` 下的母内容已经写好，准备发推、发视频。
-   需要将一个观点“一鱼多吃”，分发到 Twitter, LinkedIn, 小红书。
-   用户指令：“帮我把这篇 Guide 裂变一下”。

## 执行流程 (Execution Flow)

### 1. 初始化与读取
-   **读取母内容**: 获取用户指定的 `docs/guide/xxx.md`。
-   **创建输出目录**: 在 `output/` 下创建以“日期-主题”命名的文件夹 (e.g., `output/20240124-content-machine/`)。

### 2. 核心裂变 (Repurposing)

执行以下 4 个子任务：

#### 任务 A: 生成短教程 (Short Tutorial) -> `docs/mvp/`
> *这是为了确保“文档库”的完整性。*
-   **动作**: 依据 `01mvp-short-creator` 的逻辑（痛点 Hook + 极简 Action + 情绪 High）。
-   **输出**: 更新或创建 `docs/mvp/xxx-cheatsheet.md`。
-   **内容**: 极其精简的步骤，指向母内容的链接。

#### 任务 B: 社交媒体短文 (Social Shorts) -> `output/.../tweets.md`
> *适合 Twitter, 即刻, LinkedIn。*
-   **生成 5-10 条短内容**:
    -   每条只讲一个点。
    -   格式：`Hook (痛点)` -> `Insight (翻转)` -> `Action (建议)`。
    -   字数：100-200 字。

#### 任务 C: 平台图文 (Platform Posts) -> `output/.../xiaohongshu.md`
> *适合小红书, 公众号。*
-   **生成 3 篇笔记结构**:
    -   **标题**: 5 个爆款标题备选 (包含 Emoji, 情绪词)。
    -   **正文**: 
        -   开头：场景代入 ("你是不是也...")。
        -   中间：干货罗列 (1, 2, 3...)。
        -   结尾：互动提问 ("评论区告诉我...")。
    -   **视觉建议**: 描述封面图应该长什么样。

#### 任务 D: 视频脚本 (Video Script) -> `output/.../script.md`
> *适合 TikTok, B站, 视频号。*
-   **结构**:
    -   **0-3s**: 视觉/听觉钩子 (打断滑屏)。
    -   **3-15s**: 痛点阐述。
    -   **15-50s**: 核心干货展示。
    -   **End**: CTA ("关注我，领...")。

### 3. 输出反馈
-   告知用户 `output/` 目录下的新文件。
-   确认 `docs/mvp/` 下的短教程已生成。
-   鼓励用户直接复制粘贴发布。

## 风格规范 (Voice & Tone)
-   **Twitter/即刻**: 犀利、短促、金句感。
-   **小红书**: 亲切、生活化、Emoji 丰富。
-   **视频**: 口语化，短句为主，避免书面语。
-   **核心原则**: **Don't be boring.**

## 示例 Prompt (Internal)
*(用于生成 Tweets)*:
"Extract 10 contrarian ideas from this guide. Format them as tweets. Start with a hook that challenges common wisdom."
