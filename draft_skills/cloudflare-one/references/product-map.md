# Cloudflare Product Map

当用户问“Cloudflare 能做什么”或“我该选哪个服务”时，优先按下面的最小映射回答。

## Quick Mapping

- 跑后端逻辑：`Workers`
- 部署站点：`Pages`
- 存文件：`R2`
- 存关系型数据：`D1`
- 存配置和缓存：`KV`
- 做异步任务：`Queues`
- 打开网页并截图：`Browser Rendering`
- 调模型：`Workers AI`
- 暴露本地服务：`Tunnel`
- 防机器人：`Turnstile`

## Good First Projects

- 短链系统：`Workers + DNS`
- 上传工具：`Workers + R2`
- 报名表：`Workers + D1`
- 活动页：`Pages`
- AI 摘要接口：`Workers AI`
- 截图机器人：`Workers + Browser Rendering + Cron`

## Token Guidance

默认推荐“Builder Token”，覆盖：

- DNS
- Workers Routes
- Workers Scripts
- KV
- R2
- D1
- Pages
- Tunnel

不要默认授予：

- `API Tokens Write`

除非用户明确要求让 AI 继续创建或管理更多 Token。
