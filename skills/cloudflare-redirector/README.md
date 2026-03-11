# cloudflare-redirector

使用 Cloudflare Workers 配置和部署批量域名重定向（含 DNS 同步与规则编译）。

## 快速使用

```bash
npx skills add 01mvp/skills --skill cloudflare-redirector
```

## 配置说明

本 Skill 不会在仓库中保存任何敏感信息。请在本地环境变量中提供：

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `DNS_TARGET_HOST`（可选）

## 主要文件

- `SKILL.md`: 完整操作说明
- `data/redirects.json`: 重定向规则
- `wrangler.jsonc`: Worker 与路由配置（不存账号密钥）
