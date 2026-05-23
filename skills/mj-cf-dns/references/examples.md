# Cloudflare DNS Examples

These examples are written as operational prompts an agent can follow.

## Bind `app.example.com` To A Pages Project

User request:

> 把 app.example.com 绑定到 my-site.pages.dev

Plan:

1. Confirm `my-site` is the Pages project name.
2. Add `app.example.com` to the Pages project domains.
3. Check the Cloudflare zone `example.com`.
4. Ensure the DNS record is `CNAME app.example.com -> my-site.pages.dev`.
5. Verify Pages domain status and `curl -I https://app.example.com`.

Commands:

```bash
node /path/to/mj-cf-dns/scripts/mj-cf-dns.mjs bind-pages-domain \
  --account "$CLOUDFLARE_ACCOUNT_ID" \
  --project my-site \
  --domain app.example.com \
  --zone example.com \
  --pages-target my-site.pages.dev
```

Add `--apply` only after the dry-run plan looks correct.

## Bind A Branch Alias To Pages

User request:

> 把 staging.example.com 指向 my-site 的 staging 分支

Plan:

1. Confirm the `staging` branch has a successful Pages deployment.
2. Add `staging.example.com` under the Pages project custom domains.
3. Use proxied DNS: `CNAME staging.example.com -> staging.my-site.pages.dev`.
4. Verify `https://staging.example.com`.

Command:

```bash
node /path/to/mj-cf-dns/scripts/mj-cf-dns.mjs bind-pages-domain \
  --account "$CLOUDFLARE_ACCOUNT_ID" \
  --project my-site \
  --domain staging.example.com \
  --zone example.com \
  --pages-target staging.my-site.pages.dev \
  --proxied true
```

## Bind A Worker Custom Domain

User request:

> 把 api.example.com 绑定到这个 Worker

Plan:

1. Inspect existing DNS for `api.example.com`.
2. Remove or resolve conflicting CNAME/A/AAAA records only after showing the user the conflict.
3. Add this to `wrangler.jsonc`:

```jsonc
{
  "routes": [
    { "pattern": "api.example.com", "custom_domain": true }
  ]
}
```

4. Run:

```bash
npx wrangler deploy
curl -I https://api.example.com
```

Do not create `CNAME api.example.com -> something.workers.dev` for this flow.

## Add Email Verification Records

User request:

> 按这个表加飞书/Google Workspace 的 TXT 和 MX

Plan:

1. Copy values exactly from the table.
2. List existing apex TXT and MX records.
3. Create missing records. Do not delete existing mail records unless the user explicitly says to replace them.
4. Verify:

```bash
dig example.com TXT +short
dig example.com MX +short
```

Example MX:

```bash
node /path/to/mj-cf-dns/scripts/mj-cf-dns.mjs upsert \
  --zone example.com \
  --name example.com \
  --type MX \
  --content mx1.examplemail.com \
  --priority 10 \
  --ttl 600
```

## Replace A CNAME Target

User request:

> 把 docs.example.com 从 old.pages.dev 改到 new.pages.dev

Plan:

1. List `docs.example.com` CNAME.
2. If it points to `old.pages.dev`, patch only `content`.
3. If a different unexpected target exists, report the conflict before applying.

Command:

```bash
node /path/to/mj-cf-dns/scripts/mj-cf-dns.mjs upsert \
  --zone example.com \
  --name docs.example.com \
  --type CNAME \
  --content new.pages.dev \
  --proxied true \
  --ttl 1
```

## Delete A Record

User request:

> 删除 test.example.com 的 TXT

Plan:

1. List `TXT test.example.com`.
2. If several TXT records exist, match `content` too or ask which one.
3. Delete only the matched record.
4. Verify it no longer appears in API list and DNS query.

Command:

```bash
node /path/to/mj-cf-dns/scripts/mj-cf-dns.mjs delete \
  --zone example.com \
  --name test.example.com \
  --type TXT \
  --content "verification-token"
```

Add `--apply` only when the matched record is correct.
