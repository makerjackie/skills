# Chrome Collector Snippets

Use these snippets with the Chrome plugin's Node-backed browser runtime after connecting to the user's logged-in Chrome profile.

## Claim Or Open Xiaohongshu Tab

```js
if (!globalThis.agent) {
  const { setupBrowserRuntime } = await import("<chrome-plugin-root>/scripts/browser-client.mjs");
  await setupBrowserRuntime({ globals: globalThis });
}
if (!globalThis.browser) {
  globalThis.browser = await agent.browsers.get("extension");
}
await browser.nameSession("🔎 小红书链接采集");

const openTabs = await browser.user.openTabs();
const xhsInfo = openTabs.find((t) => (t.url || "").includes("xiaohongshu.com"));
globalThis.tab = xhsInfo ? await browser.user.claimTab(xhsInfo) : await browser.tabs.new();
await tab.goto("<xiaohongshu_profile_url>");
await tab.playwright.waitForLoadState({ state: "domcontentloaded", timeoutMs: 20000 });
await tab.playwright.waitForTimeout(3000);
```

## Collect Visible Cards

```js
async function collectVisibleCards() {
  return await tab.playwright.evaluate(() => {
    return Array.from(document.querySelectorAll("section.note-item"))
      .map((section) => {
        const title = section.querySelector("a.title")?.textContent?.trim() || "";
        const hrefs = Array.from(section.querySelectorAll("a"))
          .map((a) => a.href)
          .filter(Boolean);
        const explore = hrefs.find((h) => /\/explore\/[0-9a-f]{10,}/.test(h));
        const titleHref = section.querySelector("a.title")?.href || "";
        const idSource = explore || titleHref;
        const match = idSource.match(/(?:\/explore\/|\/profile\/[^/]+\/)([0-9a-f]{24})/);
        const token = (titleHref.match(/[?&]xsec_token=([^&]+)/) || [])[1] || "";
        const noteId = match?.[1] || "";
        return noteId
          ? {
              title,
              noteId,
              exploreUrl: `https://www.xiaohongshu.com/explore/${noteId}${
                token ? `?xsec_token=${token}&xsec_source=pc_user` : ""
              }`,
            }
          : null;
      })
      .filter(Boolean);
  }, null, { timeoutMs: 15000 });
}
```

## Scroll And Accumulate

```js
const seen = new Map();
let stagnant = 0;
let lastSeen = 0;

for (let i = 0; i < 30; i++) {
  for (const card of await collectVisibleCards()) {
    if (!seen.has(card.noteId)) seen.set(card.noteId, card);
  }
  if (seen.size === lastSeen) stagnant++;
  else stagnant = 0;
  lastSeen = seen.size;
  if (stagnant >= 4) break;

  await tab.cua.scroll({ x: 900, y: 780, scrollY: 950, scrollX: 0 });
  await tab.playwright.waitForTimeout(1800);
}

const cards = Array.from(seen.values());
console.log(JSON.stringify(cards, null, 2));
```

## Finish Browser Work

When the browser work is done, finalize Chrome tabs according to the Chrome skill instructions.
