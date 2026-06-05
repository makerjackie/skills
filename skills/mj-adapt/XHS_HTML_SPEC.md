# Xiaohongshu HTML Workflow

`generate-xhs-slides.js` 只负责一件事：把 AI 生成的 `xhs-slides.html` 截图成 PNG。

## 职责拆分

- **AI 负责**：读 Markdown，生成 `xhs-slides.html`（长文截图模式，100% 保留原文，并控制非末页内容密度）。
- **渲染器负责**：找到 `.slide`，检查是否溢出、是否非末页过于稀疏，然后逐页截图。

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
- `.slide` **必须是固定尺寸 `1080x1350`**（4:5 竖版），不能使用 `min-height`
- 每页正文必须包在 `<div data-role="content">...</div>`，页脚或页码使用 `data-role="footer"` / `data-role="page-number"`
- 最终导出为 `2160x2700` PNG（2x）
- 如果任意 `.slide` 出现 overflow，脚本会直接报错
- 如果任意非末页内容填充率低于 72% 或底部正文空白超过 320px，脚本会直接报错

---

## 长文截图模式（唯一模式，默认强制）

**小红书统一使用长文截图模式。** 不存在"杂志风模式"选项。

### 核心规则（必须遵守）

1. **100% 保留原文**：必须逐字复制原文的全部内容，包括所有段落、列表、引用、代码块、表格。
   - ❌ 禁止：改写、润色、压缩、重组、提炼原文的任何部分。
   - ❌ 禁止：添加原文没有的过渡句、总结句、评论。
   - ❌ 禁止：将列表改成卡片网格，或将文本重新组织成杂志式版面。

2. **正文内容只使用内联样式**：正文元素使用 `style` 属性（与微信公众号 HTML 相同方式）。
   - ✅ `<style>` 块只允许放 reset、body 和 `.slide` 固定尺寸。
   - ❌ 不允许在 `<style>` 块定义正文排版样式。
   - ❌ 不允许引用 `xhs-base.css`（那是旧杂志风样式，已废弃）。

3. **字号适配小红书阅读（关键）**：小红书图片在手机上是全屏宽显示（1080px 缩放至 ~430px），字号必须比微信公众号大得多。
   - ⚠️ 不要使用微信公众号的 16px 字号，在小红书上根本看不清。
   - 正文：`font-size: 38px; line-height: 1.55;`（手机上等效 ~15px）
   - H2（章节标题）：`font-size: 52px; font-weight: 700; line-height: 1.35;`
   - H3：`font-size: 44px; font-weight: 700; line-height: 1.4;`
   - H4：`font-size: 38px; font-weight: 700; line-height: 1.45;`
   - 大标题/页眉标题：`font-size: 40px; font-weight: 900; line-height: 1.3;`
   - 标签/元信息（Monospace）：`font-size: 20px;`
   - 字体族：`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
   - 颜色：黑色 `#111111` 正文，白色 `#ffffff` 背景。
   - 禁用：封面页、总览页、大号独立标题页、卡片网格、数据看板等杂志式组件。

4. **分页方式**：
   - 第一页：从文章标题 + 正文开头开始，不使用独立封面页。
   - 中间页：优先在段落、列表项、引用块、代码块边界分页；H2 章节边界只是偏好。
   - 最后一页：结尾内容 + CTA + 作者/品牌信息。
   - 非末页内容填充率目标为 72%-92%；低于 72% 或底部正文空白超过 320px 时，必须合并下一页内容。
   - 内容过长时可以在段落间拆分，但**不得跳过任何内容**。
   - 不得通过拉大行距、段距、字号或添加装饰元素来伪造填充率。

---

