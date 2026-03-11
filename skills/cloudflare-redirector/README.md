# cloudflare-redirector

使用 Cloudflare Workers 实现短域名服务和批量域名重定向。

## 快速安装

```bash
npx skills add 01mvp/skills --skill cloudflare-redirector
```

## 前提条件

- Cloudflare 账号（[免费注册](https://dash.cloudflare.com/sign-up)）
- 在 Cloudflare 购买或托管的域名
- Cloudflare API Token（在 skill 指引下配置）

## 典型使用案例

```bash
/cloudflare-redirector 帮我设置 docs.hackathonweekly.com 重定向到 https://hackathonweekly.feishu.cn/wiki/WQ7EwFC7BijePAkMkAHcajkNnae
```

详细技术文档请查看 [SKILL.md](SKILL.md)

---

## 为什么需要短域名？

### 痛点：长链接太难记

你是否遇到过这样的场景：

**分享文档链接时**
```
https://hackathonweekly.feishu.cn/wiki/WQ7EwFC7BijePAkMkAHcajkNnae
```
这样的链接又长又难记，分享时还容易被截断。

**想要的效果**
```
docs.hackathonweekly.com
```
简短、好记、专业。

### 真实案例：飞书文档短链接

假设你有一个飞书文档，原始链接是：
```
https://hackathonweekly.feishu.cn/wiki/WQ7EwFC7BijePAkMkAHcajkNnae
```

通过这个 Skill，你可以将它变成：
```
docs.hackathonweekly.com
```

访问短域名时，自动跳转到飞书文档。简单、优雅、专业。

### 为什么选择 Cloudflare Workers？

**💸 传统方案的问题**
- 域名注册商的重定向服务：免费额度少（通常 2-5 个），更多需要付费
- 第三方短链服务：有数量限制，且域名不是你自己的
- 自建服务器：需要购买服务器，还要自己维护

**✅ Cloudflare Workers 的优势**
- 完全免费（每天 10 万次请求额度）
- 无需服务器，零运维
- 全球 CDN 加速，访问速度快
- 配置简单，AI 自动完成所有设置

### 前提条件

- 注册 Cloudflare 账号（免费）
- 在 Cloudflare 购买或托管一个域名（如 `hackathonweekly.com`）

### 如何使用？

**第 1 步：准备工作**
- 注册 Cloudflare 账号（免费）
- 在 Cloudflare 购买或托管一个域名（如 `hackathonweekly.com`）

**第 2 步：安装 Skill**
```bash
npx skills add 01mvp/skills --skill cloudflare-redirector
```

**第 3 步：跟 AI 说明你的“短域名” / “重定向需求”**

```bash
/cloudflare-redirector 帮我设置 docs.hackathonweekly.com 重定向到 https://hackathonweekly.feishu.cn/wiki/WQ7EwFC7BijePAkMkAHcajkNnae
```
以 claude code 调用我们的 skill 为例（当然你也可以不用直接斜杠 skill ，直接说帮我配置短域名就好）
![](https://res.cloudinary.com/de9jqdltf/image/upload/v1773245643/aiw787owmkveaog8qcpm.png)

在 Skill 的指引下，到 [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens) 创建 Token：
- 选择 "Edit Cloudflare Workers" 模板
- 添加 "Zone.DNS Edit" 权限

**第 4 步：完成配置!**

成功截图：
![](https://res.cloudinary.com/de9jqdltf/image/upload/v1773245658/crf4ninykr3m3kxidiwp.png)


AI 会自动帮你：
- 创建 DNS 记录
- 生成 Worker 代码
- 部署到 Cloudflare

完成后，访问 `docs.hackathonweekly.com` 就会自动跳转到飞书文档。

### 更多使用场景

- **短链系统**：`go.yourdomain.com/meeting` → 会议链接
- **品牌域名**：`brand.com` → 主站
- **多语言站点**：`en.site.com` → 英文站，`cn.site.com` → 中文站
- **域名迁移**：`old-domain.com` → `new-domain.com`

---

**详细技术文档和高级配置请查看 [SKILL.md](SKILL.md)**
