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
| `laoye` | 姥爷（白头发、白胡子、棕色开衫）；只出场，不署名。爷爷也先用他，写 `top: "#5b7fa6"` 换蓝外套（见 `src/stories/little-driver/story.ts`） | 米色 |
| `ayi` | 阿姨：外面遇到的女的都用她（紫上衣） | 浅粉 |
| `shushu` | 叔叔：外面遇到的男的都用他（灰衬衫） | 浅灰 |
| `gege` | 哥哥：外面遇到的大一点的男孩（绿 T 恤），身子和小念一样大 | 浅绿 |
| `jiejie` | 姐姐：外面遇到的大一点的女孩（粉裙子、红发卡） | 浅粉 |

阿姨、叔叔只出场，不署名。是哪一行就加 `outfit`：`{ who: "ayi", outfit: "nurse", ... }` 是护士（白护士帽、粉护士服），`outfit: "doctor"` 是白大褂（医生、药店药师）。新职业装加在 `src/cast/characters.ts` 的 `OUTFITS` 里，不要为一个职业新建角色。

阿姨、叔叔、哥哥、姐姐可以在同一格里出现好几个（比如两个哥哥），给后面的换件上衣 `top: "#4fc3f7"` 分得出来；气泡指向列表里第一个。亲戚也用这几个角色，旁白里写清是谁（大舅用 `shushu`、舅妈用 `ayi`，见 `src/stories/first-birthday/story.ts`）。一格最多 4 个角色，一大家人这样的远景（`shot: "wide"`，放在整行宽的格子里）最多 7 个。

姿势、表情清单：`#/cast/nian`。常用搭配：

