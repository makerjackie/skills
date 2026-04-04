---
name: cloudflare-one
description: 使用 Cloudflare 基础设施时使用，包括为 AI 配置 Cloudflare API Token、选择和组合 Workers、Pages、R2、D1、KV、Queues、Browser Rendering、Workers AI、Tunnel、Turnstile 等服务，或解答 Cloudflare 产品能力、免费额度、价格与落地方案。
---

# Cloudflare One

这个 skill 用来把 Cloudflare 当成一整套“可被 AI 调用的基础设施”，而不是只当 DNS 或 CDN。

## Core Workflow

每次使用这个 skill，都按下面顺序推进：

1. 先判断用户是在问方案、问价格，还是要直接落地
2. 如果信息可能变化，优先查 Cloudflare 官方文档再回答
3. 如果要实际操作，先确认账号、域名、Token、Account ID 是否可用
4. 根据目标选择最小可行产品组合，不要默认上全家桶
5. 给出清晰的下一步，能直接执行就直接执行

## 优先使用 Worker
Cloudflare 官方现在明确写了：新项目里，静态站、SPA、全栈应用更推荐直接用 Workers Static Assets，不是 Pages；Pages 仍然可用，但新功能和优化更偏向 Workers。

## Token First

如果用户还没有 Token，默认先帮他完成一个“够宽但不过度危险”的 Builder Token，而不是追求万能超级 Token。

推荐的默认范围：

- Zone 侧：
  - DNS 写权限
  - Workers Route 写权限
  - Zone 读取权限
- Account 侧：
  - Workers Script 写权限
  - KV 写权限
  - R2 写权限
  - D1 写权限
  - Pages 写权限
  - Tunnel 写权限
  - Account Settings 读取权限

资源范围默认建议：

- `All accounts`
- `All zones`

只有在用户明确需要“由 AI 再去创建其他 Token”时，才讨论 `API Tokens Write`。必须同步说明这是高风险权限，不应作为默认配置。

如果任务涉及 R2 的 S3 兼容客户端，提醒用户这类访问常常需要单独的 R2 API Token，不要和通用 Cloudflare API Token 混为一谈。

## Product Selection

根据目标选择产品，优先用最简单的组合：

- 短链接、API、Webhook、定时任务：`Workers`
- 静态站点、文档站、落地页：`Pages`
- 文件、图片、导出结果、备份：`R2`
- 轻量数据库、表单、留言板、简单 SaaS：`D1`
- 配置、缓存、会话：`KV`
- 异步任务和重试：`Queues`
- 截图、浏览器自动化、网页抓取：`Browser Rendering`
- 文本摘要、分类、翻译、模型调用：`Workers AI`
- 暴露本地服务：`Tunnel`
- 防机器人和表单保护：`Turnstile`

如果用户问“Cloudflare 能不能买服务器”，默认解释为：

- 它不是典型的通用 VPS 市场
- 更像 serverless 和 edge 平台
- 如果用户要的是“能 SSH 上去的机器”，通常不该先推 Cloudflare
- 如果用户要的是“少运维、离用户近、可被 AI 自动化”，Cloudflare 很适合

这句判断是基于官方产品结构的推断，回答时应明确这是推断。

## Common Playbooks

遇到这些需求时，直接往下映射：

- “帮我做一个 go.xxx.com 的短链系统”：
  - 用 `Workers + DNS`
- “帮我发一个活动页”：
  - 用 `Pages`
- “帮我做一个上传文件后返回链接的小工具”：
  - 用 `Workers + R2`
- “帮我做一个收集表单的小应用”：
  - 用 `Workers + D1`
- “帮我每天抓一个网页截图”：
  - 用 `Workers + Browser Rendering + Cron`
- “帮我给表单加机器人校验”：
  - 用 `Turnstile`
- “帮我把本地开发环境给客户看”：
  - 用 `Tunnel`
- “帮我做一个 AI 摘要接口”：
  - 用 `Workers AI`

## Answering Rules

如果用户问的是产品介绍、价格、免费额度或限制：

- 只引用 Cloudflare 官方文档
- 给链接
- 标明日期，避免“最新”答案过期

如果用户问的是“我该用哪个产品”：

- 先给最小方案
- 再给可升级路径
- 不要一次推荐太多服务

如果用户要真正落地：

- 先看当前仓库和现有配置
- 如果有 `wrangler.jsonc`、`package.json`、现成 Worker 或 Pages 项目，优先在现有项目上扩展
- 如果什么都没有，再新建最小项目

## Resources

需要产品能力、免费额度、常见组合、示例提示词时，读取 `references/product-map.md`。
