---
name: mj-video-publish-pack
description: MakerJackie 视频发布包工作流。用于用户提供本地视频、SRT 字幕、时间戳、头像、替换截图或当前公众号 HTML，并要求生成或更新 B 站标题/封面、B 站和 YouTube 章节、B 站描述、X 推广文案、微信公众号 HTML、makerjackie.com 博客 MDX、R2/assets.01mvp.com 图片链接、视频压缩建议或完整发布素材包时使用。
---

# MakerJackie Video Publish Pack

把一条本地视频整理成完整发布包：B 站标题与封面、章节、描述、X 文案、公众号 HTML、博客 MDX、R2 图片，以及必要的视频压缩建议。

## Core Rules

- 先读真实文件：视频、SRT、已有 HTML/MDX、替换图片、目标 repo 规则和 `git status --short`。
- SRT 是正文主来源。文章内容应沿用原视频时间线，尽量使用字幕原表达，只做合并分段、标点修正、明显 ASR 错误修正和少量重点强调。
- 不要把字幕改成二创观点稿。除非用户明确要求重写，正文信息和顺序应 90% 以上与字幕一致。
- 不要把字幕逐行变成一段一段的碎文本。应按 30-120 秒主题合并成自然段。
- 不要泄露内部说明。HTML、MDX、封面、标题、描述里都不能出现 prompt、TODO、工作流说明或“按字幕整理”等内部话。
- 封面必须使用 `imagegen` 生成。不要用 HTML/CSS/SVG 自己画 B 站封面，除非用户明确要求。
- 图片上传使用远端 R2，并用 `assets.01mvp.com` CDN 链接；不要把本地 `file://` 路径放进可发布 HTML/MDX。
- makerjackie.com 博客 MDX 必须写入 `content/blog/{date}-{slug}.mdx`，并确认 `content/blog/meta.json` 已收录。
- 品牌关系固定为：Maker Jackie 是作者和内容源头，01MVP 是产品/课程入口。视频发布包默认面向 AI 教程、产品实战和独立开发复盘，结尾主 CTA 指向 01MVP，但必须先交代 `01MVP 是 Maker Jackie 做的 AI 产品实战教程`，不要把两个品牌平级并列。

## Workflow

### 1. Inventory Inputs

确认视频、字幕、替换图片、头像和现有输出：

```bash
ls -lh "/path/to/video.mp4" "/path/to/video.srt"
ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "/path/to/video.mp4"
identify -format '%f %wx%h %b\n' /path/to/images/*
git -C /path/to/makerjackie.com status --short
```

如果用户给了图片编号说明，建立映射表：

- 图 1、图 2 等对应什么内容。
- 哪些替换旧截图。
- 是否有重复文件。用 `shasum -a 256` 检查疑似重复图；重复或缺失时如实说明，不要用错图冒充。

### 2. Parse SRT By Timeline

按视频顺序切段，不要随意重排。默认使用 8-10 个段落或章节：

```text
00:00 开场结论和痛点
01:01 成果与案例
02:07 plan / goal 工作流
02:58 案例起点
03:43 调研和原型
05:14 PRD 和验收标准
07:28 Harness / API / skills / MCP
11:18 启动 /goal
12:36 App 效果和人工卡点
15:37 总结、成本、CTA
```

正文写作规则：

- 保留口播顺序和核心信息。
- 把连续字幕合并成自然段，但不要删掉关键例子、数字、工具名和转折。
- 可以修正错别字和明显口误，例如补标点、统一 `Codex`、`TestFlight`、`Harness`。
- 可以加少量强调卡片，但强调内容必须来自字幕观点。
- 如果用户要求“更像文章”，仍然保留时间线，只改善段落和标题。

### 3. Prepare Images And R2 Links

优先使用用户替换过的图片；没有替换图时才从视频截图。压缩目标：

