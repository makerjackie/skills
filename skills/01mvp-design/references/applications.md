# 01MVP 应用场景手册

## 1. 海报 / 活动物料

### 推荐尺寸

- 竖版海报：`1080 x 1440` 或 `1080 x 1920`
- 横版封面：`1200 x 628`
- 微信头图：`900 x 383`

### 结构公式

- 左上：栏目标签 / 期数 / 活动类型
- 中部：超大主标题
- 中下：副标题 / 时间 / 地点 / 一句话说明
- 底部：logo、报名方式、二维码区

### 风格约束

- 标题必须是视觉绝对中心
- 黑白对比优先
- 如果加二维码，周围必须留出清晰边界
- 可使用大面积纯黑块承载关键信息

### 推荐模板

- `assets/templates/poster-vertical.html`

## 2. 名片 / Contact Card

### 推荐结构

- 正面：logo + 01MVP 字标
- 背面：姓名、职位、微信、邮箱、网站
- 联系方式用等宽标签或紧凑信息表

### 风格约束

- 不要堆太多信息
- 正面尽量克制
- 背面强调秩序和对齐

### 推荐模板

- `assets/templates/business-card.html`

## 3. 社交卡片 / 短内容卡

适合：

- 金句卡
- 短回答
- 一页观点
- 公众号配图

### 推荐尺寸

- `3:4`
- `1080 x 1440`

### 结构公式

- 顶部：路径型标题或栏目标题
- 中部：一个核心观点
- 下部：补充说明 / 品牌落款

### 推荐模板

- `assets/templates/short-answer-card.html`
- `assets/templates/short-action-card.html`

## 4. 教程页 / Workshop Slide

适合：

- 课程封面
- 教程分页
- 操作步骤页
- 结尾行动页

### 结构公式

- 左上：章节路径
- 右上：页码
- 中部：标题 + 步骤说明
- 中下：代码块 / 行动块 / 重点信息
- 底部：日期与品牌锚点

### 推荐模板

- `assets/templates/tutorial-slide.html`

## 5. UI / Dashboard

### 结构原则

- 用边框和留白做组织，不依赖阴影
- 组件像文档系统与控制面板的混合体
- 标签、数字、按钮要有工程感

### 适合的组件

- bordered cards
- outline tags
- mono labels
- big metric blocks
- high-contrast CTA
- code-like helper areas

### 推荐起点

- `assets/tokens/01mvp-tokens.css`
- `assets/templates/style-guide.html`

## 6. 网站 / Landing Page / Docs

### 页面风格

- 像开发者产品官网或文档站
- 首页和文档页都要保持模块感
- 多用 section label、card grid、mono metadata

### 内容顺序

- hero
- problem / promise
- feature cards
- how it works
- proof / examples
- action CTA

### 风格约束

- 英文标题可以更硬朗
- 中文说明保持简洁直接
- 不要使用花哨 hero 插画来稀释品牌

## 7. Prompt 模板

### 中文 prompt

`请基于 01MVP 视觉系统设计，风格为黑白高对比、硬核极简、工程感排版、强边框、零圆角、模块化网格、等宽字体标签、无渐变、无玻璃拟态、无柔光，输出一个结构清晰、信息层级果断的设计方案。`

### English prompt

`Design in the 01MVP visual system: monochrome, high contrast, hardcore minimalism, technical editorial typography, strong borders, zero border radius, modular grid, mono labels, no gradients, no glassmorphism, no soft glow, decisive hierarchy.`

## 8. 最终自检

交付任何物料前，检查：

- 一眼是不是 01MVP
- logo 有没有被错用
- 有没有不必要的彩色或柔和效果
- 层级是不是够果断
- 画面是不是宁可更空而不是更满

