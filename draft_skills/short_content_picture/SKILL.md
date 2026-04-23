---
name:  short_content_picture
description:  生成"短的"系列（短的教程，短的回答）的图文内容
tools: [write_to_file, run_command]
---

# 生成短内容 (Generate Short Content)

此技能帮助你使用“硬核极简主义”设计语言为 01MVP 生成一致的“短内容”资产。

有两种模式：
1.  **短教程 (Short Tutorial)**：用于教授特定技能或工具的 4 页轮播图。
2.  **短回答 (Short Answer)**：用于以强烈观点回答特定问题的单页冲击卡片。

## 1. 短教程 (4 页)

适用于：工具、技能、工作流（例如，“如何使用 Remotion”）。

### 结构
*   **P1 (封面)**：
    *   **页眉**：`01MVP / 短的教程 / #XXX`
    *   **标题**：钩子问题（例如，“如何 30 秒生成视频？”）。
*   **P2 (步骤 1)**：
    *   **页眉**：同上。
    *   **标题**：设置 / 第一步行动。
    *   **内容**：代码片段或清晰指令。
*   **P3 (步骤 2)**：
    *   **页眉**：同上。
    *   **页眉**：同上。
*   **根据实际情况选择合适的页数**
*   **最后一页**：【固定内容，不会变化，请直接使用模板的 页面】
    *   **页眉**：`01MVP / 短的教程 / 理念`
    *   **主标题**："别收藏，去动手" (白色, 巨大)。
    *   **副标题**："AI 迭代太快" (灰色)。
    *   **理念**：复选框列表 (简单 > 复杂)。
    *   **页脚**：Jackie 简介 + 搜索 CTA。

### 工作流
1.  **规划**：根据用户输入定义所有 4 页的内容。
2.  **读取模板**：读取 `.agents/skills/short_tutorial/resources/tutorial_template.html`。
3.  **生成**：替换模板中的内容。
    *   更新 `#001` 为正确的编号。
    *   更新 `v2026.XX` 日期。
4.  **保存**：保存到 `public/tutorials/[YYYY-MM-DD]-[topic]-tutorial.html`。

---

## 2. 短回答 (1 页)

适用于：观点、心态、快速提示（例如，“什么是 MVP？”）。

### 结构
*   **页眉**：`短的回答 #XXX`
*   **问题**：黑色，大字 (顶部 1/3)。
*   **回答**：中号，粗体 (中部)。
*   **解释**：灰色，小字 (可选的详细说明)。
*   **页脚**：单行：头像 + "创造者 Jackie"。

### 工作流
1.  **规划**：定义问题、回答（一句话）和解释说明。
2.  **读取模板**：读取 `.agents/skills/short_tutorial/resources/short_answer_template.html`。
3.  **生成**：替换模板中的内容。
    *   更新 `#001` 为正确的编号。
4.  **保存**：保存到 `public/tutorials/[YYYY-MM-DD]-[topic]-answer.html`。

---

## 截图生成 (可选)

将 HTML 转换为 PNG 以便发布：
*   命令：`node .agents/skills/short_tutorial/resources/screenshot.js [path_to_html]`
*   *(需要 puppeteer)*
