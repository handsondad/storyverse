---
name: storyverse-comic
description: >-
  Draws storyverse comics in house style: panel layouts, camera shots, speech
  bubbles, character poses/expressions, and scene backgrounds. Use when writing
  or fixing story.ts panels, bubbles, layouts, scenes, cast art, or when the
  user mentions 分镜、气泡、版式、姿势、表情、截图、漫画。
---

# 小念家的漫画书：怎么画

故事数据格式见 `src/story/types.ts`。词表（表情、姿势、地点）见 `src/story/vocab.ts`。

## 一格里写什么

```ts
{
  scene: { place: "park", time: "morning", weather: "rain" },
  shot: "medium",          // wide | medium | close
  focus: "nian",           // 特写对准谁；默认第一个说话的人
  actors: [
    { who: "nian", at: "left", pose: "wave", face: "happy", hold: "☂️" },
    { who: "dad", at: "right", pose: "stand", face: "proud" },
  ],
  props: [{ emoji: "🌈", x: 0.7, lift: 300, size: 140, glow: "#ffd166" }],
  beats: [
    { caption: "清晨，一家人出发了。" },
    { say: "nian", text: "雨鞋在发光！", kind: "shout" },
    { say: "dad", text: "我们去找彩虹吧。" },
    { sfx: "叮！", color: "#7cc4ff" },   // 不写 at 就自动找空地方
  ],
}
```

### 景别

| shot | 用在 |
|---|---|
| `wide` | 交代环境、好几个人一起走 |
| `medium` | 对话、动作（默认） |
| `close` | 重要反应、心里话 |

一页里远、中、特写轮换，不要连续三格都是同一种。

### 站位和朝向

- `at`: `"left"` / `"center"` / `"right"`，或 `0～1`
- 不写 `facing` 时，角色自动朝向其他人；一个人就朝舞台中间
- 两个人对话：一个 left、一个 right
- 窄格子装不下时，引擎会让这一格里的人往中间站近一点（左右次序不变），不用自己改 `at`
- 道具 `x` 和 `lift` 要放在人和人之间的空当；藏在头或身子后面，检查器会报

### 气泡

| kind | 样子 |
|---|---|
| `speech`（默认） | 圆角框 + 尾巴 |
| `thought` | 云朵 + 小圆点 |
| `shout` | 尖角框 |
| `whisper` | 虚线框 |

规矩：

- 一格最多 3～4 个气泡；每个 ≤18 字
- 先说的先读（上、左）
- 引擎会躲开脸；还是挡脸就删字、换 `shot`，或少写一个气泡
- 说话的人脸必须在画里，每个气泡都要有尾巴，尾巴不能穿过别的气泡；做不到检查器会报
- 音效字（`sfx`）不压气泡、旁白和脸；窄格里用两三个字，比如「叮！」
- 旁白用 `caption`，不要塞进气泡

### 版式

常用：`1`（大图）、`1-2`、`2-1`、`1-1-1`、`2-2`。  
`layout` 的格数必须等于 `panels.length`，检查器会拦。

## 角色

| id | 谁 | 气泡底色 |
|---|---|---|
| `nian` | 小念（橙衣服） | 暖黄 |
| `dad` | 爸爸（蓝衬衫、眼镜） | 浅蓝 |
| `mom` | 妈妈（绿裙子、黄发卡） | 浅绿 |

姿势、表情清单：`#/cast/nian`。常用搭配：

- 吃惊 → `pose: "crouch"` 或 `"stand"` + `face: "surprised"`
- 想事情 → `pose: "think"` + `face: "thinking"`
- 欢呼 → `pose: "cheer"` + `face: "happy"`
- 捧东西 → `pose: "hold"` + `hold: "🎁"`

## 背景

| place | 说明 |
|---|---|
| `living-room` | 客厅（窗、沙发、落地灯） |
| `park` | 公园（树、草、天空） |
| `bedroom` | 卧室（床、夜灯） |
| `museum` | 美术馆外景（柱廊、台阶），`tint` 换墙色 |
| `subway` | 地铁车厢（绿色座位、拉手），`tint` 换车厢色 |
| `plain` | 纯色底，适合强调对话 |
| `burst` | 放射线，适合欢呼、惊喜 |

`time`: `morning` / `day` / `evening` / `night`  
`weather`: `clear`（默认）/ `rain`

## 自查

```bash
npm run check -- <id>
npm run snapshot -- <id>
```

检查器管得住的：挡脸、说话人出画、气泡没尾巴、音效压字、道具被挡。管不住的要对着 PNG 看：动作和台词对不对得上、角色脚踩没踩住、手机宽度下字清不清。测完把不需要的 `snapshots/` 丢掉（已在 `.gitignore`）。

加了新汉字：`npm run font`。
