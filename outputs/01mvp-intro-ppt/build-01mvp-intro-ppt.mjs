import fs from "node:fs/promises";
import path from "node:path";
import { FileBlob, Presentation, PresentationFile } from "@oai/artifact-tool";

const OUT_DIR = "/Users/jackiexiao/code/makerjackie/skills/outputs/01mvp-intro-ppt";
const PREVIEW_DIR = path.join(OUT_DIR, "previews");
const PPTX_PATH = path.join(OUT_DIR, "01mvp-intro.pptx");
const LOGO_PATH = "/Users/jackiexiao/code/makerjackie/01mvp.com/public/brand/01mvp-logo-dark.png";
const AVATAR_PATH = "/Users/jackiexiao/code/makerjackie/01mvp.com/public/jackie-avatar.jpg";

const COLORS = {
  black: "#000000",
  white: "#FFFFFF",
  paper: "#F7F7F5",
  gray: "#D9D9D9",
  gray2: "#B8B8B8",
  gray3: "#6B6B6B",
  light: "#EFEFEF",
};

const FONT = {
  display: "PingFang SC",
  body: "PingFang SC",
  mono: "SF Mono",
};

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function readImageBlob(imagePath) {
  const bytes = await fs.readFile(imagePath);
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
}

async function saveBinaryArtifact(artifact, outputPath) {
  if (artifact instanceof FileBlob) {
    await artifact.save(outputPath);
    return;
  }

  if (artifact?.arrayBuffer) {
    const buffer = Buffer.from(await artifact.arrayBuffer());
    await fs.writeFile(outputPath, buffer);
    return;
  }

  if (artifact instanceof Uint8Array || artifact instanceof ArrayBuffer) {
    await fs.writeFile(outputPath, Buffer.from(artifact));
    return;
  }

  if (artifact?.data) {
    await fs.writeFile(outputPath, Buffer.from(artifact.data));
    return;
  }

  throw new Error(`Unsupported artifact type for ${outputPath}`);
}

function addBox(slide, config) {
  const shape = slide.shapes.add({
    geometry: config.geometry ?? "rect",
    position: {
      left: config.left,
      top: config.top,
      width: config.width,
      height: config.height,
      rotation: config.rotation ?? 0,
    },
    fill: config.fill ?? COLORS.white,
    line: config.line ?? { width: 0, fill: COLORS.white },
  });

  if (config.text !== undefined) {
    shape.text = config.text;
    shape.text.fontSize = config.fontSize ?? 18;
    shape.text.bold = config.bold ?? false;
    shape.text.color = config.color ?? COLORS.black;
    shape.text.typeface = config.typeface ?? FONT.body;
    shape.text.alignment = config.alignment ?? "left";
    shape.text.verticalAlignment = config.verticalAlignment ?? "top";
    shape.text.insets = config.insets ?? { left: 16, right: 16, top: 12, bottom: 12 };
  }

  return shape;
}

function addTag(slide, { left, top, text, width = 160, fill = COLORS.black, color = COLORS.white }) {
  return addBox(slide, {
    left,
    top,
    width,
    height: 40,
    fill,
    text,
    fontSize: 18,
    bold: true,
    color,
    typeface: FONT.mono,
    verticalAlignment: "middle",
    insets: { left: 14, right: 14, top: 8, bottom: 8 },
  });
}

function addHeadline(slide, { left, top, width, text, size = 36, height = 62, color = COLORS.black }) {
  return addBox(slide, {
    left,
    top,
    width,
    height,
    fill: COLORS.paper,
    text,
    fontSize: size,
    bold: true,
    color,
    typeface: FONT.display,
    insets: { left: 0, right: 0, top: 0, bottom: 0 },
  });
}

function addBody(slide, { left, top, width, height, text, size = 20, color = COLORS.black, mono = false, bold = false }) {
  return addBox(slide, {
    left,
    top,
    width,
    height,
    fill: COLORS.paper,
    text,
    fontSize: size,
    bold,
    color,
    typeface: mono ? FONT.mono : FONT.body,
    insets: { left: 0, right: 0, top: 0, bottom: 0 },
  });
}

