---
name: quick-deploy
description: 一键部署工作流。用户说"部署"时自动完成 commit → push → lint/build 检查 → 修复错误 → 部署。自动检测项目类型（静态站点、Node.js、Cloudflare Workers/Pages、Vercel 等）。触发词：部署、发布、发版、ship、deploy、提交发布、推送。
---

# Quick Deploy

## AI Agent Instructions

### 触发词

当用户说"部署"、"发布"、"发版"、"ship"、"deploy"、"提交发布"、"推送" 或类似意思时，执行此自动化工作流。

### 自动化执行原则

除非用户明确要求分步执行或询问"有什么更改"，否则应一次性自动完成所有操作。

### 工作流

#### Step 0: 检查 git 状态

```bash
git status
git remote -v
```

- 如果没有未提交的更改，进入 Step 2（检查远程 + push）
- 如果有未提交的更改，执行 Step 1
- **重要**：如果 `git remote -v` 为空（没有配置远程仓库），提示用户配置远程仓库并退出

#### Step 1: 自动 commit

分析变更内容，生成 Conventional Commit 消息：

1. 先看 `git diff --staged` 和 `git diff` 的变更
2. 按以下规则选择类型前缀：
   - `feat:` — 新功能（新增文件、新增组件、新增 API）
   - `fix:` — 修复 bug
   - `docs:` — 仅文档变更
   - `refactor:` — 重构（不改变功能）
   - `perf:` — 性能优化
   - `test:` — 添加测试
   - `chore:` — 杂务（构建流程、依赖更新等）
   - `style:` — 代码格式（不是 CSS 样式）
3. 如果变更集中在特定模块，加上 scope：`feat(api):`、`fix(auth):`
4. 描述用简洁的中文或英文（跟用户的语言保持一致）

```bash
git add -A
git commit -m "<type>(<scope>): <description>"
```

#### Step 2: Push 到远程

```bash
git push
```

如果 push 失败（冲突、权限等），报告错误并停止。

#### Step 3: 检测项目类型与环境变量

运行以下检测来确定项目类型、可用的构建/部署方式、以及环境变量状态：

