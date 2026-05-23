# Cloudflare Workers 域名重定向 Skill

一个 AI Skill，帮助你快速配置和部署 Cloudflare Workers 批量域名重定向。

## 快速开始

### 1. 安装 Skill

```bash
npx skills add 01mvp/cloudflare-redirector
```

### 2. 初始化项目

创建你的重定向项目：

```bash
mkdir my-redirects && cd my-redirects
cp -r ~/.agents/skills/cloudflare-redirects/* .
```

或者在现有项目中：

```bash
cp -r .agents/skills/cloudflare-redirects/* .
```

### 3. 配置环境变量

```bash
export CLOUDFLARE_API_TOKEN='你的token'
export CLOUDFLARE_ACCOUNT_ID='你的account_id'
```

获取 Token：https://dash.cloudflare.com/profile/api-tokens

需要权限：
- `Account - Workers Scripts:Edit`
- `Zone - Workers Routes:Edit`
- `Zone - DNS:Edit`
- `Zone - Zone:Read`

### 4. 配置重定向

编辑 `data/redirects.json`：

```json
[
  {
    "source": "docs.example.com",
    "destination": "https://example.com/docs",
    "status": 301
  }
]
```

编辑 `wrangler.jsonc`：

```jsonc
{
  "account_id": "YOUR_ACCOUNT_ID",
  "routes": [
    {
      "pattern": "docs.example.com/*",
      "zone_name": "example.com"
    }
  ]
}
```

### 5. 部署

```bash
pnpm run dns:sync && pnpm run deploy
```

### 6. 使用 AI 助手

在 AI 对话中输入：

```
/cloudflare-redirects
```

AI 会引导你完成配置和部署。

## 为什么需要这个工具？

Cloudflare Bulk Redirects 的问题：
- ❌ 国内网络兼容性差
- ❌ 无法跨域名管理
- ❌ 配置繁琐

Worker 方案优势：
- ✅ 跨域名统一管理
- ✅ 国内网络兼容性好
- ✅ JSON 配置，版本控制友好
- ✅ AI 自动化配置

## 文件结构

```
your-project/
├── src/index.ts                 # Worker 入口
├── data/redirects.json          # 重定向规则
├── scripts/
│   ├── compile-rules.mjs        # 规则编译
│   └── sync-dns.mjs             # DNS 同步
├── wrangler.jsonc               # Worker 配置
└── package.json
```

## 命令

```bash
pnpm run build:rules      # 编译规则
pnpm run dev              # 本地开发
pnpm run dns:sync         # 同步 DNS
pnpm run deploy           # 部署
```

## License

MIT