function addFrame(slide, pageNumber, title) {
  slide.background.fill = COLORS.paper;

  addBox(slide, {
    left: 60,
    top: 42,
    width: 220,
    height: 42,
    fill: COLORS.paper,
    text: "01MVP / INTRO",
    fontSize: 18,
    bold: true,
    color: COLORS.black,
    typeface: FONT.mono,
    verticalAlignment: "middle",
    insets: { left: 0, right: 0, top: 0, bottom: 0 },
  });

  addBox(slide, {
    left: 60,
    top: 88,
    width: 1160,
    height: 6,
    fill: COLORS.black,
  });

  addBox(slide, {
    left: 1100,
    top: 46,
    width: 120,
    height: 42,
    fill: COLORS.paper,
    text: String(pageNumber).padStart(2, "0"),
    fontSize: 30,
    bold: true,
    color: COLORS.gray2,
    typeface: FONT.mono,
    alignment: "right",
    verticalAlignment: "middle",
    insets: { left: 0, right: 0, top: 0, bottom: 0 },
  });

  addBox(slide, {
    left: 60,
    top: 650,
    width: 160,
    height: 26,
    fill: COLORS.paper,
    text: title,
    fontSize: 14,
    color: COLORS.gray3,
    typeface: FONT.mono,
    verticalAlignment: "middle",
    insets: { left: 0, right: 0, top: 0, bottom: 0 },
  });

  addBox(slide, {
    left: 1080,
    top: 640,
    width: 140,
    height: 30,
    fill: COLORS.paper,
    text: "01MVP",
    fontSize: 20,
    bold: true,
    color: COLORS.black,
    typeface: FONT.display,
    alignment: "right",
    verticalAlignment: "middle",
    insets: { left: 0, right: 0, top: 0, bottom: 0 },
  });
}

function addBulletColumn(slide, { left, top, width, title, items }) {
  addHeadline(slide, { left, top, width, text: title, size: 24, height: 40 });

  items.forEach((item, index) => {
    addBox(slide, {
      left,
      top: top + 58 + index * 72,
      width,
      height: 54,
      fill: COLORS.paper,
      text: `${String(index + 1).padStart(2, "0")}  ${item}`,
      fontSize: 22,
      color: COLORS.black,
      typeface: FONT.body,
      insets: { left: 0, right: 0, top: 0, bottom: 0 },
    });
  });
}

function addCard(slide, { left, top, width, height, title, body, invert = false }) {
  const fill = invert ? COLORS.black : COLORS.white;
  const color = invert ? COLORS.white : COLORS.black;
  addBox(slide, {
    left,
    top,
    width,
    height,
    fill,
    line: { width: 2, fill: COLORS.black },
  });
  addBox(slide, {
    left: left + 18,
    top: top + 18,
    width: width - 36,
    height: 34,
    fill,
    text: title,
    fontSize: 22,
    bold: true,
    color,
    typeface: FONT.display,
    insets: { left: 0, right: 0, top: 0, bottom: 0 },
  });
  addBox(slide, {
    left: left + 18,
    top: top + 66,
    width: width - 36,
    height: height - 82,
    fill,
    text: body,
    fontSize: 18,
    color,
    typeface: FONT.body,
    insets: { left: 0, right: 0, top: 0, bottom: 0 },
  });
}

