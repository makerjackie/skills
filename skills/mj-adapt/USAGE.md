# MakerJackie Format (mj-format) - 使用指南

## 快速开始

### 基本用法

```bash
# 在 Claude Code 中使用
"帮我把这篇文章排版成公众号格式：[Markdown 内容]"

# 或者指定文件
"用 mj-format 处理 article.md"
```

## 样式规范

### 颜色系统
- 背景：`#ffffff` (纯白) - **全篇统一背景，黑色背景一般只在尾图中做 CTA 时候才使用。**
- 主文字：`#000000` (黑色)
- 正文：`#111111` (深灰)
- 边框：`3px solid #000000`
- 灰色引用：`#888888` (用于次要说明)

### 字体系统
- 标签：`Menlo, Monaco, Consolas, 'Courier New', monospace` (12px, 700)
- 大标题：30px, 900 weight
- 章节标题：25px, 900 weight
- 强调文字：18-20px, 700 weight
- 正文：17px, 400 weight
- 卡片：16px, 400 weight

### 布局组件
1. 灰色引用：4px 浅灰色左边框 + 灰色字体 (用于次要信息)
2. 章节标题：顶部 3px 黑色边框 + 章节编号
3. 卡片组件：2px 黑色边框 + 白色背景
4. 强调引用：黑色背景 + 白色文字 (仅用于极少数核心观点，严禁全文使用)
5. 页脚：Jackie 个人版全卡片布局 (包含头像、01mvp.com 链接)

## 进阶功能

### 完整图片生成

使用 Node.js + Puppeteer 生成真实的 PNG 图片：

```bash
# 1. 安装依赖（首次使用）
npm install

# 2. 生成图片
node generate-images.js output/your-article-wechat.html

# 或使用 npm script
npm run generate output/your-article-wechat.html
```

生成的图片特点：
- 尺寸：1080x1350px（小红书推荐）
- 分辨率：2x（高清）
- 格式：PNG
- 大小：约 300-400KB/张

### 自定义样式

修改 `assets/wechat-template.html` 中的样式变量：

```html
<!-- 修改颜色 -->
background-color:#ffffff;  → 改为你的背景色
color:#000000;             → 改为你的文字颜色

<!-- 修改字号 -->
font-size:30px;            → 改为你的标题字号
font-size:17px;            → 改为你的正文字号

<!-- 修改边框 -->
border:3px solid #000000;  → 改为你的边框样式
```

## 文件结构

```
mj-format/
├── SKILL.md              # Skill 定义和规范
├── README.md             # 使用文档
├── html_to_images.py     # 图片生成脚本
├── assets/
│   ├── wechat-template.html  # 微信公众号模板
│   └── components.html       # 组件库（待添加）
└── output/               # 输出目录
    ├── *.html           # 生成的 HTML 文件
    └── *.png            # 生成的图片文件
```

## 常见问题

### Q: 生成的 HTML 能直接粘贴到公众号吗？
A: 可以。HTML 使用内联样式，完全符合微信公众号要求。

### Q: 图片尺寸可以调整吗？
A: 默认是 1080x1350px（小红书推荐）。可以在 `html_to_images.py` 中修改。

### Q: 支持哪些 Markdown 语法？
A: 支持标准 Markdown：标题、段落、列表、引用、粗体、斜体、代码块。

### Q: 如何批量处理多篇文章？
A: 创建一个脚本循环调用 mj-format skill，或使用 bash 循环：

```bash
for file in articles/*.md; do
  echo "处理 $file"
  # 调用 mj-format
done
```

## 反馈和贡献

如果你有任何问题或建议，欢迎：
- 提交 Issue
- 发送邮件：makerjackie@qq.com
