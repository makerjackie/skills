---
name: mj-video2md-html
description: 将本地视频、SRT 字幕和时间戳转成 MakerJackie 博客 MDX 与微信公众号 HTML。用于用户提供视频/SRT 后要求生成公众号图文、博客文章、视频截图、R2 图片链接或调用 mj-adapt 做平台适配的工作流。
---

# MakerJackie Video To MDX + HTML (mj-video2md-html)

把一条本地视频变成一篇可发布文章：读 SRT，保留口播风格写成 MDX，从视频截图，压缩并上传图片到 R2，再调用 `mj-adapt` 生成微信公众号 HTML。

## 触发场景

用户提供本地视频、SRT、时间戳或当前公众号 HTML，并要求：
- 根据视频和字幕生成公众号图文。
- 生成博客 MDX，发布到 `makerjackie.com`。
- 从视频截图并插入文章。
- 压缩图片、上传到 R2，使用 `assets.01mvp.com` 链接。
- 最后使用 `mj-adapt` 生成微信公众号 HTML。

## 默认原则

- **先读真实文件**：检查视频、SRT、已有输出、博客内容目录和 repo 规则后再写。
- **保留 Jackie 口播风格**：保持“我自己试下来”“这里有个点”“你会发现”这类口语感，只修明显 ASR 错误、重复口癖和断句。
- **文章要能独立阅读**：不是逐字稿，也不是过度改写；把口播整理成清晰结构，同时保留真实表达。
- **不要泄露内部说明**：任何 UI、HTML、正文、frontmatter 里都不能出现工作流说明、AI 提示词、内部 TODO。
- **图片优先来自视频截图**：有头像没关系。截图要服务内容，不用追求完全干净。
- **公众号敏感词**：公众号 HTML 中不要直接写敏感平台名，涉及 GPT 时优先写 `GPT`。
- **脏工作区谨慎处理**：先看 `git status --short`，只改本任务相关文件，不回滚用户已有改动。

## Workflow

### Step 1: 盘点输入和仓库约定

1. 确认视频、SRT、时间戳路径存在：
   ```bash
   ls -lh "/path/to/video.mp4" "/path/to/subtitle.srt"
   ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "/path/to/video.mp4"
   ```
2. 在目标仓库检查内容结构：
   ```bash
   git status --short
   rg --files content | sed -n '1,120p'
   ```
3. 对 `makerjackie.com` 默认优先写入：
   - `content/blog/{date}-{slug}.mdx`
   - `content/blog/meta.json`
   - `output/{date}-{slug}/`
4. Fumadocs frontmatter 的 `date` 必须加引号：
   ```yaml
   date: "2026-06-09"
   ```

### Step 2: 解析 SRT，形成文章骨架

1. 读取 SRT，按 30-90 秒分段整理主题。
2. 标出关键信息出现的时间点，后续用于截图。
3. 修正明显 ASR 错误，但不要把口播改成教科书腔。
4. 文章结构建议：
   - 开头：这条视频真正想解决什么问题。
   - 中段：按视频里的关键动作、观点或案例推进。
   - 结尾：给读者一个明确行动或下一步。

### Step 2.5: 选择品牌 CTA

视频转文章默认遵守这条关系：Maker Jackie 是作者和内容源头，01MVP 是产品/课程入口；标准关系句是 `01MVP 是 Maker Jackie 做的 AI 产品实战教程。`

- AI 教程、产品实战、独立开发复盘、工具教程：主推 01MVP，轻带 Maker Jackie。结尾指向 `01mvp.com`。
- 个人成长、创作者思考、生活记录：主推 Maker Jackie，轻带 01MVP。结尾指向关注、星标、评论、个人主页或继续阅读。
- 不要在同一篇文章结尾平均推广 `makerjackie.com` 和 `01mvp.com`。只保留一个主要动作。

### Step 3: 从视频截图

默认截图要比“平均分布”更偏向信息密集段：

- 第一张截图如果卡在片头、眨眼、转场或画面未稳定，默认往后挪 1 秒重截。
- 前 70-80 秒通常承载选题、结论、页面演示和关键设定，默认抓 4-5 张候选图。
- 后续章节按主题变化抓图，每个关键章节至少 1 张候选。
- 每张截图都要看一眼；模糊、字幕遮挡重点、表情明显不合适，就换附近时间点。

常用命令：

