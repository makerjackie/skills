---
name: cloudflare-redirector
description: 使用 Cloudflare Workers 配置和部署批量域名重定向（含 DNS 同步与规则编译）。当用户要创建/修改多域名重定向、从 JSON 规则生成 Worker、同步 Cloudflare DNS、或执行 wrangler 部署时使用。
---

# Cloudflare Redirector

## AI Agent Instructions (AI 使用指南)

**每次使用此 skill 时，AI 必须执行以下检查：**

### 0. 自动化执行原则

**重要：除非用户明确要求分步执行，否则应该一次性自动完成所有操作。**

执行顺序：
1. 检查环境变量 → 如果缺失，引导配置后继续
2. 检查项目文件 → 如果不存在，初始化项目
3. 根据用户需求配置重定向规则
4. 执行 `pnpm run dns:sync`（同步 DNS）
5. 执行 `pnpm run deploy`（部署 Worker）
6. 执行 `curl -I` 验证重定向是否生效
7. 输出成功信息和后续管理说明

**只在以下情况暂停询问用户：**
- 环境变量未配置（必须先配置才能继续）
- 用户明确要求 dry-run 或预览模式
- 执行过程中出现错误

### 1. 环境变量检测

首先检查必需的环境变量是否已配置：

```bash
echo "CLOUDFLARE_API_TOKEN: ${CLOUDFLARE_API_TOKEN:+已配置}"
echo "CLOUDFLARE_ACCOUNT_ID: ${CLOUDFLARE_ACCOUNT_ID:+已配置}"
```

如果未配置，**必须先引导用户配置**，告诉用户：

```bash
# 临时配置（当前终端有效）
export CLOUDFLARE_API_TOKEN=your_token_here
export CLOUDFLARE_ACCOUNT_ID=your_account_id_here

# 永久配置（推荐）- 添加到 ~/.zshrc 或 ~/.bashrc
echo 'export CLOUDFLARE_API_TOKEN=your_token_here' >> ~/.zshrc
echo 'export CLOUDFLARE_ACCOUNT_ID=your_account_id_here' >> ~/.zshrc
source ~/.zshrc
```

并引导用户查看下方 "如何获取 Cloudflare 凭证" 部分。

### 2. 项目文件检测

检查是否存在必需文件：
- `data/redirects.json`
- `wrangler.jsonc`
- `package.json`

如果不存在，说明是**首次使用**，需要初始化项目。

### 3. 首次使用初始化流程

如果检测到空文件夹或缺少必需文件，执行以下步骤：

**Step 1: 询问项目名称**

询问用户想要创建的项目名称（默认：`my-redirector`）。

**Step 2: 创建项目文件夹**

```bash
mkdir my-redirector
cd my-redirector
```

**Step 3: 从 skill 目录复制模板文件**

找到 cloudflare-redirector skill 的安装路径（通常在 `~/.kiro/skills/` 或项目的 `.kiro/skills/` 下），然后复制必要文件：

```bash
# 假设 skill 路径为 $SKILL_PATH
cp -r $SKILL_PATH/data ./
cp -r $SKILL_PATH/scripts ./
cp -r $SKILL_PATH/src ./
cp $SKILL_PATH/package.json ./
cp $SKILL_PATH/wrangler.jsonc ./
cp $SKILL_PATH/.env.example ./.env.example
```

**Step 4: 安装依赖**

```bash
pnpm install
```

**Step 5: 引导用户配置**

提醒用户：
1. 配置环境变量（参考 .env.example）
2. 编辑 `data/redirects.json` 添加重定向规则
3. 编辑 `wrangler.jsonc` 配置路由

完成初始化后，用户就可以开始使用了。

## Prerequisites (前提条件)

**新手必读：使用此 skill 前，你需要：**

