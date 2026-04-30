# Quick Deploy

一键部署工作流。说一句"部署"，自动完成 commit → push → 检查 → 部署全流程。

## 安装

```bash
npx skills add makerjackie/skills --skill quick-deploy
```

## 使用方法

在 Claude Code 中对当前仓库说：

- "**部署**"
- "**发布**"
- "**ship**"

AI 会自动：

1. 分析变更 → 生成 Conventional Commit → 提交
2. Push 到远程
3. 检测项目类型 & 环境变量（Token、自定义域名等）
4. 运行 lint/build/typecheck → 有错误自动修复
5. 部署到对应平台（如果有配置）
6. 报告结果（含自定义域名提示、Token 配置引导等）

## 支持的项目类型

| 项目类型 | 检测方式 | 部署方式 |
|---------|---------|---------|
| Node.js (npm/pnpm/yarn) | package.json | 运行 build 脚本 + 根据平台部署 |
| Cloudflare Workers **(默认)** | wrangler.toml / wrangler.jsonc | `wrangler deploy` |
| Cloudflare Workers + 自定义域名 | wrangler routes | `wrangler deploy` + 域名检测提示 |
| Cloudflare Pages | 已连接 GitHub 仓库 | Push 触发自动部署 |
| Vercel | vercel.json | 部署 + 验证是否成功 |
| GitHub Actions | .github/workflows/ | Push 触发工作流 |
| 静态站点 | index.html | 建议配置 Workers 或 Pages |

## 智能检测

- **Cloudflare Token**: 如果 `CLOUDFLARE_API_TOKEN` 未设置，引导用户获取并配置
- **自定义域名**: Workers 部署后如果只有 workers.dev 域名，提示绑定自定义域名
- **Vercel 验证**: Vercel 部署后自动检查是否成功，失败则报告错误
- **Token 配置参考**: 详细步骤见 `references/cloudflare-deploy-guide.md`

## 前置条件

使用 Cloudflare Workers 部署需要：
- Cloudflare API Token（Dashboard → My Profile → API Tokens → Create Token）
- Cloudflare Account ID（Dashboard → 任意域名 Overview → 右侧栏）
- 设置环境变量：`export CLOUDFLARE_API_TOKEN=xxx` 和 `export CLOUDFLARE_ACCOUNT_ID=xxx`

详细指引可参考：https://makerjackie.com/blog/2026-04-24-cloudflare-deploy-guide

## 工作流

```
说"部署"
  ↓
检查 git 状态
  ↓
自动 commit（Conventional Commit）
  ↓
git push
  ↓
检测项目类型 + 环境变量 + 自定义域名
  ↓
检查 Cloudflare Token → 缺则引导配置
  ↓
运行 lint/build/typecheck
  ├─ 有错误 → 自动修复 → 重新检查
  └─ 全部通过 → 执行部署
       ├─ wrangler Workers → wrangler deploy → 检查自定义域名
       ├─ Vercel → 部署 → 验证是否成功
       ├─ 其他 CI/CD → Push 已触发自动部署
       └─ 无部署配置 → 给出配置建议
  ↓
输出报告（含域名/Token 建议）
```

---

## 为什么要做这个 skill？

### 痛点：重复的部署操作太烦了

每次写完代码，都要来一套组合拳：

- `git add .`
- `git commit -m "xxxx"`
- `git push`
- 等 CI 跑完
- 看有没有报错
- 再去 Cloudflare Dashboard 看部署状态

这一套操作本身不复杂，但每改一次就要来一遍，日积月累挺消磨人的。而且每次 commit 还要想消息怎么写，push 完了还要切出去看 CI 绿了没有。

### 解决方案：说一句话就够了

这个 skill 的逻辑很简单：

你说"**部署**"，它就把上面那一串全干了。而且不是死板地执行固定命令，它会看当前仓库是什么类型，然后决定做什么：

- 有 wrangler 配置 → 默认走 **Cloudflare Workers** 部署，完了还看有没有绑自定义域名，没有就提醒你
- 有 Vercel 配置 → 部署完帮你验证是不是真的成功了
- 纯 Git 仓库（比如笔记、配置文件） → 只做 commit + push，不强行加部署

它还帮你检查环境变量。如果 `CLOUDFLARE_API_TOKEN` 没设置，直接引导你去获取，不用自己查文档。

最爽的是 commit 消息不用你想了。它看改了什么文件，自动生成 Conventional Commit 的消息，`feat:`、`fix:`、`chore:` 选得比我还准。

### 关于部署方式的选择

你可能在想：是配 CI/CD 全自动部署好，还是每次本地手动触发好？

我的建议是混着用：

**Cloudflare Workers → 本地 wrangler deploy（默认推荐）**
Workers 部署很快（几秒），本地跑 `wrangler deploy` 比等 CI 快多了。这个 skill 会帮你自动检测 wrangler 配置然后执行。部署完后检查你有没有绑定自定义域名，如果没有主动提醒。

**前端项目 → GitHub + Cloudflare Workers 部署**
虽然可以用 Pages 自动部署，但 Workers 更灵活（可以跑逻辑、中间件、带 KV），而且部署速度更快。这个 skill 默认优先走 Workers。

**Vercel 项目 → 自动部署 + 验证**
Vercel 的 GitHub 集成是自动的，push 就触发。但这个 skill 会帮你验证部署是否真的成功了，不用再切到 Dashboard 去看。

**Git 仓库没有部署目标 → 只做 commit + push**
它不会强行部署不是网站的项目。但如果检测到有前端代码但没有配置部署，会提醒你配置 Workers 或 Pages。

**关于 Cloudflare Token：**
很多人第一次用 wrangler 都卡在这一步。这个 skill 检测到没有配置 Token 会直接引导你怎么获取，参考文档放在了 `references/cloudflare-deploy-guide.md`，不用自己去搜。

一句话：**省掉那些不用动脑子的重复操作**，把注意力留在真正需要你想的事情上。
