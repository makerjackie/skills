---
name: poster-minimal
description: Generate hardcore minimalist posters in multiple sizes and color variations. Use when the user wants to create posters, promotional graphics, or visual designs with minimalist aesthetics. Automatically generates 4 variations - standard poster (1080x1920px) and WeChat header (900x383px) in both black and white backgrounds. Supports text-based designs with bold typography and maximum white space.
---

# Poster Minimal - 极简海报生成器

## Overview

Create hardcore minimalist posters with clean typography and bold visual impact. Each generation produces 4 PNG files: standard poster and WeChat header sizes, each in black and white background variations.
## Workflow

### Step 1: Gather Requirements

Ask the user for:
- **Title**: Main headline text
- **Subtitle** (optional): Secondary text
- **Body text** (optional): Additional content
- **Registration URL** (optional): If provided, automatically generate QR code in HTML
- **Special elements** (optional): Logo, etc.

### Step 2: Generate HTML Templates

Create two HTML files with hardcore minimalist design:

**poster.html** - Standard poster (1080x1920px)
```html
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
body {
  margin: 0;
  padding: 0;
  width: 1080px;
  height: 1920px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: var(--bg);
  color: var(--fg);
}
.container {
  padding: 120px 100px;
  text-align: center;
  max-width: 880px;
}
h1 {
  font-size: 96px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
  margin: 0 0 40px 0;
}
h2 {
  font-size: 48px;
  font-weight: 400;
  line-height: 1.3;
  margin: 0 0 60px 0;
}
p {
  font-size: 32px;
  line-height: 1.5;
  margin: 0 0 40px 0;
}
#qrcode {
  margin-top: 40px;
  display: inline-block;
}
#qrcode canvas {
  width: 200px !important;
  height: 200px !important;
}
</style>
<script src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"></script>
</head>
<body>
<div class="container">
  <h1>YOUR TITLE</h1>
  <h2>Your Subtitle</h2>
  <p>Your body text here</p>
  <div id="qrcode"></div>
</div>
<script>
// Generate QR code if URL is provided
const url = "YOUR_URL_HERE";
if (url && url !== "YOUR_URL_HERE") {
  new QRCode(document.getElementById("qrcode"), {
    text: url,
    width: 200,
    height: 200,
    colorDark: "var(--fg)" === "#FFFFFF" ? "#FFFFFF" : "#000000",
    colorLight: "var(--bg)" === "#000000" ? "#000000" : "#FFFFFF"
  });
}
</script>
</body>
</html>
```

**wechat.html** - WeChat header (900x383px)
```html
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
body {
  margin: 0;
  padding: 0;
  width: 900px;
  height: 383px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: var(--bg);
  color: var(--fg);
}
.container {
  padding: 60px 80px;
  text-align: center;
}
h1 {
  font-size: 64px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
  margin: 0;
}
</style>
</head>
<body>
<div class="container">
  <h1>YOUR TITLE</h1>
</div>
</body>
</html>
```

### Step 3: Convert to PNG

Run the conversion script to generate all 4 variations:

```bash
cd skills/poster-minimal
python scripts/convert.py poster.html wechat.html
```

This creates:
- `poster-black.png` - 1080x1920px, black background
- `poster-white.png` - 1080x1920px, white background
- `wechat-black.png` - 900x383px, black background
- `wechat-white.png` - 900x383px, white background

### Step 4: Iterate

Allow user to request adjustments:
- Text content changes
- Font size adjustments
- Layout modifications
- Add QR code or logo (place in assets/ directory)

## Design Principles

### Typography
- **Poster title**: 72-120px, bold (700)
- **Poster subtitle**: 36-60px, regular (400)
- **Poster body**: 24-36px
- **WeChat title**: 48-72px, bold (700)
- **Line height**: 1.2-1.4
- **Letter spacing**: -0.02em for large text

### Layout
- **Poster margins**: 100-120px
- **WeChat margins**: 60-80px
- **Alignment**: Center for maximum impact
- **White space**: Maximum, let content breathe

### Color
- **Black background**: #000000 with #FFFFFF text
- **White background**: #FFFFFF with #000000 text
- **No gradients, shadows, or effects**
- **Pure contrast only**

## Adding Custom Assets

If user provides a registration URL:
1. Replace `YOUR_URL_HERE` in the HTML with the actual URL
2. The QR code will be automatically generated in the browser using qrcodejs
3. The QR code colors will automatically match the poster background (black/white)

For logos or other images:
1. Save to `assets/` directory (e.g., `assets/logo.png`)
2. Reference in HTML:
```html
<img src="assets/logo.png" style="width: 200px; margin-top: 60px;">
```

## Resources

### scripts/convert.py
Python script that converts HTML to PNG using Playwright. Generates all 4 color/size variations automatically.

**Note**: QR codes are generated directly in the browser using qrcodejs library (loaded from CDN), no Python dependencies needed for QR code generation.
