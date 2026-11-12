import type { Prop, SceneSpec, Story, Thing } from "../../story/types.ts";

/**
 * 2025-05-10 的真事：爸爸妈妈给小念买了个澡盆，其实就是大号洗脸盆。小念坐进去正合适，
 * 还把它当成大玩具，一说洗澡就兴奋，尽情玩水；爸爸妈妈看着他相视一笑。
 */
const bath: SceneSpec = { place: "bathroom" };
const home: SceneSpec = { place: "living-room", time: "day" };
const nian = (more: Partial<Thing> = {}): Thing => ({ kind: "baby", move: "sit", hair: "fuzz", ...more });
const inTub = (x: number, more: Partial<Thing> = {}, size = 420): Prop =>
  ({ thing: nian({ tub: true, ...more }), x, size, front: true });
/** 被大人抱着的小念：大人用 hug 姿势、面朝右站在 at，小念脸朝外 */
const inArms = (at: number, more: Partial<Thing> = {}): Prop =>
  ({ thing: nian(more), x: at + 110 / 1400, lift: 250, size: 380, front: true });

const story: Story = {
  id: "bath-basin",
  title: "小念的大澡盆",
  blurb: "爸爸妈妈买的澡盆，其实是个大号洗脸盆——可小念最爱它了！",
  when: { date: "2025-05-10", label: "新澡盆" },
  credits: { by: ["nian", "dad", "mom"] },
  cover: {
    scene: bath,
    actors: [
      { who: "mom", at: 0.3, pose: "crouch", face: "laugh", facing: "right" },
      { who: "dad", at: 0.72, pose: "stand", face: "laugh", facing: "left" },
    ],
    props: [inTub(0.5, { splash: true, giggle: true })],
  },
  pages: [
    {
      layout: "1-2",
      panels: [
        {
          scene: home,
          shot: "wide",
          actors: [
            { who: "dad", at: 0.24, pose: "point", face: "proud", facing: "right" },
            { who: "mom", at: 0.72, pose: "stand", face: "laugh", facing: "left" },
          ],
          props: [{ thing: { kind: "tub" }, x: 0.47, size: 300, front: true }],
          beats: [
            { caption: "2025年5月10日，爸爸妈妈给小念买了个洗澡盆。" },
            { say: "dad", text: "看，新澡盆！" },
            { say: "mom", text: "这不就是个大号洗脸盆嘛！" },
          ],
        },
        {
          scene: bath,
          shot: "wide",
          actors: [{ who: "mom", at: 0.36, pose: "hug", face: "happy", facing: "right" }],
          props: [inArms(0.36), { thing: { kind: "tub" }, x: 0.66, size: 240, front: true }],
          beats: [
            { say: "mom", text: "来，坐进去试试！" },
          ],
        },
        {
          scene: { place: "plain", tint: "#e3f1ff" },
          actors: [],
          props: [inTub(0.47, {}, 620)],
          beats: [
            { caption: "可小念坐进去，大小正合适！" },
          ],
        },
      ],
    },
    {
      layout: "2-2",
      panels: [
        {
          scene: home,
          actors: [{ who: "mom", at: 0.5, pose: "wave", face: "happy" }],
          beats: [
            { say: "mom", text: "小念，洗澡啦！" },
          ],
        },
        {
          scene: { place: "burst", tint: "#fff3b0" },
          actors: [],
          props: [{ thing: nian({ giggle: true }), x: 0.47, size: 560 }],
          beats: [
            { caption: "一听要洗澡，小念就兴奋得不得了。" },
            { sfx: "咿呀！", at: [0.68, 0.4] },
          ],
        },
        {
          scene: home,
          actors: [{ who: "dad", at: 0.4, pose: "hug", face: "laugh", facing: "right" }],
          props: [inArms(0.4, { giggle: true })],
          beats: [
            { say: "dad", text: "走，洗澡去！" },
          ],
        },
        {
          scene: { place: "plain", tint: "#d8f0ff" },
          actors: [],
          props: [inTub(0.47, { splash: true, giggle: true }, 600)],
          beats: [
            { caption: "一坐进澡盆，就拍起水来。" },
            { sfx: "啪啪！", at: [0.72, 0.35] },
          ],
        },
      ],
    },
    {
      layout: "1-2",
      panels: [
        {
          scene: bath,
          shot: "wide",
          actors: [
            { who: "mom", at: 0.24, pose: "crouch", face: "surprised", facing: "right" },
            { who: "dad", at: 0.78, pose: "stand", face: "laugh", facing: "left" },
          ],
          props: [inTub(0.5, { splash: true, giggle: true })],
          beats: [
            { caption: "大号洗脸盆，成了小念的大玩具。" },
            { say: "mom", text: "哎呀，水都溅出来啦！" },
            { say: "dad", text: "让他玩个够吧！" },
          ],
        },
        {
          scene: bath,
          shot: "close",
          actors: [{ who: "mom", at: 0.5, pose: "stand", face: "laugh" }],
          beats: [
            { say: "mom", text: "一说洗澡他就乐！" },
          ],
        },
        {
          scene: bath,
          shot: "close",
          actors: [{ who: "dad", at: 0.5, pose: "stand", face: "happy" }],
          beats: [
            { say: "dad", text: "洗澡最积极的就是他！" },
          ],
        },
      ],
    },
    {
      layout: "2-1",
      panels: [
        {
          scene: { place: "plain", tint: "#fff1c9" },
          actors: [],
          props: [inTub(0.47, { giggle: true }, 600)],
          beats: [
            { caption: "小念玩得可开心了。" },
          ],
        },
        {
          scene: bath,
          actors: [
            { who: "dad", at: 0.34, pose: "stand", face: "happy", facing: "right" },
            { who: "mom", at: 0.66, pose: "stand", face: "happy", facing: "left" },
          ],
          beats: [
            { caption: "看着小念这么快乐，爸爸妈妈相视一笑。" },
          ],
        },
        {
          scene: bath,
          shot: "wide",
          actors: [
            { who: "dad", at: 0.24, pose: "crouch", face: "laugh", facing: "right" },
            { who: "mom", at: 0.76, pose: "crouch", face: "laugh", facing: "left" },
          ],
          props: [inTub(0.5, { splash: true, giggle: true })],
          beats: [
            { caption: "真是幸福的一家人！" },
            { sfx: "哗啦哗啦", at: [0.5, 0.3] },
          ],
        },
      ],
    },
  ],
};

export default story;
