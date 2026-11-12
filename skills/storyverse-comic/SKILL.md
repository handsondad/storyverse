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
| `laoye` | 姥爷（白头发、白胡子、棕色开衫）；只出场，不署名 | 米色 |
| `ayi` | 阿姨：外面遇到的女的都用她（紫上衣） | 浅粉 |
| `shushu` | 叔叔：外面遇到的男的都用他（灰衬衫） | 浅灰 |
| `gege` | 哥哥：外面遇到的大一点的男孩（绿 T 恤），身子和小念一样大 | 浅绿 |
| `jiejie` | 姐姐：外面遇到的大一点的女孩（粉裙子、红发卡） | 浅粉 |

阿姨、叔叔只出场，不署名。是哪一行就加 `outfit`：`{ who: "ayi", outfit: "nurse", ... }` 是护士（白护士帽、粉护士服），`outfit: "doctor"` 是白大褂（医生、药店药师）。新职业装加在 `src/cast/characters.ts` 的 `OUTFITS` 里，不要为一个职业新建角色。

姿势、表情清单：`#/cast/nian`。常用搭配：

- 吃惊 → `pose: "crouch"` 或 `"stand"` + `face: "surprised"`
- 想事情 → `pose: "think"` + `face: "thinking"`
- 欢呼 → `pose: "cheer"` + `face: "happy"`
- 捧东西 → `pose: "hold"` + `hold: "🎁"`

### 画出来的道具

表情符号里没有的东西用 `thing` 画，和 `emoji` 只写一个。现在有乳胶枕、小宝宝、腕带、小球：

```ts
{ thing: { kind: "pillow", puff: 0.1, sealed: true, label: "2017" }, x: 0.55, size: 230 }
{ thing: { kind: "baby" }, x: 0.43, lift: 290, size: 180, front: true }          // 襁褓里的宝宝，头朝左
{ thing: { kind: "band", label: "男 16:04" }, x: 0.5, lift: 110, size: 900 }      // 手腕特写，配 plain 背景
```

