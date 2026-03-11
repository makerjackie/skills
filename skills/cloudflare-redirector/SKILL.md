---
name: cloudflare-redirector
description: 使用 Cloudflare Workers 配置和部署批量域名重定向（含 DNS 同步与规则编译）。当用户要创建/修改多域名重定向、从 JSON 规则生成 Worker、同步 Cloudflare DNS、或执行 wrangler 部署时使用。
---

# Cloudflare Redirector

## Quick Workflow

1. 检查前提：已安装 Node.js 与 pnpm。
2. 先配置环境变量（不要把敏感信息写进仓库文件）：
   - `CLOUDFLARE_API_TOKEN`: Cloudflare API Token（至少含 Zone.DNS Edit、Workers Scripts Edit）
   - `CLOUDFLARE_ACCOUNT_ID`: Cloudflare 账号 ID（供 `wrangler deploy` 使用）
   - 可选：`DNS_TARGET_HOST`（默认使用 `zone_name`）
   - 示例：
     ```bash
     export CLOUDFLARE_API_TOKEN=...
     export CLOUDFLARE_ACCOUNT_ID=...
     export DNS_TARGET_HOST=01mvp.com
     ```
3. 更新规则文件：编辑 `data/redirects.json`。
4. 更新路由：编辑 `wrangler.jsonc` 的 `routes`。
5. 先预览再执行：
   - `pnpm run dns:sync:dry-run`
   - `pnpm run deploy:dry-run`
6. 正式发布：`pnpm run dns:sync && pnpm run deploy`。

## Files To Edit

- `data/redirects.json`: 重定向规则（`source`, `destination`, `status`）
- `wrangler.jsonc`: Worker 入口与路由（不存账号密钥）

## Scripts

- `scripts/compile-rules.mjs`: 规范化并编译规则到 `data/redirects.compiled.json`
- `scripts/sync-dns.mjs`: 读取 `wrangler.jsonc` 路由并同步 CNAME 到 Cloudflare

## Commands

```bash
pnpm run build:rules
pnpm run dns:sync:dry-run
pnpm run dns:sync
pnpm run deploy:dry-run
pnpm run deploy
```

## Validation

发布后用以下命令检查：

```bash
curl -I https://<source-domain>
```

确认返回状态码（301/302）与 `Location` 头。

## References

- `references/upstream-README.md`: 旧仓库使用说明
- `references/legacy-skill-notes.md`: 旧技能提示词与历史流程
- `references/wechat-article.md`: 背景介绍与实践案例