- 吃惊 → `pose: "crouch"` 或 `"stand"` + `face: "surprised"`
- 想事情 → `pose: "think"` + `face: "thinking"`
- 欢呼 → `pose: "cheer"` + `face: "happy"`
- 捧东西 → `pose: "hold"` + `hold: "🎁"`
- 闻一闻、尝一口 → `pose: "sniff"` + `hold: "🧄"`，东西举到鼻子嘴巴前；辣着了、不爱吃 → `face: "yuck"`（皱眉、挤眼、嘴巴歪歪）。坐在餐椅上也能用，腿自然垂着（见 `src/stories/smell-first/story.ts`）

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
- 宝宝写 `move` 就是会爬会坐的样子（还是黄连体衣、侧面）：`crawl` 往左爬，`sit` 坐着脸朝右；`cry: true` 哇哇大哭（坐着时一手捂头），`flip: true` 左右翻过来。放在卧室床上用 `lift: 230, size: 360`；抱在大人怀里：大人 `pose: "hug"` 面朝右站在 at，宝宝 `move: "sit", flip: true, x: at + 110/1400, lift: 250, size: 380, front: true`（见 `src/stories/bed-edge/story.ts` 的 `inArms`）。会爬会坐的宝宝还能写 `hair: "fuzz"`（毛茸茸一层）/ `"bald"`（刚理的小光头，亮亮的），`hat: "party"` 戴生日帽（`"big"` 是小念自己过生日戴的大大的蓝帽子），`blow: true` 嘟嘴吹蜡烛，`sick: true` 生病（小脸烧得红红的、没精神），`patch: true` 额头贴退烧贴；`color` 换连体衣颜色，别人家的宝宝都换个颜色，黄色留给小念；`giggle: true` 张嘴咯咯笑。`sit` 的宝宝写 `tub: true` 就光着身子坐在粉色大澡盆里（放地上 `size: 420, front: true`），`splash: true` 举手拍水溅水花（见 `src/stories/bath-basin/story.ts`）
- 空的大澡盆：`{ thing: { kind: "tub" }, x, size: 300, front: true }`
- `sit` 的宝宝写 `hand: "red"` 那只伸出来的小手红红的（烫着了，不画伤口），`"bandage"` 包着白纱布；和 `cry` 一起写就是伸着这只手哭（见 `src/stories/hot-water/story.ts`）
- 冒热气：`{ thing: { kind: "steam" }, x, lift, size: 90～120 }`，放在热水、杯子上面（☕ 本身不带热气）
- `sit` 的宝宝写 `ride: true` 就是骑在红色大汽车（扭扭车）上，车头朝右、一只脚蹬地；`size` 400～560
- 宝宝写 `move: "stand"` 是站着、两手张开保持平衡的样子（脸朝右）
- 拱形大木板（平衡板）：`{ thing: { kind: "board", shape, rider, spot, tilt, lean }, x, size: 480～720 }`。`shape: "rock"` 弧面朝下（跷跷板、站上去摇，`tilt` -20～20 度，正数右头往下）；`"arch"` 弧面朝上像拱桥；`"slide"` 一头立起来当滑梯（左高右低，大人站在左边 `pose: "hold"` 扶着）。板上的宝宝写在 `rider` 里（crawl / sit / stand），`spot` -1～1 是在板上哪儿，`lean` 让宝宝再往后仰（仰卧起坐 -55）。窄格子里木板别太大，不然两头会被裁掉（见 `src/stories/balance-board/story.ts`）
- 农用三轮车：`{ thing: { kind: "trike", load: "grass", rider }, x, size: 540, front: true }`，车头朝右，`load: "grass"` 车斗里堆满草。大人开车：同一个 x 往右挪 `0.02 * size / 1400`，`pose: "sit", perch: true`（坐在车座上、不画小凳子）；`rider` 是坐在大人前面扶车把的宝宝（`move: "sit"`）
- 电脑显示器：`{ thing: { kind: "screen" }, x, lift: 205, size: 320 }`，放在桌面上（`table` 的 `lift` 就是桌面高 205），屏幕上是一行行彩色代码条。宝宝坐在大人腿上看电脑：大人 `seat: "chair", pose: "sit", facing: "right"`，宝宝 `{ move: "sit", x: at + 70/1400, lift: 150, size: 300, front: true }`；桌子从大人膝盖前开始（`from` 约 `at + 0.09`），不然够不着。气泡会压住显示器，这样的格子只放一句台词
- 眼镜：桌上放着的一副 `{ thing: { kind: "glasses" }, x, lift: 205, size: 120 }`；特写放大到 500 左右。宝宝戴大眼镜写 `specs: true`；`stand` 的宝宝写 `reach: true` 举手往上够（size 280 时手刚好够不到桌面）；`hat: "grad"` 是博士帽。宝宝和大人蹲着的格子别写 `table`：桌子画在人前面，会挡住
- 宝宝的高脚餐椅：`{ thing: { kind: "highchair", rider }, x, size: 400 }`，木头的，带小餐盘、红色保护带、蓝垫子；`rider` 是坐在上面的宝宝（`move: "sit"`）。被「拆」的几步：`strap: "torn"` 保护带断了，`cushion: "torn" | "patched" | "gone"` 垫子烂了 / 缝过 / 没了，`nails: true` 钉子震出来、椅子腿直晃，`rope: true` 绑了绳子。扯下来的垫子单独用 `{ thing: { kind: "cushion", cushion }, x, size: 200 }`，`patched` 时带针线。旁边要放桌子时桌子从 0.56 往右，免得窄格子里把椅子挤出去
- 小沙发：人坐上去写演员的 `seat: "sofa"`（配 `pose: "sit"` 端坐，或 `pose: "boss"` 往后一仰、两手抱在脑后、翘二郎腿，像个小领导）；空着摆在地上用 `{ thing: { kind: "sofa" }, x, size: 220 }`，和小念坐的那张一样大
- 蹦床：`{ thing: { kind: "trampoline" }, x, size: 420 }`，站上去的演员同一个 `at`，写 `lift: size * 0.2`（演员的 `lift` 是脚底离地多高），配 `pose: "jump"` 就是在蹦
- 学习机：`{ thing: { kind: "pad", pick }, x, lift, size }`，屏幕上是儿歌列表（标题「小天才」），每行看不清的字后面一个小图片；`pick`（0～5）那一行亮起来，一只小手指着那个小图。放在桌上 `lift: 205, size: 300`；特写 size 600 左右。只有道具、或者道具在演员一边的格子，写 `shot: "wide"` 才不会被裁掉
- 袜子：演员写 `feet` 就不穿鞋，`bare` 光脚丫、`socks` 穿着小蓝袜子、`wrong` 前面那只脚袜子套反了（深色袜跟鼓在脚背上、脚后跟露在外面），后面那只还光着。单独一只袜子 `{ thing: { kind: "sock" }, x, lift, size: 100～120 }`，拿在手里写 `front: true`；扯飞了就把 `lift` 写高配个「嗖！」。脚丫特写写 `worn: "wrong"`，纯色背景 `size: 900, lift: 60, shot: "wide"`。姿势 `tug` 是坐在小凳子上弯腰往脚上套袜子，袜子放在脚边 `x: at + 0.1, lift: 60, size: 100`；`face: "serious"` 是一脸严肃（皱眉、抿嘴，不带青筋）（见 `src/stories/do-it-myself/story.ts`）
- 爸爸的一双棕皮鞋：`{ thing: { kind: "shoes" }, x, size: 240, front: true }`，侧面、鞋头朝右，并排摆得整整齐齐；`messy: true` 东一只西一只（左边那只鞋头朝左歪着，右边那只鞋头翘起来，左右各多占半个 size），放在两个人中间的空地上（见 `src/stories/tidy-guard/story.ts`）
- 地上洒的一摊水：`{ thing: { kind: "puddle" }, x, size: 240～300 }`；两张白纸巾：`{ thing: { kind: "tissue" }, x, lift, size: 80～110, front: true }`，拿在手里 `lift: 140`。姿势 `wipe` 是蹲着往前探身、一只手按在地上擦，纸巾放在 `x: at + 0.11, lift: 8, size: 80`、水在 `at + 0.14`（见 `src/stories/little-helper/story.ts`）
- 扫帚这样的长东西别用 `hold`（画在两手中间会变成一根小棍），用表情符号道具立在人旁边：`{ emoji: "🧹", x: at + 0.05, lift: 120, size: 260, front: true }`
- 手机特写：`{ thing: { kind: "phone" }, x, lift, size: 240～330 }`，竖着，屏幕上放着小兔子动画片；`show: "swipe"` 一根小手指往上划，`show: "ad"` 黄底大红字「广告」。只有道具的格子写 `shot: "wide"`。拿在手里的小手机用 `hold: "📱"`。姿势 `rub` 是低着头两手揉眼睛（见 `src/stories/watch-ads/story.ts`）
- 洗衣液大桶：`{ thing: { kind: "jug" }, x, size: 200, front: true }`，蓝桶红盖、白标签写「洗衣液」，左边提手、右边瓶口；`cap: "off"` 盖子拧下来扔在桶左边地上，`cap: "spill"` 桶躺倒了、洗衣液从瓶口淌出一大摊冒泡泡（往右占到 1.4 个 size，盖子在最右边），放在两个人中间要留够地方。只有桶的特写用纯色背景 `size: 420, shot: "wide"`（见 `src/stories/strong-hands/story.ts`）
- 一板拼图：`{ thing: { kind: "puzzle" }, x, lift, size }`，4×3 块，图上是蓝天、太阳、小山、马路和小红车；`pieces: "mixed"` 形状对上了、画是乱的，`pieces: "torn"` 有几块图案被撕掉、露出纸板。特写用纯色背景 `x: 0.5, lift: 40, size: 520, shot: "wide"`；拿在手里、散在地上的小拼图块用表情符号 🧩（见 `src/stories/puzzle-time/story.ts`）
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
- 卧室里坐在大床边上：`{ at: 0.76, pose: "sit", perch: true, lift: 120 }`，不画小凳子（见 `src/stories/story-time/story.ts`）
- `pose: "push"`：坐着两腿往前伸直蹬，身子往后仰
- `seat: "bed"` + `pose: "recline"`：半躺在带轮子的推床上，盖着被子。头在床背那头，`facing: "left"` 时头朝右；推床的人站在床背后，别挨着脸
- `tip`：连人带椅子往后翘的角度。15～30 前腿翘起，80 左右整个倒在地上；人和椅子一起转，气泡和镜头会跟着脸走
- 饭桌写在场景里：`scene: { place: "dining-room", table: { from: 0.31, to: 0.95 } }`，画在人前面。盘子用道具，`lift: 205` 正好放在桌面上
- 站着说话的格子别带桌子，不然桌子会横在人身上
- 一个故事里同一张饭桌的几格，座位写成小函数共用（见 `src/stories/high-chair/story.ts`），翻页时桌椅不会跳