- `puff` 0～1：鼓起来多少，连着几格慢慢变大就能看出变化
- `sealed`：装在密封袋里；`label` 是袋上的小标签，或者腕带上的字（≤8 个字）
- 宝宝写了 `diaper` 就画成只穿纸尿裤仰面躺着（头朝左）：`high` 捂到肚脐上、`low` 在肚脐下、`airy` 透气款往下折；`navel` 是 `stump`（脐带还没掉）/ `sore`（一圈淡红）/ `healed`。放在卧室大床上用 `x: 0.814, lift: 200, size: 300`；肚子特写用纯色背景、`size: 1000, lift: 100`（见 `src/stories/belly-button/story.ts`）
- 宝宝写了 `kick` 就画成侧面：穿黄连体衣仰面躺在爬行垫上，小腿举起来蹬（头朝左）；`up` / `left` / `right` 换着写像在来回蹬，`ball: true` 脚丫上顶个小球；`grab` 小手抱着脚丫，`toes` 啃脚趾头；`giggle: true` 张嘴咯咯笑。宝宝不会说话，咿咿呜呜写进旁白，别给他气泡。放在客厅地上用 `x: 0.46, size: 460, front: true`（别放沙发前，腿和沙发会糊在一起），特写用纯色背景 `size: 900, lift: 40`（见 `src/stories/kick-ball/story.ts`）
- 宝宝写 `move` 就是会爬会坐的样子（还是黄连体衣、侧面）：`crawl` 往左爬，`sit` 坐着脸朝右；`cry: true` 哇哇大哭（坐着时一手捂头），`flip: true` 左右翻过来。放在卧室床上用 `lift: 230, size: 360`；抱在大人怀里：大人 `pose: "hug"` 面朝右站在 at，宝宝 `move: "sit", flip: true, x: at + 110/1400, lift: 250, size: 380, front: true`（见 `src/stories/bed-edge/story.ts` 的 `inArms`）。会爬会坐的宝宝还能写 `hair: "fuzz"`（毛茸茸一层）/ `"bald"`（刚理的小光头，亮亮的），`hat: "party"` 戴生日帽，`sick: true` 生病（小脸烧得红红的、没精神），`patch: true` 额头贴退烧贴；`color` 换连体衣颜色，别人家的宝宝都换个颜色，黄色留给小念；`giggle: true` 张嘴咯咯笑。`sit` 的宝宝写 `tub: true` 就光着身子坐在粉色大澡盆里（放地上 `size: 420, front: true`），`splash: true` 举手拍水溅水花（见 `src/stories/bath-basin/story.ts`）
- 空的大澡盆：`{ thing: { kind: "tub" }, x, size: 300, front: true }`
- `sit` 的宝宝写 `hand: "red"` 那只伸出来的小手红红的（烫着了，不画伤口），`"bandage"` 包着白纱布；和 `cry` 一起写就是伸着这只手哭（见 `src/stories/hot-water/story.ts`）
- 冒热气：`{ thing: { kind: "steam" }, x, lift, size: 90～120 }`，放在热水、杯子上面（☕ 本身不带热气）
- `sit` 的宝宝写 `ride: true` 就是骑在红色大汽车（扭扭车）上，车头朝右、一只脚蹬地；`size` 400～560
- 妈妈小时候的老照片：`{ thing: { kind: "photo" }, x, size }`，特写用 700 左右；拿在手里配 `pose: "hold"`、面朝右，照片 `x: at + 0.08, lift: 270, size: 160, front: true`（见 `src/stories/little-rider/story.ts`）
- 药盒：`{ thing: { kind: "box", label: "退烧贴" }, x, lift, size: 120 }`，`label` 必写，颜色跟着药名变；放药店柜台上用 `lift: 205`（见 `src/stories/first-cold/story.ts`）
- 理发的电推子：`{ thing: { kind: "clipper" }, x, lift, size: 200 }`，刀头朝左，放在宝宝头顶右边（见 `src/stories/laoye-birthday/story.ts`）
- 大人小孩戴生日帽：角色写 `hat: "party"`
- 单独一个红黄蓝小球：`{ thing: { kind: "ball" }, x, lift, size: 60 }`，飞在空中就把 `lift` 写高
- 宝宝抱在半躺的妈妈怀里：`lift: 290`、离妈妈 20 个舞台单位（见 `src/stories/born/story.ts` 的 `baby()`）
- 拿在手里、放在脚前面的道具写 `front: true`，画在人前面（不算被挡）
- 窄格子里拟声字没地方放时，别硬塞到主角道具上，写进旁白就行

### 椅子和饭桌

- `seat: "chair"`（大人的椅子）或 `"high-chair"`（小孩的高脚餐椅），配 `pose: "sit"`；不写 `seat` 时 `sit` 坐小凳子
- `pose: "push"`：坐着两腿往前伸直蹬，身子往后仰
- `seat: "bed"` + `pose: "recline"`：半躺在带轮子的推床上，盖着被子。头在床背那头，`facing: "left"` 时头朝右；推床的人站在床背后，别挨着脸
- `tip`：连人带椅子往后翘的角度。15～30 前腿翘起，80 左右整个倒在地上；人和椅子一起转，气泡和镜头会跟着脸走
- 饭桌写在场景里：`scene: { place: "dining-room", table: { from: 0.31, to: 0.95 } }`，画在人前面。盘子用道具，`lift: 205` 正好放在桌面上
- 站着说话的格子别带桌子，不然桌子会横在人身上
- 一个故事里同一张饭桌的几格，座位写成小函数共用（见 `src/stories/high-chair/story.ts`），翻页时桌椅不会跳

## 背景

| place | 说明 |
|---|---|
| `living-room` | 客厅（窗、沙发、落地灯） |
| `dining-room` | 餐厅（挂钟、吊灯、餐边柜），配 `table` |
| `bathroom` | 卫生间（瓷砖、洗手池、镜子） |
| `hospital` | 医院走廊（双开门、扶手、长椅、四点钟的挂钟），门上牌子写 `sign`，默认「产房」，比如 `sign: "儿科"` |
| `gateball` | 体育公园的门球场（人造草皮、小球门、门柱、围网和「门球场」牌子） |
| `pharmacy` | 药店（药架、绿十字灯牌、「福」），配 `table` 就是画在人前面的柜台 |
| `street` | 街上一排小店，过年拉着卷帘门、贴「放假」、挂红灯笼；中间那家的招牌写 `sign`（默认「药店」）。招牌字小，用 `wide` 才看得见 |
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
