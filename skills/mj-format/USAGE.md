# MakerJackie Format (mj-format) - 使用指南

## 快速开始

### 基本用法

```bash
# 在 Claude Code 中使用
"帮我把这篇文章排版成公众号格式：[Markdown 内容]"

# 或者指定文件
"用 mj-format 处理 article.md"
```

### 输出文件

生成的文件会保存在 `output/` 目录：

- `{date}-{slug}-wechat.html` - 微信公众号 HTML
- `{date}-{slug}-1.png` - 封面图（标题 + TL;DR）
- `{date}-{slug}-2.png` - 第1章
- `{date}-{slug}-3.png` - 第2章
- ...

## 测试结果

✅ 已成功测试示例文章：

```
output/
├── 2026-04-09-why-i-make-ai-tutorials-wechat.html (22KB)
├── 2026-04-09-why-i-make-ai-tutorials-1.png (封面)
├── 2026-04-09-why-i-make-ai-tutorials-2.png (第1章)
├── 2026-04-09-why-i-make-ai-tutorials-3.png (第2章)
├── 2026-04-09-why-i-make-ai-tutorials-4.png (第3章)
├── 2026-04-09-why-i-make-ai-tutorials-5.png (第4章)
├── 2026-04-09-why-i-make-ai-tutorials-6.png (第5章)
└── 2026-04-09-why-i-make-ai-tutorials-7.png (第6章 + 页脚)
```

## 样式规范

### 颜色系统
- 背景：`#ffffff` (白色)
- 主文字：`#000000` (黑色)
- 正文：`#111111` (深灰)
- 边框：`3px solid #000000`
- 强调背景：`#000000` (黑底白字)

### 字体系统
- 标签：`Menlo, Monaco, Consolas, 'Courier New', monospace` (12px, 700)
- 大标题：30px, 900 weight
- 章节标题：25px, 900 weight
- 强调文字：18-20px, 700 weight
- 正文：17px, 400 weight
- 卡片：16px, 400 weight

### 布局组件
1. 文章头部：3px 黑色边框 + 日期标签 + 大标题
2. TL;DR 区块：黑色背景 + 白色文字
3. 章节标题：顶部 3px 黑色边框 + 章节编号
4. 卡片组件：2px 黑色边框 + 白色背景
5. 强调引用：黑色背景 + 白色文字
6. 页脚：黑色背景 + 作者信息

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

## 下一步计划

- [ ] 实现真实的 PNG 图片生成（使用 Playwright）
- [ ] 支持自定义配色方案
- [ ] 添加更多组件模板
- [ ] 支持从 Markdown 直接生成
- [ ] 添加图片压缩和优化
- [ ] 支持批量处理

## 反馈和贡献

如果你有任何问题或建议，欢迎：
- 提交 Issue
- 发送邮件：makerjackie@qq.com
- 访问网站：makerjackie.com

---

**Maker Jackie** | 让排版更简单
