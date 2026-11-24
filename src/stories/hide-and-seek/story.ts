import type { Prop, SceneSpec, Story, Thing } from "../../story/types.ts";

/**
 * 2025-12-05 的真事：小念一岁四个月，迷上了躲猫猫——玩偶挡脸、躲到沙发后面、玩具藏到身后。
 * 爸爸得认认真真地配合，小念才高兴。这会儿他还是宝宝，不会说话，只用笑声和旁白。
 */
const home: SceneSpec = { place: "living-room", time: "day" };
/** 会爬会坐会站的小念：一岁四个月，胎毛还在 */
const nian = (move: Thing["move"], more: Partial<Thing> = {}): Thing => ({ kind: "baby", move, hair: "fuzz", ...more });
/** 玩偶挡在脸前：宝宝坐着时的脸低一点 */
const bearOnBaby = (x: number, lift = 90, size = 130): Prop => ({ emoji: "🧸", x, lift, size, front: true });
/** 玩偶挡在爸爸脸前 */
const bearOnDad = (x: number, lift = 410): Prop => ({ emoji: "🧸", x, lift, size: 130, front: true });
/** 藏在小念身后的小车 */
const toyBehind = (x: number): Prop => ({ emoji: "🚗", x, lift: 90, size: 100 });

const story: Story = {
  id: "hide-and-seek",
  title: "躲猫猫高手",
  blurb: "玩偶挡脸、沙发后藏身、玩具放身后——爸爸得认真找，小念才笑得出来！",
  when: { date: "2025-12-05", label: "躲猫猫" },
  credits: { by: ["nian", "dad", "mom"] },
  cover: {
    scene: home,
    actors: [{ who: "dad", at: 0.3, pose: "crouch", face: "laugh", facing: "right" }],
    props: [
      { thing: nian("sit", { giggle: true }), x: 0.58, size: 360 },
      bearOnBaby(0.58, 90),
    ],
  },
  pages: [
    {
      layout: "1-2",
      panels: [
        {
          scene: home,
          shot: "wide",
          actors: [{ who: "dad", at: 0.28, pose: "crouch", face: "laugh", facing: "right" }],
          props: [
            { thing: nian("sit", { giggle: true }), x: 0.6, size: 360 },
            bearOnBaby(0.6, 90),
          ],
          beats: [
            { caption: "2025年12月5日，小念一岁四个月，迷上了躲猫猫。" },
            { say: "dad", text: "小念？小念在哪儿呀？" },
          ],
        },
        {
          scene: { place: "plain", tint: "#fff0c2" },
          shot: "wide",
          actors: [],
          props: [
            { thing: nian("sit", { giggle: true }), x: 0.5, size: 700 },
            bearOnBaby(0.5, 230, 200),
          ],
          beats: [
            { caption: "玩偶一挡脸，他就咯咯笑。" },
            { sfx: "嘿嘿！" },
          ],
        },
        {
          scene: home,
          shot: "medium",
          actors: [{ who: "dad", at: 0.5, pose: "stand", face: "surprised" }],
          beats: [
            { say: "dad", text: "咦？看不见小念了！" },
          ],
        },
      ],
    },
    {
      layout: "2-1",
      panels: [
        {
          scene: home,
          shot: "wide",
          actors: [{ who: "dad", at: 0.28, pose: "crouch", face: "laugh", facing: "right" }],
          props: [bearOnDad(0.36, 410), { thing: nian("sit", { giggle: true }), x: 0.7, size: 340 }],
          beats: [
            { caption: "爸爸也拿起玩偶，挡住了自己的脸。" },
            { say: "dad", text: "哎呀，我也看不见啦！" },
          ],
        },
        {
          scene: home,
          shot: "close",
          focus: "dad",
          actors: [{ who: "dad", at: 0.5, pose: "crouch", face: "laugh" }],
          props: [bearOnDad(0.56, 410)],
          beats: [
            { say: "dad", text: "这下换爸爸躲猫猫啦！" },
          ],
        },
        {
          scene: home,
          shot: "wide",
          actors: [],
          props: [{ thing: nian("sit", { giggle: true }), x: 0.5, size: 460 }],
          beats: [
            { caption: "小念笑得前仰后合。" },
            { sfx: "哈哈哈！" },
          ],
        },
      ],
    },
    {
      layout: "1-2-1",
      panels: [
        {
          scene: home,
          shot: "wide",
          actors: [],
          props: [
            { thing: nian("crawl", { giggle: true }), x: 0.4, size: 360 },
            { thing: { kind: "sofa" }, x: 0.52, size: 240, front: true },
          ],
          beats: [
            { caption: "后来，小念躲到小沙发后面。" },
          ],
        },
        {
          scene: home,
          shot: "medium",
          actors: [{ who: "dad", at: 0.3, pose: "walk", face: "thinking", facing: "right" }],
          beats: [
            { caption: "爸爸东找找，西找找。" },
            { say: "dad", text: "小念去哪儿了？" },
          ],
        },
        {
          scene: home,
          shot: "wide",
          actors: [{ who: "dad", at: 0.24, pose: "shrug", face: "confused", facing: "right" }],
          props: [{ thing: nian("sit", { cry: true }), x: 0.62, size: 380 }],
          beats: [
            { caption: "爸爸要是说「不找了」，小念就急得嗯啊叫。" },
          ],
        },
        {
          scene: home,
          shot: "wide",
          actors: [{ who: "dad", at: 0.28, pose: "crouch", face: "laugh", facing: "right" }],
          props: [{ thing: nian("sit", { giggle: true }), x: 0.66, size: 360 }],
          beats: [
            { caption: "爸爸只好认认真真地找，小念才开心。" },
          ],
        },
      ],
    },
    {
      layout: "1-1-1",
      panels: [
        {
          scene: home,
          shot: "wide",
          actors: [],
          props: [
            { thing: nian("stand", { giggle: true }), x: 0.42, size: 400 },
            toyBehind(0.32),
          ],
          beats: [
            { caption: "最近，小念又玩起了玩具躲猫猫。" },
          ],
        },
        {
          scene: home,
          shot: "close",
          focus: "dad",
          actors: [{ who: "dad", at: 0.5, pose: "think", face: "confused" }],
          beats: [
            { say: "dad", text: "咦，玩具去哪儿了？" },
          ],
        },
        {
          scene: home,
          shot: "wide",
          actors: [{ who: "dad", at: 0.68, pose: "point", face: "laugh", facing: "left" }],
          props: [{ thing: nian("stand", { giggle: true }), x: 0.4, size: 400 }],
          beats: [
            { say: "dad", text: "是小念藏起来了！" },
          ],
        },
      ],
    },
    {
      layout: "1-2",
      panels: [
        {
          scene: home,
          shot: "wide",
          actors: [{ who: "dad", at: 0.74, pose: "cheer", face: "laugh", facing: "left" }],
          props: [
            { thing: nian("stand", { giggle: true }), x: 0.38, size: 400 },
            { emoji: "🚗", x: 0.46, lift: 260, size: 100, front: true },
          ],
          beats: [
            { caption: "小念一听，高兴地把玩具拿出来！" },
          ],
        },
        {
          scene: home,
          shot: "medium",
          actors: [{ who: "dad", at: 0.5, pose: "crouch", face: "laugh" }],
          beats: [
            { say: "dad", text: "原来是个躲猫猫高手！" },
          ],
        },
        {
          scene: { place: "burst", tint: "#ffe9a8" },
          shot: "wide",
          actors: [],
          props: [{ thing: nian("sit", { giggle: true }), x: 0.5, size: 560 }],
          beats: [
            { caption: "哈哈哈哈，真实好玩。" },
            { sfx: "哈哈哈！" },
          ],
        },
      ],
    },
  ],
};

export default story;
