#!/usr/bin/env node

import { execFileSync } from 'node:child_process';

const API_BASE = 'https://api.cloudflare.com/client/v4';
const DNS_RECORD_TYPES_WITH_PROXY = new Set(['A', 'AAAA', 'CNAME']);

main().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exit(1);
});

async function main() {
  const [command, ...rest] = process.argv.slice(2);
  const opts = parseArgs(rest);

  if (!command || opts.help) {
    printHelp();
    return;
  }

  switch (command) {
    case 'zone':
      await commandZone(opts);
      break;
    case 'list':
      await commandList(opts);
      break;
    case 'upsert':
      await commandUpsert(opts);
      break;
    case 'delete':
      await commandDelete(opts);
      break;
    case 'bind-pages-domain':
      await commandBindPagesDomain(opts);
      break;
    case 'pages-status':
      await commandPagesStatus(opts);
      break;
    case 'verify':
      commandVerify(opts);
      break;
    default:
      throw new Error(`Unknown command "${command}". Run with --help.`);
  }
}

function parseArgs(args) {
  const opts = {};

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (!arg.startsWith('--')) {
      throw new Error(`Unexpected argument "${arg}"`);
    }

    const key = arg.slice(2);
    const next = args[index + 1];
    if (!next || next.startsWith('--')) {
      opts[toCamelCase(key)] = true;
      continue;
    }

    opts[toCamelCase(key)] = next;
    index += 1;
  }

  return opts;
}

