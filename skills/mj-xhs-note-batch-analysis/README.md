# mj-xhs-note-batch-analysis

批量采集小红书创作者主页的真实笔记链接，导入 Get笔记，再从 `web_content` 原文材料里做知识库分析。

## 安装

```bash
npx skills add makerjackie/skills --skill mj-xhs-note-batch-analysis
```

## 快速使用

```text
Use $mj-xhs-note-batch-analysis to collect this Xiaohongshu profile into Get笔记, then summarize from web_content:

https://www.xiaohongshu.com/user/profile/...
```

如果需要登录态，直接说明使用 `@chrome`：

```text
Use $mj-xhs-note-batch-analysis with @chrome to collect this logged-in Xiaohongshu profile, import one sample to Get笔记, and show me the web_content quality.
```

## 它解决什么

小红书公开页面经常只能看到标题、封面和点赞数，源码里的 `noteId` 可能为空，直接点链接也可能跳到登录错误页。这个 skill 固化了可行路径：用已经登录的 Chrome 页面读取渲染后的卡片链接，拿到稳定的 `/explore/{noteId}`，再交给 Get笔记解析。

## 工作流

1. 检查 `getnote auth status`
2. 用 Chrome 登录态打开创作者主页
3. 滚动主页，累计采集 `{ title, noteId, exploreUrl }`
4. 先导入 1 条验证 Get笔记解析质量
5. 批量 `getnote save`
6. 用 `getnote note <id> --field web_content` 拉原文
7. 从 `web_content` 自己总结，不使用 Get笔记 AI 摘要

## 注意

`web_content` 可能包含语音转写错误，整理知识库时需要清洗。公开输出时不要大段搬运原文，应保留来源链接并做原创综合。

---

# 小红书笔记批量分析：把创作者主页变成可整理的原始材料

很多小红书主页看起来能访问，但真正要批量整理时会卡在两个地方：

- 公开 HTML 拿不到每条笔记的真实链接
- Get笔记的 AI 摘要太像二次加工，不能直接当知识库来源

这个 skill 的重点不是“自动写总结”，而是把采集链路跑稳：先从登录态 Chrome 里拿到真实 `/explore/{noteId}`，再让 Get笔记解析出 `web_content`。后面的知识库整理基于原文转写来做，质量更可控。

适合用在这些场景：

- 批量研究某个小红书创作者的内容体系
- 把视频口播转写整理成方法论
- 把一批笔记导入 Get笔记知识库
- 做账号定位、选题、变现模型、内容结构分析
