# Repository Guidelines

## Project Structure & Module Organization
This repository hosts reusable skills, with each skill self-contained under `skills/<skill-name>/`.

- Root: [`README.md`](README.md) lists install commands and the skill catalog.

When adding a new skill, mirror this folder pattern and update the root README table.

## Build, Test, and Development Commands
Run commands from `skills/cloudflare-redirector/`:

- `pnpm run build:rules` compiles redirect rules to `data/redirects.compiled.json`.
- `pnpm run dev` compiles rules and starts local Wrangler dev.
- `pnpm run deploy:dry-run` validates deploy config without publishing.
- `pnpm run deploy` deploys the Worker.
- `pnpm run dns:sync:dry-run` previews DNS CNAME changes.
- `pnpm run dns:sync` applies DNS changes via Cloudflare API.

## Coding Style & Naming Conventions
- Use TypeScript for Worker runtime code and ESM Node scripts for tooling.
- Follow existing formatting: TypeScript uses tabs; `.mjs` scripts use 2-space indentation.
- Prefer clear, small functions (`parseConfig`, `normalizeDestination`, etc.).
- Use lowercase, descriptive filenames and kebab-case directory names (e.g., `cloudflare-redirector`).

## Testing Guidelines
There is no formal test suite yet. Validate changes with:

1. `pnpm run build:rules`
2. `pnpm run dns:sync:dry-run`
3. `pnpm run deploy:dry-run`
4. `curl -I https://<source-domain>` after deploy to verify `301/302` and `Location`.

If you add logic-heavy code, include focused automated tests in the skill folder.

## Commit & Pull Request Guidelines
Use Conventional Commit prefixes as seen in history (`feat:`, `docs:`).

- Commit examples: `feat: add wildcard redirect normalization`, `docs: update skill usage notes`
- Keep commits scoped to one skill or concern.
- PRs should include: purpose, changed paths, dry-run output, and rollout/verification notes.
- Link related issues/tasks and include screenshots only when UI/docs rendering changes matter.

## Security & Configuration Tips
- Never commit real Cloudflare credentials.
- Required env var: `CLOUDFLARE_API_TOKEN`.
- Optional env var: `DNS_TARGET_HOST` for CNAME target override.
- Keep `wrangler.jsonc` `account_id` and `routes` accurate before deploy.
