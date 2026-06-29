#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <r2-key> <compressed-image>" >&2
  echo "Example: $0 images/docs/01mvp-art/example.webp /tmp/example.webp" >&2
  exit 2
fi

key="${1#/}"
file="$2"
bucket="${MJ_01MVP_ART_R2_BUCKET:-${PUBLIC_UPLOAD_BUCKET:-01mvp-public-assets}}"
public_base="${MJ_01MVP_ART_R2_PUBLIC_URL:-${PUBLIC_UPLOAD_PUBLIC_URL:-https://assets.01mvp.com}}"

if [ ! -f "$file" ]; then
  echo "File not found: $file" >&2
  exit 1
fi

if ! command -v wrangler >/dev/null 2>&1; then
  echo "wrangler is required for R2 upload. Install or authenticate wrangler first." >&2
  exit 1
fi

case "$file" in
  *.webp)
    content_type="image/webp"
    ;;
  *.jpg|*.jpeg)
    content_type="image/jpeg"
    ;;
  *.png)
    content_type="image/png"
    ;;
  *)
    content_type="$(file -b --mime-type "$file")"
    ;;
esac

wrangler r2 object put "$bucket/$key" \
  --remote \
  --file "$file" \
  --content-type "$content_type" \
  --cache-control "public, max-age=31536000, immutable" \
  >/dev/null

printf "%s/%s\n" "${public_base%/}" "$key"