## HTML 骨架（必须使用此结构）

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
    .slide { width: 1080px; height: 1350px; background: #fff; margin: 20px auto; overflow: hidden; }
  </style>
</head>
<body>
  <section class="slide" style="padding: 50px 44px 40px; display: flex; flex-direction: column;">
    <div data-role="content" style="display: block;">
      <!-- 文章内容：所有样式使用内联，字号适配小红书阅读（正文38px，H2 52px） -->
      <h2 style="font-size: 52px; font-weight: 700; line-height: 1.35; margin: 28px 0 18px; color: #000;">章节标题</h2>
      <p style="font-size: 38px; line-height: 1.55; margin: 0 0 24px; color: #111;">正文内容...</p>
    </div>
    <div data-role="page-number" style="margin-top: auto; text-align: right; font-size: 24px; font-weight: 700; color: #111;">1/8</div>
  </section>
  <section class="slide" style="padding: 50px 44px 40px;">
    <div data-role="content" style="display: block;">
      <!-- 下一页正文 -->
    </div>
  </section>
</body>
</html>
```

注意：`.slide` 的 `width: 1080px; height: 1350px; overflow: hidden;` 由全局样式控制，确保每页都是精确的 4:5 竖版尺寸。**内容样式全部使用内联**。

---

## ❌ 禁止的做法（常见错误）

| 禁止项 | 原因 |
|--------|------|
| 使用 `xhs-base.css` | 那是旧杂志风样式，会触发封面/卡片/总览等重排版 |
| 在 `<head>` 中写正文元素样式 | 正文排版必须用内联样式 |
| 添加封面页、总览页、大号标题页等独立页面 | 第一页必须直接从文章内容开始 |
| 压缩/改写/提炼原文内容 | 必须 100% 保留原文 |
| 将列表（`<ul><li>`）改为卡片网格 | 保持原文结构不变 |
| 添加原文没有的过渡句或总结 | 不做内容编辑 |
| 使用 `min-height` 代替 `height` | 必须固定 `height: 1350px`，否则输出图片不是标准的 4:5 竖版尺寸 |
| 非末页只有几段文字，下半页空白 | 必须继续合并下一页内容，直到密度合格 |
| 用页码或页脚撑满底部 | 正文必须放在 `data-role="content"`，页脚不会计入密度 |

---

## ✅ 正确的做法

- 像"截图网页长图"一样思考：每个 `.slide` 就是文章某个章节的截图。
- 原文是什么，HTML 里就写什么，一个字不改。
- 列表还是列表（`<ul><li>`），段落还是段落（`<p>`），引用还是引用（`<blockquote>`）。
- 内联样式只控制视觉呈现（字号、行高、边距），不改变内容结构。
- 非末页像正常手机阅读截图一样连续推进，不要让一页只承载一个短章节。

---

## 分页原则

- 第一页：文章标题 + 正文开头段落（直接从内容开始，不要封面页）。
- 优先在段落、列表项、引用块、代码块边界分页；H2 章节边界只是偏好。
- 非末页正文底部应到达页面高度 72% 以上，或底部正文空白不超过 320px。
- 如果一个 H2 章节太短，继续放入下一段或下一个 H2 的开头。
- 最后一页：结尾 + CTA + 作者/品牌信息。
- 内容溢出时可以拆分，但拆分后下一页必须继续原文，不得跳过。

---

## Quality Gates

渲染前 AI 需要自查：
- [ ] 原文是否被修改或压缩？→ 是则重写，保证逐字一致。
- [ ] 正文排版是否使用了内联样式而非全局 `<style>`？→ 否则重写。
- [ ] 是否有杂志式组件（封面、总览、卡片网格）？→ 是则删除。
- [ ] 单页内容是否会 overflow？→ 是则拆分。
- [ ] `.slide` 是否使用 `height: 1350px`（而不是 `min-height`）？→ 确保每页是精确的 4:5 竖版尺寸。
- [ ] 每页正文是否包在 `data-role="content"`？→ 否则补上，页脚/页码不要混入正文容器。
- [ ] 非末页是否有下半页大面积空白？→ 是则合并下一页内容重新分页。

渲染时脚本会检查：
- [ ] 是否存在 `.slide`
- [ ] 是否有 overflow
- [ ] 非末页是否 underfilled
