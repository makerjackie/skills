#!/usr/bin/env node
/**
 * MakerJackie Format - HTML to Image Converter
 * 将微信公众号 HTML 转换为小红书风格的图片
 */

import puppeteer from 'puppeteer';
import { readFileSync } from 'fs';
import { basename, dirname, join } from 'path';
import * as cheerio from 'cheerio';

// 小红书推荐尺寸
const IMAGE_WIDTH = 1080;
const IMAGE_HEIGHT = 1350;

/**
 * 从 HTML 中提取章节
 */
function extractSections(htmlPath) {
  const html = readFileSync(htmlPath, 'utf-8');
  const $ = cheerio.load(html);

  const baseName = basename(htmlPath).replace('-wechat.html', '');
  const outputDir = dirname(htmlPath);

  const sections = [];

  // 1. 封面：标题 + TL;DR
  const header = $('section').first();
  const tldr = $('section').eq(1);
  sections.push({
    name: `${baseName}-1.png`,
    description: '封面：标题 + TL;DR',
    html: `<section style="margin:0;padding:24px 0;background-color:#ffffff;">
      <section style="margin:0 auto;padding:0 16px;max-width:677px;box-sizing:border-box;">
        ${header.html()}
        ${tldr.html()}
      </section>
    </section>`
  });

  // 2. 提取所有章节（带顶部黑色边框的 section）
  let chapterIndex = 2;
  $('section').each((i, elem) => {
    const $section = $(elem);
    const hasTopBorder = $section.find('section[style*="border-top"]').length > 0;

    if (hasTopBorder) {
      const chapterTitle = $section.find('p[style*="font-size:25px"]').text().trim();

      sections.push({
        name: `${baseName}-${chapterIndex}.png`,
        description: `第${chapterIndex - 1}章：${chapterTitle}`,
        html: `<section style="margin:0;padding:24px 0;background-color:#ffffff;">
          <section style="margin:0 auto;padding:0 16px;max-width:677px;box-sizing:border-box;">
            ${$section.html()}
          </section>
        </section>`
      });

      chapterIndex++;
    }
  });

  // 3. 最后一张：CTA + 作者信息
  const cta = $('section').filter((i, elem) => {
    return $(elem).find('p:contains("CTA")').length > 0;
  });
  const footer = $('section').last();

  sections.push({
    name: `${baseName}-${chapterIndex}.png`,
    description: '结尾：CTA + 作者信息',
    html: `<section style="margin:0;padding:24px 0;background-color:#ffffff;">
      <section style="margin:0 auto;padding:0 16px;max-width:677px;box-sizing:border-box;">
        ${cta.html()}
        ${footer.html()}
      </section>
    </section>`
  });

  return { sections, outputDir };
}

/**
 * 生成图片
 */
async function generateImages(htmlPath) {
  console.log(`📄 HTML 文件: ${htmlPath}`);

  const { sections, outputDir } = extractSections(htmlPath);

  console.log(`📁 输出目录: ${outputDir}`);
  console.log(`\n🎨 计划生成 ${sections.length} 张图片:\n`);

  sections.forEach((section, i) => {
    console.log(`  ${i + 1}. ${section.name}`);
    console.log(`     ${section.description}`);
  });

  console.log('\n🚀 启动浏览器...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // 设置视口大小
    await page.setViewport({
      width: IMAGE_WIDTH,
      height: IMAGE_HEIGHT,
      deviceScaleFactor: 2 // 2x 分辨率，更清晰
    });

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const outputPath = join(outputDir, section.name);

      console.log(`\n📸 生成 ${i + 1}/${sections.length}: ${section.name}`);

      // 加载 HTML 内容
      await page.setContent(section.html, {
        waitUntil: 'networkidle0'
      });

      // 等待字体加载
      await page.evaluateHandle('document.fonts.ready');

      // 截图
      await page.screenshot({
        path: outputPath,
        type: 'png',
        fullPage: false
      });

      console.log(`   ✅ 已保存: ${outputPath}`);
    }

    console.log(`\n✨ 完成！生成了 ${sections.length} 张图片`);
    console.log(`📍 输出位置: ${outputDir}`);

  } finally {
    await browser.close();
  }
}

// 命令行入口
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Usage: node generate-images.js <html-file>');
  console.log('Example: node generate-images.js output/article-wechat.html');
  process.exit(1);
}

const htmlPath = args[0];

generateImages(htmlPath).catch(err => {
  console.error('❌ 错误:', err);
  process.exit(1);
});