function toCamelCase(value) {
  return value.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

function printHelp() {
  console.log(`Cloudflare DNS helper

Offline dry-run is the default. Add --inspect to read Cloudflare during dry-run.
Add --apply for live writes.

Commands:
  zone --zone example.com
  list --zone example.com [--name app.example.com] [--type CNAME]
  upsert --zone example.com --name app.example.com --type CNAME --content site.pages.dev [--proxied true] [--ttl 1] [--inspect] [--apply]
  delete --zone example.com --name app.example.com --type TXT [--content token] [--inspect] [--apply]
  bind-pages-domain --account <id> --project <name> --domain app.example.com [--zone example.com] [--pages-target site.pages.dev] [--apply]
  pages-status --account <id> --project <name> --domain app.example.com
  verify --domain app.example.com --type CNAME [--expected site.pages.dev] [--nameserver ns.example.com]
`);
}

async function commandZone(opts) {
  const zoneName = requireOption(opts, 'zone');
  const zone = await findZone(zoneName);
  console.log(JSON.stringify(zone, null, 2));
}

async function commandList(opts) {
  const zoneName = requireOption(opts, 'zone');
  const zone = await findZone(zoneName);
  const records = await listRecords(zone.id, {
    name: opts.name ? normalizeRecordName(opts.name, zone.name) : undefined,
    type: opts.type,
  });

  console.log(JSON.stringify(records, null, 2));
}

async function commandUpsert(opts) {
  const result = await upsertRecord({
    zoneName: requireOption(opts, 'zone'),
    name: requireOption(opts, 'name'),
    type: requireOption(opts, 'type'),
    content: requireOption(opts, 'content'),
    ttl: opts.ttl,
    proxied: opts.proxied,
    priority: opts.priority,
    comment: opts.comment,
    inspect: Boolean(opts.inspect),
    apply: Boolean(opts.apply),
  });

  console.log(JSON.stringify(result, null, 2));
}

async function commandDelete(opts) {
  const zoneName = requireOption(opts, 'zone');
  const recordName = requireOption(opts, 'name');
  const type = requireOption(opts, 'type').toUpperCase();
  const apply = Boolean(opts.apply);

  if (!apply && !opts.inspect) {
    console.log(JSON.stringify({
      dryRun: true,
      action: 'delete',
      note: 'Offline plan only. Add --inspect to list matching live records, then --apply to delete.',
      match: { zone: zoneName, name: recordName, type, content: opts.content },
    }, null, 2));
    return;
  }

  if (!process.env.CLOUDFLARE_API_TOKEN) {
    console.log(JSON.stringify({
      dryRun: true,
      action: 'delete',
      note: 'CLOUDFLARE_API_TOKEN is not set, so this is an offline plan only.',
      match: { zone: zoneName, name: recordName, type, content: opts.content },
      applyWith: 'Add --apply after inspecting real matching records.',
    }, null, 2));
    return;
  }

  const zone = await findZone(zoneName);
  const fullName = normalizeRecordName(recordName, zone.name);
  const records = await listRecords(zone.id, { name: fullName, type });
  const matches = opts.content
    ? records.filter((record) => record.content === opts.content)
    : records;

  if (matches.length === 0) {
    console.log(JSON.stringify({
      action: 'noop',
      reason: 'No matching records found.',
      searched: { zone: zone.name, name: fullName, type, content: opts.content },
    }, null, 2));
    return;
  }

  if (matches.length > 1 && !opts.content) {
    throw new Error(`Matched ${matches.length} records. Re-run with --content to delete exactly one record.`);
  }

  if (!apply) {
    console.log(JSON.stringify({
      dryRun: true,
      action: 'delete',
      zone: zone.name,
      matches,
      applyWith: 'Re-run the same command with --apply.',
    }, null, 2));
    return;
  }

  const deleted = [];
  for (const record of matches) {
    deleted.push(await api(`/zones/${zone.id}/dns_records/${record.id}`, { method: 'DELETE' }));
  }

  console.log(JSON.stringify({
    action: 'deleted',
    zone: zone.name,
    deleted,
  }, null, 2));
}

async function commandBindPagesDomain(opts) {
  const accountId = requireOption(opts, 'account');
  const project = requireOption(opts, 'project');
  const domain = normalizeHostname(requireOption(opts, 'domain'));
  const apply = Boolean(opts.apply);
  const pagesTarget = opts.pagesTarget ? normalizeHostname(opts.pagesTarget) : undefined;
  const zoneName = opts.zone ? normalizeHostname(opts.zone) : inferZoneFromHostname(domain);

  const plan = {
    dryRun: !apply,
    action: 'bind-pages-domain',
    pagesDomain: {
      method: 'POST',
      path: `/accounts/${accountId}/pages/projects/${project}/domains`,
      body: { name: domain },
    },
    dns: pagesTarget
      ? {
          zone: zoneName,
          type: 'CNAME',
          name: domain,
          content: pagesTarget,
          proxied: parseBoolean(opts.proxied, true),
          ttl: parseInteger(opts.ttl, 1),
        }
      : {
          note: 'No --pages-target was provided. Add the Pages custom domain first, then inspect validation data for DNS instructions.',
        },
  };

  if (!apply) {
    console.log(JSON.stringify(plan, null, 2));
    return;
  }

  requireToken();

  let pagesDomain;
  try {
    pagesDomain = await api(`/accounts/${accountId}/pages/projects/${project}/domains/${encodeURIComponent(domain)}`);
  } catch (error) {
    if (!String(error.message).includes('HTTP 404')) {
      throw error;
    }
  }

  if (!pagesDomain) {
    pagesDomain = await api(`/accounts/${accountId}/pages/projects/${project}/domains`, {
      method: 'POST',
      body: { name: domain },
    });
  }

  let dnsResult = null;
  if (pagesTarget) {
    if (domain === zoneName) {
      dnsResult = {
        action: 'skipped',
        reason: 'Domain is the zone apex. Verify Cloudflare Pages validation before creating an apex CNAME manually.',
      };
    } else {
      dnsResult = await upsertRecord({
        zoneName,
        name: domain,
        type: 'CNAME',
        content: pagesTarget,
        ttl: opts.ttl ?? 1,
        proxied: opts.proxied ?? true,
        apply: true,
      });
    }
  }

  console.log(JSON.stringify({
    action: 'bound-pages-domain',
    pagesDomain,
    dns: dnsResult,
    next: 'Check pages-status and curl the custom domain after DNS/certificate activation.',
  }, null, 2));
}

async function commandPagesStatus(opts) {
  const accountId = requireOption(opts, 'account');
  const project = requireOption(opts, 'project');
  const domain = normalizeHostname(requireOption(opts, 'domain'));

  const result = await api(`/accounts/${accountId}/pages/projects/${project}/domains/${encodeURIComponent(domain)}`);
  console.log(JSON.stringify(result, null, 2));
}

function commandVerify(opts) {
  const domain = normalizeHostname(requireOption(opts, 'domain'));
  const type = requireOption(opts, 'type').toUpperCase();
  const expected = opts.expected ? normalizeDnsAnswer(opts.expected) : undefined;
  const args = opts.nameserver
    ? [`@${normalizeHostname(opts.nameserver)}`, domain, type, '+short']
    : [domain, type, '+short'];

  let output = '';
  try {
    output = execFileSync('dig', args, { encoding: 'utf8' }).trim();
  } catch (error) {
    throw new Error(`dig failed: ${error.message}`);
  }

  const answers = output
    .split('\n')
    .map((line) => normalizeDnsAnswer(line))
    .filter(Boolean);

  const matched = expected ? answers.includes(expected) : answers.length > 0;
  console.log(JSON.stringify({
    domain,
    type,
    nameserver: opts.nameserver || 'system resolver',
    answers,
    expected,
    matched,
  }, null, 2));

  if (!matched) {
    process.exitCode = 2;
  }
}

async function upsertRecord(input) {
  const desired = normalizeDesiredRecord(input);
  if (input.zoneName) {
    desired.name = normalizeRecordName(desired.name, input.zoneName);
  }
  const apply = Boolean(input.apply);
  const inspect = Boolean(input.inspect);

  if (!apply && !inspect) {
    return {
      dryRun: true,
      action: 'upsert',
      note: 'Offline plan only. Add --inspect to read existing Cloudflare records, then --apply to write.',
      desired,
    };
  }

  if (!process.env.CLOUDFLARE_API_TOKEN) {
    return {
      dryRun: true,
      action: 'upsert',
      note: 'CLOUDFLARE_API_TOKEN is not set, so this is an offline plan only.',
      desired,
      applyWith: 'Set CLOUDFLARE_API_TOKEN and re-run with --apply after inspecting the plan.',
    };
  }

  const zone = await findZone(input.zoneName);
  desired.name = normalizeRecordName(desired.name, zone.name);

  const records = await listRecords(zone.id, {
    name: desired.name,
    type: desired.type,
  });

  const exactContentMatches = records.filter((record) => record.content === desired.content);
  const updateCandidate = chooseUpdateCandidate(desired, records, exactContentMatches);
  const changes = updateCandidate ? changedFields(updateCandidate, desired) : desired;

  if (updateCandidate && Object.keys(changes).length === 0) {
    return {
      action: 'noop',
      reason: 'Existing record already matches desired state.',
      zone: zone.name,
      record: updateCandidate,
    };
  }

  if (!apply) {
    return {
      dryRun: true,
      action: updateCandidate ? 'patch' : 'create',
      zone: zone.name,
      existing: records,
      targetRecordId: updateCandidate?.id,
      changes,
      desired,
      applyWith: 'Re-run the same command with --apply.',
    };
  }

  if (updateCandidate) {
    const result = await api(`/zones/${zone.id}/dns_records/${updateCandidate.id}`, {
      method: 'PATCH',
      body: changes,
    });
    return { action: 'patched', zone: zone.name, result };
  }

  const result = await api(`/zones/${zone.id}/dns_records`, {
    method: 'POST',
    body: desired,
  });
  return { action: 'created', zone: zone.name, result };
}

function normalizeDesiredRecord(input) {
  const type = input.type.toUpperCase();
  const record = {
    type,
    name: normalizeHostname(input.name),
    content: input.content,
    ttl: parseInteger(input.ttl, 1),
  };

  if (DNS_RECORD_TYPES_WITH_PROXY.has(type)) {
    record.proxied = parseBoolean(input.proxied, false);
  }

  if (type === 'MX' || input.priority !== undefined) {
    record.priority = parseInteger(input.priority, undefined);
    if (record.priority === undefined) {
      throw new Error('MX records require --priority.');
    }
  }

  if (input.comment) {
    record.comment = input.comment;
  }

  return record;
}

function chooseUpdateCandidate(desired, records, exactContentMatches) {
  if (exactContentMatches.length === 1) {
    return exactContentMatches[0];
  }

  if (desired.type === 'CNAME' && records.length === 1) {
    return records[0];
  }

  if (['A', 'AAAA'].includes(desired.type) && records.length === 1) {
    return records[0];
  }

  if (exactContentMatches.length > 1) {
    throw new Error(`Found ${exactContentMatches.length} records with the same content. Refine manually.`);
  }

  return null;
}

function changedFields(existing, desired) {
  const changes = {};

  for (const [key, value] of Object.entries(desired)) {
    if (value === undefined) {
      continue;
    }
    if (key === 'ttl' && Number(existing[key]) === Number(value)) {
      continue;
    }
    if (existing[key] !== value) {
      changes[key] = value;
    }
  }

  return changes;
}

async function findZone(zoneName) {
  requireToken();
  const normalized = normalizeHostname(zoneName);
  const result = await api(`/zones?name=${encodeURIComponent(normalized)}&status=active`);
  const zones = result.result || [];

  if (zones.length === 0) {
    throw new Error(`No active Cloudflare zone found for "${normalized}".`);
  }

  if (zones.length > 1) {
    throw new Error(`Multiple zones found for "${normalized}". Narrow token/account scope first.`);
  }

  return zones[0];
}

async function listRecords(zoneId, filters = {}) {
  requireToken();
  const params = new URLSearchParams();
  if (filters.name) {
    params.set('name', normalizeHostname(filters.name));
  }
  if (filters.type) {
    params.set('type', filters.type.toUpperCase());
  }
  params.set('per_page', '100');

  const records = [];
  let page = 1;
  while (true) {
    params.set('page', String(page));
    const result = await api(`/zones/${zoneId}/dns_records?${params.toString()}`);
    records.push(...(result.result || []));

    const info = result.result_info;
    if (!info || page >= info.total_pages) {
      break;
    }
    page += 1;
  }

  return records;
}

async function api(path, options = {}) {
  requireToken();

  const response = await fetch(`${API_BASE}${path}`, {
    method: options.method || 'GET',
    headers: {
      Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const text = await response.text();
  let payload;
  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    payload = { raw: text };
  }

  if (!response.ok || payload.success === false) {
    const messages = [
      ...(payload.errors || []).map((error) => error.message || JSON.stringify(error)),
      ...(payload.messages || []).map((message) => message.message || JSON.stringify(message)),
    ];
    throw new Error(`Cloudflare API HTTP ${response.status}: ${messages.join('; ') || text}`);
  }

  return payload;
}

function requireToken() {
  if (!process.env.CLOUDFLARE_API_TOKEN) {
    throw new Error('CLOUDFLARE_API_TOKEN is required for Cloudflare API calls.');
  }
}

function requireOption(opts, key) {
  if (opts[key] === undefined || opts[key] === '') {
    throw new Error(`Missing --${key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)}.`);
  }
  return opts[key];
}

function normalizeRecordName(name, zoneName) {
  const normalizedZone = normalizeHostname(zoneName);
  if (name === '@') {
    return normalizedZone;
  }

  const normalized = normalizeHostname(name);
  if (normalized === normalizedZone || normalized.endsWith(`.${normalizedZone}`)) {
    return normalized;
  }

  return `${normalized}.${normalizedZone}`;
}

function normalizeHostname(value) {
  return String(value).trim().replace(/\.$/, '').toLowerCase();
}

function inferZoneFromHostname(hostname) {
  const parts = normalizeHostname(hostname).split('.');
  if (parts.length < 2) {
    return hostname;
  }
  return parts.slice(-2).join('.');
}

function normalizeDnsAnswer(value) {
  return String(value)
    .trim()
    .replace(/^"|"$/g, '')
    .replace(/\.$/, '')
    .toLowerCase();
}

function parseInteger(value, fallback) {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    throw new Error(`Expected integer, received "${value}".`);
  }

  return parsed;
}

function parseBoolean(value, fallback) {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }
  if (typeof value === 'boolean') {
    return value;
  }

  const normalized = String(value).toLowerCase();
  if (['true', '1', 'yes', 'y'].includes(normalized)) {
    return true;
  }
  if (['false', '0', 'no', 'n'].includes(normalized)) {
    return false;
  }

  throw new Error(`Expected boolean, received "${value}".`);
}
