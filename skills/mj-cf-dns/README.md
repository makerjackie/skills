# mj-cf-dns

Cloudflare DNS 和自定义域名维护 skill。它用于新增、更新、删除、验证 DNS 记录，也可以处理 Cloudflare Pages 自定义域名和 Workers custom domain 绑定。

## 安装

```bash
npx skills add makerjackie/skills --skill mj-cf-dns
```

## 快速使用

```text
Use $mj-cf-dns to bind app.example.com to my Cloudflare Pages project and verify the DNS record.
```

```text
Use $mj-cf-dns to add this TXT verification record, inspect existing records first, then apply it.
```

## 前提条件

- Cloudflare 账号
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- Token 至少包含当前任务需要的 Zone、DNS、Pages 或 Workers 权限

## 工作流

1. 识别任务类型，普通 DNS、Pages 自定义域名或 Workers custom domain。
2. 先列出现有记录，不直接覆盖。
3. 默认给 dry-run 计划。
4. 用户明确要求执行时才写入。
5. 写入后用 Cloudflare API 和 DNS 查询验证。

---

## 为什么需要这个 skill？

DNS 出错通常不是代码问题，而是记录冲突、代理状态、TTL、域名托管位置和平台绑定方式混在一起。`mj-cf-dns` 把这些步骤固定下来，先查清楚，再做最小改动，最后验证结果。
