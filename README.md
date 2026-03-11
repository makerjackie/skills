# 01MVP Skills

这是 01MVP 推荐的好用 Skills 仓库合集。

## 安装

安装后按提示选择你想使用的 Skills：

```bash
npx skills add 01mvp/skills
```

安装本仓库全部 Skills：

```bash
npx skills add 01mvp/skills --all
```

如果只安装某个 Skill：

```bash
npx skills add 01mvp/skills --skill [skill-name]
```

国内用户如果无法通过前面的方式安装，可使用 CNB 仓库地址：

```bash
npx skills add https://cnb.cool/01mvp/skills
```

## 推送同步说明

每次更新代码并 push 时，需要同时同步到 `https://cnb.cool/01mvp/skills`。

```bash
git push origin <branch>
git push cnb <branch>
```

## Skills 列表

| Skills 名称 | 一句话介绍 |
| --- | --- |
| [cloudflare-redirector](./skills/cloudflare-redirector/README.md) | 使用 Cloudflare Workers 配置和部署批量域名重定向（含 DNS 同步与规则编译）。 |

## 仓库结构

- `skills/<skill-name>/SKILL.md`: Skill 指令入口
- `skills/<skill-name>/README.md`: Skill 快速说明
- `skills/<skill-name>/scripts/*`: 自动化脚本
- `skills/<skill-name>/references/*`: 参考资料（可选）
