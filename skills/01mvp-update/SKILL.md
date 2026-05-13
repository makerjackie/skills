---
name: 01mvp-update
description: Generate and publish reader-facing 01MVP update digests. Use this skill whenever the user says /01mvp-update, asks to update the 01MVP changelog, summarize recent 01MVP knowledge-base changes, prepare a WeChat official-account update, write update copy for WeChat groups, X/Twitter, Xiaohongshu, or English readers, or wants one command/skill to handle recent 01MVP updates end to end.
---

# 01MVP Update

Turn recent 01MVP product, docs, and knowledge-base changes into reader-facing
update materials.

This skill is the top-level workflow. It may reuse the visual style and
rendering ideas from `mj-adapt`, but it is not the same job:

- `01mvp-update`: discover recent changes, decide what matters to readers,
  update website changelog surfaces, and write multi-platform update copy.
- `mj-adapt`: adapt an already-finished article into platform-specific formats.

## Default Inputs

Default repo:

```txt
/Users/jackiexiao/code/makerjackie/01mvp
```

If the user gives a date range, commit range, or notes, use them. Otherwise:

1. Run `pnpm changelog:draft` in the 01MVP repo if available.
2. Read `.agents/changelog-drafts/latest.md`.
3. Read `apps/01mvp-web/content/docs/about/changelog.mdx`.
4. Read the touched docs/pages when needed to understand the reader benefit.
5. Treat user-provided notes as higher priority than git evidence.

`pnpm changelog:draft` uses the newest date heading in
`apps/01mvp-web/content/docs/about/changelog.mdx` as the default checkpoint. If
the last public entry is Monday and the skill runs again on Friday, summarize
the changes between Monday and Friday. If the user runs multiple updates on the
same day, ask for or infer a commit range to avoid repeating the same-day
changes.

## What To Update Directly

When the user asks to run the update workflow, do these edits directly unless
they explicitly ask for discussion only:

1. Insert a reviewed, reader-facing entry at the top of
   `apps/01mvp-web/content/docs/about/changelog.mdx`.
2. Update the homepage recent-update source if one exists. If the homepage still
   uses inline data, update the inline array and mention that it should later be
   moved to a shared data file.
3. Generate one archive Markdown file:
   `output/01mvp-updates/YYYY-MM-DD-<slug>.md`.
4. Generate a WeChat HTML file beside it:
   `output/01mvp-updates/YYYY-MM-DD-<slug>.wechat.html`.
5. Show the copyable sections directly in chat after the files are generated.

Do not generate Xiaohongshu images by default. Generate Xiaohongshu text only.
Only create image assets when the user explicitly asks for them.

## Reader Filter

The final update is not a commit summary. Keep only changes readers can notice
or benefit from:

- new docs, guides, cases, tools, templates, workflows, or visible UI
- better reading path, clearer navigation, stronger trust/update signals
- product features people can try
- pricing, membership, template capability, or community changes
- fixes that remove a real reader pain

Usually omit:

- refactors, build fixes, package bumps, internal script cleanup
- file moves unless the visible reading path changed
- raw commit hashes, branch names, internal file paths
- agent workflow details

## Writing Style

Use friendly, practical, reader-facing Chinese. The update should answer:

- What changed?
- What problem does it solve for the reader?
- Where can the reader try or read it?
- What should they do next?

Prefer the user's natural update style:

```txt
今天网站新增了一个很实用的小功能：01MVP Drop。

我们现在经常 vibe coding 写 HTML，比如 slide、产品宣传页、小游戏页面。
但想分享给朋友时很麻烦：你需要部署、绑域名、处理静态文件。

现在你只要把 HTML 或 zip 上传到 01mvp.com/drop，就能直接变成一个网址。
朋友点开就能看。
```

Keep the article concrete. Avoid generic launch-note language.

## Output Bundle

Create one Markdown archive file with this structure:

```markdown
# 01MVP 更新素材 - YYYY-MM-DD

## 已更新到网站

- Changelog: ...
- 首页最近更新: ...

## 公众号文章

标题：...

正文：
...

## 微信群短消息

...

## X / Twitter

...

## 小红书文案

标题：...

正文：
...

标签：
...

## English Update

...

## 证据与备注

- 来源：...
- 人工备注：...
```

Then render the WeChat article section into HTML:

```bash
node /Users/jackiexiao/code/makerjackie/skills/skills/01mvp-update/scripts/render-wechat-html.mjs \
  output/01mvp-updates/YYYY-MM-DD-<slug>.md \
  --out output/01mvp-updates/YYYY-MM-DD-<slug>.wechat.html
```

## WeChat Article Format

The official-account article should usually be 800-1500 Chinese characters.
For small feature updates, 600-1000 Chinese characters is better. Keep it easy
to scan on mobile: short paragraphs, concrete examples, and no long
meta-explanations about the update process.

Use this structure:

1. Make the title clearly say this is a 01MVP.com, 01MVP handbook,
   knowledge-base, or product update. Examples: `01MVP.com 更新：...`,
   `01MVP 手册更新：...`, `01MVP 知识库最近更新：...`.
2. Start with the reader pain or concrete use case.
3. Explain the update in plain language.
4. List 3-5 useful changes.
5. Link the changes to reader outcomes.
6. End with a concrete CTA that makes 01MVP feel worth reading or buying:
   read the guide, try the feature, join the community, or become a member to
   keep receiving deeper cases, templates, and future updates.

Never put internal editorial notes, AI instructions, or implementation
commentary into the HTML. Reader-facing copy can mention that the update is
practical and focused on useful changes, but do not write phrases like
`不写内部工程流水账`.

Keep the ending compact. Do not stack a separate CTA block and an author card
with repeated text. Use one concise author/CTA card, and expose only
`01mvp.com` in visible copy unless the user explicitly asks for a deep link.

Example article skeleton:

```markdown
标题：01MVP 最近更新：手册路径更清楚了

正文：
这次主要整理了 01MVP 的阅读路径。

以前它更像一个工具箱，你能找到很多实用教程，但新读者可能不知道从哪里开始。

现在我把它改成了一条更清楚的路径：从认识自己、验证问题，到构建 MVP、上线、收费和持续运营。

## 这次更新了什么

1. ...

## 对你有什么用

...

## 可以先看这里

...

## 后面会继续更新

...
```

For feature updates, prefer titles like:

```txt
01MVP.com 更新：一键拖拽，把 HTML 变成网址
01MVP Drop 更新：把 HTML 页面直接分享给朋友
```

Avoid stiff titles like `部署 HTML 为网址`; use `把 HTML 变成网址` or
`生成一个可分享的网址`.

## WeChat HTML Rendering

The bundled renderer produces a MakerJackie-style WeChat HTML file with inline
styles: white background, black borders, monospace labels, strong section
hierarchy, and a footer pointing readers back to 01MVP.

Use the renderer for the HTML file. Do not hand-write the full HTML unless the
script fails.

## Final Chat Response

After running the workflow, keep the final response compact:

- say what website files were updated
- give the generated Markdown and HTML paths
- paste the copyable sections: WeChat article title/body, group message,
  X/Twitter, Xiaohongshu text, English update
- list checks run

Do not end by telling the user to open the Markdown file. The Markdown is an
archive; the chat response should contain the usable copy.
