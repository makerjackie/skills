# mj-skill-creator

把一个反复出现的 MakerJackie 工作流固化成可安装 skill，并完成 README、commit、push、全局安装。

## 安装

```bash
npx skills add makerjackie/skills --skill mj-skill-creator
```

## 快速使用

```text
Use $mj-skill-creator to create a new skill for this workflow:

每次我整理小红书创作者主页时，都需要用 Chrome 登录态采集 /explore 链接，再导入 Get笔记，从 web_content 总结。
```

也可以用于更新已有 skill：

```text
Use $mj-skill-creator to update the mj-adapt skill README with a new usage example, then commit, push, and reinstall it globally.
```

## 它会做什么

1. 在 `/Users/jackiexiao/code/makerjackie/skills/skills/<skill-name>/` 创建或更新 skill
2. 写 `SKILL.md`
3. 写 `README.md`
4. 写 `agents/openai.yaml`
5. 更新根目录 `README.md` 的技能列表
6. 跑 skill 校验和 `git diff --check`
7. commit、push
8. 运行 `npx skills add makerjackie/skills --skill <skill-name> -g --yes`

## 前提条件

- 本地有 `/Users/jackiexiao/code/makerjackie/skills`
- 当前机器能运行 `npx skills add`
- 需要推送时，GitHub 远程权限已经配置好

---

# 把临时经验变成可复用技能

很多工作流第一次做是探索，第二次做就应该沉淀。

比如你刚跑通了一个“Chrome 采集小红书链接 → Get笔记解析 → 用 web_content 总结”的流程。如果每次都靠聊天记录回忆步骤，很快就会丢细节。`mj-skill-creator` 的作用就是把这类经验变成一个标准 skill：有触发条件、有安装方式、有使用示例，也能进入全局技能列表。

它适合在这些时候使用：

- 一个流程已经验证过，想以后重复使用
- 想把某次成功经验写成 skill
- 想让别人通过 `npx skills add makerjackie/skills --skill ...` 安装
- 想更新 skills 仓库 README 并自动发布到全局
