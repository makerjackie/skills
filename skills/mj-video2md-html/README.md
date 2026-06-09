# MakerJackie Video To MDX + HTML (mj-video2md-html)

把本地视频和 SRT 字幕转成 MakerJackie 博客 MDX、视频截图、R2 图片链接和微信公众号 HTML。

## Installation

```bash
npx skills add makerjackie/skills --skill mj-video2md-html
```

## Quick Start

```text
帮我根据这个视频和 SRT 生成一篇博客 MDX，再用 mj-adapt 生成公众号图文，截图上传到 R2。
```

输入通常包括：
- 视频文件：`.mp4`
- 字幕文件：`.srt`
- 可选时间戳或用户指定截图反馈

## Output

- `content/blog/{date}-{slug}.mdx` - 博客文章
- `content/blog/meta.json` - 博客导航索引更新
- `output/{date}-{slug}/screenshots/` - 视频截图
- `output/{date}-{slug}/r2-upload/` - 压缩后的待上传图片
- `https://assets.01mvp.com/images/makerjackie/{date}-{slug}/...` - R2 公网图片
- `output/{date}-{slug}/{date}-{slug}-wechat.html` - 微信公众号 HTML
- `output/{date}-{slug}/{date}-{slug}-title-cover-options.md` - 标题与封面候选

## Workflow

1. 读取视频、SRT 和仓库内容规则。
2. 按字幕整理文章结构，保留 Jackie 口播风格。
3. 从视频截图，前 70-80 秒默认多抓 4-5 张候选，第一张不好就往后一秒。
4. 写入博客 MDX，并更新 `meta.json`。
5. 压缩图片并上传到 R2，替换为 `assets.01mvp.com` 链接。
6. 调用 `mj-adapt` 生成公众号 HTML、标题候选和封面候选。
7. 跑 `pnpm types:check`、`pnpm lint`、`git diff --check`。

详细规则见 [SKILL.md](SKILL.md)。
