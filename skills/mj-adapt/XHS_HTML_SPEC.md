# Xiaohongshu HTML Workflow

`generate-xhs-slides.js` 现在只负责一件事：把 AI 生成的 `xhs-slides.html` 截图成 PNG。

正确职责拆分：
- AI 负责读 Markdown，决定该做几页、每页如何布局、哪里需要分页（保留原文，不压缩文案）。
- 渲染器只负责找到 `.slide`，检查是否溢出，然后逐页截图。

## Final Workflow

1. 读原始 Markdown 文章
2. AI 直接生成 `xhs-slides.html`
3. HTML 内包含多页：

```html
<section class="slide">...</section>
<section class="slide">...</section>
<section class="slide">...</section>
```

4. 运行：

```bash
node generate-xhs-slides.js path/to/xhs-slides.html path/to/output-dir
```

## Rendering Contract

- 每一页必须是一个 `.slide`
- `.slide` 必须是固定画布，推荐 `1080x1350`
- 最终导出为 `2160x2700` PNG（2x）
- 如果任意 `.slide` 出现 overflow，脚本会直接报错

## 长文截图模式（默认）

默认小红书使用**长文截图模式**：保留原文完整内容和微信排版风格，按 H2 章节分页截图。

关键规则：
- 保留原文 100% 内容，不压缩文案、不重组内容。
- 使用内联样式（与微信公众号 HTML 相同方式），**不使用** `xhs-base.css`（那是杂志风幻灯片样式，默认禁用）。
- 排版风格与微信公众号保持一致（16px 正文、1.65 行高、H2 20px/H3 17px/H4 15px）。
- 不做杂志式重排版（无封面页、总览、卡片网格、大号独立标题页）。

## Recommended HTML Skeleton

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>XHS Slides</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { background: #f5f5f5; display: flex; flex-direction: column; align-items: center; padding: 20px; }
      .slide { width: 1080px; min-height: 1350px; background: #fff; margin: 20px auto; overflow: hidden; padding: 40px; }
    </style>
  </head>
  <body>
    <section class="slide">
      <!-- 文章内容：使用内联样式，与微信排版风格一致 -->
    </section>
    <section class="slide">
      <!-- 下一页 -->
    </section>
  </body>
</html>
```

注意：每个 `.slide` 内部使用内联样式（inline styles），与微信公众号 HTML 规范保持一致。

## 分页原则

- 第一页：从文章标题 + 正文开头开始，不使用独立封面页。
- 中间页：按 H2 章节分页，一个 H2 及其内容为一页。
- 最后一页：结尾内容 + CTA + 作者/品牌信息。
- 内容过长时拆分：如果一个 H2 章节内容超过一页，可以在段落间拆分。

## Quality Gates

渲染前 AI 需要自己检查：
- 单页内容是否过多（超出 1080x1350 会 overflow，脚本会报错）
- 是否需要拆页
- 原文是否被修改或压缩

渲染时脚本会再检查：
- 是否存在 `.slide`
- 是否有 overflow

