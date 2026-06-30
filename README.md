# MakerJackie Skills

这里放的是 MakerJackie 常用、可复用的 skills。当前默认全局安装的自有 skill 都以 `mj-` 开头，方便和系统、插件、第三方 skill 区分。

详细介绍可见 [MakerJackie Skills](https://skills.makerjackie.com)。

## 安装

单独安装某个 skill：

```bash
npx skills add makerjackie/skills --skill [skillname]
```

例如：

```bash
npx skills add makerjackie/skills --skill mj-writer
```

一键安装当前 active skill：

```bash
npx skills add makerjackie/skills -g --yes --all
```

`--all` 只应该安装 `skills/` 目录里的 active skill。已停用或合并的旧 skill 放在 `backup_skills/`，不会作为默认全局 skill 维护。

## Active Skills

| Skill 名称 | 安装命令 | 说明 |
| --- | --- | --- |
| [mj-writer](./skills/mj-writer/README.md) | `npx skills add makerjackie/skills --skill mj-writer` | MakerJackie 内容创作总入口，合并选题、写作调研、语音转文章、文章审校、视频脚本和演讲稿优化。 |
| [mj-adapt](./skills/mj-adapt/README.md) | `npx skills add makerjackie/skills --skill mj-adapt` | 把已完成文章适配到公众号、小红书、X 等平台，生成排版和发布素材。 |
| [mj-video2md-html](./skills/mj-video2md-html/README.md) | `npx skills add makerjackie/skills --skill mj-video2md-html` | 把本地视频和 SRT 转成博客 MDX、视频截图、R2 图片链接和微信公众号 HTML。 |
| [mj-video-publish-pack](./skills/mj-video-publish-pack/README.md) | `npx skills add makerjackie/skills --skill mj-video-publish-pack` | 把本地视频和 SRT 做成 B 站标题封面、章节、公众号 HTML、博客 MDX 和 R2 图片发布包。 |
| [mj-01mvp-art](./skills/mj-01mvp-art/README.md) | `npx skills add makerjackie/skills --skill mj-01mvp-art` | 生成 01MVP 黑白硬核正文配图、概念隐喻和粗线条 01MVP operator 风格样张。 |
| [mj-cf-dns](./skills/mj-cf-dns/README.md) | `npx skills add makerjackie/skills --skill mj-cf-dns` | 管理 Cloudflare DNS、Pages 自定义域名和 Workers 自定义域名绑定。 |
| [mj-deploy](./skills/mj-deploy/README.md) | `npx skills add makerjackie/skills --skill mj-deploy` | 一键部署工作流，说“部署”后自动完成 commit、push、检查、修复和部署。 |
| [mj-claude-code-review-loop](./skills/mj-claude-code-review-loop/README.md) | `npx skills add makerjackie/skills --skill mj-claude-code-review-loop` | 调用 Claude Code CLI 做三轮系统性代码审查，由 Codex 判断、修复、验证并提交。 |
| [mj-notes-workflow](./skills/mj-notes-workflow/README.md) | `npx skills add makerjackie/skills --skill mj-notes-workflow` | 自动处理 Get笔记语音笔记，增量拉取、跨笔记分析、生成执行计划并按主题执行。 |
| [mj-xhs-note-batch-analysis](./skills/mj-xhs-note-batch-analysis/README.md) | `npx skills add makerjackie/skills --skill mj-xhs-note-batch-analysis` | 批量采集小红书主页笔记链接，导入 Get笔记，并基于 `web_content` 整理知识库。 |
| [mj-startup-test](./skills/mj-startup-test/README.md) | `npx skills add makerjackie/skills --skill mj-startup-test` | 高压测试创业想法，输出核心假设、致命风险、竞品地图、前 10 个客户动作和 2 周 MVP 方案。 |
| [mj-markdown-formatter](./skills/mj-markdown-formatter/README.md) | `npx skills add makerjackie/skills --skill mj-markdown-formatter` | 优化 Markdown 文章排版、修复格式与基础错误，并尽量保持原文语气。 |
