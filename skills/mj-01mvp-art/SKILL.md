---
name: mj-01mvp-art
description: Generate 01MVP-style black-and-white article illustrations and visual concepts. Use when the user asks for 01MVP handbook/blog/docs/marketing images, Chinese article illustrations, shot lists, visual metaphors, compressed social-media-ready image assets, assets.01mvp.com uploads, or imagegen prompts that should feel concise, direct, high-impact, and visually consistent with the 01MVP operator style.
---

# 01MVP Art

Generate 01MVP article illustrations in one unified style: white background, chunky black `01` operator, thick marker lines, one red-orange accent, and a direct physical metaphor. Use `assets/examples/00-character-exploration.png` as the style anchor.

## References

- `references/visual-dna.md`: visual rules, source attribution, and composition rules.
- `references/prompt-recipes.md`: prompt template, short-text rules, compression and upload workflow.
- `scripts/prepare-social-image.sh`: convert generated PNGs into compressed social/web assets.
- `scripts/upload-r2-asset.sh`: upload compressed assets to the public 01MVP R2 bucket through `wrangler`.

## Workflow

1. Pick one cognitive anchor from the article: validation, payment, launch, cut scope, feedback, or automation timing.
2. Convert it into one physical action: cut, push, launch, crank, charge, weigh, block, collect, or ship.
3. Draw the 01MVP operator doing that action. The character must drive the meaning, not decorate the page.
4. Keep the image obvious at a glance. If the idea needs many arrows or many labels, reduce the metaphor.
5. Use imagegen directly for short Chinese text. Keep text to 1 title plus 2-4 labels, each 2-6 Chinese characters.
6. Save only compressed review/production assets by default:
   - Web/docs default: `1600x900` WebP, quality around 82.
   - Social fallback: `1600x900` JPG, quality around 86 when a platform does not accept WebP.
7. Upload approved/reusable compressed images to R2 by default. Prefer `wrangler r2 object put --remote` against `01mvp-public-assets`; use environment variables only for bucket/public URL overrides. Never print or store access keys.

## Quality Gate

- Generate one image per article concept. Do not use one crowded contact sheet as the final article image.
- Review a contact sheet before upload when generating more than 3 images.
- Reject images with wrong Chinese text, unrelated subjects, weak metaphors, thin lines, cute mascots, or decorative clutter.
- Use dated filenames such as `<slug>-YYYYMMDD.webp` for public R2 URLs, so a pre-upload 404 cannot poison the final URL through CDN cache.
- Verify every final public URL with `curl -I`; it must return `200` and `content-type: image/webp`.
- Insert only R2 URLs into 01MVP docs. Do not commit generated article images into the web repo unless explicitly requested.

## Output Rules

- Do not ship raw imagegen PNGs as the final article asset.
- Do not use local text overlays as the default path.
- Keep source PNGs only as temporary working files unless the user asks to preserve them.
- For 01MVP web docs, do not add generated article images to the repo unless the user explicitly asks for local files.
- For approved/reusable images, use `https://assets.01mvp.com/images/docs/01mvp-art/<slug>.webp` in MDX and other docs.

## R2 Upload

Use `wrangler` auth by default. These non-secret environment variables may override the default target:

- `MJ_01MVP_ART_R2_BUCKET`
- `MJ_01MVP_ART_R2_PUBLIC_URL`
- `PUBLIC_UPLOAD_BUCKET`
- `PUBLIC_UPLOAD_PUBLIC_URL`

Do not print, persist, or document API tokens/access keys.

Default upload path uses `wrangler ... --remote`, so explicit R2 keys are not required when Cloudflare auth is already available in the shell:

```bash
scripts/upload-r2-asset.sh images/docs/01mvp-art/<slug>.webp /tmp/<slug>.webp
```

If `wrangler` is not authenticated and no safe upload path is available, keep the compressed file in a temporary working directory and report that upload was skipped. Do not fall back to committing image files into the web repo.