```bash
mkdir -p "output/{date}-{slug}/screenshots/raw"

ffmpeg -y -ss 00:00:12.000 -i "/path/to/video.mp4" \
  -frames:v 1 -vf "scale=1600:-1" -q:v 2 \
  "output/{date}-{slug}/screenshots/raw/shot-001-00-00-12.jpg"
```

截图命名建议：

```text
shot-001-00-00-12.jpg
shot-002-00-00-28.jpg
shot-003-00-00-45.jpg
```

### Step 4: 写博客 MDX

1. 选定日期和 slug，例如 `2026-06-09-ai-permanent-personal-site`。
2. 写入 `content/blog/{date}-{slug}.mdx`。
3. 更新 `content/blog/meta.json`，把新文章放在合理位置。
4. 图片先可用本地路径占位，R2 上传后再替换：
   ```mdx
   ![搭建个人网站的关键步骤](https://assets.01mvp.com/images/makerjackie/{date}-{slug}/shot-001.jpg)
   ```
5. 不要在正文开头重复 H1，遵守项目现有文档风格。

### Step 5: 压缩图片并上传 R2

图片进入正文前优先压缩，目标是公众号和博客都能快速打开。

建议规格：
- 正文截图宽度：1200-1600px。
- 格式：JPG，质量 78-86。
- 封面或 UI 线条图：必要时用 PNG，避免文字糊。

常用压缩命令：

```bash
mkdir -p "output/{date}-{slug}/r2-upload"

sips -Z 1600 "output/{date}-{slug}/screenshots/raw/shot-001-00-00-12.jpg" \
  --out "output/{date}-{slug}/r2-upload/shot-001.jpg"
```

R2 路径约定：

```text
images/makerjackie/{date}-{slug}/shot-001.jpg
images/makerjackie/{date}-{slug}/cover.png
```

上传命令示例：

```bash
wrangler r2 object put "01mvp-public-assets/images/makerjackie/{date}-{slug}/shot-001.jpg" \
  --file "output/{date}-{slug}/r2-upload/shot-001.jpg" \
  --content-type "image/jpeg"
```

上传后验证：

```bash
curl -I "https://assets.01mvp.com/images/makerjackie/{date}-{slug}/shot-001.jpg"
```

验证返回 `200` 后，把 MDX 和 HTML 里的本地图片路径替换为 `https://assets.01mvp.com/...`。

### Step 6: 生成微信公众号 HTML

调用或遵循 `mj-adapt`：

1. 使用已完成的 MDX 作为输入。
2. 默认生成 5 个标题候选、3 个封面方向和 3 张公众号首图候选。
3. 生成 `output/{date}-{slug}/{date}-{slug}-wechat.html`。
4. HTML 顶部放 primary 封面图，不在正文开头重复标题框。
5. 正文保留原文，不为了适配公众号删段落。
6. 图片优先使用 R2 URL，避免本地 file 路径进入可发布 HTML。
7. CTA 和页脚遵循 Step 2.5 的品牌选择规则。

### Step 7: 本地预览和验收

必要检查：

```bash
pnpm types:check
pnpm lint
git diff --check
```

图片链接检查：

```bash
rg -n "src=|!\\[" "content/blog/{date}-{slug}.mdx" "output/{date}-{slug}/{date}-{slug}-wechat.html"
rg -n "\\{\\{[A-Z_]+\\}\\}" "output/{date}-{slug}/{date}-{slug}-wechat.html"
curl -I "https://assets.01mvp.com/images/makerjackie/{date}-{slug}/shot-001.jpg"
```

如果用户正在看本地 HTML，直接更新当前 `output/...-wechat.html`，让 in-app browser 刷新即可。改截图时优先只替换图片文件和引用，不重写正文。

## 输出清单

完成后应向用户说明：
- 博客 MDX 路径。
- 微信公众号 HTML 路径。
- 截图数量和 R2 目录。
- 是否刷新了 `mj-adapt` 生成的标题/封面候选。
- 已跑的验证命令；没跑成功的要明确说明原因。

## 常见修正

- **第一张截图不好**：往后一秒重截，再替换引用。
- **前 80 秒信息多**：补 4-5 张图，不要只截一张开场。
- **公众号图片打不开**：先 `curl -I` R2 URL，确认域名和 key 路径。
- **文章太像逐字稿**：保留语气，但按问题、行动、结果重新组织小节。
- **文章太像 AI 稿**：删掉空泛总结，换回视频中的具体动作、界面和个人判断。
