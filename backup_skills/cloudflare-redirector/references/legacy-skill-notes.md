---
skill: cloudflare-redirects
version: 1.0.0
description: 配置和部署 Cloudflare Workers 批量域名重定向
tags: [cloudflare, workers, dns, redirect]
---

# Cloudflare 域名重定向配置助手

帮助用户使用 Cloudflare Workers 配置批量域名重定向。

## 何时使用

当用户需要：
- 配置多个子域名重定向到不同目标地址
- 跨域名统一管理重定向规则
- 部署 Cloudflare Workers 重定向服务

## 工作流程

### 1. 检查前提条件

首先确认：
- 域名已接入 Cloudflare
- 本地已安装 pnpm
- 项目路径：`/Users/jackiexiao/code/01mvp/mono/tools/cloudflare-bulk-redirector`

### 2. 配置 Cloudflare API Token

引导用户创建具有正确权限的 API Token：

**步骤：**
1. 打开 Cloudflare 控制台：https://dash.cloudflare.com/profile/api-tokens
2. 点击 `Create Token`
3. 选择 `Create Custom Token`
4. 配置权限（最小权限原则）：
   - `Account - Workers Scripts:Edit`
   - `Zone - Workers Routes:Edit`
   - `Zone - DNS:Edit`
   - `Zone - Zone:Read`
5. `Account Resources` 选择账户
6. `Zone Resources` 选择需要管理的域名（或 All zones）
7. 创建后复制 Token

**设置环境变量：**
```bash
export CLOUDFLARE_API_TOKEN='你的token'
export CLOUDFLARE_ACCOUNT_ID='你的account_id'
```

Account ID 获取位置：Cloudflare Dashboard 右侧栏 `Account ID`

**验证 Token：**
```bash
curl -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  https://api.cloudflare.com/client/v4/user/tokens/verify
```

返回 `"success": true` 即可。

### 3. 配置重定向规则

有两种方式配置规则：

**方式 1：JSON 格式** (`data/redirects.json`)
```json
[
  {
    "source": "logo.hackathonweekly.com",
    "destination": "https://hackathonweekly.feishu.cn/wiki/xxx",
    "status": 301
  }
]
```

**方式 2：CSV 格式** (`data/redirects.csv`)
```csv
source,destination,status
logo.hackathonweekly.com,https://hackathonweekly.feishu.cn/wiki/xxx,301
```

字段说明：
- `source`: 来源域名（仅 host）
- `destination`: 目标 URL（完整 URL）
- `status`: `301`（永久）或 `302`（临时），默认 301

### 4. 配置 Worker 路由

编辑 `wrangler.jsonc` 的 `routes` 部分：

```jsonc
"routes": [
  {
    "pattern": "logo.hackathonweekly.com/*",
    "zone_name": "hackathonweekly.com"
  },
  {
    "pattern": "docs.hackathonweekly.com/*",
    "zone_name": "hackathonweekly.com"
  }
]
```

### 5. 同步 DNS 记录

自动创建或更新子域名的 CNAME 记录：

```bash
cd /Users/jackiexiao/code/01mvp/mono/tools/cloudflare-bulk-redirector
pnpm run dns:sync
```

预览不落库：
```bash
pnpm run dns:sync:dry-run
```

### 6. 部署 Worker

```bash
pnpm run deploy
```

### 7. 一键流程（推荐）

```bash
cd /Users/jackiexiao/code/01mvp/mono/tools/cloudflare-bulk-redirector
pnpm run dns:sync && pnpm run deploy
```

## 常见问题处理

### Authentication failed / Invalid API Token
- Token 失效或权限不足
- 重新创建 Token 并检查权限范围
- 确保包含所有必需权限

### 部署报 route/zone 权限错误
- 补齐 `Workers Routes:Edit` 和 `Zone:Read` 权限

### 访问子域名没有生效
- 执行 `pnpm run dns:sync`
- 去 DNS 页面确认记录是 Proxied（橙云）

### 新增域名
1. 在规则文件（JSON/CSV）添加映射
2. 在 `wrangler.jsonc` 添加 route
3. 执行 `pnpm run dns:sync && pnpm run deploy`

## 为什么不用 Cloudflare 自带的批量重定向？

Cloudflare Bulk Redirects 存在以下限制：
1. **国内网络兼容性问题**：某些国内网络环境下可能无法正常工作
2. **无法跨域名配置**：每个域名需要单独配置
3. **配置繁琐**：维护成本高

Worker 方案优势：
- ✅ 跨域名统一管理
- ✅ 更好的国内网络兼容性
- ✅ 规则集中维护（JSON/CSV）
- ✅ 版本控制友好

## 实施步骤

当用户请求配置重定向时：

1. **询问重定向规则**：
   - 来源域名列表
   - 目标 URL 列表
   - 重定向类型（301/302）

2. **检查 Token 配置**：
   - 询问是否已配置 CLOUDFLARE_API_TOKEN
   - 如未配置，提供详细步骤

3. **更新配置文件**：
   - 更新 `data/redirects.json`
   - 更新 `wrangler.jsonc` 的 routes

4. **执行部署**：
   - 先运行 `dns:sync:dry-run` 预览
   - 确认后执行 `dns:sync && deploy`

5. **验证结果**：
   - 提供测试命令：`curl -I https://域名`
   - 检查返回的 Location 头
