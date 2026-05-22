# MakerJackie Skills

这里放的是 MakerJackie 常用、可复用的 Skills。

详细介绍可见 [MakerJackie Skills](https://skills.makerjackie.com)。

## 怎么安装

每个 Skill 都按下面这个格式单独安装：

```bash
npx skills add makerjackie/skills --skill [skillname]
```

例如：

```bash
npx skills add makerjackie/skills --skill mj-design
```

如果你是个超级大懒人，想一键全局安装我的全部skill，你可以用这个命令：

```bash
npx skills add makerjackie/skills -g --yes --all
# 它会全局安装我的全部 skill，而且不需要你二次确认。
```

## Skills 列表

下面先只介绍目前常用的非 `01MVP` 系列 skill。

| Skill 名称 | 安装命令 | 说明 |
| --- | --- | --- |
| [mj-research](./skills/mj-research/README.md) | `npx skills add makerjackie/skills --skill mj-research` | 结构化网络调研与信息搜索，多渠道交叉验证，调研成果增量保存。 |
| [mj-topic-gen](./skills/mj-topic-gen/README.md) | `npx skills add makerjackie/skills --skill mj-topic-gen` | 快速生成3-4个选题方向，含标题、大纲和优劣分析。 |
| [mj-writer](./skills/mj-writer/README.md) | `npx skills add makerjackie/skills --skill mj-writer` | MakerJackie 的内容写作 skill，用于公众号文章、教程、长推和基于素材的内容整理。 |
| [mj-proofreading](./skills/mj-proofreading/README.md) | `npx skills add makerjackie/skills --skill mj-proofreading` | 三遍审校降低AI检测率，24种AI模式识别与改写，含质量评分体系。 |
| [mj-adapt](./skills/mj-adapt/README.md) | `npx skills add makerjackie/skills --skill mj-adapt` | 原 `mj-format`，把已完成的文章适配到公众号、小红书等不同发布平台。含社交媒体短内容生成和配图设计提案。 |
| [01mvp-update](./skills/01mvp-update/README.md) | `npx skills add makerjackie/skills --skill 01mvp-update` | 把 01MVP 最近更新整理成读者版 changelog、公众号 HTML、微信群、X、小红书文案和英文 update。 |
| [mj-script-polish](./skills/mj-script-polish/README.md) | `npx skills add makerjackie/skills --skill mj-script-polish` | 视频脚本口语化审校，去书面腔让脚本适合说出来。 |
| [mj-speech-coach](./skills/mj-speech-coach/README.md) | `npx skills add makerjackie/skills --skill mj-speech-coach` | 基于Patrick Winston How to Speak方法论的演讲教练，覆盖开场、结构、互动、结尾。 |
| [mj-design](./skills/mj-design/README.md) | `npx skills add makerjackie/skills --skill mj-design` | 基于 `james-design` 改造的高保真 HTML 设计 skill，用于 UI、原型、Slides、动画和视觉探索。 |
| [voice-to-article](./skills/voice-to-article/README.md) | `npx skills add makerjackie/skills --skill voice-to-article` | 将语音识别的文字转为文章，保持说话者风格，支持三种模式：直接转换、建议优化、分类整理。 |
| [cloudflare-one](./skills/cloudflare-one/README.md) | `npx skills add makerjackie/skills --skill cloudflare-one` | 用一个适合 AI 调用的 Cloudflare Token，把 Workers、Pages、R2、D1、KV、Queues、Browser Rendering、Workers AI 等基础设施串起来。 |
| [cloudflare-redirector](./skills/cloudflare-redirector/README.md) | `npx skills add makerjackie/skills --skill cloudflare-redirector` | 用 Cloudflare Workers 做批量域名重定向，支持规则编译和 DNS 同步。 |
| [quick-deploy](./skills/quick-deploy/README.md) | `npx skills add makerjackie/skills --skill quick-deploy` | 一键部署工作流，说"部署"自动完成 commit → push → 检查 → 修复 → 部署。 |
| [startup-pressure-test](./skills/startup-pressure-test/README.md) | `npx skills add makerjackie/skills --skill startup-pressure-test` | 高压测试创业想法，输出核心假设、致命风险、竞品地图、前 10 个客户动作和 2 周 MVP 方案。 |
| [notes-workflow](./skills/notes-workflow/README.md) | `npx skills add makerjackie/skills --skill notes-workflow` | 自动处理 Get笔记 语音笔记 — 增量拉取、跨笔记分析、生成执行计划、按主题并行执行。 |
| [xhs-note-batch-analysis](./skills/xhs-note-batch-analysis/README.md) | `npx skills add makerjackie/skills --skill xhs-note-batch-analysis` | 批量采集小红书主页笔记链接，导入 Get笔记，并基于 `web_content` 整理知识库。 |
| [mj-skill-creator](./skills/mj-skill-creator/README.md) | `npx skills add makerjackie/skills --skill mj-skill-creator` | 把重复工作流固化成 MakerJackie skill，并完成 README、commit、push 和全局安装。 |