```bash
# 1. 检查 package.json
ls package.json 2>/dev/null && echo "HAS_PACKAGE=true" || echo "HAS_PACKAGE=false"

# 2. 检查 wrangler 配置
ls wrangler.toml 2>/dev/null && echo "HAS_WRANGLER=true" || echo "HAS_WRANGLER=false"
ls wrangler.jsonc 2>/dev/null && echo "HAS_WRANGLER_JSONC=true" || echo "HAS_WRANGLER_JSONC=false"

# 3. 检查 vercel 配置
ls vercel.json 2>/dev/null && echo "HAS_VERCEL=true" || echo "HAS_VERCEL=false"

# 4. 检查 CI/CD 配置
ls .github/workflows 2>/dev/null && echo "HAS_GITHUB_ACTIONS=true" || echo "HAS_GITHUB_ACTIONS=false"

# 5. 检查静态站点特征
ls index.html 2>/dev/null && echo "HAS_INDEX_HTML=true" || echo "HAS_INDEX_HTML=false"

# 6. 读取 package.json scripts
node -e "
const p = require('./package.json');
const scripts = Object.keys(p.scripts || {});
console.log('SCRIPTS:', scripts.join(', '));
console.log('HAS_LINT:', scripts.some(s => /^lint/.test(s)));
console.log('HAS_BUILD:', scripts.some(s => /^build/.test(s)));
console.log('HAS_TYPE_CHECK:', scripts.some(s => /^type(check|script)/.test(s)));
console.log('HAS_DEPLOY:', scripts.some(s => /^deploy/.test(s)));
console.log('HAS_PREVIEW:', scripts.some(s => /^preview/.test(s)));
" 2>/dev/null || echo "SCRIPTS: none"

# 7. 检查 Cloudflare 环境变量
echo "CF_TOKEN_EXISTS: ${CLOUDFLARE_API_TOKEN:+yes}"
echo "CF_ACCOUNT_ID_EXISTS: ${CLOUDFLARE_ACCOUNT_ID:+yes}"

# 8. 检查环境变量文件（区分生产/开发环境）
for f in .env.prd .env.production .env .env.local; do
  [ -f "$f" ] && echo "HAS_ENV_$(echo $f | tr '[:lower:].' '[:upper:]_'): true" || echo "HAS_ENV_$(echo $f | tr '[:lower:].' '[:upper:]_'): false"
done

# 9. 检查 wrangler 配置中的自定义域名（如果有 wrangler 配置）
if [ -f wrangler.jsonc ]; then
  node -e "
  const cfg = JSON.parse(require('fs').readFileSync('wrangler.jsonc','utf-8'));
  const routes = cfg.routes || [];
  const customDomains = routes
    .map(r => r.pattern || r)
    .filter(p => p && !p.includes('workers.dev') && !p.includes('*.'));
  console.log('WRANGLER_ROUTES:', routes.length);
  console.log('WRANGLER_CUSTOM_DOMAINS:', customDomains.length > 0 ? customDomains.join(', ') : 'none');
  console.log('WRANGLER_HAS_CUSTOM_DOMAIN:', customDomains.length > 0 ? 'yes' : 'no');
  " 2>/dev/null
elif [ -f wrangler.toml ]; then
  # TOML 解析较复杂，用 grep 简单判断
  grep -q 'pattern' wrangler.toml 2>/dev/null && echo "WRANGLER_HAS_ROUTES=true" || echo "WRANGLER_HAS_ROUTES=false"
  grep -q 'workers.dev' wrangler.toml 2>/dev/null && echo "WRANGLER_ONLY_WORKERS_DEV=true" || echo "WRANGLER_ONLY_WORKERS_DEV=false"
fi
```

**环境变量文件使用规则（重要）：**
- `.env.prd` 或 `.env.production` — **生产环境变量**，部署前应加载此文件
- `.env` — 通用变量，安全时可用
- `.env.local` — **本地开发环境**，部署时**不要**加载此文件（可能包含本地专用配置）
- 部署前按照优先级加载：`.env.prd` > `.env.production` > `.env`（`.env.local` 跳过）

**环境变量检查逻辑：**
- 如果检测到 wrangler 配置 且 `CLOUDFLARE_API_TOKEN` 未设置：
  - 先检查是否存在 `.env.prd` 或 `.env.production`，如果存在则从中加载（`set -a; source .env.prd; set +a`）
  - 如果加载后仍有缺失，暂停工作流，提示用户需要配置 Cloudflare Token
  - 参考 `references/cloudflare-deploy-guide.md` 中的步骤引导用户获取和配置 Token
  - 用户配置完成后继续

**自定义域名检测逻辑：**
- 如果检测到 wrangler 配置 且是 Workers 部署：
  - 检查 routes 中是否配置了自定义域名（非 `workers.dev` 域名）
  - 如果没有自定义域名，在部署完成后提示用户绑定自定义域名

#### Step 4: 运行检查

根据检测结果运行对应的检查命令：

**有 package.json 的项目：**
- 如果有 lint 脚本 → `npm run lint`（如果报错则运行 `npm run lint -- --fix` 再检查）
- 如果有 typecheck 脚本 → `npm run typecheck`
- 如果有 build 脚本 → `npm run build`
- 注意：优先使用 `pnpm`（如果项目有 pnpm-lock.yaml）或 `yarn`（如果项目有 yarn.lock）

**有 wrangler 配置的 Worker 项目：**
- 如果有 build 脚本 → 先 build
- `npx wrangler deploy --dry-run`（验证配置）

**修复循环策略：**
1. 如果 lint 有可自动修复的错误 → 运行 `--fix` 后重新 lint
2. 如果 lint 有不可自动修复的错误 → 报告错误列表，询问用户是否继续
3. 如果 build 失败 → 分析错误信息，尝试修复后重新 build（最多重试 2 次）
4. 如果 2 次重试后仍然失败 → 报告错误并停止