async function buildDeck() {
  await ensureDir(OUT_DIR);
  await ensureDir(PREVIEW_DIR);

  const presentation = Presentation.create({
    slideSize: { width: 1280, height: 720 },
  });

  const logoBlob = await readImageBlob(LOGO_PATH);
  const avatarBlob = await readImageBlob(AVATAR_PATH);

  presentation.theme.colorScheme = {
    name: "01MVP",
    themeColors: {
      accent1: COLORS.black,
      accent2: COLORS.gray3,
      bg1: COLORS.paper,
      bg2: COLORS.white,
      tx1: COLORS.black,
      tx2: COLORS.gray3,
    },
  };

  const slide1 = presentation.slides.add();
  slide1.background.fill = COLORS.paper;
  addTag(slide1, { left: 74, top: 72, text: "AI 实战教程", width: 154 });
  addBox(slide1, {
    left: 248,
    top: 72,
    width: 180,
    height: 40,
    fill: COLORS.white,
    line: { width: 2, fill: COLORS.black },
    text: "正在施工中",
    fontSize: 18,
    bold: true,
    color: COLORS.black,
    typeface: FONT.mono,
    verticalAlignment: "middle",
    insets: { left: 16, right: 16, top: 8, bottom: 8 },
  });
  addBox(slide1, {
    left: 74,
    top: 126,
    width: 1130,
    height: 6,
    fill: COLORS.black,
  });
  addHeadline(slide1, { left: 74, top: 180, width: 520, text: "01MVP", size: 86, height: 96 });
  addBox(slide1, {
    left: 74,
    top: 298,
    width: 620,
    height: 82,
    fill: COLORS.black,
    text: "Jackie 的 AI 实战教程",
    fontSize: 42,
    bold: true,
    color: COLORS.white,
    typeface: FONT.display,
    verticalAlignment: "middle",
    insets: { left: 20, right: 20, top: 14, bottom: 14 },
  });
  addBody(slide1, {
    left: 74,
    top: 410,
    width: 700,
    height: 110,
    text: "从 0 到 1 实现你的 MVP，用 AI 做点好玩的",
    size: 30,
    color: COLORS.black,
    bold: true,
  });
  addBody(slide1, {
    left: 74,
    top: 560,
    width: 500,
    height: 40,
    text: "Build → Ship → Share → Learn",
    size: 20,
    color: COLORS.gray3,
    mono: true,
  });
  const logoImage = slide1.images.add({
    blob: logoBlob,
    fit: "contain",
    alt: "01MVP logo",
  });
  logoImage.position = { left: 720, top: 180, width: 460, height: 150 };
  addBox(slide1, {
    left: 1030,
    top: 620,
    width: 150,
    height: 34,
    fill: COLORS.paper,
    text: "01 / 07",
    fontSize: 28,
    bold: true,
    color: COLORS.gray2,
    typeface: FONT.mono,
    alignment: "right",
    verticalAlignment: "middle",
    insets: { left: 0, right: 0, top: 0, bottom: 0 },
  });

  const slide2 = presentation.slides.add();
  addFrame(slide2, 2, "WHY 01MVP");
  addHeadline(slide2, { left: 60, top: 130, width: 600, text: "为什么做 01MVP", size: 48, height: 60 });
  addBody(slide2, {
    left: 60,
    top: 206,
    width: 520,
    height: 48,
    text: "AI 变化太快，信息太碎，很多教程只会放大焦虑。",
    size: 24,
    color: COLORS.gray3,
  });
  addBulletColumn(slide2, {
    left: 60,
    top: 300,
    width: 520,
    title: "读者常见困境",
    items: [
      "更新太快，今天学会，明天过时",
      "工具一大堆，但做不出真正成果",
      "市面内容太营销，缺少可落地路径",
    ],
  });
  addBox(slide2, {
    left: 670,
    top: 160,
    width: 540,
    height: 430,
    fill: COLORS.black,
  });
  addHeadline(slide2, {
    left: 704,
    top: 196,
    width: 460,
    text: "珍重读者的时间",
    size: 40,
    height: 52,
    color: COLORS.white,
  });
  addBody(slide2, {
    left: 704,
    top: 274,
    width: 440,
    height: 250,
    text: "01  不跟风，只推荐真正长期使用的 AI 工作流\n\n02  别废话，先快速上手，再延伸阅读\n\n03  真诚推荐更好的内容，不把注意力浪费在包装上",
    size: 24,
    color: COLORS.white,
  });

  const slide3 = presentation.slides.add();
  addFrame(slide3, 3, "CONTENT MAP");
  addHeadline(slide3, { left: 60, top: 130, width: 700, text: "网站会有什么", size: 48, height: 60 });
  addBody(slide3, {
    left: 60,
    top: 204,
    width: 760,
    height: 40,
    text: "主线不是工具堆砌，而是把从入门到发布的路径压缩清楚。",
    size: 24,
    color: COLORS.gray3,
  });
  const modules = [
    ["快速开始", "2-3 小时内建立地图，并做出第一个 Demo"],
    ["基础准备", "账号、工具、环境与网络按需展开"],
    ["案例库", "从 10 分钟 Demo 到独立站、Agent 工作流"],
    ["部署工程化", "把代码真正变成可访问产品"],
    ["发布增长", "发布、反馈、SEO、变现与迭代"],
    ["Mindset & Life", "缓解焦虑、管理心力、长期做下去"],
  ];
  modules.forEach(([title, body], index) => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    addCard(slide3, {
      left: 60 + col * 390,
      top: 286 + row * 170,
      width: 350,
      height: 138,
      title,
      body,
      invert: index === 0 || index === 4,
    });
  });

  const slide4 = presentation.slides.add();
  addFrame(slide4, 4, "LOOP");
  addHeadline(slide4, { left: 60, top: 130, width: 760, text: "01MVP 的最小闭环", size: 48, height: 60 });
  addBody(slide4, {
    left: 60,
    top: 204,
    width: 760,
    height: 40,
    text: "先做出来，再发出去，再拿反馈。不要只停在“我还在准备”。",
    size: 24,
    color: COLORS.gray3,
  });
  const steps = [
    "痛点与用户",
    "需求描述",
    "原型",
    "最小可运行版本",
    "部署上线",
    "发布反馈",
    "继续迭代",
  ];
  steps.forEach((step, index) => {
    const x = 60 + index * 170;
    addBox(slide4, {
      left: x,
      top: 334,
      width: 144,
      height: 90,
      fill: index % 2 === 0 ? COLORS.white : COLORS.black,
      line: { width: 2, fill: COLORS.black },
      text: step,
      fontSize: 22,
      bold: true,
      color: index % 2 === 0 ? COLORS.black : COLORS.white,
      typeface: FONT.display,
      verticalAlignment: "middle",
      alignment: "center",
      insets: { left: 12, right: 12, top: 12, bottom: 12 },
    });
    if (index < steps.length - 1) {
      addBody(slide4, {
        left: x + 148,
        top: 362,
        width: 20,
        height: 32,
        text: "→",
        size: 26,
        color: COLORS.gray3,
        mono: true,
      });
    }
  });
  addCard(slide4, {
    left: 60,
    top: 500,
    width: 360,
    height: 110,
    title: "先做小",
    body: "能用一个页面讲清楚价值，就别先做十个页面。",
  });
  addCard(slide4, {
    left: 450,
    top: 500,
    width: 360,
    height: 110,
    title: "先做闭环",
    body: "至少要能打开、能演示、能发给别人看。",
    invert: true,
  });
  addCard(slide4, {
    left: 840,
    top: 500,
    width: 360,
    height: 110,
    title: "先拿反馈",
    body: "别靠脑补优化，先让真实用户告诉你哪里有价值。",
  });

  const slide5 = presentation.slides.add();
  addFrame(slide5, 5, "START HERE");
  addHeadline(slide5, { left: 60, top: 130, width: 760, text: "推荐上手顺序", size: 48, height: 60 });
  addBody(slide5, {
    left: 60,
    top: 204,
    width: 760,
    height: 40,
    text: "先完成一个最小案例，再逐步升级复杂度，不要一开始挑最难的项目。",
    size: 24,
    color: COLORS.gray3,
  });
  const pathCards = [
    ["STEP 01", "环境搭建", "一次配好，后续不再折腾"],
    ["STEP 02", "工具选择", "精选实用 AI 辅助工具"],
    ["STEP 03", "实战项目", "从零构建一个完整 MVP"],
    ["STEP 04", "上线发布", "部署上线并获取真实反馈"],
  ];
  pathCards.forEach(([step, title, body], index) => {
    const top = 270 + index * 96;
    addTag(slide5, { left: 60, top: top + 14, text: step, width: 120 });
    addCard(slide5, {
      left: 194,
      top,
      width: 390,
      height: 88,
      title,
      body,
      invert: index === 1 || index === 3,
    });
  });
  const examples = [
    ["猫咪补光灯网站", "10 分钟", "HTML + AI 编程工具"],
    ["做一个自己的文档网站", "半天到一天", "Next.js + Fumadocs"],
    ["Cloudflare Worker MVP", "1-2 天", "可上线网页产品"],
    ["海外独立站 MVP", "2-5 天", "Web + 支付 + 内容页"],
  ];
  examples.forEach(([title, time, desc], index) => {
    const top = 270 + index * 96;
    addCard(slide5, {
      left: 640,
      top,
      width: 560,
      height: 88,
      title,
      body: `${time}  ·  ${desc}`,
      invert: index === 0 || index === 2,
    });
  });

  const slide6 = presentation.slides.add();
  addFrame(slide6, 6, "BRAND");
  addHeadline(slide6, { left: 60, top: 130, width: 860, text: "01MVP 为什么长这样", size: 48, height: 60 });
  addBody(slide6, {
    left: 60,
    top: 204,
    width: 860,
    height: 40,
    text: "不是为了好看，是为了能用。让内容更容易被理解，也更容易推动行动。",
    size: 24,
    color: COLORS.gray3,
  });
  addBox(slide6, {
    left: 60,
    top: 280,
    width: 420,
    height: 260,
    fill: COLORS.black,
    text: "黑白灰\n强边框\n等宽字体",
    fontSize: 42,
    bold: true,
    color: COLORS.white,
    typeface: FONT.display,
    verticalAlignment: "middle",
    insets: { left: 28, right: 28, top: 28, bottom: 28 },
  });
  addCard(slide6, {
    left: 520,
    top: 280,
    width: 300,
    height: 118,
    title: "适合",
    body: "教程文档\n实战分享\n产品导览\nWorkshop 海报",
  });
  addCard(slide6, {
    left: 850,
    top: 280,
    width: 350,
    height: 118,
    title: "不属于 01MVP",
    body: "渐变、玻璃、圆角气泡、多中心布局",
    invert: true,
  });
  addCard(slide6, {
    left: 520,
    top: 430,
    width: 680,
    height: 110,
    title: "一句话定义",
    body: "Monochrome hardcore minimalism with strong borders, technical typography, modular layout, and decisive editorial hierarchy.",
  });

  const slide7 = presentation.slides.add();
  addFrame(slide7, 7, "ABOUT JACKIE");
  addHeadline(slide7, { left: 60, top: 130, width: 620, text: "关于 Jackie", size: 48, height: 60 });
  addBody(slide7, {
    left: 60,
    top: 204,
    width: 700,
    height: 40,
    text: "把自己从 0 到 1 做产品的经验，整理成一套少讲概念、多给路径的 AI 教程。",
    size: 24,
    color: COLORS.gray3,
  });
  const avatar = slide7.images.add({
    blob: avatarBlob,
    fit: "cover",
    alt: "Jackie avatar",
  });
  avatar.position = { left: 60, top: 282, width: 220, height: 220 };
  avatar.geometry = "roundRect";
  addCard(slide7, {
    left: 320,
    top: 282,
    width: 530,
    height: 220,
    title: "作者简介",
    body: "前 AI 算法工程师，现独立开发者，也是周周黑客松的发起人。\n\n01MVP 的目标不是让你囤积工具，而是帮你更快完成 Build → Ship → Share 的闭环，拿到真实反馈。",
  });
  addCard(slide7, {
    left: 880,
    top: 282,
    width: 320,
    height: 220,
    title: "下一步",
    body: "打开 01mvp.com\n先看 /docs/start\n先做一个能打开、能分享、能被别人使用的小东西",
    invert: true,
  });
  addBox(slide7, {
    left: 60,
    top: 564,
    width: 1140,
    height: 66,
    fill: COLORS.black,
    text: "先做出来，再发出去。别把自己卡在“我还在准备”。",
    fontSize: 30,
    bold: true,
    color: COLORS.white,
    typeface: FONT.display,
    verticalAlignment: "middle",
    insets: { left: 24, right: 24, top: 10, bottom: 10 },
  });

  for (const [index, slide] of presentation.slides.items.entries()) {
    const image = await presentation.export({ slide, format: "png", scale: 1 });
    await saveBinaryArtifact(
      image,
      path.join(PREVIEW_DIR, `slide-${String(index + 1).padStart(2, "0")}.png`),
    );
  }

  const pptx = await PresentationFile.exportPptx(presentation);
  await pptx.save(PPTX_PATH);

  return { PPTX_PATH };
}

buildDeck()
  .then(({ PPTX_PATH: outputPath }) => {
    console.log(`PPTX written to ${outputPath}`);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
