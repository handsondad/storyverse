---
name: storyverse-cocreate
description: >-
  Guides family co-creation of a children's comic story in the storyverse repo:
  chat with the child one question at a time, write ideas.md, fill story.ts,
  run check and snapshot, and publish. Use when starting a new story, revising
  credits or ideas, or when the user mentions 和孩子一起编、共创、新故事、ideas.md.
---

# 小念家的漫画书：和孩子一起编故事

目标：孩子出主意、做决定；大人（和 agent）把决定写成数据、画成漫画。孩子的原话尽量留在 `ideas.md` 里。

仓库结构、命令、硬性规矩见根目录 `AGENTS.md`。怎么画好见 [../storyverse-comic/SKILL.md](../storyverse-comic/SKILL.md)。

## 六步

每一步都要孩子点头才往下走。一次只问一个问题。

```
- [ ] 1. 聊点子 → ideas.md
- [ ] 2. 定角色（小念/爸爸/妈妈；家里其他人只出场、不署名）
- [ ] 3. 分镜：先定每一页几格、谁出场、说什么
- [ ] 4. 写 story.ts → npm run check -- <id>
- [ ] 5. npm run snapshot -- <id>，对着 PNG 改
- [ ] 6. 台词定了：npm run voice -- <id>，在阅读页点「▶ 听故事」和孩子一起听一遍
- [ ] 7. typecheck / test / build，浏览器翻一遍
```

### 1. 聊点子

建议按这个顺序问，每次只问一句：

1. 今天想讲谁的故事？（默认小念）
2. 他们想去哪儿？
3. 路上遇到什么麻烦或惊喜？
4. 谁来帮忙？
5. 结局开心吗？最后一页想看到什么？
6. 这件事是哪天发生的？那天是什么日子吗？（真事写那天；编出来的写今天）

把孩子的原话记进 `src/stories/<id>/ideas.md`。书名也可以让孩子起。日子写进 `story.ts` 的 `when: { date, label }`，首页的时间绳按它排；不知道就问大人，别猜。

### 2. 定角色

主角是 `nian` / `dad` / `mom`。家里其他人可以作为角色出场，现在有姥爷 `laoye`；他们不署名。故事里出现还没有的家人，先问大人要不要加，再照 `laoye` 在 `src/cast/characters.ts` 里加一个（`look` 管长相，`voice` 选一个声音），并在 `src/story/script.ts` 的 `VOICES` 里配上。想换衣服颜色，改 `look`，先跑 `npm run snapshot -- cast <id>` 给孩子看样张。

### 3. 分镜

在纸上或 `ideas.md` 里列出每一页：

- 版式（`1`、`1-2`、`2-1`、`1-1-1`…，见 `src/engine/layout.ts`）
- 每一格：地点、时间、谁、姿势、表情、旁白/对话

一页不要超过 3～4 格；一格气泡不要超过 3 个。

### 4～6. 写成数据、检查、截图

```bash
npm run story:new -- <id>          # 若还没有目录
# 编辑 story.ts
npm run check -- <id>
npm run snapshot -- <id>
npm run font                       # 加了新汉字时
npm run voice -- <id>              # 台词定了再配；改了字重跑，只会重配改过的句子
npm run typecheck && npm test && npm run build
```

## 署名

小念、爸爸、妈妈既是故事里的人，也是创作者。署名只用他们：

```ts
when: { date: "2025-06-01", label: "六一儿童节" },  // 故事发生的那天，只记这一个日子
credits: {
  by: ["nian", "dad", "mom"],  // 只能是固定角色，不要写家里其他人的名字
}
```

封面会写成「小念、爸爸和妈妈一起编的故事」。公开发布时不要写学校、住址、真名；孩子录音默认放 `private/`。

## 验收

- `npm run check` 无报错
- `snapshots/` 里每一页：脸没被气泡挡、字看得清、角色站得住
- 手机宽度下能翻页
