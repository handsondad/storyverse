# 小念家的漫画书

孩子和家人一起编故事，用代码画成漫画。故事是仓库里的 TypeScript 数据，画面由 SVG 引擎画出来——不用外部生图接口。

固定角色：小念、爸爸、妈妈（和 [身体奇遇记](https://github.com/handsondad/bodyverse) 同一个系列）。

## 本地运行

需要 Node.js 22+。

```bash
npm install
npm run dev
```

| 命令 | 作用 |
|---|---|
| `npm run dev` | 开发服务器 |
| `npm run typecheck` | 类型检查 |
| `npm test` | 测试 |
| `npm run check` | 检查故事内容 |
| `npm run snapshot -- <故事id>` | 截成 PNG |
| `npm run voice` | 给旁白和台词配音（edge-tts） |
| `npm run build` | 生产构建 |

## 加一个新故事

见 [AGENTS.md](AGENTS.md)。讲法和画法：

- [skills/storyverse-cocreate/SKILL.md](skills/storyverse-cocreate/SKILL.md) — 怎么和孩子共创
- [skills/storyverse-comic/SKILL.md](skills/storyverse-comic/SKILL.md) — 怎么写分镜、气泡、姿势

简单说：`npm run story:new -- <id>` → 写 `src/stories/<id>/story.ts` → `npm run check` → `npm run snapshot`。

## 部署

推送到 `main` 后，`.github/workflows/deploy.yml` 会跑测试、构建，并发布到 GitHub Pages。仓库 Settings → Pages 的 Source 选 **GitHub Actions**。

## 目录

| 位置 | 内容 |
|---|---|
| `src/stories/` | 故事数据 |
| `src/cast/` | 角色骨架、表情、姿势 |
| `src/engine/` | 版式、镜头、气泡排布 |
| `src/scenes/` | 背景 |
| `src/render/` | SVG 画图 |
| `src/pages/` | 书架、阅读、样张 |
| `skills/` | 给代码助手的共创/画法说明 |
| `ideas/legacy-books.md` | 旧版 AI 生图书的文字素材 |
| `archive/ai-image` 分支 | 旧的 Express + 生图版本 |

## 许可

代码 MIT（待补完整声明）。字体：站酷快乐体（OFL），子集在 `public/fonts/`。配音由微软 Edge 在线语音生成，见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。家庭和非商业使用。署名用角色名（小念、爸爸、妈妈），不要写家里其他人的名字。