#### Step 5: 自动部署

**环境变量加载（部署前）：**
在执行任何部署命令之前，按照以下优先级加载环境变量文件：
- 首先尝试加载 `.env.prd`（生产环境专用）
- 如果不存在则尝试 `.env.production`
- 如果不存在则尝试 `.env`
- **跳过 `.env.local`**（本地开发环境，不要用于部署）
- 加载方式：`set -a; source <file>; set +a`
- 加载后重新检查 `CLOUDFLARE_API_TOKEN` 等关键变量是否就绪

根据检测到的部署目标和项目类型执行部署（或告知自动部署状态）：

| 检测到的配置 | 操作 |
|-------------|------|
| **wrangler.toml / wrangler.jsonc** (优先 Workers) | 执行 `npx wrangler deploy` 或 `npm run deploy`（如果有 deploy 脚本） |
| 有 deploy 脚本但无 wrangler | 执行 `npm run deploy` |
| Vercel (vercel.json) | 执行部署后，**必须验证部署是否成功**（见下方 Vercel 验证部分） |
| GitHub Actions | 告知用户 "Push 已触发 GitHub Actions 工作流" |
| 仅 Cloudflare Pages (无 wrangler) | 告知用户 "Push 已触发 Cloudflare Pages 自动部署" |
| 以上都没有 | 不执行部署，只完成 commit + push |

**重要**：
- **默认使用 Cloudflare Workers**，不要推荐 Pages。只有检测到 Pages 配置且没有 wrangler 时才提示 Pages。
- 如果检测到多个部署方式，优先使用本地的（wrangler deploy > deploy 脚本 > CI/CD 自动部署提示）。

**Workers 部署后 - 自定义域名检查：**
部署完成后，检查 wrangler 配置中是否包含自定义域名：

- 如果 wrangler 的 routes 中没有自定义域名（只有 `*.workers.dev` 或无 routes）：
  > 检测到你的 Worker 目前只有 workers.dev 域名。
  > 是否要绑定自定义域名？
  > 
  > 操作方式：
  > 1. 在 wrangler.jsonc 的 routes 中添加：`{ "pattern": "你的域名.com/*", "zone_name": "你的域名.com" }`
  > 2. 然后重新部署
  > 
  > 或者通过 Cloudflare Dashboard：
  > 1. Workers & Pages → 选择该 Worker
  > 2. Triggers → Custom Domains → Add Custom Domain
  >
  > 需要先确保域名已在 Cloudflare 上托管。

**Vercel 部署验证流程：**
Vercel 部署后，必须验证是否成功：

```bash
# 查看 Vercel 部署状态（需要已安装 Vercel CLI 或登录）
npx vercel list 2>/dev/null | head -5

# 或者 curl 项目域名检查是否返回 200
# 从 vercel.json 中提取项目名，构造 URL
node -e "
const fs = require('fs');
let cfg;
try { cfg = JSON.parse(fs.readFileSync('vercel.json','utf-8')); } catch(e) {}
const name = cfg?.name || require('./package.json').name || '';
console.log('VERCEL_PROJECT:', name);
" 2>/dev/null

# 如果部署失败（构建错误、路由不对等），报告错误给用户并停止
```

如果 Vercel 部署失败，分析错误信息并尝试修复，最多重试 1 次。

#### Step 6: 报告结果

输出格式：

```
📦 Quick Deploy 完成

✅ Commit:      <commit-hash> — <commit-message>
✅ Push:        <branch> → <remote>/<branch>
✅ Lint:        <passed/failed summary>
✅ Build:       <passed/failed summary>
✅ Deploy:      <url or status>
   🌐 自定义域名: <已配置 / 未配置 — 建议绑定>

💡 建议：<如果有建议，在此显示>
```

