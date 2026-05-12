---
name: cloudflare-dns
description: "Maintain Cloudflare DNS and domain bindings safely. Use when a user asks to add, update, delete, verify, or audit Cloudflare DNS records; point a domain or subdomain at a Cloudflare Pages `*.pages.dev` site; bind a custom domain to a Pages project; configure a Worker custom domain through Wrangler `custom_domain: true`; fix DNS conflicts; or verify Cloudflare nameserver propagation."
---

# Cloudflare DNS

## Overview

Use this skill to make Cloudflare DNS changes deliberately: identify the real product path, inspect existing records first, apply idempotent changes, and verify against Cloudflare or authoritative DNS instead of guessing.

## Hard Rules

- Do not overwrite or delete DNS records until you have listed the existing records for the exact hostname and type.
- Default to dry-run planning unless the user explicitly asks you to apply the change.
- Preserve user-provided record values literally: type, name, content, priority, TTL, proxied state, and comments.
- Treat Cloudflare Pages, Workers Custom Domains, Workers Routes, and ordinary DNS as different workflows.
- For production domains, verify after write with the Cloudflare API and DNS queries. Prefer authoritative nameservers when available.
- Never print full API tokens. Report only whether `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` are present.

## Choose The Path

1. If the user says "point this domain to `*.pages.dev`" or "bind a custom domain to Cloudflare Pages", use the Pages custom-domain workflow.
2. If the user says "bind this domain to a Worker" or the repo has `wrangler.jsonc` with `routes`, use the Workers Custom Domains workflow.
3. If the user gives a DNS table, MX/TXT verification values, A/AAAA/CNAME records, or says "change DNS", use the ordinary DNS workflow.
4. If the user only asks whether permissions or config are needed, answer directly and do not touch live DNS.

## Credentials

Check:

```bash
echo "CLOUDFLARE_API_TOKEN=${CLOUDFLARE_API_TOKEN:+set}"
echo "CLOUDFLARE_ACCOUNT_ID=${CLOUDFLARE_ACCOUNT_ID:+set}"
```

Minimum token permissions by task:

- DNS read/write: `Zone Read`, `DNS Read`, `DNS Write` scoped to the target zone.
- Pages custom domains: `Pages Read`, `Pages Write`, plus DNS permissions if you also need to create or repair records in a Cloudflare zone.
- Workers Custom Domains through Wrangler: Worker script/route permissions such as `Workers Scripts Write` and `Workers Routes Write`; DNS Write is not the main path for `custom_domain: true`, but existing DNS conflicts may still need DNS access to inspect or delete.

If credentials are missing, explain the exact missing variable and stop before live operations. You may still produce an offline dry-run plan.

## Ordinary DNS Workflow

Use for direct DNS record maintenance.

1. Resolve the zone from the hostname, usually the registrable domain such as `example.com`.
2. List current records for the exact `name` and `type`.
3. Decide create vs update vs no-op by comparing `content`, `ttl`, `proxied`, `priority`, and other relevant fields.
4. Apply only the minimal change.
5. Verify with Cloudflare API and `dig`.

Helper script examples:

```bash
# Offline dry-run CNAME upsert. No live write without --apply.
node /path/to/cloudflare-dns/scripts/cloudflare-dns.mjs upsert \
  --zone example.com \
  --name app.example.com \
  --type CNAME \
  --content my-site.pages.dev \
  --proxied true \
  --ttl 1

# Dry-run with live read of existing records.
node /path/to/cloudflare-dns/scripts/cloudflare-dns.mjs upsert ... --inspect

# Apply after checking the plan.
node /path/to/cloudflare-dns/scripts/cloudflare-dns.mjs upsert ... --apply

# Verify DNS.
node /path/to/cloudflare-dns/scripts/cloudflare-dns.mjs verify \
  --domain app.example.com \
  --type CNAME \
  --expected my-site.pages.dev
```

Read `references/cloudflare-dns-runbook.md` for API payloads and edge cases.

## Pages Custom Domain Workflow

Use when binding `www.example.com`, `app.example.com`, or `example.com` to a Cloudflare Pages project.

1. Confirm the Pages project name and account ID.
2. Add the domain to the Pages project through the Pages project domains API or dashboard.
3. For subdomains in a Cloudflare-managed zone, Cloudflare may add the CNAME after confirmation. If it does not, create or update a CNAME from the custom hostname to `<project>.pages.dev`.
4. For external DNS providers, provide the CNAME instruction to the user instead of editing Cloudflare.
5. For apex domains, make sure the apex zone is active on Cloudflare; do not blindly create a normal CNAME at the apex unless you have verified Cloudflare's CNAME flattening behavior and existing records.
6. Re-check the Pages domain status until it is `active` or report the pending validation details.

Dry-run example:

```bash
node /path/to/cloudflare-dns/scripts/cloudflare-dns.mjs bind-pages-domain \
  --account "$CLOUDFLARE_ACCOUNT_ID" \
  --project my-site \
  --domain app.example.com \
  --zone example.com \
  --pages-target my-site.pages.dev
```

Apply example:

```bash
node /path/to/cloudflare-dns/scripts/cloudflare-dns.mjs bind-pages-domain \
  --account "$CLOUDFLARE_ACCOUNT_ID" \
  --project my-site \
  --domain app.example.com \
  --zone example.com \
  --pages-target my-site.pages.dev \
  --apply
```

Read `references/examples.md` for common Pages scenarios.

## Workers Custom Domain Workflow

Use this for a Worker that should own a hostname such as `api.example.com`.

1. Check for existing CNAME/A/AAAA conflicts on the hostname.
2. Prefer Wrangler config:

```jsonc
{
  "routes": [
    { "pattern": "api.example.com", "custom_domain": true }
  ]
}
```

3. Run `npx wrangler deploy` from the Worker project.
4. Verify the domain under Workers & Pages > Worker > Settings > Domains & Routes and with `curl -I https://api.example.com`.

Do not create a CNAME to `workers.dev` for this workflow. Cloudflare creates the DNS record and certificate for a Worker Custom Domain.

## References

- `references/cloudflare-dns-runbook.md`: detailed API workflow, payloads, verification commands, and failure handling.
- `references/examples.md`: concrete examples for Pages, Workers, MX/TXT verification, redirects, and deletion.
- `scripts/cloudflare-dns.mjs`: small API helper for dry-run planning, DNS upsert/delete, Pages domain binding, and DNS verification.
