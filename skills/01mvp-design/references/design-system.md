# 01MVP 视觉设计规范

## 1. 品牌气质

01MVP 的核心不是“漂亮”，而是：

- 从 `0` 到 `1` 的行动感
- 最小可行产品的执行力
- 工程秩序感
- 信息清晰与决断力

推荐把整体气质理解为：

- 硬核极简
- 高对比
- 模块化
- 工程编辑感
- 技术理性

不要把它做成：

- 柔和治愈风
- 糖果色 SaaS 风
- 玻璃拟态
- 重插画营销页
- 依赖渐变和发光的未来感页面

## 2. 核心关键词

- `Hardcore Minimalism`
- `Monochrome First`
- `High Contrast`
- `Technical Editorial`
- `Sharp Grid`
- `No Decoration`

## 3. 色彩系统

核心只用三种颜色：

- `#000000`：主色，代表执行力、判断力、秩序
- `#FFFFFF`：底色，代表清晰、留白、信息可读性
- `#F5F5F5`：辅助灰，只用于分层、背景、代码块、弱对比区域

补充说明：

- UI、网页、名片、海报默认都先用黑白灰完成
- 不主动增加品牌色
- 如必须加入功能色，只能小范围作为状态提示，不能抢主视觉

## 4. 字体系统

### 主字体

- 英文与西文：`Inter`
- 中文：`Noto Sans SC` 或系统无衬线中文字体
- 回退：`-apple-system`, `BlinkMacSystemFont`, `"Helvetica Neue"`, `Arial`, `sans-serif`

### 等宽字体

- `JetBrains Mono`
- 回退：`Space Mono`, `SFMono-Regular`, `Menlo`, `Monaco`, `Consolas`, `monospace`

### 使用规则

- 大标题：`900` 字重，紧字距，强调压迫感与果断感
- 小标签、序号、路径、元信息：优先用等宽字体
- 正文：保持克制，可读即可，不要玩花哨字效
- 英文大标题可全大写；中文标题保持自然断句，不强制全大写

## 5. 排版层级

推荐层级：

- Hero / 封面标题：`3.2rem` 到 `5rem`，`900`，紧字距
- H1 / 主标题：`2.4rem` 到 `3.6rem`
- H2 / 分区标题：`1.5rem` 到 `2.4rem`
- 标签 / 路径 / 序号：`0.75rem` 到 `1rem`，等宽，uppercase
- 正文：`1rem` 到 `1.4rem`
- 说明文字 / 注释：可降到灰色，但仍需清晰可读

## 6. 结构原则

### 边框

- UI 默认 `2px solid #000`
- 社交卡片、教程卡片、海报主容器可用 `3px solid #000`
- 不使用圆角，默认 `0px`

### 留白

- 宁愿更空，不要更满
- 内容分组用留白和边框，不靠花样背景
- 外边距和内边距要明显，不要挤

### 网格

- 偏模块化、分栏式布局
- 信息块之间要有明确边界
- 页面上尽量有“头部标记 / 主内容 / 底部锚点”

## 7. 组件语言

### 按钮

- 黑白反转是首选交互
- 文案尽量短而明确
- 用等宽字体或强字重无衬线字体

### 卡片

- 白底黑边是默认卡片
- 黑底白字用于强调块、行动块、重点提示
- 允许大留白 + 少量强信息

### 标签 / Badge

- 小号、等宽、全大写
- 可以纯黑底白字，也可以描边样式

### 代码块 / 技术块

- 用浅灰底承接
- 等宽字体
- 保持技术文档感，不要装饰

## 8. Logo 系统

可用资源：

- `assets/logo/01mvp-wordmark-primary.svg`
- `assets/logo/01mvp-wordmark-inverse.svg`
- `assets/logo/01mvp-icon-black.svg`
- `assets/logo/01mvp-icon-white.svg`
- `assets/logo/01mvp-lockup-horizontal.svg`

### 使用规则

- 白底优先黑字版
- 黑底优先白字版
- 浅灰底可以使用黑字版
- 不要擅自换色
- 不要拉伸、倾斜、阴影、描边特效、发光

### 安全距离与最小尺寸

- 安全距离：四周至少保留 `1x`，`x` 取字标里 `0` 的高度
- 字标最小高度：`24px`
- 图标最小尺寸：`32px`

## 9. 允许与禁止

### 允许

- 黑白强对比
- 大字号排版
- 标签式信息头
- 模块化分区
- 单向硬阴影卡片
- 极少量灰色辅助层

### 禁止

- 渐变
- 柔光 / 氛围发光
- 玻璃模糊
- 圆角气泡
- 过多彩色强调
- 复杂背景照片压 logo
- 轻飘飘的营销插画风

## 10. 一句话风格定义

如果需要一句话描述给设计师或 AI：

`01MVP = monochrome hardcore minimalism with strong borders, technical typography, modular layout, and decisive editorial hierarchy.`

