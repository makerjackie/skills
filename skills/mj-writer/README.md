# mj-writer

MakerJackie 内容创作总入口。它负责文章选题、写作调研、公众号长文、AI 教程、语音转文章、文章审校、视频脚本口语化和演讲稿优化。

## 安装

```bash
npx skills add makerjackie/skills --skill mj-writer
```

## 快速使用

```text
Use $mj-writer to turn this voice transcript into a publishable article.
```

```text
Use $mj-writer to give me 4 article angles for this topic, with titles, outlines, effort, and risks.
```

```text
Use $mj-writer to review this draft and make it sound more like MakerJackie.
```

## 工作模式

| 模式 | 用途 |
| --- | --- |
| 选题模式 | 给出 3-4 个标题、角度、大纲和优劣分析 |
| 写作调研模式 | 为文章或教程搜集资料、验证事实、保存来源 |
| 写作模式 | 从素材产出公众号文章、教程、长推或实战指南 |
| 语音转文章模式 | 把口述、语音识别稿、会议记录整理成文章 |
| 审校模式 | 降低 AI 味，修复逻辑、节奏和表达问题 |
| 视频脚本模式 | 把书面稿改成适合说出来的视频脚本 |
| 演讲教练模式 | 优化分享、培训、PPT 演讲和 B 站教程结构 |

## 适用边界

这个 skill 只处理内容工作流。如果任务是部署、DNS、UI 设计、普通网页搜索或代码排查，请使用对应的其他 skill 或系统能力。

---

## 为什么需要这个 skill？

内容创作最容易卡在几个地方，选题太散、资料没有证据、初稿像 AI、语音素材没法直接发布、视频脚本读起来别扭。

`mj-writer` 把这些环节合并成一个入口。你不用在多个 skill 之间切换，只要说明你现在处在哪个阶段，它会选择对应模式处理。

它的目标不是替你编造经历，而是帮你把已有素材、判断、案例和真实表达组织成更清晰的内容。
