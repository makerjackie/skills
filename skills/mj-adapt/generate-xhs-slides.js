#!/usr/bin/env node

import { existsSync, mkdirSync } from 'fs';
import { basename, extname, join, resolve } from 'path';
import { pathToFileURL } from 'url';
import puppeteer from 'puppeteer';

const VIEWPORT_WIDTH = 1400;
const VIEWPORT_HEIGHT = 1600;
const DEVICE_SCALE_FACTOR = 2;

function usage() {
  console.error('Usage: node generate-xhs-slides.js <xhs-slides.html> [output-dir]');
}

function slugFromPath(filePath) {
  return basename(filePath, extname(filePath));
}

function outputBaseName(filePath) {
  return slugFromPath(filePath).replace(/([.-])xhs-slides$/i, '').replace(/([.-])slides$/i, '');
}

function ensureHtmlInput(inputPath) {
  if (!existsSync(inputPath)) {
    throw new Error(`Input file does not exist: ${inputPath}`);
  }

  if (!inputPath.endsWith('.html')) {
    throw new Error(
      'generate-xhs-slides.js now renders AI-generated HTML slides directly. ' +
        'Pass an xhs-slides.html file that contains one or more `.slide` sections.',
    );
  }
}

async function collectSlides(page) {
  await page.waitForSelector('.slide');

  const overflow = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.slide')).map((slide, index) => {
      const rect = slide.getBoundingClientRect();
      return {
        index,
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        scrollWidth: slide.scrollWidth,
        scrollHeight: slide.scrollHeight,
        clientWidth: slide.clientWidth,
        clientHeight: slide.clientHeight,
      };
    });
  });

  const overflowed = overflow.filter(
    (slide) => slide.scrollWidth > slide.clientWidth || slide.scrollHeight > slide.clientHeight,
  );

  if (overflowed.length > 0) {
    const detail = overflowed
      .map(
        (slide) =>
          `slide ${slide.index + 1}: ${slide.width}x${slide.height}, ` +
          `scroll=${slide.scrollWidth}x${slide.scrollHeight}, client=${slide.clientWidth}x${slide.clientHeight}`,
      )
      .join('; ');
    throw new Error(`Slide overflow detected: ${detail}`);
  }

  const slides = await page.$$('.slide');
  if (slides.length === 0) {
    throw new Error('No `.slide` elements found in the HTML.');
  }

  return slides;
}

async function renderSlides(inputPath, outputDir) {
  mkdirSync(outputDir, { recursive: true });

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({
      width: VIEWPORT_WIDTH,
      height: VIEWPORT_HEIGHT,
      deviceScaleFactor: DEVICE_SCALE_FACTOR,
    });

    await page.goto(pathToFileURL(inputPath).href, {
      waitUntil: 'networkidle0',
    });

    const slides = await collectSlides(page);
    const baseName = outputBaseName(inputPath);

    for (const [index, slideHandle] of slides.entries()) {
      const box = await slideHandle.boundingBox();
      if (!box) {
        throw new Error(`Unable to measure slide ${index + 1}`);
      }

      const outputPath = join(outputDir, `${baseName}-${index + 1}.png`);
      await page.screenshot({
        path: outputPath,
        type: 'png',
        clip: {
          x: box.x,
          y: box.y,
          width: box.width,
          height: box.height,
        },
        captureBeyondViewport: true,
      });
    }
  } finally {
    await browser.close();
  }
}

async function main() {
  const [inputPathArg, outputDirArg] = process.argv.slice(2);
  if (!inputPathArg) {
    usage();
    process.exit(1);
  }

  const inputPath = resolve(inputPathArg);
  ensureHtmlInput(inputPath);

  const outputDir = resolve(outputDirArg ?? join(process.cwd(), 'output', outputBaseName(inputPath)));
  await renderSlides(inputPath, outputDir);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