## 封面

封面是这本书的门脸，要让人一眼看出讲的是哪件事：

- 用故事里真实的地点（客厅、卫生间、饭桌……），不要用 `burst` / `plain` 换个颜色糊弄
- 放两三个人，摆出这个故事最有意思的那一刻：谁在干什么、谁在一旁什么表情；把故事的主角道具（袜子、鞋、洗衣液桶、拼图……）放进去
- 封面是竖的，镜头只拍得下半个舞台宽：人和道具都写在 0.3～0.7 之间。站不下时引擎会让大家往中间站、道具跟着离它最近的人挪；还是站不下，检查器会报「封面：某某被裁到画外了」
- 改完截一张看看：`npm run snapshot -- <id> 0`

## 背景

| place | 说明 |
|---|---|
| `living-room` | 客厅（窗、沙发、落地灯） |
| `dining-room` | 餐厅（挂钟、吊灯、餐边柜），配 `table` |
| `bathroom` | 卫生间（瓷砖、洗手池、镜子） |
| `hospital` | 医院走廊（双开门、扶手、长椅、四点钟的挂钟），门上牌子写 `sign`，默认「产房」，比如 `sign: "儿科"` |
| `gateball` | 体育公园的门球场（人造草皮、小球门、门柱、围网和「门球场」牌子） |
| `farm` | 老家的田（远处小山和农家小院，一垄垄庄稼地，土路，草垛） |
| `pharmacy` | 药店（药架、绿十字灯牌、「福」），配 `table` 就是画在人前面的柜台 |
| `street` | 街上一排小店，过年拉着卷帘门、贴「放假」、挂红灯笼；中间那家的招牌写 `sign`（默认「药店」）。招牌字小，用 `wide` 才看得见 |
| `park` | 公园（树、草、天空） |
| `bedroom` | 卧室（床、夜灯） |
| `museum` | 美术馆外景（柱廊、台阶），`tint` 换墙色 |
| `subway` | 地铁车厢（绿色座位、拉手），`tint` 换车厢色 |
| `plain` | 纯色底，适合强调对话 |
| `burst` | 放射线，适合格子里的欢呼、惊喜（别拿来当封面） |

`time`: `morning` / `day` / `evening` / `night`  
`weather`: `clear`（默认）/ `rain`

## 自查

```bash
npm run check -- <id>
npm run snapshot -- <id>
```

检查器管得住的：挡脸、说话人出画、气泡没尾巴、音效压字、道具被挡。管不住的要对着 PNG 看：动作和台词对不对得上、角色脚踩没踩住、手机宽度下字清不清。测完把不需要的 `snapshots/` 丢掉（已在 `.gitignore`）。

加了新汉字：`npm run font`。
