# MakerJackie Adapt (mj-adapt)

将已完成的文章适配到多个发布平台，自动生成各平台所需的格式和素材。

## Installation

```bash
claude code skill install /Users/jackiexiao/code/makerjackie/skills/skills/mj-adapt
```

## Quick Start

```bash
# 多平台适配
"我写好了一篇文章，需要发到公众号和小红书"

# 只生成公众号格式
"把这篇文章转成公众号格式"

# 从文件适配
"把 article.md 适配到各个平台"

# AI 先产出 xhs-slides.html，再截图
node generate-xhs-slides.js fixtures/2026-04-20-ai-subscription-bill-1785-monthly.xhs-slides.html ../../output/2026-04-20-ai-subscription-bill-1785-monthly
```

## 支持的平台

- ✅ **微信公众号**：生成特殊格式的 HTML（内联样式）
- ✅ **小红书**：生成图文素材（1080x1350px）
- 🚧 **知乎/推客**：优化 Markdown 排版（未来支持）

## Output

- `output/{date}-{slug}-wechat.html` - 公众号 HTML（复制到编辑器）
- `output/{date}-{slug}-1.png` - 小红书封面图
- `output/{date}-{slug}-2.png` - 小红书内容图
- ...
- `output/{date}-{slug}/xhs-slides.html` - AI 生成的小红书多页 HTML

## Documentation

详细文档请查看 [skill.md](skill.md)

---

# 为什么需要多平台内容适配工具

## 痛点：一篇文章，多次排版

你有没有遇到过这种情况：

- 文章写完了，但要发到公众号、小红书、知乎、推客...
- 每个平台的格式要求都不一样
- 公众号需要特殊的 HTML 格式（内联样式）
- 小红书需要图片，还得手动做图
- 每次发布都要重新排版，浪费大量时间

我自己就经常遇到这个问题。写完一篇文章，光是适配各个平台就要花半小时。

## 解决方案：一键适配，多平台发布

所以我做了这个工具，核心就是：**写一次，到处发布**。

你只需要：
1. 用 Markdown 写好文章（专注内容）
2. 运行一个命令
3. 自动生成各平台所需的格式和素材

而且，所有输出都保持统一的 MakerJackie 风格：
- 黑白配色，简洁有力
- 清晰的层次结构
- 技术感的 monospace 标签
- 强烈的视觉对比

## 特色：不只是格式转换，还是品牌统一

这个工具不是简单的格式转换，而是把品牌风格固化成了一套系统：

### 1. 微信公众号 HTML
- 完全符合公众号的 HTML 要求（内联样式）
- 响应式布局，手机阅读体验好
- 统一的组件库（标题、卡片、引用、页脚）
- 直接复制粘贴到编辑器，无需二次调整

### 2. 小红书图片
- AI 先把内容直接生成成多页 HTML slides，再由脚本稳定截图
- 默认统一白底，不做整页黑白背景交替
- 超过单页容量时自动分页，不裁卡片
- 1080x1350 视口导出 2x PNG，最终为 2160x2700
- 直接上传，无需手动做图

### 3. 可复用的设计系统
- 颜色系统：黑白为主
- 字体系统：Monospace 标签 + 清晰正文
- 间距系统：24-32px 组件间距
- 组件库：标题、卡片、引用、页脚

## 适合谁用

这个工具特别适合：

- **内容创作者**：经常发公众号和小红书，需要保持统一风格
- **个人品牌建设者**：想要有辨识度的视觉风格
- **效率控**：不想在排版上浪费时间
- **技术博主**：喜欢 Markdown 写作，需要自动化工具

## 快速上手

### 前提条件
- 安装 Claude Code
- 有一篇已完成的 Markdown 格式文章

### 使用步骤

**Step 1：安装 skill**
```bash
claude code skill install /Users/jackiexiao/code/makerjackie/skills/skills/mj-adapt
```

**Step 2：准备文章**
用 Markdown 写好你的文章，或者已有的 .md 文件

**Step 3：适配到各平台**
```bash
# 方式 1：多平台适配
"我写好了一篇文章，需要发到公众号和小红书
[提供 Markdown 内容]"

# 方式 2：只生成公众号格式
"把这篇文章转成公众号格式
[提供 Markdown 内容]"

# 方式 3：从文件适配
"把 article.md 适配到各个平台"

# 方式 4：AI 先写 xhs-slides.html，再交给脚本截图
node generate-xhs-slides.js fixtures/2026-04-20-ai-subscription-bill-1785-monthly.xhs-slides.html ../../output/2026-04-20-ai-subscription-bill-1785-monthly
```

**Step 4：查看输出**
在 `output/` 目录下会生成：
- `{date}-{slug}-wechat.html` - 复制到公众号编辑器
- `{date}-{slug}-1.png` - 小红书封面图
- `{date}-{slug}-2.png` - 小红书内容图
- ...

### 常见问题

**Q: 生成的 HTML 能直接粘贴到公众号吗？**
A: 可以。HTML 使用内联样式，完全符合微信公众号要求。

**Q: 图片尺寸可以调整吗？**
A: 默认按 1080x1350 视口导出，并使用 2x 高清截图，最终 PNG 为 2160x2700。

**Q: 为什么脚本不直接读 Markdown？**
A: 因为“怎么排版”是内容理解问题，应该由 AI 来决定；脚本只负责把 AI 产出的 `xhs-slides.html` 稳定截图成同一套规格。

**Q: 可以自定义样式吗？**
A: 可以。修改 `skill.md` 中的样式规范。

**Q: 支持哪些 Markdown 语法？**
A: 支持标准 Markdown：标题、段落、列表、引用、粗体、斜体、代码块。

**Q: 支持其他平台吗？**
A: 目前支持微信公众号和小红书。知乎、推客等平台的支持正在开发中。

## 实际效果

参考示例：`inbox/2026-04-09-why-i-make-ai-tutorials-01mvp-wechat.html`

小红书回归样例：`fixtures/2026-04-20-ai-subscription-bill-1785-monthly.md`
小红书 HTML 样例：`fixtures/2026-04-20-ai-subscription-bill-1785-monthly.xhs-slides.html`

这是用这个工具生成的实际文章，你可以看到：
- 清晰的视觉层次
- 统一的黑白配色
- 技术感的标签设计
- 强烈的品牌辨识度

## 下一步

如果你也想建立自己的内容品牌，保持统一的视觉风格，这个工具可以帮你省下大量时间。

试试看，从写完文章到多平台发布，只需要一个命令。

---

**作者**：Maker Jackie  
**联系**：makerjackie@qq.com  
**AI教程**：[01mvp.com](https://01mvp.com)
