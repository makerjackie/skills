# MJ Design

把 `james-design` 这个设计 skill 改造成适合 MakerJackie skills 仓库的版本，用来做高保真 HTML 设计稿、交互原型、Slides、动画和视觉探索。

这个版本命名为 `mj-design`，并明确标注来源：

- 上游仓库：[`iamzifei/james-design`](https://github.com/iamzifei/james-design)
- 更早来源：社区流传的 leaked `Claude Design System Prompt`

## 快速安装

```bash
npx skills add makerjackie/skills --skill mj-design
```

## 前提条件

- 你要产出的东西最好已经明确：页面、原型、Slides、动效、设计探索稿
- 最好能提供至少一种上下文：截图、品牌资产、现有页面、设计系统、产品文案
- 如果需要直接预览 HTML，浏览器能打开本地文件即可

## 典型使用案例

```bash
/mj-design 帮我做一个 AI 产品首页 hero，风格克制一点，但不要普通 SaaS 风
```

```bash
/mj-design 用 HTML 做一个 8 页的分享 deck，主题是 AI 工作流
```

```bash
/mj-design 帮我做一个可点击的移动端 onboarding 原型，先给 3 个方向
```

详细说明见 [SKILL.md](./SKILL.md)。

---

## Part 1：GitHub README

### 这个 skill 是干什么的

`mj-design` 让 AI 在做设计类工作时，不只是输出“一个页面”，而是像设计师一样去处理：

- 高保真 HTML 设计稿
- 交互原型
- 演示文稿与讲稿页面
- 动效与过场
- 多方向视觉探索

它适合这些任务：

- 做 landing page、产品页、dashboard、组件探索
- 做 workshop / 分享用的 slides
- 做交互原型、点击流程、界面方向探索
- 做强调视觉表达的 HTML 作品，而不是普通文档页

### Prerequisites（前提条件）

- 最好明确输出形式：静态页面、原型、slides、动画
- 最好有设计上下文：品牌、截图、文案、现有界面、logo、参考网站
- 如果没有现成上下文，也至少要说明目标用户、使用场景和风格边界

### Quick Workflow / Getting Started

#### Step 1：先说清楚你要什么

至少说出下面几项中的大部分：

- 做什么
- 给谁看
- 需要多高保真
- 是单一方案还是多方案探索
- 有没有现成风格可依附

#### Step 2：把现有上下文丢给 AI

例如：

```bash
/mj-design 基于我现有的官网截图，帮我探索 3 个 hero 方向
```

或者：

```bash
/mj-design 帮我做一个 workshop 分享 deck，风格偏技术编辑感，中文
```

#### Step 3：先出早期版本，再迭代

这个 skill 的思路不是先空想很久，而是：

1. 先理解需求
2. 再读现有上下文
3. 然后直接出一版可预览的 HTML
4. 基于反馈继续改

#### Step 4：需要探索时，就让它探索

如果你不确定要哪种方向，直接要求：

- 3 个版本
- 不同布局
- 不同层级
- 不同交互密度
- 不同配色策略

#### Step 5：交付前检查

检查：

- 有没有脱离原有品牌语境
- 有没有落回普通模板味
- 是否足够可读、可改、可继续迭代

### Common Pitfalls

- 没给上下文：容易做成泛化的网页稿
- 只说“高级一点”：这种描述太空，无法稳定出方向
- 一开始就追求完美：更适合先出早期版本再收反馈
- 做原型却没有交互说明：会导致结果像静态海报
- 要 slides 却不给听众和场景：会影响信息层级和节奏

---

## Part 2：一篇更完整的说明

### 痛点：很多 AI 设计稿，第一眼就能看出是“平均值”

你可能已经遇到过这种情况：

- 页面是整齐的，但没记忆点
- 组件很多，但没有主次
- 明明说的是“产品设计”，最后出来的是普通 SaaS 模板
- 做 Slides 时，像在排文档，不像在讲一个东西

问题不一定在模型本身，而在于没有一套明确的设计工作流。

### 这个 skill 解决的不是“会不会画”，而是“会不会做设计判断”

`mj-design` 的重点不是把 HTML 当代码输出器，而是把它当设计介质。

也就是说，它会优先关心：

- 是静态展示还是交互原型
- 是要一个版本还是多个探索方向
- 是延续现有系统还是从上下文里抽新语言
- 什么该编辑、什么该固定、什么该做成 live tweak

这比单纯“生成一个页面”更接近真正的设计工作。

### 这个 skill 的来路

这个版本不是凭空写的。

它基于 [`iamzifei/james-design`](https://github.com/iamzifei/james-design) 改造而来，而 `james-design` 本身又是把社区流传的 leaked `Claude Design System Prompt` skill 化、可复用化后的结果。

我这里做的事情主要是：

- 换成 `mj-design` 的命名
- 适配 MakerJackie skills 仓库结构
- 补上仓库内统一的 README 说明
- 保留来源说明，避免把它包装成原创

### 这个 skill 适合谁

- 需要快速出高保真方向的独立开发者
- 想让 AI 帮自己做视觉探索和原型的人
- 做 workshop、教程、产品展示页的人
- 已经有品牌或页面基础，只差一套“像设计师一样工作”的 AI 提示框架的人

### 最适合怎么用

最好的方式不是只说一句“帮我设计一下”，而是这样：

```bash
/mj-design 基于这个产品现有 UI，做 3 个 dashboard 改版方向，重点比较信息层级和操作流
```

```bash
/mj-design 帮我做一个讲 AI 工作流的分享 deck，听众是开发者，风格偏技术编辑感
```

```bash
/mj-design 帮我做一个可以点击的 onboarding prototype，给我一个保守版、一个更激进版
```

这样，它更容易真的进入设计模式，而不是退回模板生成器模式。