**如果检测到 wrangler Workers 部署但没有自定义域名：**
  > 🌐 **自定义域名提示：**
  > 你的 Worker 目前只部署在 workers.dev 子域名上。
  > 建议绑定自定义域名，让用户通过你自己的域名访问：
  > 1. 在 wrangler.jsonc 的 routes 中添加自定义域名，或
  > 2. Cloudflare Dashboard → Worker → Triggers → Custom Domains
  > 3. 需要域名已在 Cloudflare 托管

**如果 `CLOUDFLARE_API_TOKEN` 未设置：**
  > 🔑 **Cloudflare Token 未配置**
  > 部署前需要设置 Cloudflare API Token。
  > 参考 `references/cloudflare-deploy-guide.md` 的详细步骤，或按以下方式快速设置：
  >
  > ```bash
  > export CLOUDFLARE_API_TOKEN=你的token
  > export CLOUDFLARE_ACCOUNT_ID=你的account_id
  > ```
  >
  > 永久配置（添加到 ~/.zshrc）：
  > ```bash
  > echo 'export CLOUDFLARE_API_TOKEN=你的token' >> ~/.zshrc
  > echo 'export CLOUDFLARE_ACCOUNT_ID=你的account_id' >> ~/.zshrc
  > source ~/.zshrc
  > ```
  >
  > 如何获取 Token：
  > 1. 登录 Cloudflare Dashboard → My Profile → API Tokens
  > 2. 创建 Token → 选择 "Edit Cloudflare Workers" 模板
  > 3. 复制保存 Token（关闭页面后不可见）
  >
  > 详细指引可访问：https://makerjackie.com/blog/2026-04-24-cloudflare-deploy-guide

**如果项目没有部署配置**，根据项目类型给出建议：

- **前端静态/SPA 项目**:
  > 检测到这是一个前端项目，但没有配置自动部署。
  > 推荐使用 Cloudflare Workers 部署静态站点（比 Pages 更灵活）：
  > 1. 创建 `wrangler.toml` 配置
  > 2. 安装 `wrangler` 并登录
  > 3. 配置构建和部署脚本
  >
  > 或者连接 GitHub 仓库到 Cloudflare Pages。
  > 参考：https://makerjackie.com/blog/2026-04-24-cloudflare-deploy-guide

- **Cloudflare Workers 项目**:
  > 检测到 wrangler 配置。已执行本地部署（wrangler deploy）。
  > 🌐 建议配置自定义域名（参考 Step 5 的自定义域名检查部分）。
  > 建议配置 GitHub Actions 实现 CI/CD。
  > 参考模板：https://github.com/cloudflare/wrangler-action

- **Vercel 项目**:
  > 检测到 Vercel 配置。
  > Vercel 部署状态：<成功/失败>
  > 可在 Vercel Dashboard 查看详情。

- **不可部署的项目**（无构建脚本、无 wrangler、无 index.html）:
  > 这个仓库没有检测到可部署的目标（无 package.json、wrangler、或静态文件），
  > 已完成 commit + push。如果这不是预期的，可以手动配置部署方式。

### 注意事项

1. **commit 消息必须遵循 Conventional Commits 规范**
2. **如果 push 失败（冲突、权限问题），立即报告并停止，不要重试**
3. **如果 lint/build 错误无法自动修复，询问用户是否继续（不要强行部署）**
4. **如果 `git remote -v` 为空，提示用户配置远程仓库并退出工作流**
5. **不要修改不属于本次变更的文件（只 add 已变更的文件）**
6. **如果当前分支没有追踪远程分支，使用 `git push -u origin <branch>`**
7. **所有操作都应当有明确的输出，让用户知道当前进度**

### 语言回复规则

AI 必须使用用户对话的语言进行回复。如果用户用中文说"部署"，全部用中文回复。

## References

- `references/cloudflare-deploy-guide.md`: Cloudflare 凭证获取、Token 配置、wrangler 部署完整指南。当用户需要设置 Cloudflare 部署或配置 Token 时参考此文档。
