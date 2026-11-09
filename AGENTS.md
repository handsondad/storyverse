# AGENTS.md：给接手这个仓库的代码助手

## 这是什么

「小念家的漫画书」：孩子和家人一起编故事，用代码画成漫画，发布到 GitHub Pages。没有后端，没有 AI 生图；故事是 `src/stories/` 里的 TypeScript 数据，画面由 SVG 引擎按数据画出来。

固定角色：小念（男孩）、爸爸、妈妈，是主角也是创作者。家里其他人只作为角色出场，目前有姥爷（`laoye`，妈妈的爸爸）。和《身体奇遇记》是同一个系列。

技术栈：React 18 + TypeScript（strict）+ Vite 5。Hash 路由，相对路径资源，部署在任意子路径下都能打开。

**写故事、画漫画之前，先读 `skills/storyverse-cocreate/SKILL.md` 和 `skills/storyverse-comic/SKILL.md`。**

## 命令

需要 Node.js 22+。测试和脚本直接用 Node 跑 `.ts` 文件。

| 命令 | 作用 |
|---|---|
| `npm run dev` | 开发服务器 |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | 全部测试 |
| `npm run check [-- <故事id>]` | 检查故事内容 |
| `npm run snapshot -- <故事id> [页码...]` | 截成 PNG，放在 `snapshots/` |
| `npm run snapshot -- cast <角色id>` | 截角色样张 |
| `npm run story:new -- <id>` | 新建故事目录 |
| `npm run font` | 按源码里用到的字重新截取字体 |
| `npm run voice [-- <故事id>]` | 用 edge-tts 给旁白和台词配音（只配新的和改过的句子） |
| `npm run build` | 生产构建，输出到 `dist/` |

交付前四个都要过：`npm run typecheck`、`npm test`、`npm run check`、`npm run build`。新故事还要 `npm run snapshot` 自己看一遍图。

## 地图

| 路由 | 页面 | 文件 |
|---|---|---|
| `#/` | 首页时间绳（按 `story.when.date` 排，位置在 `src/pages/timeline.ts`） | `src/pages/ShelfPage.tsx` |
| `#/read/<id>/0` | 封面 | `src/pages/ReadPage.tsx` |
| `#/read/<id>/<n>` | 第 n 页（从 1 数） | 同上 |
| `#/cast/<角色>` | 角色样张（姿势 + 表情） | `src/pages/CastPage.tsx` |

内容和引擎：

- `src/stories/<id>/story.ts`：一个故事一份数据，类型在 `src/story/types.ts`
- `src/stories/<id>/ideas.md`：和孩子聊到的点子，不进画面
- `src/stories/index.ts`：书架列表
- `src/cast/`：角色骨架、表情、姿势；`chair.ts` 是椅子和往后翘（画图、排版共用一套数）
- `src/engine/`：版式、镜头、气泡排布、折行（纯函数）
- `src/scenes/`：背景（客厅、餐厅、卫生间、公园、卧室、美术馆、地铁、纯色、放射线）和饭桌
- `src/render/`：SVG 画图组件
- `public/fonts/story.woff`：站酷快乐体子集（OFL）
- `tools/snapshot.mjs`：无头浏览器截 PNG
- `src/story/script.ts`：把故事摊成按顺序念的台词表，「听故事」和配音工具共用
- `src/pages/useStoryPlayer.ts`：听故事（一句一句冒出来、放配音、念完自动翻页）
- `tools/voice.mjs`：配音，输出 `public/voice/<故事>/<页>-<格>-<beat>.mp3` 和 `src/story/voice-manifest.ts`（生成的，别手改）
- `tests/story-rules.mjs`：内容检查器

旧的 Express 后端和 AI 生图版本在分支 `archive/ai-image`。旧书文字素材在 `ideas/legacy-books.md`。

## 加一个新故事

1. `npm run story:new -- <id>`（id 用小写字母和短横线）
2. 和孩子聊点子，记进 `ideas.md`（见 cocreate skill）
3. 写 `story.ts`，跑 `npm run check -- <id>` 直到通过
4. `npm run snapshot -- <id>`，打开 `snapshots/` 看图；挡脸、挤、缺字就改数据再截
5. 加了新汉字就跑 `npm run font`；台词定了就跑 `npm run voice`（要联网，需要 `python -m pip install edge-tts` 和 ffmpeg）
6. `npm run typecheck && npm test && npm run build`
7. 浏览器里从封面翻到最后一页，再看一眼手机宽度（390px）

## 硬性规矩

- **署名**：`credits.by` 只能是 `nian` / `dad` / `mom`（`CREATOR_IDS`）。他们既是角色也是创作者；姥爷这样的角色能出场，但不署名，也不要写家里人的真名。
- **孩子的内容**：
  - 不写真名、学校、住址。
  - 孩子自己录的声音默认放 `private/`，不进仓库；要公开才手动挪到 `public/voice/`。
  - 不写吓人、暴力、色情内容；不确定就先问大人。
- **角色**：小念是男孩，用「他」；爸爸「他」；妈妈「她」；姥爷「他」。加新家人角色要先问大人。
- **配音**：小念 `zh-CN-YunxiaNeural`，爸爸 `zh-CN-YunxiNeural`，妈妈 `zh-CN-XiaoxiaoNeural`，姥爷 `zh-CN-YunjianNeural`（放慢、压低）。旁白也用妈妈的声音（放慢一点），不另找别人的声音。设置在 `src/story/script.ts`。
- **素材许可**：站酷快乐体是 OFL；新素材要在 `THIRD_PARTY_NOTICES.md` 写明来源。
- **代码风格**：照周围代码写。中文注释只写代码本身表达不了的约束；改动要小而完整。

## 已知的坑

- **`.ts` 扩展名**：Node 直接跑 `.ts`，所以被测试导入的文件相互导入时要写 `.ts` 扩展名。`tsconfig` 开了 `allowImportingTsExtensions`。
- **字体缺字**：页面上出现方框，跑 `npm run font` 再刷新。
- **截图要用本机 Edge/Chrome**：`puppeteer-core` 不自带浏览器；找不到时设环境变量 `BROWSER_PATH`。
- **并行写文件**：几个代理同时往 `src/` 写大文件时，Vite 可能报 EBUSY，重启 `npm run dev` 即可。
