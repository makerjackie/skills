# Xiaohongshu HTML Workflow

`generate-xhs-slides.js` 现在只负责一件事：把 AI 生成的 `xhs-slides.html` 截图成 PNG。

正确职责拆分：
- AI 负责读 Markdown，决定该做几页、每页如何布局、文案怎么压缩、哪里需要分页。
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

## Recommended HTML Skeleton

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>XHS Slides</title>
    <link rel="stylesheet" href="../../skills/mj-adapt/assets/xhs-base.css" />
  </head>
  <body class="xhs-canvas">
    <section class="slide">
      ...
    </section>

    <section class="slide">
      ...
    </section>
  </body>
</html>
```

## Base CSS

推荐直接复用：
- `assets/xhs-base.css`

AI 可以在这个基础上自由组合内容，但不要偏离这些底层约束：
- 默认全篇白底
- 不做整页黑白背景交替
- 用粗边框、Monospace 顶部路径、数字权重、底部结论条维持统一风格
- 文案为图片阅读而压缩，不要把 Markdown 正文原段落直接塞进页面

## Suggested Page Patterns

AI 按内容选择页面，不需要固定模板，但通常会落在这些模式里：

- 封面页：Hook + 大标题 + 副标题
- 总览页：分类汇总 / 核心数字 / 总结
- 列表页：账单、步骤、清单、对比
- 说明页：FAQ、为什么、补充说明
- 结尾页：提问 / CTA / 总结

## Quality Gates

渲染前 AI 需要自己检查：
- 单页内容是否过多
- 是否需要拆页
- 标题是否过长
- 底部结论条是否被挤压

渲染时脚本会再检查：
- 是否存在 `.slide`
- 是否有 overflow
