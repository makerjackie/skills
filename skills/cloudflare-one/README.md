# cloudflare-one

把 Cloudflare 当成一套 AI 可以直接调度的基础设施来用：不仅能做重定向，还能做站点、API、对象存储、数据库、浏览器自动化、AI 小工具和各种自动化工作流。

注意：这个 skill 名字叫 `cloudflare-one`，但这里说的是“Cloudflare 一站式玩法”，不是 Cloudflare 官方企业安全产品 `Cloudflare One`。

## 快速安装

```bash
npx skills add 01mvp/skills --skill cloudflare-one
```

## 前提条件

- Cloudflare 账号：[免费注册](https://dash.cloudflare.com/sign-up)
- 一个接入 Cloudflare 的域名
- 一个 Cloudflare API Token
- 建议安装 `wrangler`：`npm install -g wrangler`

## 典型使用案例

```bash
/cloudflare-one 我已经有 Cloudflare token 了，帮我做一个 go.example.com 的短链系统，然后再给我加一个上传文件到 R2 的接口
```

详细用法请查看 [SKILL.md](SKILL.md)

---

## Part 1：GitHub README

### 这个 skill 是干什么的

 `cloudflare-one` 就是“用 Cloudflare 做基础设施”。

它适合这类任务：

- 先配置一个适合 AI 调用的 Cloudflare Token
- 让 AI 帮你选择用 Workers、Pages、R2、D1 还是其他服务
- 了解 Cloudflare 到底能做什么，免费额度有多少
- 直接让 AI 帮你把这些资源连起来

### Prerequisites（前提条件）

- Cloudflare 账号
- 一个已托管到 Cloudflare 的域名
- 本地命令行环境
- Node.js `18+`
- `wrangler` CLI

#### 怎么拿到 Token

到 [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)：

1. 点击 `Create Token`
2. 选择 `Create Custom Token`
3. 添加下面这组“AI Builder Token”权限
4. 把 `Account Resources` 设为 `All accounts`
5. 把 `Zone Resources` 设为 `All zones`
6. 创建后复制保存

推荐权限：

- Zone：
  - DNS 写权限
  - Workers Route 写权限
  - Zone 读取权限
- Account：
  - Workers Script 写权限
  - KV 写权限
  - R2 写权限
  - D1 写权限
  - Pages 写权限
  - Tunnel 写权限
  - Account Settings 读取权限

Cloudflare 官方支持按模板创建 Token，也支持自定义权限；其中 `Edit` 表示完整写权限，[官方文档](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/)。官方模板列表也能帮助你快速理解常见权限组合，[官方文档](https://developers.cloudflare.com/fundamentals/api/reference/template/)。


### Quick Workflow / Getting Started

#### Step 1：接入域名

- 注册 Cloudflare 账号
- 把域名托管到 Cloudflare，或者直接在 Cloudflare Registrar 购买

Cloudflare Registrar 的官方定位是按成本价卖域名，没有额外 markup，[官方文档](https://developers.cloudflare.com/registrar/)。

#### Step 2：创建一个“AI Builder Token”

按上面的权限配置创建自定义 Token。

#### Step 3：安装 skill

```bash
npx skills add 01mvp/skills --skill cloudflare-one
```

#### Step 4：直接把目标交给 AI

```bash
/cloudflare-one 帮我用 Cloudflare 做一个活动页，挂到 launch.example.com，并加一个把报名表存到 D1 的接口
```

或者：

```bash
/cloudflare-one 帮我用 Cloudflare 做一个图片上传工具，文件存 R2，元数据存 D1
```

#### Step 5：验证结果

- 回 Cloudflare Dashboard 看资源是否创建成功
- 检查域名是否已绑定
- 如果用了 Workers 或 Pages，访问线上地址确认结果
- 如果用了 R2、D1、Queues 等，确认资源已出现在控制台

### Common Pitfalls

- Token 权限不够：最常见是漏了 DNS、Workers Route 或 Workers Script 写权限
- Zone 选错：Token 覆盖不到当前域名
- 以为一个 Token 可以覆盖所有用法：R2 的 S3 兼容访问经常需要独立 R2 Token，[官方文档](https://developers.cloudflare.com/r2/api/tokens/)
- 把 Cloudflare 当 VPS：它更偏 serverless/edge，不是典型云主机
- 忽略免费额度：很多服务超出免费额度后会受限，部分服务需要先开通 Workers Paid

---

## Part 2：一篇更完整的教程

### 痛点：大多数人只把 Cloudflare 用成了 DNS

很多人知道 Cloudflare 很强，但真正用起来通常只停留在：

- 托管 DNS
- 开 CDN
- 偶尔配一个重定向

但如果你已经在用 AI，Cloudflare 更有意思的用法其实是：

- 先配一个 Token
- 再把 Cloudflare 当成 AI 可操作的基础设施
- 以后需要短链、站点、文件存储、数据库、自动化浏览器、AI 接口时，直接让 AI 帮你搭

这比你自己一个一个点控制台高效得多。

### Cloudflare 到底能做什么“好玩的事情”？

这是最值得展开的部分。

配置好 Token 之后，你可以让 AI 基于 Cloudflare 做很多有意思的东西：

- 短链系统：`go.example.com/docs`
- 活动页和营销页：`launch.example.com`
- 轻量 API：Webhook、订阅接口、表单处理
- 文件上传和下载：文件存到 R2
- 小数据库应用：报名表、留言板、任务清单
- AI 小工具：翻译、摘要、分类、内容生成
- 网页截图和自动抓取：用 Browser Rendering
- 定时任务：每天同步数据、发日报、抓网页
- 表单防机器人：用 Turnstile
- 暴露本地开发环境：用 Tunnel

你会发现，Cloudflare 很适合做“轻量、直接上线、少运维”的东西。

### 第四个问题：它到底有哪些核心服务？免费额度是多少？

下面这张表可以作为新手版本的产品地图。额度与价格按 2026-03-12 查询到的官方文档整理。

| 服务 | 适合做什么 | 免费额度 / 起步价格 |
| --- | --- | --- |
| Workers | API、Webhook、重定向、Cron | Free: `100,000` 请求/天；Workers Paid: `$5/月` 起，[官方](https://developers.cloudflare.com/workers/platform/pricing/) |
| Pages | 博客、文档站、活动页、静态站 | 静态资源请求免费且不限量；Functions 计入 Workers 配额，[官方](https://developers.cloudflare.com/pages/functions/pricing/) |
| KV | 配置、缓存、会话 | Free: `100,000` 读/天、`1,000` 写/天、`1GB` 存储，[官方](https://developers.cloudflare.com/workers/platform/pricing/) |
| D1 | SQLite 数据库、小型业务数据 | Free: `5M` 行读/天、`100k` 行写/天、`5GB`，[官方](https://developers.cloudflare.com/d1/platform/pricing/) |
| R2 | 文件、图片、导出结果、备份 | Free: `10 GB-month`、`1M` Class A/月、`10M` Class B/月，公网 egress 免费，[官方](https://developers.cloudflare.com/r2/pricing/) |
| Workers AI | 摘要、分类、翻译、生成 | Free: `10,000 Neurons/天`；超出后 `$0.011 / 1,000 Neurons`，且需要 Workers Paid，[官方](https://developers.cloudflare.com/workers-ai/platform/pricing/) |
| Browser Rendering | 截图、网页抓取、自动化测试 | Free: `10 分钟/天`、`3` 并发浏览器；Paid: `10 小时/月` 后 `$0.09/小时`，[官方](https://developers.cloudflare.com/browser-rendering/pricing/) |
| Queues | 异步任务、重试、消息队列 | Free: `10,000` operations/天；Paid: `1,000,000` operations/月后 `$0.40/million`，[官方](https://developers.cloudflare.com/queues/platform/pricing/) |
| Turnstile | 表单防刷、登录保护 | Free 计划适用于大多数生产应用，[官方](https://developers.cloudflare.com/turnstile/plans/) |
| Images | 图片处理、缩图、水印 | Free: `5,000` 唯一变换/月，[官方](https://developers.cloudflare.com/images/pricing/) |
| Zaraz | 埋点、第三方脚本管理 | 每月 `1,000,000` 免费事件，[官方](https://developers.cloudflare.com/zaraz/pricing-info/) |
| Containers | 运行更复杂的容器化工作负载 | 建立在 Workers Paid 之上；Workers Paid `$5/月` 起，容器资源按量计费，[官方](https://developers.cloudflare.com/containers/pricing/) |

### 最后一个问题：新手最值得先从哪几个服务开始？

我的建议是这个顺序：

1. `Workers`
2. `Pages`
3. `R2`
4. `D1`
5. `Workers AI`
6. `Browser Rendering`
7. `Queues / Tunnel / Turnstile`

原因不是它们“最强”，而是它们最容易组成完整结果。

比如：

- `Workers + R2` 就能做上传工具
- `Workers + D1` 就能做表单应用
- `Pages + Workers` 就能做完整站点
- `Workers + Browser Rendering` 就能做截图机器人

### 适合直接交给 AI 的提示词

你可以直接这样用：

```bash
/cloudflare-one 帮我做一个投票页，前端用 Pages，投票记录存 D1
```

```bash
/cloudflare-one 帮我做一个网页截图 API，用 Browser Rendering，每天定时抓取一次首页
```

```bash
/cloudflare-one 帮我做一个文件上传接口，文件存 R2，返回可访问链接
```

```bash
/cloudflare-one 帮我给这个表单加 Turnstile，避免垃圾提交
```

### 最自然的上手方式

不要一开始就学全家桶。

最自然的路径是：

1. 接入一个域名
2. 配一个 `AI Builder Token`
3. 先完成一个很小但真实的成果

比如：

- 一个短链
- 一个 landing page
- 一个上传接口
- 一个小表单

只要第一个结果跑通，你就会发现 Cloudflare 的其他服务其实都能顺着这个入口继续扩展。

---

**详细技术说明请查看 [SKILL.md](SKILL.md)**
