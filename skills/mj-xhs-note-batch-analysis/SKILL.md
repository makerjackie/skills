---
name: mj-xhs-note-batch-analysis
description: Use when collecting or analyzing Xiaohongshu / 小红书 notes from a creator profile, board, or note links, especially when the user wants Chrome login-state collection, stable /explore/{noteId} URLs, Get笔记 import, web_content extraction, transcript cleanup, or a synthesized knowledge base from many notes.
---

# 小红书笔记批量分析

Use this skill to turn a Xiaohongshu creator profile into source material for analysis. The reliable path is:

1. Use the user's logged-in Chrome page to collect real `/explore/{noteId}` links.
2. Import links into Get笔记.
3. Pull `web_content` as the source text.
4. Summarize from the original `web_content`, not from Get笔记's AI summary.

## Prerequisites

- Use the Chrome plugin when the user mentions `@chrome` or the target page depends on logged-in Xiaohongshu state.
- Confirm `getnote auth status` is authenticated before any batch import.
- Keep browser discovery read-only. Do not inspect cookies, local storage, profile files, passwords, or session stores.

## Workflow

### 1. Validate With One Note

Before batching, save one note and inspect `web_content`:

```bash
getnote save '<explore_url>' --title '<title>' --tag '小红书采集验证' -o json
getnote note <note_id> --field web_content
```

Use this to check whether Get笔记 can parse the current Xiaohongshu URL format. Ignore `content` for final analysis unless the user explicitly wants Get笔记's generated summary.

### 2. Collect Profile Links In Chrome

For profile pages, public HTML may hide `noteId` values or return empty IDs. Use logged-in Chrome and collect from the rendered DOM while scrolling.

Read `references/chrome-collector.md` for the reusable Chrome snippets.

Collect records in this shape:

```json
{
  "title": "粉丝数真没有你想的那么重要",
  "noteId": "6a0c33e10000000008031847",
  "exploreUrl": "https://www.xiaohongshu.com/explore/6a0c33e10000000008031847?xsec_token=...&xsec_source=pc_user"
}
```

Xiaohongshu profile grids are virtualized. Keep a `Map` keyed by `noteId`, scroll, collect visible cards, dedupe, and stop only after repeated scrolls add no new IDs.

### 3. Import To Get笔记

Use `getnote save` for each deduped `exploreUrl`. Treat note IDs as strings because Get笔记 note IDs are int64.

Recommended batch rules:

- Start with 1-3 notes before a large run.
- Add tags such as creator name, platform, and import batch.
- If a knowledge base is requested, list KBs first with `getnote kbs -o json`, then add notes with `getnote kb add <topic_id> <note_id...>`.
- Expect each save to poll for a while. Do not assume import is instant.

### 4. Extract Source Text

Pull source material with:

```bash
getnote note <note_id> --field web_content
```

Use `web_content` as the durable source. It usually contains:

- hashtags
- image links
- video or image-text transcript
- occasional speech-to-text mistakes

Clean obvious transcript errors during synthesis. Keep source URLs beside extracted claims so the analysis can be traced back to notes.

### 5. Build The Knowledge Base

Synthesize across notes instead of summarizing one-by-one:

- Group repeated ideas by topic.
- Separate tactics, claims, examples, and open questions.
- Preserve useful source titles and URLs.
- Mark transcript uncertainty when a sentence appears mistranscribed.
- Avoid dumping long verbatim source text into public docs; write original synthesis and cite links.

## Output Shape

For a validation run, report:

- Profile or note URL tested.
- Number of links collected.
- Get笔记 note ID created.
- Whether `web_content` was usable.
- One short sample of the cleaned structure.

For a batch run, return:

- Total links collected, imported, failed, and skipped.
- Knowledge base topic ID if used.
- The synthesized Markdown file or docs location.
- Any transcript-quality risks that need manual review.

## Common Pitfalls

| Pitfall | Fix |
| --- | --- |
| Public HTML shows titles but empty `noteId` values | Use logged-in Chrome rendered DOM. |
| Reading only current DOM misses notes | Accumulate while scrolling because the grid is virtualized. |
| Using Get笔记 `content` as the source | Use `web_content`; `content` is an AI summary. |
| Treating note IDs as numbers | Keep IDs as strings. |
| Batch starts before auth is checked | Run `getnote auth status` first. |
