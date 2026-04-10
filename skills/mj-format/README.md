# MakerJackie Format (mj-format)

将 Markdown 文章自动排版为微信公众号 HTML 格式，并生成小红书风格的图片。

## Installation

```bash
claude code skill install /Users/jackiexiao/code/makerjackie/skills/skills/mj-format
```

## Quick Start

```bash
# 从 Markdown 文件生成
mj-format article.md

# 或直接提供内容
"帮我把这篇文章排版成公众号格式：[Markdown 内容]"
```

## Features

- ✅ 微信公众号 HTML 格式（内联样式）
- ✅ 小红书图片生成（1080x1350px）
- ✅ MakerJackie 品牌风格（黑白配色）
- ✅ 自动分段和排版
- ✅ 响应式布局

## Output

- `output/{date}-{slug}-wechat.html` - 公众号 HTML
- `output/{date}-{slug}-1.png` - 封面图
- `output/{date}-{slug}-2.png` - 内容图片
- ...

## Documentation

详细文档请查看 [SKILL.md](SKILL.md)

---

# 为什么我要做这个排版工具

## 痛点：公众号排版太麻烦了

你有没有遇到过这种情况：

- 写完文章，还要花半小时在编辑器里调格式
- 每次都要重新设置字号、间距、颜色
- 想保持统一的视觉风格，但手动操作太容易出错
- 想同时发小红书，还得重新做图，又是一堆重复劳动

我自己就经常遇到这个问题。写文章本身就够累了，排版更是让人头疼。

## 解决方案：一键生成，保持风格

所以我做了这个工具，核心就是三个字：**自动化**。

你只需要：
1. 用 Markdown 写文章（纯文本，专注内容）
2. 运行一个命令
3. 自动生成公众号 HTML + 小红书图片

而且，所有输出都保持统一的 MakerJackie 风格：
- 黑白配色，简洁有力
- 清晰的层次结构
- 技术感的 monospace 标签
- 强烈的视觉对比

## 特色：不只是排版，还是品牌

这个工具不是简单的格式转换，而是把我的品牌风格固化成了一套系统：

### 1. 微信公众号 HTML
- 完全符合公众号的 HTML 要求（内联样式）
- 响应式布局，手机阅读体验好
- 统一的组件库（标题、卡片、引用、页脚）

### 2. 小红书图片
- 自动分段，每个章节一张图
- 保持相同的视觉风格
- 1080x1350px，符合小红书推荐尺寸

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
- 有一篇 Markdown 格式的文章

### 使用步骤

**Step 1：安装 skill**
```bash
claude code skill install /Users/jackiexiao/code/makerjackie/skills/skills/mj-format
```

**Step 2：准备文章**
用 Markdown 写好你的文章，或者已有的 .md 文件

**Step 3：生成排版**
```bash
# 方式 1：从文件生成
mj-format article.md

# 方式 2：直接对话
"帮我把这篇文章排版成公众号格式：
# 标题
内容..."
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
A: 默认是 1080x1350px（小红书推荐），可以在生成时指定其他尺寸。

**Q: 可以自定义样式吗？**
A: 可以。修改 `assets/wechat-template.html` 中的样式变量。

**Q: 支持哪些 Markdown 语法？**
A: 支持标准 Markdown：标题、段落、列表、引用、粗体、斜体、代码块。

## 实际效果

参考示例：`inbox/2026-04-09-why-i-make-ai-tutorials-01mvp-wechat.html`

这是我用这个工具生成的实际文章，你可以看到：
- 清晰的视觉层次
- 统一的黑白配色
- 技术感的标签设计
- 强烈的品牌辨识度

## 下一步

如果你也想建立自己的内容品牌，保持统一的视觉风格，这个工具可以帮你省下大量时间。

试试看，从写完文章到发布，只需要一个命令。

---

**作者**：Maker Jackie
**联系**：makerjackie@qq.com
**网站**：[makerjackie.com](https://makerjackie.com) / [01mvp.com](https://01mvp.com)
