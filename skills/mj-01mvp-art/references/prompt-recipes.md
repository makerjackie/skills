# Prompt Recipes

## Imagegen Template

```text
Use case: illustration-story
Asset type: 01MVP article illustration, 16:9
Primary request: Generate a direct 01MVP-style article illustration for "<concept>".
Subject: The same chunky black 01MVP operator style as the reference: black rectangular body with bold white "01", short sturdy arms and legs. The operator is <action> <object> to show <meaning>.
Style/medium: pure white background, thick black marker lines, solid black fills, rough but controlled editorial sketch, one red-orange accent.
Composition/framing: one large central action, very few props, clear at thumbnail size, no decorative background.
Text (verbatim): "<short title>" plus labels "<label1>", "<label2>", "<label3>".
Constraints: Chinese text must be short, clear, and readable. The picture should explain the idea in one second.
Avoid: local text overlay, long text, PPT flowchart, many arrows, thin-line Xiaohei style, cute mascot, pet, gradient, shadow, beige paper texture, clutter.
```

## Text Rules

Use imagegen text directly, but make it easy:

- Title: 2-8 Chinese characters.
- Labels: 2-6 Chinese characters each.
- Total visible text: usually 3-5 short phrases.
- Prefer words like `人工跑通`, `真实付款`, `再自动化`, `先验证`, `再写代码`, `手机可用`, `CTA清楚`.

If text is wrong, regenerate with shorter text. Do not make local overlay the default.

## Compression

Generated PNGs are working files. Final assets should be compressed:

```bash
skills/mj-01mvp-art/scripts/prepare-social-image.sh input.png output.webp
skills/mj-01mvp-art/scripts/prepare-social-image.sh input.png output.jpg
```

Default:

- Web/docs: WebP, `1600x900`, quality 82.
- Social fallback: JPG, `1600x900`, quality 86.

## Upload

Upload approved/reusable compressed assets through remote `wrangler` R2 under:

```text
images/docs/01mvp-art/<slug>.webp
```

```bash
skills/mj-01mvp-art/scripts/upload-r2-asset.sh images/docs/01mvp-art/<slug>.webp /tmp/<slug>.webp
```

Default bucket/public URL:

- Bucket: `01mvp-public-assets`
- Public URL: `https://assets.01mvp.com`

Use `MJ_01MVP_ART_R2_BUCKET`, `MJ_01MVP_ART_R2_PUBLIC_URL`, `PUBLIC_UPLOAD_BUCKET`, or `PUBLIC_UPLOAD_PUBLIC_URL` only as environment overrides. Never print access keys.

Important: R2 object commands must target remote storage. Do not omit `--remote`; otherwise Wrangler may write to the local R2 simulator and the public URL will 404.

## Batch Rollout Checklist

For docs-wide illustration work:

1. Pick only high-value pages: phase overviews, decision pages, key workflows, case entries, and brand/visual pages.
2. Keep a manifest of page path, slug, alt text, title, labels, and physical metaphor.
3. Generate in small batches, then review contact sheets before compression.
4. Compress all accepted images to `1600x900` WebP.
5. Upload to R2 with dated filenames.
6. Verify every public URL with `curl -I`.
7. Insert R2 URLs into MDX; do not add images under `public/`.