- 宽图或产品截图：宽度 1600-1800px，JPG 质量 84-88。
- 字幕/深色信息图：保持原分辨率或宽度 1080-1400px，JPG 质量 88，避免文字糊。
- 封面和 UI 线条图必要时保留 PNG。

建议输出目录：

```text
output/{date}-{slug}/article-v2-images/
```

上传远端 R2：

```bash
wrangler r2 object put \
  "01mvp-public-assets/images/makerjackie/{date}-{slug}/article-v2/{name}.jpg" \
  --file "output/{date}-{slug}/article-v2-images/{name}.jpg" \
  --content-type image/jpeg \
  --remote
```

上传后用版本化 URL 校验，避免 404 缓存：

```bash
curl --http1.1 -sS -o /dev/null -w '%{http_code}' \
  "https://assets.01mvp.com/images/makerjackie/{date}-{slug}/article-v2/{name}.jpg?v={version}"
```

如果 `wrangler` 中途 `fetch failed`，不要假设成功；按 CDN `200/404` 重传缺失对象。

### 4. Generate Covers With Imagegen

封面原则：

- 使用用户头像作为人物参考。
- 先从 SRT/视频里提取 3-5 个真正关键的传播点，再为每个传播点生成封面方向。不要套上一次视频的封面逻辑。
- 参考用户给的成功封面风格，但不要复制原图，也不要默认所有封面都做成红黑爆款风。
- B 站封面要具体、带痛点、有动作、有结果或证据：痛点 + 动作 + 结果。情绪可以有，但人物表情必须自然、可信，避免夸张皱眉、瞪眼、假装生气、硬凹姿势。
- 如果用户提供头像，只把头像作为身份参考，不要把表情改得奇怪。默认使用自然专注、轻微微笑、认真讲解、侧身指向屏幕等普通创作者状态。
- 底部元素要服务视频主题，不要出现无关 App、笔记软件、修图软件、产品画廊。
- 目标编程类封面应突出：运行时长、自动测试、自主验证、/goal、PRD、Harness、验收。
- 封面主视觉只放核心内容。R2、上传、压缩、对象存储、工具配置通常是辅助信息，只有当视频主题就是存储/部署时才放大成主视觉。
- 对短视频或展示型内容，优先突出“前后对比”“从模板到自己的版本”“让文章不再干”“形成自己的视觉语言”“几十张配图落地到网站”等字幕中出现的关键点。
- 主题色根据内容自动选择：黑白极简、白底黑线、黄黑提示、蓝白科技、低饱和品牌色都可以。不要默认红色作为主色。

优先生成：

- 4:3 横版 B 站主封面至少 3 张，且卖点或风格要明显不同。
- 3:4 竖版或公众号头图至少 1 张。
- 必要时生成 16:9 横版 1 张。
- 默认一轮至少给 5 个封面选择；如果用户不满意，要根据反馈修正 skill/提示词并再生成一轮，不要只解释。

生成前先写一个简短封面策略表：

```text
候选卖点 1：文章太干 -> 自己的小黑配图
候选卖点 2：爆火小黑 -> 做成自己的版本
候选卖点 3：一次生成几十张配图 -> 网站更生动
候选卖点 4：内容资产 -> 长期复用视觉语言
```

然后分别生成，而不是让每张封面都长得一样。

有效标题示例：

```text
别再当 AI 监工
让 AI 自己交付
一条 /goal 跑到底
别只用模板
文章终于不干了
做自己的小黑
一套图跑完整站
```

封面生成后必须视觉检查。若人物表情奇怪、底部跑成无关 App 展示、把次要工具放太大、文字太多或主题色与内容不匹配，应重新提示并再生成。目标编程类只允许 Codex 工作流、PRD、Harness、/goal、测试、验收；视觉语言/插画类只允许 GitHub 小黑、Imagegen、Skills、文章配图、网站落地、个人角色形象等相关元素。

### 5. Build B 站 / YouTube Chapters

章节总数不超过 10 个。每个章节名尽量 10 个字符以内。格式兼容 YouTube：

