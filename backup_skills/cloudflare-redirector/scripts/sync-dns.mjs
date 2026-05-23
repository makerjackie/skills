import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const wranglerPath = resolve(root, 'wrangler.jsonc');

function stripJsonComments(input) {
  return input
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split(/\r?\n/)
    .map((line) => line.replace(/(^|\s)\/\/.*$/, ''))
    .join('\n');
}

function parseConfig() {
  const raw = readFileSync(wranglerPath, 'utf-8');
  const json = JSON.parse(stripJsonComments(raw));
  return json;
}

function parseHostFromPattern(pattern) {
  const clean = String(pattern || '').trim();
  if (!clean) return '';
  return clean.replace(/\/\*$/, '').toLowerCase();
}

function assertToken() {
  const token = process.env.CLOUDFLARE_API_TOKEN;
  if (!token) {
    console.error('Missing CLOUDFLARE_API_TOKEN');
    process.exit(1);
  }
  return token;
}

async function cfFetch(path, init = {}) {
  const token = assertToken();
  const res = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    ...init,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(`Cloudflare API error on ${path}: ${JSON.stringify(data.errors || data, null, 2)}`);
  }

  return data.result;
}

async function getZoneId(zoneName) {
  const result = await cfFetch(`/zones?name=${encodeURIComponent(zoneName)}&status=active`);
  if (!Array.isArray(result) || result.length === 0) {
    throw new Error(`Zone not found or not active: ${zoneName}`);
  }
  return result[0].id;
}

async function upsertCnameRecord(zoneId, fullHost, targetHost, dryRun) {
  const existing = await cfFetch(`/zones/${zoneId}/dns_records?type=CNAME&name=${encodeURIComponent(fullHost)}`);

  const payload = {
    type: 'CNAME',
    name: fullHost,
    content: targetHost,
    proxied: true,
    ttl: 1,
    comment: 'managed-by: cf-bulk-redirector',
  };

  if (dryRun) {
    if (existing.length > 0) {
      console.log(`[dry-run] UPDATE CNAME ${fullHost} -> ${targetHost} (proxied)`);
    } else {
      console.log(`[dry-run] CREATE CNAME ${fullHost} -> ${targetHost} (proxied)`);
    }
    return;
  }

  if (existing.length > 0) {
    const id = existing[0].id;
    await cfFetch(`/zones/${zoneId}/dns_records/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    console.log(`Updated CNAME ${fullHost} -> ${targetHost}`);
    return;
  }

  await cfFetch(`/zones/${zoneId}/dns_records`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  console.log(`Created CNAME ${fullHost} -> ${targetHost}`);
}

async function main() {
  const config = parseConfig();
  const routes = Array.isArray(config.routes) ? config.routes : [];
  const dryRun = process.argv.includes('--dry-run');

  if (routes.length === 0) {
    console.log('No routes configured in wrangler.jsonc');
    return;
  }

  const zoneIdCache = new Map();

  for (const route of routes) {
    const zoneName = String(route?.zone_name || '').trim().toLowerCase();
    const host = parseHostFromPattern(route?.pattern);

    if (!zoneName || !host) {
      console.log(`Skip invalid route: ${JSON.stringify(route)}`);
      continue;
    }

    if (!host.endsWith(`.${zoneName}`) && host !== zoneName) {
      console.log(`Skip route (host not in zone): ${host} not under ${zoneName}`);
      continue;
    }

    let zoneId = zoneIdCache.get(zoneName);
    if (!zoneId) {
      zoneId = await getZoneId(zoneName);
      zoneIdCache.set(zoneName, zoneId);
    }

    const targetHost = process.env.DNS_TARGET_HOST || zoneName;
    await upsertCnameRecord(zoneId, host, targetHost, dryRun);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
