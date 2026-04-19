const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

function findAvatarFromParents(startDir) {
  let current = startDir;

  while (true) {
    const candidate = path.join(current, "public", "jackie-avatar.jpg");
    if (fs.existsSync(candidate)) {
      return candidate;
    }

    const parent = path.dirname(current);
    if (parent === current) {
      return null;
    }
    current = parent;
  }
}

function ensureAvatarAsset(htmlPath) {
  const expectedAvatarPath = path.resolve(
    path.dirname(htmlPath),
    "../jackie-avatar.jpg",
  );
  if (fs.existsSync(expectedAvatarPath)) {
    return;
  }

  const fromCwd = path.resolve(process.cwd(), "public", "jackie-avatar.jpg");
  const sourceAvatar = fs.existsSync(fromCwd)
    ? fromCwd
    : findAvatarFromParents(path.dirname(htmlPath));

  if (!sourceAvatar) {
    return;
  }

  fs.mkdirSync(path.dirname(expectedAvatarPath), { recursive: true });
  fs.copyFileSync(sourceAvatar, expectedAvatarPath);
  console.log(`ℹ️  Missing avatar fixed: ${expectedAvatarPath}`);
}

async function snapshot() {
  let puppeteer;
  try {
    puppeteer = require("puppeteer");
  } catch (e) {
    console.log("❌ Puppeteer not found. Identifying installation...");
    try {
      console.log("Installing puppeteer (temporary)...");
      execSync("npm install --no-save puppeteer", { stdio: "inherit" });
      puppeteer = require("puppeteer");
    } catch (err) {
      console.error(
        "Failed to install/load puppeteer. Please run: npm install -D puppeteer",
      );
      process.exit(1);
    }
  }

  const inputFile = process.argv[2];
  if (!inputFile) {
    console.error("Usage: node screenshot.js <path-to-html-file>");
    process.exit(1);
  }

  const htmlPath = path.resolve(inputFile);
  if (!fs.existsSync(htmlPath)) {
    console.error("File not found:", htmlPath);
    process.exit(1);
  }

  ensureAvatarAsset(htmlPath);

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  // Set a large viewport to ensure high resolution capture
  await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 2 });

  await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle0" });

  const slideElements = await page.$$(".slide");

  const outputDir = path.join(path.dirname(htmlPath), "images");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`Found ${slideElements.length} slides. Capturing...`);

  for (let i = 0; i < slideElements.length; i++) {
    const slide = slideElements[i];
    const box = await slide.boundingBox();

    // Create a precise filename
    const filename = `slide_${String(i + 1).padStart(2, "0")}.png`;
    const outputPath = path.join(outputDir, filename);

    if (box) {
      // Shadow is 12px. Add 30px padding to capture it fully.
      const padding = 30;
      const clip = {
        x: box.x,
        y: box.y,
        width: box.width + padding,
        height: box.height + padding,
      };

      // Use page.screenshot with clip instead of element.screenshot
      await page.screenshot({ path: outputPath, clip });
      console.log(`Saved: ${outputPath}`);
    }
  }

  await browser.close();
  console.log("✅ Done! Check the images folder.");
}

snapshot();
