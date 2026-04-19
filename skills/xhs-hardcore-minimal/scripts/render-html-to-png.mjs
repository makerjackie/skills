#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

function printUsage() {
  console.log(`Usage:
  node render-html-to-png.mjs --input <html-file-or-dir> --output <png-dir> [options]

Options:
  --width <number>      Viewport width (default: 1080)
  --height <number>     Viewport height (default: 1440)
  --scale <number>      Device scale factor (default: 2)
  --delay <number>      Wait time after load in ms (default: 200)
  --selector <string>   Screenshot a specific selector instead of whole page
`);
}

function parseArgs(argv) {
  const opts = {
    width: 1080,
    height: 1440,
    scale: 2,
    delay: 200,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;

    const key = token.slice(2);
    const value = argv[i + 1];

    if (["input", "output", "selector"].includes(key)) {
      if (!value || value.startsWith("--")) {
        throw new Error(`Missing value for --${key}`);
      }
      opts[key] = value;
      i += 1;
      continue;
    }

    if (["width", "height", "scale", "delay"].includes(key)) {
      if (!value || value.startsWith("--")) {
        throw new Error(`Missing value for --${key}`);
      }
      const numericValue = Number(value);
      if (!Number.isFinite(numericValue) || numericValue <= 0) {
        throw new Error(`Invalid numeric value for --${key}: ${value}`);
      }
      opts[key] = numericValue;
      i += 1;
      continue;
    }

    throw new Error(`Unknown option: ${token}`);
  }

  if (!opts.input || !opts.output) {
    throw new Error("--input and --output are required");
  }

  return opts;
}

function listHtmlFiles(inputPath) {
  const absoluteInput = path.resolve(inputPath);
  if (!fs.existsSync(absoluteInput)) {
    throw new Error(`Input path does not exist: ${absoluteInput}`);
  }

  const stat = fs.statSync(absoluteInput);
  if (stat.isFile()) {
    if (!absoluteInput.endsWith(".html")) {
      throw new Error("Input file must end with .html");
    }
    return [absoluteInput];
  }

  const files = fs
    .readdirSync(absoluteInput)
    .filter((name) => name.toLowerCase().endsWith(".html"))
    .map((name) => path.join(absoluteInput, name))
    .sort((a, b) => a.localeCompare(b, "en"));

  if (files.length === 0) {
    throw new Error(`No .html files found in directory: ${absoluteInput}`);
  }

  return files;
}

function cleanupOldPng(outputDir) {
  if (!fs.existsSync(outputDir)) return;
  const oldPng = fs
    .readdirSync(outputDir)
    .filter((name) => /^page-\d+\.png$/i.test(name))
    .map((name) => path.join(outputDir, name));
  for (const file of oldPng) {
    fs.unlinkSync(file);
  }
}

async function loadPlaywright() {
  try {
    const mod = await import("playwright");
    return { mod, mode: "module" };
  } catch {
    return { mod: null, mode: "npx" };
  }
}

function renderWithNpx(htmlFiles, outputDir, opts) {
  for (const htmlPath of htmlFiles) {
    const baseName = path.basename(htmlPath, ".html");
    const outputPath = path.join(outputDir, `${baseName}.png`);
    const args = [
      "-y",
      "playwright@latest",
      "screenshot",
      "--browser",
      "chromium",
      "--viewport-size",
      `${opts.width},${opts.height}`,
      "--wait-for-timeout",
      String(opts.delay),
    ];

    if (opts.selector) {
      args.push("--locator", opts.selector);
    }

    args.push(pathToFileURL(htmlPath).toString(), outputPath);

    let res = spawnSync("npx", args, { encoding: "utf8" });

    if (res.status !== 0) {
      const combined = `${res.stdout || ""}\n${res.stderr || ""}`;
      const missingBrowser =
        combined.includes(
          "Please run the following command to download new browsers",
        ) || combined.includes("Executable doesn't exist");

      if (missingBrowser) {
        const install = spawnSync(
          "npx",
          ["-y", "playwright@latest", "install", "chromium"],
          { stdio: "inherit" },
        );
        if (install.status !== 0) {
          throw new Error("Failed to install chromium for npx playwright.");
        }
        res = spawnSync("npx", args, { encoding: "utf8" });
      }
    }

    if (res.stdout) process.stdout.write(res.stdout);
    if (res.stderr) process.stderr.write(res.stderr);
    if (res.status !== 0) {
      throw new Error(
        `Failed to render ${htmlPath} with npx playwright (exit ${res.status})`,
      );
    }
    console.log(`Rendered: ${outputPath}`);
  }
}

async function run() {
  let opts;
  try {
    opts = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    printUsage();
    process.exit(1);
  }

  const htmlFiles = listHtmlFiles(opts.input);
  const outputDir = path.resolve(opts.output);
  fs.mkdirSync(outputDir, { recursive: true });
  cleanupOldPng(outputDir);

  const runtime = await loadPlaywright();
  if (runtime.mode === "npx") {
    console.log(
      "playwright package not found in this project, fallback to npx playwright.",
    );
    renderWithNpx(htmlFiles, outputDir, opts);
    console.log(`Done. Total PNG files: ${htmlFiles.length}`);
    return;
  }

  const { chromium } = runtime.mod;
  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext({
      viewport: { width: opts.width, height: opts.height },
      deviceScaleFactor: opts.scale,
    });

    const page = await context.newPage();

    for (const htmlPath of htmlFiles) {
      const fileUrl = pathToFileURL(htmlPath).toString();
      const baseName = path.basename(htmlPath, ".html");
      const outputPath = path.join(outputDir, `${baseName}.png`);

      await page.goto(fileUrl, { waitUntil: "networkidle" });
      await page.waitForTimeout(opts.delay);

      if (opts.selector) {
        const locator = page.locator(opts.selector);
        if ((await locator.count()) === 0) {
          throw new Error(
            `Selector not found in ${htmlPath}: ${opts.selector}`,
          );
        }
        await locator.first().screenshot({ path: outputPath, type: "png" });
      } else {
        await page.screenshot({
          path: outputPath,
          type: "png",
          fullPage: false,
        });
      }

      console.log(`Rendered: ${outputPath}`);
    }

    await context.close();
    console.log(`Done. Total PNG files: ${htmlFiles.length}`);
  } finally {
    await browser.close();
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
