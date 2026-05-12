# Cloudflare DNS Runbook

Use this runbook after `SKILL.md` selects the correct workflow.

## Official Sources To Re-check

- DNS records API: https://developers.cloudflare.com/api/resources/dns/subresources/records/
- DNS record management guide: https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/
- Pages custom domains: https://developers.cloudflare.com/pages/configuration/custom-domains/
- Pages project domains API: https://developers.cloudflare.com/api/resources/pages/
- Workers Custom Domains: https://developers.cloudflare.com/workers/configuration/routing/custom-domains/
- API token permissions: https://developers.cloudflare.com/fundamentals/api/reference/permissions/

Cloudflare changes API details over time. Re-check these sources when writing new commands, explaining permissions, or debugging validation behavior.

## Environment Check

```bash
echo "CLOUDFLARE_API_TOKEN=${CLOUDFLARE_API_TOKEN:+set}"
echo "CLOUDFLARE_ACCOUNT_ID=${CLOUDFLARE_ACCOUNT_ID:+set}"
npx wrangler whoami
```

Never echo the token value.

## Zone Discovery

```bash
curl -sS "https://api.cloudflare.com/client/v4/zones?name=example.com&status=active" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json"
```

Use the returned `result[0].id` as `zone_id`. If no zone is returned:

- The domain may not be active on Cloudflare.
- The token may not have access to the zone.
- The domain may be a deeper subdomain delegated elsewhere.

For authoritative nameserver verification:

```bash
dig NS example.com +short
dig @jason.ns.cloudflare.com app.example.com CNAME +short
```

Use the actual nameservers returned by `dig NS`, not hardcoded examples.

## DNS Records API

Endpoints:

```text
GET    /zones/{zone_id}/dns_records
POST   /zones/{zone_id}/dns_records
PATCH  /zones/{zone_id}/dns_records/{dns_record_id}
PUT    /zones/{zone_id}/dns_records/{dns_record_id}
DELETE /zones/{zone_id}/dns_records/{dns_record_id}
```

List exact records before writing:

```bash
curl -sS "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records?type=CNAME&name=app.example.com" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json"
```

Create CNAME:

```bash
curl -sS -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "type": "CNAME",
    "name": "app.example.com",
    "content": "my-site.pages.dev",
    "ttl": 1,
    "proxied": true
  }'
```

Patch only changed fields:

```bash
curl -sS -X PATCH "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/$RECORD_ID" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"content":"new-target.example.com","proxied":true}'
```

Delete only after showing the matched record:

```bash
curl -sS -X DELETE "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/$RECORD_ID" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json"
```

## Record Rules That Matter

- CNAME records cannot coexist with A/AAAA records on the same name. Check conflicts before creating a CNAME.
- MX records need `priority`.
- TXT values must be preserved exactly, including provider verification strings.
- `ttl: 1` means automatic TTL in Cloudflare API usage.
- `proxied` applies to HTTP-capable records such as A, AAAA, and CNAME. MX and TXT must be DNS-only.
- For redirect-only or originless setups, a proxied placeholder `A 192.0.2.0` or `AAAA 100::` is useful when Cloudflare rules need a hostname to exist.

## Pages Custom Domains

Use when the target is a Cloudflare Pages project or `*.pages.dev`.

API endpoints:

```text
GET    /accounts/{account_id}/pages/projects/{project_name}/domains
GET    /accounts/{account_id}/pages/projects/{project_name}/domains/{domain_name}
POST   /accounts/{account_id}/pages/projects/{project_name}/domains
PATCH  /accounts/{account_id}/pages/projects/{project_name}/domains/{domain_name}
DELETE /accounts/{account_id}/pages/projects/{project_name}/domains/{domain_name}
```

Add a custom domain:

```bash
curl -sS -X POST "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/$PROJECT/domains" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"name":"app.example.com"}'
```

Then handle DNS:

- If the zone is managed in the same Cloudflare account, Cloudflare often creates the CNAME after confirmation. Check before creating one yourself.
- If the zone is external, instruct the user to create `CNAME app.example.com -> my-site.pages.dev` at the external DNS provider.
- For a branch alias, the DNS target is typically `<branch>.<project>.pages.dev`, and the DNS record should be proxied.

Check status:

```bash
curl -sS "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/$PROJECT/domains/app.example.com" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json"
```

Report `status`, `validation_data`, and `verification_data` when activation is pending.

## Workers Custom Domains

Use when a Worker should own a hostname directly.

Wrangler config:

```jsonc
{
  "routes": [
    {
      "pattern": "api.example.com",
      "custom_domain": true
    }
  ]
}
```

Deploy:

```bash
npx wrangler deploy
```

Important distinction:

- `custom_domain: true` is not the same as a normal DNS CNAME.
- Cloudflare creates the DNS record and certificate.
- A pre-existing CNAME on the same hostname can block the custom domain. Inspect and resolve conflicts first.
- A classic Worker route such as `example.com/*` is different from a Custom Domain. Routes usually need an existing proxied DNS record for traffic to enter Cloudflare.

## Verification

After write:

```bash
# API truth
node /path/to/cloudflare-dns/scripts/cloudflare-dns.mjs list \
  --zone example.com \
  --name app.example.com \
  --type CNAME

# Recursive DNS
dig app.example.com CNAME +short

# Authoritative DNS
dig NS example.com +short
dig @<authoritative-ns> app.example.com CNAME +short

# HTTP
curl -I https://app.example.com
```

For proxied records, `dig` may not return the raw origin target. Use the Cloudflare API as the record source of truth and `curl` as the user-facing check.

## Failure Handling

- `Authentication error`: token missing, expired, or missing product permissions.
- Empty zone list: wrong account, token scope too narrow, or domain not on Cloudflare.
- CNAME conflict: list all record types for the hostname before changing anything.
- Pages domain stuck pending: report validation data, check CNAME target, and retry validation with `PATCH`.
- Worker custom domain fails: inspect existing DNS conflicts, zone ownership, and whether the route pattern is exact hostname rather than `hostname/*`.
