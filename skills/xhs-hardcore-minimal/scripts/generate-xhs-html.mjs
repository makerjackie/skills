#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const THEMES = {
  "hardcore-minimal": {
    bg: "#f7f7f5",
    text: "#101010",
    muted: "#4a4a4a",
    accent: "#111111",
    border: "#e8e8e5",
    panel: "#ffffff",
    panelText: "#111111",
    ctaBg: "#111111",
    ctaText: "#ffffff",
  },
  "mono-grid": {
    bg: "#ffffff",
    text: "#0a0a0a",
    muted: "#595959",
    accent: "#0a0a0a",
    border: "#d9d9d9",
    panel: "#f8f8f8",
    panelText: "#101010",
    ctaBg: "#0a0a0a",
    ctaText: "#ffffff",
  },
  "neo-brutal": {
    bg: "#fff455",
    text: "#111111",
    muted: "#303030",
    accent: "#ff3b30",
    border: "#111111",
    panel: "#ffffff",
    panelText: "#111111",
    ctaBg: "#ff3b30",
    ctaText: "#111111",
  },
  "dark-tech": {
    bg: "#0b1020",
    text: "#eaf2ff",
    muted: "#9db0cc",
    accent: "#4df0b8",
    border: "#243351",
    panel: "#101a33",
    panelText: "#eaf2ff",
    ctaBg: "#4df0b8",
    ctaText: "#062018",
  },
};

function usage() {
  console.log(`Usage:
  node generate-xhs-html.mjs --input <pages.json> --output <dir> [--theme <name>]

Input schema:
{
  "theme": "hardcore-minimal",
  "pages": [
    {
      "kicker": "第1页/6页",
      "title": "封面标题",
      "points": ["点1", "点2", "点3"],
      "footer": "收藏这篇，照着做"
    }
  ]
}
`);
}

function parseArgs(argv) {
  const opts = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const value = argv[i + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for --${key}`);
    }
    opts[key] = value;
    i += 1;
  }

  if (!opts.input || !opts.output) {
    throw new Error("--input and --output are required");
  }
  return opts;
}

function escapeHtml(raw) {
  return String(raw)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildHtml(page, theme, pageNo, total) {
  const points = (page.points || [])
    .slice(0, 4)
    .map((p, idx) => {
      const order = String(idx + 1).padStart(2, "0");
      return `<article class="point"><span class="point-no">${order}</span><p>${escapeHtml(p)}</p></article>`;
    })
    .join("\n");

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>page-${String(pageNo).padStart(2, "0")}</title>
  <style>
    :root {
      --bg: ${theme.bg};
      --text: ${theme.text};
      --muted: ${theme.muted};
      --accent: ${theme.accent};
      --border: ${theme.border};
      --panel: ${theme.panel};
      --panel-text: ${theme.panelText};
      --cta-bg: ${theme.ctaBg};
      --cta-text: ${theme.ctaText};
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "SF Pro Display", "PingFang SC", "Helvetica Neue", Arial, sans-serif;
      color: var(--text);
      background: var(--bg);
    }
    #canvas {
      width: 1080px;
      height: 1440px;
      background: var(--bg);
      padding: 62px;
      border: 4px solid var(--border);
      display: grid;
      grid-template-rows: auto auto 1fr auto;
      gap: 28px;
    }
    .meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
    }
    .kicker {
      color: var(--muted);
      font-size: 32px;
      letter-spacing: 0.5px;
      font-weight: 600;
    }
    .title {
      font-size: 78px;
      line-height: 1.15;
      font-weight: 800;
      letter-spacing: -1px;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .content {
      margin-top: 8px;
      display: grid;
      gap: 16px;
      align-content: start;
    }
    .point {
      background: var(--panel);
      color: var(--panel-text);
      border: 3px solid var(--border);
      border-radius: 22px;
      padding: 22px 24px;
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 14px;
      align-items: start;
      min-height: 120px;
    }
    .point-no {
      font-size: 28px;
      font-weight: 800;
      color: var(--accent);
      line-height: 1.4;
    }
    .point p {
      margin: 0;
      font-size: 42px;
      line-height: 1.3;
      font-weight: 600;
    }
    .bottom {
      display: grid;
      gap: 16px;
      margin-top: 6px;
    }
    .footer {
      color: var(--muted);
      font-size: 30px;
      line-height: 1.3;
    }
    .badge {
      font-size: 26px;
      font-weight: 700;
      color: var(--accent);
      border: 2px solid var(--accent);
      border-radius: 999px;
      padding: 8px 16px;
      white-space: nowrap;
      max-width: max-content;
    }
    .cta {
      background: var(--cta-bg);
      color: var(--cta-text);
      border-radius: 18px;
      padding: 18px 22px;
      font-size: 34px;
      line-height: 1.3;
      font-weight: 700;
    }
  </style>
</head>
<body>
  <main id="canvas">
    <div class="meta">
      <div class="kicker">${escapeHtml(page.kicker || `第 ${pageNo}/${total} 页`)}</div>
      <div class="badge">${escapeHtml(page.badge || "高密度速读")}</div>
    </div>
    <div class="title">${escapeHtml(page.title || "未填写标题")}</div>
    <section class="content">
      ${points}
    </section>
    <section class="bottom">
      <div class="footer">${escapeHtml(page.footer || "基于原文整理，不额外脑补")}</div>
      <div class="cta">${escapeHtml(page.cta || "下一页看关键信息")}</div>
    </section>
  </main>
</body>
</html>
`;
}

function cleanupOldPages(outputDir) {
  if (!fs.existsSync(outputDir)) return;
  const oldPages = fs
    .readdirSync(outputDir)
    .filter((name) => /^page-\d+\.html$/i.test(name))
    .map((name) => path.join(outputDir, name));
  for (const file of oldPages) {
    fs.unlinkSync(file);
  }
}

function main() {
  let opts;
  try {
    opts = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    usage();
    process.exit(1);
  }

  const inputPath = path.resolve(opts.input);
  const outputPath = path.resolve(opts.output);

  if (!fs.existsSync(inputPath)) {
    console.error(`Input JSON not found: ${inputPath}`);
    process.exit(1);
  }

  const payload = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  const themeName = opts.theme || payload.theme || "hardcore-minimal";
  const theme = THEMES[themeName];

  if (!theme) {
    console.error(`Unknown theme: ${themeName}`);
    console.error(`Available: ${Object.keys(THEMES).join(", ")}`);
    process.exit(1);
  }

  if (!Array.isArray(payload.pages) || payload.pages.length === 0) {
    console.error("Input JSON must include non-empty pages array.");
    process.exit(1);
  }

  fs.mkdirSync(outputPath, { recursive: true });
  cleanupOldPages(outputPath);

  const total = payload.pages.length;
  payload.pages.forEach((page, idx) => {
    const pageNo = idx + 1;
    const html = buildHtml(page, theme, pageNo, total);
    const file = path.join(
      outputPath,
      `page-${String(pageNo).padStart(2, "0")}.html`,
    );
    fs.writeFileSync(file, html, "utf8");
    console.log(`Wrote: ${file}`);
  });

  console.log(`Done. Theme: ${themeName}, pages: ${total}`);
}

main();
