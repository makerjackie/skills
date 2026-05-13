#!/usr/bin/env node

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

function parseArgs(argv) {
  const options = {
    input: undefined,
    out: undefined,
    date: new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Shanghai",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date()),
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--out") {
      options.out = argv[++index];
    } else if (arg.startsWith("--out=")) {
      options.out = arg.slice("--out=".length);
    } else if (arg === "--date") {
      options.date = argv[++index];
    } else if (arg.startsWith("--date=")) {
      options.date = arg.slice("--date=".length);
    } else if (!options.input) {
      options.input = arg;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!options.input) {
    throw new Error("Usage: render-wechat-html.mjs <update.md> --out <output.html>");
  }

  options.out =
    options.out ?? options.input.replace(/\.md$/i, ".wechat.html");

  return options;
}

function extractWeChatSection(markdown) {
  const sectionMatch = markdown.match(/^##\s+公众号文章\s*\n([\s\S]*)$/m);
  const raw = sectionMatch?.[1]?.trim() || markdown.trim();
  const platformBoundary = raw.search(
    /^##\s+(微信群短消息|X\s*\/\s*Twitter|小红书文案|English Update|证据与备注)\s*$/m,
  );
  const articleRaw =
    platformBoundary >= 0 ? raw.slice(0, platformBoundary).trim() : raw;
  const titleMatch =
    articleRaw.match(/^标题[：:]\s*(.+)$/m) || markdown.match(/^#\s+(.+)$/m);
  const title = titleMatch?.[1]?.trim() || "01MVP 最近更新";
  const body = articleRaw
    .replace(/^标题[：:].*$/m, "")
    .replace(/^正文[：:]\s*$/m, "")
    .trim();

  return { title, body };
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inlineMarkdown(value) {
  let html = escapeHtml(value);
  html = html.replace(/`([^`]+)`/g, (_match, code) => {
    return `<code style="padding:2px 4px;background-color:#f3f4f6;border-radius:4px;font-family:Menlo,Monaco,Consolas,'Courier New',monospace;font-size:14px;">${code}</code>`;
  });
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(
    /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
    '<a href="$2" style="color:#000000;text-decoration:underline;text-underline-offset:3px;">$1</a>',
  );
  return html;
}

function paragraph(text) {
  return `<p style="margin:0 0 18px;font-size:16px;line-height:1.65;color:#111111;">${inlineMarkdown(text)}</p>`;
}

function sectionHeading(title, number) {
  return `<section style="margin:32px 0 18px;padding-top:14px;border-top:3px solid #000000;box-sizing:border-box;">
  <p style="margin:0 0 10px;font-size:12px;line-height:1.6;letter-spacing:1px;color:#000000;font-weight:700;font-family:Menlo,Monaco,Consolas,'Courier New',monospace;">SECTION / ${String(number).padStart(2, "0")}</p>
  <p style="margin:0;font-size:25px;line-height:1.45;color:#000000;font-weight:900;">${escapeHtml(title)}</p>
</section>`;
}

function listBlock(items, ordered) {
  const tag = ordered ? "ol" : "ul";
  const style = ordered ? "decimal" : "square";
  const lis = items
    .map(
      (item) =>
        `<li style="margin-bottom:8px;">${inlineMarkdown(item.replace(/^\d+\.\s+|^[-*]\s+/, ""))}</li>`,
    )
    .join("\n");
  return `<section style="margin:0 0 24px;padding:0;box-sizing:border-box;">
  <${tag} style="margin:0;padding:0 0 0 20px;list-style-type:${style};color:#111111;font-size:16px;line-height:1.65;">
${lis}
  </${tag}>
</section>`;
}

function quoteBlock(lines) {
  return `<section style="margin:0 0 18px;padding:8px 16px;border-left:5px solid #000000;background-color:#f9f9f9;box-sizing:border-box;">
  <p style="margin:0;font-size:16px;line-height:1.65;color:#555555;font-style:italic;">${inlineMarkdown(lines.join(" "))}</p>
</section>`;
}

function renderBody(markdown) {
  const lines = markdown.split(/\r?\n/);
  const blocks = [];
  let buffer = [];
  let list = [];
  let listOrdered = false;
  let quote = [];
  let sectionCount = 0;

  function flushParagraph() {
    if (buffer.length > 0) {
      blocks.push(paragraph(buffer.join(" ")));
      buffer = [];
    }
  }

  function flushList() {
    if (list.length > 0) {
      blocks.push(listBlock(list, listOrdered));
      list = [];
    }
  }

  function flushQuote() {
    if (quote.length > 0) {
      blocks.push(quoteBlock(quote));
      quote = [];
    }
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushList();
      flushQuote();
      continue;
    }

    const heading = line.match(/^##+\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      flushQuote();
      sectionCount += 1;
      blocks.push(sectionHeading(heading[1], sectionCount));
      continue;
    }

    if (line.startsWith(">")) {
      flushParagraph();
      flushList();
      quote.push(line.replace(/^>\s?/, ""));
      continue;
    }

    if (/^\d+\.\s+/.test(line) || /^[-*]\s+/.test(line)) {
      flushParagraph();
      flushQuote();
      const ordered = /^\d+\.\s+/.test(line);
      if (list.length > 0 && listOrdered !== ordered) {
        flushList();
      }
      listOrdered = ordered;
      list.push(line);
      continue;
    }

    flushList();
    flushQuote();
    buffer.push(line);
  }

  flushParagraph();
  flushList();
  flushQuote();

  return blocks.join("\n\n");
}

function renderHtml({ title, body, date }) {
  return `<section style="margin:0;padding:24px 0;background-color:#ffffff;">
  <section style="margin:0 auto;padding:0;max-width:677px;box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">

    <section style="margin:0 0 24px;padding:18px;border:3px solid #000000;background-color:#ffffff;box-sizing:border-box;">
      <p style="margin:0 0 12px;font-size:12px;line-height:1.6;letter-spacing:1px;color:#000000;font-weight:700;font-family:Menlo,Monaco,Consolas,'Courier New',monospace;">
        01MVP 手册更新 / ${escapeHtml(date)}
      </p>
      <p style="margin:0;font-size:30px;line-height:1.35;color:#000000;font-weight:900;">
        ${escapeHtml(title)}
      </p>
    </section>

${renderBody(body)}

    <section style="margin:44px 0 0;padding:0;border:3px solid #000000;background-color:#ffffff;box-sizing:border-box;">
      <section style="padding:24px 24px 20px;">
        <p style="margin:0 0 6px;font-size:26px;line-height:1.1;color:#000000;font-weight:900;letter-spacing:-1px;">
          Maker Jackie
        </p>
        <p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:#000000;font-weight:700;letter-spacing:1px;font-family:Menlo,Monaco,Consolas,'Courier New',monospace;">
          独立开发者 / AI 实践者
        </p>
        <p style="margin:0 0 10px;font-size:16px;line-height:1.65;color:#111111;">
          01MVP 记录一个人如何用 AI 把想法做成产品：验证、上线、收费、增长和持续运营。
        </p>
        <p style="margin:0 0 22px;font-size:15px;line-height:1.65;color:#555555;">
          如果你也想做自己的小产品，可以从这里开始看。
        </p>
        <a href="https://01mvp.com/" style="display:inline-block;padding:10px 18px;background-color:#000000;color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;font-family:Menlo,Monaco,Consolas,'Courier New',monospace;letter-spacing:1px;">
          01mvp.com
        </a>
      </section>
      <section style="margin:0;padding:14px 24px;background-color:#f5f5f5;border-top:2px solid #000000;">
        <p style="margin:0;font-size:12px;line-height:1.6;color:#000000;font-family:Menlo,Monaco,Consolas,'Courier New',monospace;font-weight:700;letter-spacing:0.5px;">
          ID / @MakerJackie (微信 | 小红书 | X | B站)
        </p>
      </section>
    </section>

  </section>
</section>
`;
}

try {
  const options = parseArgs(process.argv.slice(2));
  const inputPath = resolve(options.input);
  const outPath = resolve(options.out);
  const markdown = readFileSync(inputPath, "utf8");
  const article = extractWeChatSection(markdown);
  const html = renderHtml({ ...article, date: options.date });
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html);
  console.log(`Wrote ${outPath}`);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
