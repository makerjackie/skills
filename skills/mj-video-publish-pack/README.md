# MakerJackie Video Publish Pack

把本地视频、SRT、截图和头像整理成完整发布包：B 站标题封面、章节、描述、X 文案、公众号 HTML、博客 MDX 和 R2 图片链接。

## Installation

```bash
npx skills add makerjackie/skills --skill mj-video-publish-pack
```

## Quick Start

```text
Use $mj-video-publish-pack to turn this local video and SRT into a B站/公众号/博客发布包。
视频：/path/to/video.mp4
字幕：/path/to/video.srt
头像：/path/to/me.jpg
输出到 makerjackie.com，并上传图片到 assets.01mvp.com。
```

## Output

- B 站标题候选、B 站描述、X 推广文案
- imagegen 生成的 B 站横版封面、竖版/公众号头图
- B 站 / YouTube 章节，最多 10 个，每个标题尽量 10 字以内
- `content/blog/{date}-{slug}.mdx`
- `content/blog/meta.json` 收录
- `output/{date}-{slug}/{date}-{slug}-wechat.html`
- 压缩后上传到 R2 的图片 CDN 链接

## Documentation

详细流程见 [SKILL.md](SKILL.md)。

---

# 为什么需要这个 skill

视频发布不是简单“转成文章”。真正麻烦的是同时做好几件事：

- 字幕要整理成可读文章，但不能乱改时间线。
- 公众号要排版舒服，但不能变成逐行字幕。
- B 站封面要有点击欲，必须具体、带情绪、有动作。
- 图片要压缩上传到 R2，链接还要能稳定打开。
- 博客 MDX 要进入 makerjackie.com 的内容系统。
- 章节要符合 B 站和 YouTube 的限制。

这个 skill 把这次跑通的经验固定下来：以 SRT 为主线、用 imagegen 做封面、用 R2 做图片托管、用 `mj-adapt` 的黑白公众号排版、最后用 build 验证博客。

## 适合的任务

- 视频转公众号图文
- 视频转博客 MDX
- B 站标题封面和简介生成
- YouTube/B 站章节整理
- 视频截图替换、压缩、上传 R2
- 从一次视频内容生成完整发布素材包

---

**作者**：Maker Jackie

**01MVP**：Maker Jackie 做的 AI 产品实战教程，[01mvp.com](https://01mvp.com)
