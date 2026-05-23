import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const jsonPath = resolve(root, 'data/redirects.json');
const outPath = resolve(root, 'data/redirects.compiled.json');

const normalizeSource = (source) => source.trim().toLowerCase().replace(/\/$/, '');
const normalizeDestination = (destination) => {
  const trimmed = destination.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

function parseJsonRules(input) {
  let parsed = [];
  try {
    parsed = JSON.parse(input);
  } catch {
    parsed = [];
  }

  if (!Array.isArray(parsed)) return [];

  return parsed
    .map((item) => ({
      source: normalizeSource(String(item?.source ?? '')),
      destination: normalizeDestination(String(item?.destination ?? '')),
      status: String(item?.status ?? '301') === '302' ? 302 : 301,
    }))
    .filter((item) => item.source && item.destination);
}

const jsonRaw = readFileSync(jsonPath, 'utf-8');
const compiled = parseJsonRules(jsonRaw);

writeFileSync(outPath, `${JSON.stringify(compiled, null, 2)}\n`, 'utf-8');
console.log(`Compiled ${compiled.length} redirect rules -> data/redirects.compiled.json`);
