/**
 * 故事里能用的词：表情、姿势、地点、镜头……
 * 运行时也要用到这些清单（检查器、样张页），所以写成数组，类型从数组推出来。
 */

/** 表情。说话的角色会自动张嘴，不用另外写 */
export const EXPRESSIONS = [
  "neutral",   // 平常，淡淡地笑
  "happy",     // 开心，眯眼笑
  "laugh",     // 哈哈大笑
  "surprised", // 吃惊，头上一个"！"
  "sad",       // 难过
  "cry",       // 哭，带眼泪
  "angry",     // 生气，头上一个青筋
  "scared",    // 害怕，冒冷汗
  "thinking",  // 想事情，眼睛往上看
  "confused",  // 疑惑，头上一个"？"
  "shy",       // 害羞，脸红
  "sleepy",    // 困了，头上"Zz"
  "proud",     // 得意，闪闪发光
] as const;
export type Expression = (typeof EXPRESSIONS)[number];

/** 姿势。都按"面朝右"设计，facing: "left" 时整个人左右翻过来 */
export const POSES = [
  "stand",  // 站着
  "wave",   // 挥手打招呼
  "point",  // 往前指
  "cheer",  // 两手举高欢呼
  "jump",   // 跳起来
  "think",  // 一手托下巴
  "walk",   // 走
  "run",    // 跑
  "sit",    // 坐在小凳子上（写了 seat 就坐椅子）
  "push",   // 坐着，两条腿往前伸直蹬，身子往后仰
  "recline", // 半躺着（配 seat: "bed"）
  "crouch", // 蹲下
  "shrug",  // 摊手
  "hug",    // 张开手臂往前抱
  "hold",   // 两手捧着东西（配合 hold 字段）
] as const;
export type Pose = (typeof POSES)[number];

/** 地点。plain 是纯色底，burst 是漫画里"轰"一下的放射线底 */
export const PLACES = ["living-room", "dining-room", "bathroom", "hospital", "park", "bedroom", "museum", "subway", "pharmacy", "street", "plain", "burst"] as const;
export type Place = (typeof PLACES)[number];

/** 画出来的道具（表情符号里没有的东西） */
export const THINGS = ["pillow", "baby", "band", "ball", "clipper", "box"] as const;
export type ThingKind = (typeof THINGS)[number];

export const TIMES = ["morning", "day", "evening", "night"] as const;
export type TimeOfDay = (typeof TIMES)[number];

export const WEATHERS = ["clear", "rain"] as const;
export type Weather = (typeof WEATHERS)[number];

/** 镜头：wide 远景看全身和环境，medium 中景到膝盖，close 特写脸 */
export const SHOTS = ["wide", "medium", "close"] as const;
export type Shot = (typeof SHOTS)[number];

/** 气泡：speech 说话，thought 心里想（云朵），shout 大喊（尖角），whisper 小声（虚线） */
export const BUBBLE_KINDS = ["speech", "thought", "shout", "whisper"] as const;
export type BubbleKind = (typeof BUBBLE_KINDS)[number];

/** 站位：left / center / right，或者 0～1 之间的数（0 最左，1 最右） */
export const SLOTS = { left: 0.25, center: 0.5, right: 0.75 } as const;
export type Slot = keyof typeof SLOTS;