1. **Cloudflare 账号**：在 [cloudflare.com](https://cloudflare.com) 注册免费账号
2. **域名托管在 Cloudflare**：你的域名 DNS 需要使用 Cloudflare（在域名注册商处修改 Nameservers）
3. **本地环境**：
   - 已安装 Node.js (v18+)
   - 已安装 pnpm (`npm install -g pnpm`)
4. **Cloudflare 凭证**：
   - API Token（需要权限：Zone.DNS Edit + Workers Scripts Edit）
   - Account ID

### 如何获取 Cloudflare 凭证？

**获取 API Token：**
1. 登录 Cloudflare Dashboard
2. 进入 "My Profile" → "API Tokens"
3. 点击 "Create Token"
4. 选择 "Edit Cloudflare Workers" 模板，并添加 "Zone.DNS Edit" 权限
5. 复制生成的 Token

**获取 Account ID：**
1. 登录 Cloudflare Dashboard
2. 进入任意域名的 Overview 页面
3. 右侧栏可以看到 "Account ID"

## 初始化模板 (Initialization Templates)

### package.json 模板

```json
{
  "name": "cloudflare-redirector",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "build:rules": "node scripts/compile-rules.mjs",
    "dns:sync": "node scripts/sync-dns.mjs",
    "dns:sync:dry-run": "node scripts/sync-dns.mjs --dry-run",
    "deploy": "pnpm run build:rules && wrangler deploy",
    "deploy:dry-run": "pnpm run build:rules && wrangler deploy --dry-run"
  },
  "devDependencies": {
    "wrangler": "^3.0.0"
  }
}
```

### wrangler.jsonc 模板

```jsonc
{
  "name": "redirector",
  "main": "src/index.js",
  "compatibility_date": "2024-01-01",
  "routes": [
    // 示例：{ "pattern": "old.example.com/*", "zone_name": "example.com" }
  ]
}
```

### data/redirects.json 模板

```json
[
  {
    "source": "old.example.com",
    "destination": "https://new.example.com",
    "status": 301
  }
]
```

### src/index.js 模板

```javascript
import redirects from '../data/redirects.compiled.json';

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const hostname = url.hostname;

    const rule = redirects.find(r => r.source === hostname);
    if (rule) {
      return Response.redirect(rule.destination, rule.status);
    }

    return new Response('Not found', { status: 404 });
  }
};
```

### scripts/compile-rules.mjs 模板

```javascript
import { readFileSync, writeFileSync } from 'fs';

const rules = JSON.parse(readFileSync('data/redirects.json', 'utf-8'));
const compiled = rules.map(r => ({
  source: r.source,
  destination: r.destination,
  status: r.status || 301
}));

writeFileSync('data/redirects.compiled.json', JSON.stringify(compiled, null, 2));
console.log(`✓ Compiled ${compiled.length} redirect rules`);
```

### scripts/sync-dns.mjs 模板

```javascript
import { readFileSync } from 'fs';

const isDryRun = process.argv.includes('--dry-run');
const token = process.env.CLOUDFLARE_API_TOKEN;
const targetHost = process.env.DNS_TARGET_HOST;

if (!token) {
  console.error('❌ CLOUDFLARE_API_TOKEN not set');
  process.exit(1);
}

const config = JSON.parse(readFileSync('wrangler.jsonc', 'utf-8'));
const routes = config.routes || [];

console.log(isDryRun ? '🔍 Dry run mode' : '🚀 Syncing DNS records');
console.log(`Found ${routes.length} routes to process`);

// DNS sync logic here (simplified for template)
for (const route of routes) {
  const domain = route.pattern.replace('/*', '');
  const target = targetHost || route.zone_name;
  console.log(`${isDryRun ? '[DRY RUN]' : '✓'} ${domain} → ${target}`);
}
```

## Quick Workflow (快速上手)

### 第一次使用？跟着这个流程走：

**Step 1: 配置环境变量**

不要把敏感信息写进代码！在终端执行：

```bash
export CLOUDFLARE_API_TOKEN=your_token_here
export CLOUDFLARE_ACCOUNT_ID=your_account_id_here
export DNS_TARGET_HOST=yourdomain.com  # 可选，默认使用 zone_name
```

**Step 2: 编辑重定向规则**

编辑 `data/redirects.json`，添加你的重定向规则：

```json
[
  {
    "source": "old.example.com",
    "destination": "https://new.example.com",
    "status": 301
  }
]
```

**Step 3: 配置路由**

编辑 `wrangler.jsonc` 的 `routes` 字段，添加需要处理的域名：

```jsonc
{
  "routes": [
    { "pattern": "old.example.com/*", "zone_name": "example.com" }
  ]
}
```

**Step 4: 预览（推荐！）**

先用 dry-run 模式检查，不会真正执行：

```bash
pnpm run dns:sync:dry-run  # 查看会创建哪些 DNS 记录
pnpm run deploy:dry-run    # 查看部署配置
```

**Step 5: 正式部署**

确认无误后执行：

```bash
pnpm run dns:sync  # 同步 DNS 记录
pnpm run deploy    # 部署 Worker
```

**Step 6: 验证**

测试重定向是否生效：

```bash
curl -I https://old.example.com
```

应该看到 301/302 状态码和 `Location` 头指向目标地址。

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

## 后续管理 (Managing Redirects)

**重要：后续所有管理操作都应该通过此 skill 完成，AI 会自动处理。**

### 新增重定向

用户只需说："添加一个重定向，从 xxx.com 到 https://yyy.com"

AI 会自动：
1. 编辑 `data/redirects.json` 添加新规则
2. 编辑 `wrangler.jsonc` 添加路由
3. 执行 `pnpm run dns:sync` 同步 DNS
4. 执行 `pnpm run deploy` 部署
5. 验证新重定向是否生效

### 修改重定向

用户只需说："把 xxx.com 的重定向目标改成 https://zzz.com"

AI 会自动修改配置并重新部署。

### 删除重定向

用户只需说："删除 xxx.com 的重定向"

AI 会自动：
1. 从 `data/redirects.json` 删除规则
2. 从 `wrangler.jsonc` 删除路由
3. 重新部署
4. （可选）删除 DNS 记录

### 查看所有重定向

用户只需说："列出所有重定向规则"

AI 会读取 `data/redirects.json` 并展示。

### 批量操作

用户可以提供多个重定向规则，AI 会一次性处理完成。

## 语言回复规则 (Language Response Rule)

**AI 必须使用用户对话的语言进行回复。**

- 如果用户用中文提问，用中文回复
- 如果用户用英文提问，用英文回复
- 保持与用户相同的语言风格

## References

- `references/upstream-README.md`: 旧仓库使用说明
- `references/legacy-skill-notes.md`: 旧技能提示词与历史流程
- `references/wechat-article.md`: 背景介绍与实践案例
