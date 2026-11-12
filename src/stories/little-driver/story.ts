import type { Actor, Prop, SceneSpec, Story, Thing } from "../../story/types.ts";

/**
 * 2025-10-06 的真事：小念和爸爸妈妈回老家看爷爷。爷爷牵着老黄牛，一家人去地里：
 * 爸爸和爷爷装喂牛的草，妈妈带小念找小动物。装好草，小念也要开三轮车，
 * 爷爷说他牵牛走回去，让小念坐车。小念坐上驾驶座像模像样地「开」（其实是爸爸在开）。
 * 爷爷用姥爷的样子（大人说的），换件蓝色干活的外套，分得出来。
 */
const field: SceneSpec = { place: "farm", time: "day" };
const nian = (move: Thing["move"], more: Partial<Thing> = {}): Thing => ({ kind: "baby", move, hair: "fuzz", ...more });
/** 爷爷：姥爷的样子，穿蓝外套 */
const yeye = (more: Partial<Actor>): Actor => ({ who: "laoye", at: 0.5, top: "#5b7fa6", ...more });
const ox = (x: number, size = 260, lift = 0): Prop => ({ emoji: "🐂", x, size, lift });
/** 被大人抱着的小念：大人用 hug 姿势、面朝右站在 at，小念脸朝外伸着手 */
const inArms = (at: number, more: Partial<Thing> = {}): Prop =>
  ({ thing: nian("sit", more), x: at + 110 / 1400, lift: 250, size: 380, front: true });
const TRIKE = 540;
/** 三轮车停在 x；driving 时爸爸坐在车座上开，小念坐在他前面扶车把 */
const trike = (x: number, more: Partial<Thing> = {}): Prop => ({ thing: { kind: "trike", ...more }, x, size: TRIKE, front: true });
const driver = (x: number, face: Actor["face"]): Actor => ({ who: "dad", at: x + (0.02 * TRIKE) / 1400, pose: "sit", perch: true, face, facing: "right" });

const story: Story = {
  id: "little-driver",
  title: "小小驾驶员",
  blurb: "回老家看爷爷，爷爷牵着老黄牛，小念坐上三轮车的驾驶座，开得可认真啦！",
  when: { date: "2025-10-06", label: "回老家看爷爷" },
  credits: { by: ["nian", "dad", "mom"] },
  cover: {
    scene: field,
    actors: [driver(0.5, "laugh")],
    props: [trike(0.5, { load: "grass", rider: nian("sit", { giggle: true }) })],
  },
  pages: [
    {
      layout: "1-2",
      panels: [
        {
          scene: field,
          shot: "wide",
          actors: [
            { who: "dad", at: 0.14, pose: "wave", face: "happy", facing: "right" },
            { who: "mom", at: 0.32, pose: "hug", face: "happy", facing: "right" },
            yeye({ at: 0.66, pose: "wave", face: "laugh", facing: "left" }),
          ],
          props: [inArms(0.32, { giggle: true }), ox(0.86)],
          beats: [
            { caption: "2025年10月6日，小念和爸爸妈妈回老家看爷爷。" },
            { say: "laoye", text: "走，带小念去地里玩！" },
          ],
        },
        {
          scene: field,
          shot: "wide",
          actors: [yeye({ at: 0.4, pose: "walk", face: "happy", facing: "left" })],
          props: [ox(0.64, 260)],
          beats: [
            { caption: "爷爷牵着老黄牛，一家人都出动啦。" },
            { sfx: "哞——", at: [0.7, 0.45] },
          ],
        },
        {
          scene: field,
          shot: "wide",
          actors: [{ who: "mom", at: 0.36, pose: "crouch", face: "happy", facing: "right" }],
          props: [
            { thing: nian("stand", { giggle: true }), x: 0.6, size: 300 },
            { emoji: "🐞", x: 0.76, size: 60 },
            { emoji: "🦗", x: 0.72, lift: 70, size: 64 },
          ],
          beats: [
            { caption: "妈妈带小念在地里找小动物。" },
            { say: "mom", text: "看，小瓢虫！还有蚂蚱！" },
          ],
        },
      ],
    },
    {
      layout: "1-2",
      panels: [
        {
          scene: field,
          shot: "wide",
          actors: [
            { who: "dad", at: 0.16, pose: "hold", face: "happy", facing: "right", hold: "🌾" },
            yeye({ at: 0.74, pose: "hold", face: "laugh", facing: "left", hold: "🌾" }),
          ],
          props: [trike(0.48, { load: "grass" })],
          beats: [
            { caption: "爸爸和爷爷把喂牛的草装上三轮车。" },
            { say: "laoye", text: "装满点，够牛吃好几天！" },
          ],
        },
        {
          scene: field,
          shot: "wide",
          actors: [{ who: "dad", at: 0.74, pose: "point", face: "happy", facing: "left" }],
          props: [trike(0.5, { load: "grass" })],
          beats: [
            { caption: "装好了，爸爸要开三轮车回家。" },
            { say: "dad", text: "上车喽！" },
          ],
        },
        {
          scene: field,
          actors: [{ who: "mom", at: 0.4, pose: "hug", face: "surprised", facing: "right" }],
          props: [inArms(0.4, { giggle: true })],
          beats: [
            { caption: "小念一看，伸着小手也要开！" },
            { say: "mom", text: "你也要开车呀？" },
          ],
        },
      ],
    },
    {
      layout: "1-2",
      panels: [
        {
          scene: field,
          shot: "wide",
          actors: [
            { who: "dad", at: 0.16, pose: "stand", face: "laugh", facing: "right" },
            { who: "mom", at: 0.34, pose: "hug", face: "laugh", facing: "right" },
            yeye({ at: 0.66, pose: "point", face: "happy", facing: "left" }),
          ],
          props: [inArms(0.34, { giggle: true }), ox(0.86)],
          beats: [
            { caption: "爸爸妈妈都哈哈大笑。" },
            { say: "laoye", text: "我牵着牛走回去，让小念坐车！" },
          ],
        },
        {
          scene: { place: "burst", tint: "#ffe2c4" },
          shot: "wide",
          actors: [],
          props: [trike(0.5, { rider: nian("sit", { giggle: true }) })],
          beats: [
            { caption: "于是，小念坐上了驾驶座！" },
          ],
        },
        {
          scene: field,
          shot: "wide",
          actors: [driver(0.46, "happy")],
          props: [trike(0.46, { rider: nian("sit") })],
          beats: [
            { caption: "当然，其实是爸爸在开。" },
            { say: "dad", text: "小司机，握好车把！", kind: "whisper" },
          ],
        },
      ],
    },
    {
      layout: "1-1",
      panels: [
        {
          scene: field,
          shot: "wide",
          actors: [driver(0.4, "happy")],
          props: [trike(0.4, { load: "grass", rider: nian("sit", { giggle: true }) })],
          beats: [
            { caption: "小念像模像样地开起了三轮车——" },
            { sfx: "突突突！" },
          ],
        },
        {
          scene: field,
          shot: "wide",
          actors: [
            driver(0.3, "laugh"),
            { who: "mom", at: 0.62, pose: "cheer", face: "laugh", facing: "left" },
            yeye({ at: 0.8, pose: "walk", face: "laugh", facing: "left" }),
          ],
          props: [trike(0.3, { load: "grass", rider: nian("sit", { giggle: true }) }), ox(0.94, 220)],
          beats: [
            { caption: "看着小驾驶员认真的样子，爸爸妈妈都笑了。" },
            { say: "mom", text: "小司机，开稳点儿！" },
          ],
        },
      ],
    },
  ],
};

export default story;
