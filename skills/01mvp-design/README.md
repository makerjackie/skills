# 01MVP Design

把 01MVP 的视觉语言固定成一套可复用的 skill：海报、名片、社交卡片、教程页、UI、官网、活动物料，都按同一套黑白高对比、硬边界、工程感的规范来做。

## 快速安装

```bash
npx skills add 01mvp/skills --skill 01mvp-design
```

## 前提条件

- 有明确的输出场景：海报、名片、UI、网页、社交卡片等
- 能打开 `SVG`、`HTML` 或任意常见设计工具（Figma、Sketch、浏览器、Framer、HTML/CSS 都可以）
- 如果要直接复用模板，建议本地可预览 HTML

## 典型使用案例

```bash
/01mvp-design 帮我做一张 01MVP 风格的上海活动海报，主标题是“AI Builder Night”，要黑白高对比，保留报名二维码区域
```

```bash
/01mvp-design 帮我设计一套 01MVP 官网视觉风格，包含 hero、功能卡片、按钮和 logo 使用规则
```

```bash
/01mvp-design 帮我做一张 01MVP 名片，正面只放 logo，背面放姓名、微信、邮箱和一句介绍
```

详细规范请查看 [SKILL.md](SKILL.md)。

---

## Part 1：GitHub README

### 这个 skill 是干什么的

`01mvp-design` 把 01MVP 已有的 logo kit 和 UI 设计语言打包成一个统一的品牌技能。

它适合这类任务：

- 做 01MVP 的活动海报、课程封面、Workshop 视觉
- 做 01MVP 的名片、介绍卡、社交卡片
- 做 01MVP 官网、文档站、组件库、后台 UI
- 约束外包设计、AI 设计稿、前端实现稿，让风格不跑偏

### Prerequisites（前提条件）

- 知道这次要产出的媒介和尺寸
- 能使用一个可编辑输出的工具：Figma、Keynote、HTML/CSS、Framer 等
- 如果要直接复用技能里的模板，浏览器可打开本地 HTML 即可

### Quick Workflow / Getting Started

#### Step 1：确定物料类型

先说清楚你要做什么：

- 海报
- 名片
- 社交卡片
- 教程页 / Slides
- UI / 网站

#### Step 2：让 AI 套用 01MVP 规范

直接告诉 AI：

```bash
/01mvp-design 用 01MVP 的视觉系统帮我做一个产品发布页 hero 区块
```

或者：

```bash
/01mvp-design 帮我做一张 01MVP 风格的短内容卡片，尺寸 3:4，黑白高对比，底部保留品牌标记
```

#### Step 3：选择最近的模板

这个 skill 已经内置：

- logo SVG 资源
- 品牌 tokens
- 海报模板
- 名片模板
- 短内容卡片模板
- 教程 slide 模板
- 风格总览模板

#### Step 4：按规范出稿

优先保持这些元素：

- 黑白灰
- 清晰边框
- 尖锐直角
- 大字号强层级
- 等宽字体做标签和元信息

#### Step 5：交付前自检

检查：

- logo 是否用对版本
- 是否出现了渐变、柔和阴影、圆角、杂色
- 是否仍然一眼就是 01MVP

### Common Pitfalls

- 误加品牌色：01MVP 默认不是彩色品牌体系
- 阴影太软：只有少数卡片模板允许硬阴影
- 圆角太多：这个系统默认是直角和硬边界
- logo 放在复杂背景上：优先纯白、纯黑、浅灰背景
- 排版太花：01MVP 重结构，不重装饰

---

## Part 2：一篇更完整的说明

### 痛点：物料一多，品牌风格最容易散

很多团队一开始做官网、海报、名片、活动页时都还比较统一。

但一旦开始：

- 不同设计师一起做
- AI 连续生成多种视觉稿
- 前端和设计分别实现
- 海报、网站、名片、社交图并行产出

视觉就很容易慢慢跑偏。

最后常见的问题是：

- logo 每次都不一样
- 有的物料是黑白极简，有的突然变彩色
- 有的页面是硬朗工程风，有的又变成营销 SaaS 风
- 卡片、按钮、字体、边框都不统一

### 这个 skill 怎么解决

这个 skill 不是单纯给一个 logo 文件，而是把 01MVP 的整套视觉约束打包好了：

- logo 资源
- 颜色与字体规则
- 边框、卡片、按钮、标签的做法
- 海报 / 名片 / 卡片 / 网站 / UI 的应用方式
- 可以直接复用的 HTML 模板

这样不管是人来设计，还是 AI 来生成，最终都会被拉回同一套设计语言。

### 这套设计语言的核心是什么

可以把 01MVP 理解成：

- `Hardcore Minimalism`
- `Monochrome First`
- `Engineering Editorial`
- `Sharp, Structured, Decisive`

它不是柔和、可爱、潮流装饰型风格。

它更像：

- Vercel / GitHub 那种开发者审美
- 更硬朗一点的新布鲁塔主义
- 但比典型 neo-brutalism 更克制、更收敛

### 这个 skill 里有什么资源

- `assets/logo/`：官方 logo SVG
- `assets/tokens/01mvp-tokens.css`：可直接复用的设计 token
- `assets/templates/`：海报、名片、卡片、教程页、风格页模板
- `references/design-system.md`：完整视觉规范
- `references/applications.md`：不同媒介的使用方法

### 适合怎么用

最推荐的用法不是“看完再设计”，而是直接把任务交给 AI：

```bash
/01mvp-design 帮我做一张 01MVP 讲座海报
```

```bash
/01mvp-design 帮我设计 01MVP 官网的首页风格
```

```bash
/01mvp-design 帮我把这个现有页面改成 01MVP 风格
```

这个 skill 会自动把设计往统一风格上拉。

