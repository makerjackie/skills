# Cloudflare 部署配置指南

> 参考文章：https://makerjackie.com/blog/2026-04-24-cloudflare-deploy-guide

## 获取 Cloudflare 凭证

### 获取 API Token

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 右上角 "My Profile" → "API Tokens" 选项卡
3. 点击 "Create Token"
4. 选择 "Edit Cloudflare Workers" 模板（包含 Workers 部署权限）
5. 如果需要管理 DNS（自定义域名），添加权限：
   - `Zone.DNS Edit`
   - `Zone.Zone Read`
6. 选择对应的域名区域
7. 点击 "Continue to summary" → "Create Token"
8. **复制并保存 Token**（关闭页面后无法再次查看）

### 获取 Account ID

1. 登录 Cloudflare Dashboard
2. 进入任意域名 Overview 页面
3. 右侧栏 "Account ID" — 复制即可

### 配置环境变量

在终端中设置：

```bash
# 临时配置（当前终端有效）
export CLOUDFLARE_API_TOKEN=your_token_here
export CLOUDFLARE_ACCOUNT_ID=your_account_id_here

# 永久配置（推荐）- 添加到 ~/.zshrc
echo 'export CLOUDFLARE_API_TOKEN=your_token_here' >> ~/.zshrc
echo 'export CLOUDFLARE_ACCOUNT_ID=your_account_id_here' >> ~/.zshrc
source ~/.zshrc
```

将 `your_token_here` 和 `your_account_id_here` 替换为实际值。

## wrangler 配置

### 安装 wrangler

```bash
npm install -g wrangler
# 或
pnpm add -g wrangler
```

### 登录（Token 方式）

Token 方式不需要 `wrangler login`，直接在环境变量中设置 `CLOUDFLARE_API_TOKEN` 即可。

### wrangler.jsonc 配置示例

```jsonc
{
  "name": "my-worker",
  "main": "src/index.js",
  "compatibility_date": "2025-01-01",
  "compatibility_flags": ["nodejs_compat"],
  "routes": [
    { "pattern": "api.example.com/*", "zone_name": "example.com" }
  ],
  "vars": {
    "ENVIRONMENT": "production"
  }
}
```

### 自定义域名绑定

部署后可以通过 Cloudflare Dashboard 绑定自定义域名：

1. 进入 Cloudflare Dashboard → Workers & Pages
2. 选择你的 Worker
3. "Triggers" 选项卡 → "Custom Domains"
4. 点击 "Add Custom Domain"
5. 输入域名（如 `api.yourdomain.com`）
6. 保存 — Cloudflare 自动配置 DNS 和 SSL

或者在 wrangler.jsonc 中配置 routes：

```jsonc
{
  "routes": [
    { "pattern": "yourdomain.com/*", "zone_name": "yourdomain.com" },
    { "pattern": "api.yourdomain.com/*", "zone_name": "yourdomain.com" }
  ]
}
```

## 部署命令

```bash
# 部署 Worker
wrangler deploy

# 预览（dry-run）
wrangler deploy --dry-run

# 指定环境
wrangler deploy --env production
```

## 验证部署

```bash
# 测试 Worker 是否在线
curl https://your-worker.your-account.workers.dev

# 测试自定义域名
curl https://api.yourdomain.com
```
