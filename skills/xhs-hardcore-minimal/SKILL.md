---
name: "xhs-hardcore-minimal-old"
description: "历史版本，忽略"
---

# 小红书硬核极简 HTML + PNG 生成器

将文章压缩成小红书图文页，先输出可渲染的 HTML，再调用脚本批量导出 PNG。

## 内容忠实原则（必须执行）
- 只使用原文出现的信息，不补充未经原文支持的判断。
- 工具推荐类内容必须保留原文推荐顺序与倾向（如“强力推荐/不推荐”）。
- 不写“夸张承诺”“空泛鸡汤”“未经验证数据”。
- 如果原文是评测/对比，优先复用原文里的：工具名、评分、费用、优缺点。
- 拿不准时宁可少写，不要脑补。

## 默认约束
- 使用小红书竖版卡片画布（3:4）：`1080x1440`。
- 默认主风格：`hardcore-minimal`。
- 默认成本模式：只生成 1 套完整主风格 + 2 套风格预览（每套仅封面和 1 页内容）。
- 用户明确要求多风格全量导出时，再生成多套完整图文。

## 输出目录约定
将结果放在：`output/xhs/<date>-<topic>/`

- `content-plan.md`：分页内容提纲（每页一句结论 + 2-4 句正文）
- `pages.json`：用于脚本生成 HTML 的结构化分页数据
- `hardcore-minimal/page-01.html ...`：默认完整 HTML
- `style-preview/<style>/page-01.html`、`page-02.html`：候选风格预览 HTML
- `png/hardcore-minimal/page-01.png ...`：默认风格 PNG
- `png/style-preview/<style>/page-01.png ...`：候选风格预览 PNG

## 执行流程（严格按顺序）
1. 提炼文章主结论（1 句）。
2. 抽取 3-6 个高价值信息点（步骤、对比、数据、结果）。
3. 按长度决定页数：
   - `<=1200` 字：`4` 页
   - `1201-3000` 字：`6` 页
   - `>3000` 字：`8` 页
4. 为每页生成文案：每页仅 1 个核心信息点，句长优先 `<=22` 字。
5. 先写 `pages.json`，再调用脚本生成 HTML 页面文件。
6. 运行脚本导出 PNG。
7. 回报路径与可选风格，让用户决定是否全量导出候选风格。

## 首页规则（软件推荐场景强制）
- 首页第一屏必须出现明确结论：`我推荐：<工具名>` 或 `首选：<工具名>`。
- 首页必须同时给一个钩子：告诉读者后续页有什么（如“完整对比/不推荐原因/避坑点”）。
- 推荐依据只写原文已有事实（如评分、费用、本地/联网、稳定性描述）。
- 首页不要写抽象口号，直接给“推荐对象 + 为什么 + 后续看点”。

## 文案规则（硬核极简）
- 每页第一句必须是结论句。
- 删除铺垫、口号、重复表达。
- 多用数字、动作词、结果词。
- 吸睛但不夸张，不承诺不可验证结果。
- 全套总字数默认控制在 `350-900` 字。
- 语气默认“信息播报”，而不是“情绪煽动”。

## 图标素材（可选）
- 仅在高置信度匹配时添加图标（工具官方 Logo 或通用品牌图标）。
- 若图标来源或准确性不确定，直接跳过图标，保持纯文本版式。
- 不因为找图标而阻塞主流程。

## 风格预设
默认主风格：`hardcore-minimal`

可选候选风格（默认只做预览）：
- `mono-grid`：黑白网格、杂志感、结构清晰
- `neo-brutal`：高对比纯色块、粗线条、强视觉冲击
- `dark-tech`：深色背景+荧光强调、科技感数据卡片

具体样式 token 见 `references/style-presets.md`。

## HTML 生成脚本
先生成 `pages.json`（每页一个对象），再调用：

```bash
node .agents/skills/xhs-hardcore-minimal/scripts/generate-xhs-html.mjs \
  --input output/xhs/2026-02-16-topic/pages.json \
  --output output/xhs/2026-02-16-topic/hardcore-minimal \
  --theme hardcore-minimal
```

候选风格预览只需要 `pages.json` 的前两页：

```bash
node .agents/skills/xhs-hardcore-minimal/scripts/generate-xhs-html.mjs \
  --input output/xhs/2026-02-16-topic/pages-preview.json \
  --output output/xhs/2026-02-16-topic/style-preview/neo-brutal \
  --theme neo-brutal
```

`pages.json` 结构：

```json
{
  "theme": "hardcore-minimal",
  "pages": [
    {
      "kicker": "第1页/6页",
      "title": "标题",
      "points": ["点1", "点2", "点3"],
      "footer": "收藏后照着做",
      "badge": "高密度速读"
    }
  ]
}
```

页面模板可参考：`assets/base-page.template.html`。

## HTML 结构要求
每个页面遵循同一骨架：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Page 01</title>
  <style>
    /* Inline CSS only, no external network assets */
  </style>
</head>
<body>
  <main id="canvas">
    <header class="kicker">...</header>
    <section class="title">...</section>
    <section class="content">...</section>
    <footer class="footer">...</footer>
  </main>
</body>
</html>
```

强制要求：
- `#canvas` 固定 `width: 1080px; height: 1440px;`（3:4）
- 内容区保留安全边距（建议 `56-72px`）
- 使用系统字体优先：`"SF Pro Display", "PingFang SC", "Helvetica Neue", Arial, sans-serif`
- 不使用在线字体、在线图片

## PNG 导出脚本
使用：`scripts/render-html-to-png.mjs`

示例（默认风格）：
```bash
node .agents/skills/xhs-hardcore-minimal/scripts/render-html-to-png.mjs \
  --input output/xhs/2026-02-16-topic/hardcore-minimal \
  --output output/xhs/2026-02-16-topic/png/hardcore-minimal
```

示例（候选风格预览）：
```bash
node .agents/skills/xhs-hardcore-minimal/scripts/render-html-to-png.mjs \
  --input output/xhs/2026-02-16-topic/style-preview/neo-brutal \
  --output output/xhs/2026-02-16-topic/png/style-preview/neo-brutal
```

若缺少 Playwright：
```bash
pnpm dlx playwright install chromium
```

## 输出给用户时必须包含
- 本次生成的页数与风格说明（主风格 + 预览风格）
- HTML 目录和 PNG 目录
- 1 句建议：是否继续把候选风格全量导出
- 若本次未加图标，明确说明“为避免误配，已跳过图标”。
