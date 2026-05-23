# 我做了一个 AI Skill，让域名重定向变得超简单

## 问题背景

作为开发者，你是否遇到过这样的场景：

- 需要把 `docs.example.com` 重定向到飞书文档
- 需要把 `feedback.example.com` 重定向到问卷表单
- 需要把 `join.example.com` 重定向到招募页面

如果你用的是 Cloudflare，可能会想到用它自带的 **Bulk Redirects** 功能。但实际使用后会发现：

1. **国内网络兼容性差**：某些网络环境下重定向失效
2. **无法跨域名管理**：每个域名要单独配置，维护成本高
3. **配置繁琐**：需要在控制台一个个添加规则

## 解决方案

我创建了一个基于 **Cloudflare Workers** 的域名重定向工具，并把它做成了一个 **AI Skill**。

### 什么是 AI Skill？

AI Skill 是一种让 AI 助手（如 Claude、Kiro）具备特定能力的插件。安装后，AI 就能帮你自动完成复杂的配置和部署流程。

### 核心优势

✅ **跨域名统一管理**：一个 Worker 处理所有域名的重定向  
✅ **国内网络兼容性好**：基于 Worker，稳定可靠  
✅ **JSON 配置**：版本控制友好，易于维护  
✅ **AI 自动化**：一句话完成配置和部署  

## 使用体验

### 传统方式 vs AI Skill

**传统方式**（需要 30+ 分钟）：
1. 登录 Cloudflare 控制台
2. 创建 API Token，配置权限
3. 编写 Worker 代码
4. 配置路由规则
5. 手动创建 DNS 记录
6. 部署 Worker
7. 测试验证

**使用 AI Skill**（只需 2 分钟）：
```bash
# 1. 安装 Skill
npx skills add 01mvp/cloudflare-redirector

# 2. 初始化项目
mkdir my-redirects && cd my-redirects
cp -r ~/.agents/skills/cloudflare-redirects/* .

# 3. 对 AI 说
/cloudflare-redirects

# 4. 告诉 AI 你的需求
我想把 docs.example.com 重定向到 https://example.com/docs
```

AI 会自动帮你：
- 引导配置 API Token
- 生成重定向规则
- 配置 Worker 路由
- 同步 DNS 记录
- 部署到 Cloudflare

## 技术实现

### 架构设计

```
用户请求 → Cloudflare DNS (CNAME) → Worker → 重定向到目标 URL
```

### 核心代码

Worker 代码非常简洁（不到 40 行）：

```typescript
import compiledRules from "../data/redirects.compiled.json";

const ruleMap = new Map();
for (const item of compiledRules) {
  ruleMap.set(item.source.toLowerCase(), item);
}

export default {
  async fetch(request: Request): Promise<Response> {
    const host = new URL(request.url).hostname.toLowerCase();
    const rule = ruleMap.get(host);
    
    if (!rule) {
      return new Response("No redirect rule", { status: 404 });
    }
    
    return Response.redirect(rule.destination, rule.status);
  },
};
```

### 配置文件

重定向规则用 JSON 管理：

```json
[
  {
    "source": "docs.example.com",
    "destination": "https://example.com/docs",
    "status": 301
  }
]
```

## 实际案例

我用这个工具管理了 HackathonWeekly 的 10 个子域名重定向：

- `logo.hackathonweekly.com` → 品牌资源
- `docs.hackathonweekly.com` → 文档中心
- `feedback.hackathonweekly.com` → 反馈表单
- `hwdocs.01mvp.com` → 文档中心
- ...

配置和部署只用了 **不到 5 分钟**。

## 快速开始

### 1. 安装 Skill

```bash
npx skills add 01mvp/cloudflare-redirector
```

### 2. 初始化项目

```bash
mkdir my-redirects && cd my-redirects
cp -r ~/.agents/skills/cloudflare-redirects/* .
```

### 3. 配置环境变量

```bash
export CLOUDFLARE_API_TOKEN='你的token'
export CLOUDFLARE_ACCOUNT_ID='你的account_id'
```

### 4. 使用 AI 配置

在 AI 对话中输入：

```
/cloudflare-redirects
```

然后告诉 AI 你的需求，比如：

```
我想添加以下重定向：
- docs.example.com → https://example.com/docs
- blog.example.com → https://blog.example.com
```

AI 会自动帮你完成所有配置和部署。

## 为什么选择 Worker 而不是 Bulk Redirects？

| 特性 | Cloudflare Bulk Redirects | Worker 方案 |
|------|---------------------------|-------------|
| 国内网络兼容性 | ❌ 不稳定 | ✅ 稳定 |
| 跨域名管理 | ❌ 每个域名单独配置 | ✅ 统一管理 |
| 配置方式 | ❌ 控制台手动操作 | ✅ JSON 文件 + Git |
| 版本控制 | ❌ 不支持 | ✅ 支持 |
| AI 自动化 | ❌ 不支持 | ✅ 支持 |
| 性能 | ⚡ 快 | ⚡ 快 |
| 成本 | 💰 需要付费计划 | 💰 免费额度充足 |

## 技术栈

- **Cloudflare Workers**：边缘计算平台
- **Wrangler**：Worker 开发工具
- **Node.js**：脚本运行环境
- **AI Skill**：自动化配置

## 开源地址

GitHub: https://github.com/01mvp/cloudflare-redirector

欢迎 Star ⭐ 和贡献代码！

## 总结

通过将 Cloudflare Workers 和 AI Skill 结合，我们把原本需要 30 分钟的配置流程压缩到了 2 分钟。

这个工具特别适合：
- 需要管理多个子域名重定向的团队
- 希望用代码管理基础设施的开发者
- 想要提高工作效率的运维人员

如果你也有类似的需求，不妨试试这个工具。有任何问题或建议，欢迎在 GitHub 提 Issue！

---

**作者**：Jackie Xiao  
**GitHub**：https://github.com/jackiexiao  
**项目地址**：https://github.com/01mvp/cloudflare-redirector
