import type { CharacterSpec } from "./types.ts";

/** 线条颜色：深棕，不用纯黑，和页面文字同一个色系 */
export const INK = "#3d3027";

const nian: CharacterSpec = {
  id: "nian",
  name: "小念",
  pronoun: "他",
  age: "7 岁",
  about: "好奇、爱追问的男孩，和《身体奇遇记》里是同一个小念",
  voice: "zh-CN-YunxiaNeural",
  body: {
    headRx: 80, headRy: 75, neck: 8, torso: 100, shoulder: 34, hip: 22,
    upperArm: 52, foreArm: 48, thigh: 58, shin: 56, limb: 25, hand: 15,
  },
  look: {
    skin: "#ffd9b8", hair: "#3b2a20", hairStyle: "spiky", eyeScale: 1,
    top: { color: "#ff9f43", sleeve: "short", collar: "round" },
    bottom: { kind: "shorts", color: "#4d7cc7" },
    shoes: "#e85d4a", socks: "#ffffff", blush: 0.45,
  },
  bubble: "#fff4e0",
};

const dad: CharacterSpec = {
  id: "dad",
  name: "爸爸",
  pronoun: "他",
  age: "大人",
  about: "温和、讲话具体的爸爸，戴眼镜，穿蓝衬衫",
  voice: "zh-CN-YunxiNeural",
  body: {
    headRx: 66, headRy: 72, neck: 14, torso: 170, shoulder: 60, hip: 38,
    upperArm: 92, foreArm: 86, thigh: 115, shin: 112, limb: 32, hand: 18,
  },
  look: {
    skin: "#f6cfa8", hair: "#2a211c", hairStyle: "short", eyeScale: 0.8,
    top: { color: "#5b8def", sleeve: "long", collar: "shirt" },
    bottom: { kind: "pants", color: "#4a4f5c" },
    shoes: "#6b4a33", glasses: "#3d3027", blush: 0.2,
  },
  bubble: "#eaf2ff",
};

const mom: CharacterSpec = {
  id: "mom",
  name: "妈妈",
  pronoun: "她",
  age: "大人",
  about: "爱笑、点子多的妈妈，短发别着黄色发卡，穿绿色连衣裙",
  voice: "zh-CN-XiaoxiaoNeural",
  body: {
    headRx: 64, headRy: 70, neck: 14, torso: 152, shoulder: 50, hip: 34,
    upperArm: 84, foreArm: 80, thigh: 108, shin: 105, limb: 27, hand: 16,
  },
  look: {
    skin: "#ffdcc0", hair: "#5a3a2a", hairStyle: "bob", eyeScale: 0.85,
    top: { color: "#43b58f", sleeve: "long", collar: "none" },
    bottom: { kind: "skirt", color: "#43b58f" },
    shoes: "#c0566b", accent: "#ffd166", blush: 0.35,
  },
  bubble: "#e8f8f0",
};

const laoye: CharacterSpec = {
  id: "laoye",
  name: "姥爷",
  pronoun: "他",
  age: "老人",
  about: "妈妈的爸爸，白头发、白胡子，说话慢悠悠，穿棕色开衫",
  voice: "zh-CN-YunjianNeural",
  body: {
    headRx: 66, headRy: 70, neck: 12, torso: 160, shoulder: 60, hip: 40,
    upperArm: 86, foreArm: 82, thigh: 104, shin: 100, limb: 32, hand: 18,
  },
  look: {
    skin: "#f2c9a0", hair: "#e9e5de", hairStyle: "receding", eyeScale: 0.75,
    top: { color: "#a9744a", sleeve: "long", collar: "shirt" },
    bottom: { kind: "pants", color: "#676b74" },
    shoes: "#4a3a30", mustache: "#e9e5de", wrinkles: true, blush: 0.25,
  },
  bubble: "#f4ece0",
};

export const CAST = { nian, dad, mom, laoye } as const;
export type CharacterId = keyof typeof CAST;
export const CHARACTER_IDS = Object.keys(CAST) as CharacterId[];

/** 能署名的人：小念、爸爸、妈妈既是角色也是创作者。别的角色（比如姥爷）只在故事里出场 */
export const CREATOR_IDS = ["nian", "dad", "mom"] as const satisfies readonly CharacterId[];
export type CreatorId = (typeof CREATOR_IDS)[number];

export function isCharacterId(id: string): id is CharacterId {
  return Object.prototype.hasOwnProperty.call(CAST, id);
}
