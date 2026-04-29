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
| [mj-writer](./skills/mj-writer/README.md) | `npx skills add makerjackie/skills --skill mj-writer` | MakerJackie 的内容写作 skill，用于公众号文章、教程、长推和基于素材的内容整理。 |
| [mj-adapt](./skills/mj-adapt/README.md) | `npx skills add makerjackie/skills --skill mj-adapt` | 原 `mj-format`，把一篇已完成的文章适配到公众号、小红书等不同发布平台。 |
| [mj-design](./skills/mj-design/README.md) | `npx skills add makerjackie/skills --skill mj-design` | 基于 `james-design` 改造的高保真 HTML 设计 skill，用于 UI、原型、Slides、动画和视觉探索。 |
| [voice-to-article](./skills/voice-to-article/README.md) | `npx skills add makerjackie/skills --skill voice-to-article` | 将语音识别的文字转为文章，保持说话者风格，支持三种模式：直接转换、建议优化、分类整理。 |
| [cloudflare-one](./skills/cloudflare-one/README.md) | `npx skills add makerjackie/skills --skill cloudflare-one` | 用一个适合 AI 调用的 Cloudflare Token，把 Workers、Pages、R2、D1、KV、Queues、Browser Rendering、Workers AI 等基础设施串起来。 |
| [cloudflare-redirector](./skills/cloudflare-redirector/README.md) | `npx skills add makerjackie/skills --skill cloudflare-redirector` | 用 Cloudflare Workers 做批量域名重定向，支持规则编译和 DNS 同步。 |
