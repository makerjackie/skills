#!/usr/bin/env node
/**
 * MakerJackie Cover Generator
 * 将 AI 生成的封面 HTML（.cover 元素）截图成 PNG
 *
 * Usage: node generate-cover.js <cover.html> [output-dir]
 * Example: node generate-cover.js output/2026-04-20-article-cover.html output/
 */

import puppeteer from 'puppeteer';
import { readFileSync, existsSync } from 'fs';
import { basename, join, dirname } from 'path';

const COVER_WIDTH = 900;
const COVER_HEIGHT = 383;

async function generateCover(htmlPath, outputDir) {
  if (!existsSync(htmlPath)) {
    console.error(`❌ 文件不存在: ${htmlPath}`);
    process.exit(1);
  }

  const baseName = basename(htmlPath).replace('-cover.html', '');

  console.log(`📄 Cover HTML: ${htmlPath}`);
  console.log(`🚀 启动浏览器...`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({
      width: COVER_WIDTH,
      height: COVER_HEIGHT,
      deviceScaleFactor: 2
    });

    // Load the cover HTML
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
    await page.evaluateHandle('document.fonts.ready');

    // Wait a moment for fonts to render
    await new Promise(r => setTimeout(r, 200));

    // Screenshot the .cover element
    const coverEl = await page.$('.cover');
    if (!coverEl) {
      console.error('❌ 未找到 .cover 元素');
      process.exit(1);
    }

    const outputPath = join(outputDir, `${baseName}-cover.png`);
    await coverEl.screenshot({ path: outputPath, type: 'png' });

    console.log(`✅ 封面图已保存: ${outputPath} (${COVER_WIDTH * 2}x${COVER_HEIGHT * 2})`);
    return outputPath;
  } finally {
    await browser.close();
  }
}

// CLI
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Usage: node generate-cover.js <cover.html> [output-dir]');
  console.log('Example: node generate-cover.js output/2026-04-20-article-cover.html output/');
  process.exit(1);
}

const htmlPath = args[0];
const outputDir = args[1] || dirname(htmlPath);

generateCover(htmlPath, outputDir).catch(err => {
  console.error('❌ 错误:', err);
  process.exit(1);
});
