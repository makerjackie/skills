#!/usr/bin/env node

import { existsSync, mkdirSync } from 'fs';
import { basename, extname, join, resolve } from 'path';
import { pathToFileURL } from 'url';
import puppeteer from 'puppeteer';

const VIEWPORT_WIDTH = 1400;
const VIEWPORT_HEIGHT = 1600;
const DEVICE_SCALE_FACTOR = 2;
const MIN_NON_FINAL_FILL_RATIO = 0.72;
const MAX_NON_FINAL_BLANK_BELOW = 320;

function usage() {
  console.error('Usage: node generate-xhs-slides.js <xhs-slides.html> [output-dir] [--allow-underfilled]');
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

function parseArgs(args) {
  const options = {
    allowUnderfilled: false,
    positional: [],
  };

  for (const arg of args) {
    if (arg === '--allow-underfilled') {
      options.allowUnderfilled = true;
    } else {
      options.positional.push(arg);
    }
  }

  return options;
}

async function collectSlides(page, options = {}) {
  await page.waitForSelector('.slide');

  const slideMetrics = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.slide')).map((slide, index) => {
      const rect = slide.getBoundingClientRect();
      const contentRoot = slide.querySelector('[data-role="content"]') ?? slide;
      const contentElements = Array.from(contentRoot.querySelectorAll('*')).filter((element) => {
        if (element.closest('[data-role="footer"], [data-role="page-number"]')) {
          return false;
        }

        const style = window.getComputedStyle(element);
        if (style.display === 'none' || style.visibility === 'hidden') {
          return false;
        }

        const elementRect = element.getBoundingClientRect();
        return elementRect.width > 0 && elementRect.height > 0;
      });

      const contentBottom = contentElements.reduce((bottom, element) => {
        const elementRect = element.getBoundingClientRect();
        return Math.max(bottom, elementRect.bottom - rect.top);
      }, 0);
      const blankBelow = Math.max(0, slide.clientHeight - contentBottom);

      return {
        index,
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        scrollWidth: slide.scrollWidth,
        scrollHeight: slide.scrollHeight,
        clientWidth: slide.clientWidth,
        clientHeight: slide.clientHeight,
        contentBottom: Math.round(contentBottom),
        fillRatio: slide.clientHeight > 0 ? contentBottom / slide.clientHeight : 0,
        blankBelow: Math.round(blankBelow),
      };
    });
  });

  const overflowed = slideMetrics.filter(
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

  if (!options.allowUnderfilled) {
    const underfilled = slideMetrics.filter(
      (slide) =>
        slide.index < slideMetrics.length - 1 &&
        (slide.fillRatio < MIN_NON_FINAL_FILL_RATIO || slide.blankBelow > MAX_NON_FINAL_BLANK_BELOW),
    );

    if (underfilled.length > 0) {
      const detail = underfilled
        .map(
          (slide) =>
            `slide ${slide.index + 1}: fill=${Math.round(slide.fillRatio * 100)}%, ` +
            `blankBelow=${slide.blankBelow}px, contentBottom=${slide.contentBottom}px`,
        )
        .join('; ');
      throw new Error(
        `Underfilled non-final slide detected: ${detail}. ` +
          `Merge content from the next slide or repaginate; pass --allow-underfilled only for debugging.`,
      );
    }
  }

  const slides = await page.$$('.slide');
  if (slides.length === 0) {
    throw new Error('No `.slide` elements found in the HTML.');
  }

  return slides;
}

async function renderSlides(inputPath, outputDir, options = {}) {
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

    const slides = await collectSlides(page, options);
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
  const { positional, allowUnderfilled } = parseArgs(process.argv.slice(2));
  const [inputPathArg, outputDirArg] = positional;
  if (!inputPathArg) {
    usage();
    process.exit(1);
  }

  const inputPath = resolve(inputPathArg);
  ensureHtmlInput(inputPath);

  const outputDir = resolve(outputDirArg ?? join(process.cwd(), 'output', outputBaseName(inputPath)));
  await renderSlides(inputPath, outputDir, { allowUnderfilled });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
