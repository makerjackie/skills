# Poster Minimal - 极简海报生成器

Generate hardcore minimalist posters with clean typography and bold visual impact.

## Installation

```bash
npx skills add 01mvp/skills/poster-minimal
```

## Features

- Generates 4 poster variations automatically:
  - Standard poster (1080x1920px) - black & white backgrounds
  - WeChat header (900x383px) - black & white backgrounds
- Hardcore minimalist design with maximum white space
- Bold typography with system fonts
- Pure black/white contrast, no gradients or effects
- HTML-first workflow with PNG export
- Automatic QR code generation from registration URLs

## Quick Start

1. Install the skill
2. Ask Claude to create a poster with your content
3. Get 4 PNG files ready to use

Example: "Create a minimalist poster with title 'LESS IS MORE' and subtitle 'Design Philosophy'"

## Prerequisites

The conversion script requires Playwright:

```bash
pip install playwright
playwright install chromium
```

QR codes are generated automatically in the browser using qrcodejs (loaded from CDN), no additional dependencies needed.

## Custom Assets

Place QR codes, logos, or other assets in the `assets/` directory. The skill will reference them when generating posters.

---

## 痛点 (Pain Points)

Creating posters is time-consuming:
- Design tools have steep learning curves
- Need multiple size variations for different platforms
- Maintaining consistent minimalist aesthetics is hard
- Exporting to different formats takes manual work

## 解决方案 (Solution)

This skill automates minimalist poster generation:
- **Zero design skills needed** - Just provide text content
- **Instant variations** - Get 4 sizes/colors in one command
- **Consistent aesthetics** - Hardcore minimalist principles built-in
- **Production-ready** - PNG files ready for WeChat, social media, print

Perfect for:
- Product launches and announcements
- Event promotions
- Social media content
- WeChat article headers
- Presentation covers

## 使用场景 (Use Cases)

**产品发布**: Generate launch posters with product name and tagline
**活动宣传**: Create event posters with date and location
**公众号首图**: WeChat header images with article titles
**社交媒体**: Instagram/Twitter graphics with quotes or messages
**演讲封面**: Presentation title slides with speaker info
