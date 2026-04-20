---
name: mj-adapt
description: MakerJackie 多平台内容适配工具：将已完成的文章适配到不同发布平台，使用极简硬核风格排版，比如微信公众号，小红书，推特等平台优化排版。核心场景是「一篇文章，多平台发布」的内容分发工作流。
---

# MakerJackie Adapt (mj-adapt)

将已完成的文章适配到多个发布平台，自动生成各平台所需的格式和素材（默认生成全部平台）。

## 核心使用场景

**触发时机**：用户已经写好一篇文章，需要将其发布到多个平台（微信公众号、小红书、知乎、推特等）。

**核心任务**：根据不同平台的要求，生成对应的格式和素材：
- **微信公众号**：生成特殊格式的 HTML（内联样式，符合公众号编辑器要求） + 微信公众号首图 + 文章标题和描述
- **小红书**：生成图文素材（1080x1350px 图片）
- **推特**：生成简短版本的介绍（140 字以内）

## Quick Workflow

### Step 1: 接收已完成的文章
- 接收 Markdown 格式的文章内容
- 或接收文章文件路径
- **前提**：文章内容已经完成，只需要适配格式

### Step 2: 识别目标平台
- 默认生成：全部平台素材，除非用户说“只生成微信公众号素材”，则只生成微信公众号相关素材

### Step 3: 生成微信公众号 HTML
- 解析 Markdown 结构
- 应用 MakerJackie 排版样式（黑白配色、粗边框）
- 生成符合微信公众号要求的 HTML（内联样式） + 微信公众号首图（风格类似前面的 HTML，但是放上标题） + 文章标题和描述
- 输出到 `output/` 目录

### Step 4: 生成小红书图片
- 将 HTML 内容分段
- 每段生成一张 PNG 图片（1080x1350px）
- 保持相同的视觉风格
- 输出为 1.png, 2.png, 3.png...

## 样式规范

### 核心设计原则
- **白色底色**：干净、简洁的阅读体验
- **黑白配色**：强烈的视觉对比
- **清晰层次**：通过边框和间距区分内容块
- **Monospace 标签**：技术感的小标题和元信息

### 颜色系统
- 背景色：`#ffffff` (白色)
- 主文字：`#000000` (黑色)
- 正文：`#111111` (深灰)
- 边框：`3px solid #000000` (黑色粗边框)
- 强调背景：`#000000` (黑底白字)

### 字体系统
- **标签/元信息**：`Menlo, Monaco, Consolas, 'Courier New', monospace`
  - 12px, 700 weight, 1.6 line-height, 1px letter-spacing
- **大标题**：30px, 900 weight, 1.35 line-height
- **章节标题**：25px, 900 weight, 1.45 line-height
- **强调文字**：18-20px, 700 weight, 1.8-1.9 line-height
- **正文**：17px, 400 weight, 1.9 line-height
- **卡片文字**：16px, 400 weight, 1.9 line-height

### 布局组件

#### 1. 文章头部 (Header)
```
- 3px 黑色边框
- 18px padding
- 包含：日期标签 + 大标题
```

#### 2. TL;DR 区块
```
- 黑色背景
- 白色文字
- 18px padding
- 包含：标签 + 强调文字
```

#### 3. 章节标题
```
- 顶部 3px 黑色边框
- 14px padding-top
- 包含：章节编号 + 标题
```

#### 4. 卡片组件
```
- 2px 黑色边框
- 16px padding
- 白色背景
- 包含：小标签 + 内容
```

#### 5. 强调引用
```
- 黑色背景
- 白色文字
- 16-18px padding
- 用于重要观点
```

#### 6. 页脚
```
- 黑色背景
- 白色文字
- 包含：作者信息 + 联系方式
```

### 间距系统
- 组件间距：24-32px
- 段落间距：18px
- 内部 padding：16-18px
- 小间距：10-12px

## 微信公众号 HTML 要求

### 必须遵守的规则
1. **内联样式**：所有样式必须写在 `style` 属性中
2. **不支持的 CSS**：避免使用 `position: fixed/sticky`, `float`, `transform` 等
3. **盒模型**：使用 `box-sizing: border-box`
4. **响应式**：使用 `max-width` 而非固定宽度
5. **图片**：使用相对路径或 CDN 链接

### 容器结构
```html
<section style="margin:0;padding:24px 0;background-color:#ffffff;">
  <section style="margin:0 auto;padding:0 16px;max-width:677px;box-sizing:border-box;">
    <!-- 内容区域 -->
  </section>
</section>
```

## 图片生成规范

### 小红书图片尺寸
- 推荐尺寸：1080x1350px (4:5 比例)
- 或：1080x1920px (9:16 比例)
- 最小宽度：1080px

### 分段策略
1. 标题 + TL;DR → 封面图 (1.png)
2. 每个主要章节 → 独立图片 (2.png, 3.png...)
3. 结尾 CTA + 作者信息 → 最后一张

### 图片样式
- 保持与 HTML 相同的视觉风格
- 适当增大字号以适应图片阅读
- 保持足够的边距和留白

## 输出文件命名

### HTML 文件
格式：`{date}-{slug}-wechat.html`
示例：`2026-04-09-why-i-make-ai-tutorials-wechat.html`

### 图片文件
格式：`{date}-{slug}-{number}.png`
示例：
- `2026-04-09-why-i-make-ai-tutorials-1.png`
- `2026-04-09-why-i-make-ai-tutorials-2.png`

## 使用示例

### 示例 1：多平台发布
```
用户：我写好了一篇文章，需要发到公众号和小红书
[提供 Markdown 内容]

输出：
- output/2026-04-20-article-title-wechat.html （复制到公众号编辑器）
- output/2026-04-20-article-title-1.png （小红书封面图）
- output/2026-04-20-article-title-2.png （小红书内容图）
- ...
```

### 示例 2：只生成公众号格式
```
用户：把这篇文章转成公众号格式
[提供文章文件路径或内容]

输出：
- output/2026-04-20-article-wechat.html
```

### 示例 3：从文件批量适配
```
用户：把 article.md 适配到各个平台

输出：
- output/2026-04-20-article-wechat.html （公众号）
- output/2026-04-20-article-1.png （小红书图1）
- output/2026-04-20-article-2.png （小红书图2）
- ...
```

## 质量检查清单

生成内容前，确保：
- [ ] HTML 使用内联样式
- [ ] 颜色系统正确（黑白为主）
- [ ] 字体和字号符合规范
- [ ] 边框粗细正确（3px 主边框，2px 卡片边框）
- [ ] 间距系统一致
- [ ] 响应式布局（max-width: 677px）
- [ ] 图片尺寸符合小红书要求
- [ ] 文件命名规范

## 参考资源

- 示例 HTML：`/Users/jackiexiao/code/makerjackie/skills/inbox/2026-04-09-why-i-make-ai-tutorials-01mvp-wechat.html`
- 样式模板：`assets/wechat-template.html`
- 组件库：`assets/components.html`
