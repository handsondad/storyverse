import type { Prop, SceneSpec, Story, Thing } from "../../story/types.ts";

/**
 * 2025-04-20 的真事：小念爬得飞快。体育公园的门球场被会爬的小娃娃们「占」成了遛娃的地方，
 * 小念是最爱爬的那一个：追着会跑的哥哥姐姐爬，看见会走的小汽车也趴着追。
 */
const court: SceneSpec = { place: "gateball", time: "day" };
const crawler = (x: number, more: Partial<Thing> = {}, size = 300): Prop =>
  ({ thing: { kind: "baby", move: "crawl", ...more }, x, size, front: true });
/** 别人家的宝宝换个颜色，黄色留给小念 */
const BLUE = "#9fd0ff";
const PINK = "#ffbcd2";
const MINT = "#b8ecc8";
const car = (x: number, size = 110): Prop => ({ emoji: "🚗", x, size, front: true });

const story: Story = {
  id: "crawl-court",
  title: "门球场上的爬爬队",
  blurb: "体育公园的门球场，成了小娃娃们的爬爬场。小念是爬得最欢的那一个！",
  when: { date: "2025-04-20", label: "爬爬高手" },
  credits: { by: ["nian", "dad", "mom"] },
  cover: {
    scene: court,
    actors: [{ who: "dad", at: 0.68, pose: "cheer", face: "laugh", facing: "left" }],
    props: [car(0.36), crawler(0.53, {}, 340)],
  },
  pages: [
    {
      layout: "1-2",
      panels: [
        {
          scene: { place: "living-room", time: "day" },
          shot: "wide",
          actors: [{ who: "mom", at: 0.2, pose: "point", face: "laugh", facing: "right" }],
          props: [crawler(0.46, {}, 380)],
          beats: [
            { caption: "2025年4月，小念爬得可快了，整天在地上爬来爬去。" },
            { say: "mom", text: "小念，慢点爬！" },
          ],
        },
        {
          scene: court,
          shot: "wide",
          actors: [
            { who: "dad", at: 0.3, pose: "point", face: "happy", facing: "right" },
            { who: "mom", at: 0.6, pose: "hug", face: "happy", facing: "left" },
          ],
          props: [{ thing: { kind: "baby", move: "sit" }, x: 0.6 - 110 / 1400, lift: 250, size: 380, front: true }],
          beats: [
            { caption: "4月20日，爸爸妈妈带他去体育公园玩。" },
            { say: "dad", text: "看，那边有个门球场！" },
          ],
        },
        {
          scene: court,
          shot: "wide",
          actors: [],
          props: [crawler(0.36, { color: BLUE, flip: true }, 250), crawler(0.53, { color: PINK }, 250), crawler(0.68, { color: MINT }, 250)],
          beats: [
            { caption: "门球场早被娃娃们「占」了，成了遛娃的好地方。" },
          ],
        },
      ],
    },
    {
      layout: "2-1",
      panels: [
        {
          scene: { place: "plain", tint: "#e3f6e8" },
          actors: [],
          props: [crawler(0.37, { color: BLUE, flip: true }, 300), crawler(0.6, { color: PINK }, 300)],
          beats: [
            { caption: "一群会爬的「小动物」，你爬过来，我爬过去。" },
          ],
        },
        {
          scene: { place: "burst", tint: "#fff3b0" },
          actors: [],
          props: [crawler(0.47, {}, 560)],
          beats: [
            { caption: "小念是里面最爱爬的那一个！" },
          ],
        },
        {
          scene: court,
          shot: "wide",
          actors: [
            { who: "gege", at: 0.14, pose: "run", face: "laugh", facing: "left" },
            { who: "jiejie", at: 0.36, pose: "run", face: "happy", facing: "left" },
          ],
          props: [crawler(0.66, {}, 320)],
          beats: [
            { caption: "哥哥姐姐在前面跑，小念就在后面爬着追。" },
            { say: "jiejie", text: "小念，来追我呀！" },
            { say: "gege", text: "哇，他爬得好快！" },
          ],
        },
      ],
    },
    {
      layout: "1-2",
      panels: [
        {
          scene: court,
          shot: "wide",
          actors: [],
          props: [car(0.3), crawler(0.62, {}, 340)],
          beats: [
            { caption: "看见会走的小汽车，他也趴着追过去。" },
            { sfx: "嘀嘀——", at: [0.3, 0.62] },
          ],
        },
        {
          scene: { place: "plain", tint: "#fff1c9" },
          actors: [],
          props: [{ thing: { kind: "baby", move: "sit" }, x: 0.4, size: 560 }, car(0.62, 150)],
          beats: [
            { caption: "追上啦！" },
          ],
        },
        {
          scene: court,
          shot: "wide",
          actors: [
            { who: "dad", at: 0.3, pose: "stand", face: "laugh", facing: "right" },
            { who: "mom", at: 0.6, pose: "hug", face: "laugh", facing: "left" },
          ],
          props: [{ thing: { kind: "baby", move: "sit" }, x: 0.6 - 110 / 1400, lift: 250, size: 380, front: true }],
          beats: [
            { say: "mom", text: "真是一个好动的小念呀！" },
            { say: "dad", text: "一刻都停不下来！" },
          ],
        },
      ],
    },
  ],
};

export default story;
