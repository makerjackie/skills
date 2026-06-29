#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 2 ]; then
  echo "Usage: $0 <input-image> <output-image.webp|jpg> [width] [height]" >&2
  exit 2
fi

input="$1"
output="$2"
width="${3:-1600}"
height="${4:-900}"

if ! command -v magick >/dev/null 2>&1; then
  echo "ImageMagick 'magick' is required." >&2
  exit 1
fi

case "$output" in
  *.webp)
    quality=82
    ;;
  *.jpg|*.jpeg)
    quality=86
    ;;
  *)
    echo "Output must end with .webp, .jpg, or .jpeg" >&2
    exit 2
    ;;
esac

magick "$input" \
  -auto-orient \
  -resize "${width}x${height}^" \
  -gravity center \
  -extent "${width}x${height}" \
  -strip \
  -colorspace sRGB \
  -quality "$quality" \
  "$output"
