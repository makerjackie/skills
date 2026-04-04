#!/usr/bin/env python3
"""
Convert HTML posters to PNG with black and white background variations.
Usage: python convert.py poster.html wechat.html
"""
import sys
import os
from pathlib import Path

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    print("Error: playwright not installed")
    print("Install with: pip install playwright && playwright install chromium")
    sys.exit(1)

def convert_html_to_png(html_file, output_dir="output"):
    """Convert HTML to PNG with both black and white backgrounds"""
    html_path = Path(html_file)
    if not html_path.exists():
        print(f"Error: {html_file} not found")
        return

    output_path = Path(output_dir)
    output_path.mkdir(exist_ok=True)

    base_name = html_path.stem

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Read HTML content
        html_content = html_path.read_text()

        # Black background version
        black_html = html_content.replace(
            "var(--bg)", "#000000"
        ).replace(
            "var(--fg)", "#FFFFFF"
        )
        page.set_content(black_html)
        page.screenshot(path=str(output_path / f"{base_name}-black.png"))
        print(f"✓ Generated {base_name}-black.png")

        # White background version
        white_html = html_content.replace(
            "var(--bg)", "#FFFFFF"
        ).replace(
            "var(--fg)", "#000000"
        )
        page.set_content(white_html)
        page.screenshot(path=str(output_path / f"{base_name}-white.png"))
        print(f"✓ Generated {base_name}-white.png")

        browser.close()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python convert.py <html_file1> [html_file2] ...")
        sys.exit(1)

    for html_file in sys.argv[1:]:
        convert_html_to_png(html_file)

    print(f"\n✅ All posters generated in output/ directory")