```text
00:00 目标编程
01:01 十天六款
02:07 Plan到Goal
02:58 一愿案例
03:43 调研原型
05:14 需求验收
07:28 Harness规范
11:18 启动Goal
12:36 App与上架
15:37 人机协作
```

用脚本或人工检查标题字符数；超过 10 个字符就压短。

### 6. Write Blog MDX

对 makerjackie.com：

- 写入 `content/blog/{date}-{slug}.mdx`。
- `date` 必须加引号。
- 图片使用 JSX `<img>`，并写 `width` / `height`，避免 Fumadocs 构建时抓远程图片尺寸。
- 更新 `content/blog/meta.json`，把 slug 放到合理位置。
- 不要在正文开头重复 H1。

MDX 结尾默认加入：

```md
> / 作者：Maker Jackie，独立开发者，01MVP 作者
> / 01MVP 是 Maker Jackie 做的 AI 产品实战教程：01mvp.com
> / 合作请联系邮箱：makerjackie@qq.com
```

### 7. Write WeChat HTML

遵循 `mj-adapt` 的公众号排版风格：

- 外层 `max-width:677px`。
- 内联样式。
- 正文 `font-size:16px; line-height:1.65`。
- 公众号正文黑白灰为主；封面不必强制黑白。
- 段落 `margin:14px 0` 左右，不要靠拉大行距填充页面。
- 图片使用 `border:3px solid #000`。
- 不要把字幕逐行输出；合并成自然段。
- 不要把文章改成完全重新创作的观点文。

HTML 结尾默认加入：

```html
<p>/ 作者：Maker Jackie，独立开发者，01MVP 作者</p>
<p>/ 01MVP 是 Maker Jackie 做的 AI 产品实战教程：01mvp.com</p>
<p>/ 合作请联系邮箱：makerjackie@qq.com</p>
```

### 8. Generate Platform Copy

给出多个选择，不只一个答案：

- B 站标题 5-8 个。
- B 站描述 2 个版本。
- X 推广文案 2-3 个版本。
- 封面候选说明：本地路径、CDN、尺寸、画面文字、推荐用途。

标题要具体、带痛点、带动作。避免空泛词：

- 好：`别再当 AI 监工：一条 /goal 让 Codex 自己跑到验收`
- 弱：`目标编程完整分享`

### 9. Video Compression Advice

如果用户问视频太大：

- 先读原视频分辨率、码率、时长、编码。
- 不要默认降到低清。若用户在意清晰度，优先保留原分辨率或 2K 级别，用 CRF/HEVC 降码率。
- 1080p 版本适合 B 站快速上传；高保真版本可保留 2K 或原始分辨率。

示例：

```bash
ffmpeg -i input.mp4 \
  -c:v libx265 -preset slow -crf 26 \
  -c:a aac -b:a 128k \
  -movflags +faststart \
  output-2k-hevc-crf26.mp4
```

### 10. Validate

至少检查：

```bash
rg -n "src=|!\\[|<img" content/blog/{slug}.mdx output/{slug}/{slug}-wechat.html
rg -n "line-height:1\\.75|按原视频字幕|TODO|prompt" output/{slug}/{slug}-wechat.html
corepack pnpm@10.28.2 types:check
corepack pnpm@10.28.2 build
git diff --check
```

验证所有 CDN 链接返回 `200`。如果 build 失败，区分是本次文件问题还是仓库已有无关文章/格式问题。

## Common Pitfalls

- 不要把文章改成自己的二创总结稿；时间线错了就是失败。
- 不要把公众号 HTML 写得像逐行字幕；需要自然段。
- 不要用 HTML 生成 B 站爆款封面；使用 `imagegen`。
- 不要因为“公众号正文黑白”就把封面也强行做黑白。
- 不要把未上传或重复的图片硬塞进正文。
- 不要使用裸 CDN 新路径做最终链接；刚上传的新对象最好带 `?v=...`。
- 不要忘记把 MDX 加进 `meta.json`。
