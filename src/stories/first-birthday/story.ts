import type { Actor, Prop, SceneSpec, Story, Thing } from "../../story/types.ts";

/**
 * 2025-08-03 的真事：小念过一岁生日。妈妈准备了蛋糕和生日帽（姥爷生日时答应的大大的帽子），
 * 姥爷做了他最爱吃的菜，爸爸挂上妈妈买的装饰。小念吹蜡烛吹上了瘾，让爸爸点了好几回。
 * 大舅（叔叔的样子）、舅妈（阿姨的样子）和两个哥哥也来了，一大家人都坐不下了。
 */
const room: SceneSpec = { place: "dining-room", time: "evening" };
const nian = (more: Partial<Thing> = {}): Thing => ({ kind: "baby", move: "sit", hair: "fuzz", hat: "big", ...more });
/** 被大人抱着的小念：大人用 hug 姿势、面朝右站在 at，小念脸朝外 */
const inArms = (at: number, more: Partial<Thing> = {}): Prop =>
  ({ thing: nian({ giggle: true, ...more }), x: at + 110 / 1400, lift: 250, size: 380, front: true });
const balloons: Prop[] = [
  { emoji: "🎈", x: 0.08, lift: 560, size: 130 },
  { emoji: "🎉", x: 0.5, lift: 640, size: 110 },
  { emoji: "🎈", x: 0.93, lift: 580, size: 130 },
];
/** 一大家人：大舅、舅妈、两个哥哥（第二个换件蓝衣服）、妈妈抱着小念、姥爷、爸爸 */
const everyone = (face: Actor["face"], pose: Actor["pose"] = "stand"): Actor[] => [
  { who: "gege", at: 0.075, pose, face, facing: "right" },
  { who: "gege", at: 0.155, pose, face, facing: "right", top: "#4fc3f7" },
  { who: "ayi", at: 0.265, pose, face, facing: "right" },
  { who: "shushu", at: 0.375, pose, face, facing: "right" },
  { who: "mom", at: 0.5, pose: "hug", face, facing: "right" },
  { who: "laoye", at: 0.72, pose, face, facing: "left" },
  { who: "dad", at: 0.87, pose, face, facing: "left" },
];

const story: Story = {
  id: "first-birthday",
  title: "小念一岁啦！",
  blurb: "小念过生日，终于戴上了自己大大的生日帽。吹蜡烛吹上了瘾，一大家人都坐不下啦！",
  when: { date: "2025-08-03", label: "小念一岁生日" },
  credits: { by: ["nian", "dad", "mom"] },
  cover: {
    scene: { ...room, table: { from: 0.3, to: 0.7 } },
    actors: [
      { who: "dad", at: 0.2, pose: "cheer", face: "laugh", facing: "right" },
      { who: "mom", at: 0.42, pose: "hug", face: "laugh", facing: "right" },
      { who: "laoye", at: 0.76, pose: "stand", face: "laugh", facing: "left" },
    ],
    props: [
      { emoji: "🎂", x: 0.62, lift: 205, size: 140 },
      inArms(0.42),
      { emoji: "🎈", x: 0.28, lift: 305, size: 110 },
      { emoji: "🎉", x: 0.68, lift: 325, size: 105 },
    ],
  },
  pages: [
    {
      layout: "1-2",
      panels: [
        {
          scene: room,
          shot: "wide",
          actors: [
            { who: "mom", at: 0.2, pose: "hold", face: "happy", facing: "right", hold: "🎂" },
            { who: "laoye", at: 0.5, pose: "hold", face: "laugh", facing: "left", hold: "🍲" },
            { who: "dad", at: 0.8, pose: "hold", face: "happy", facing: "left", hold: "🎈" },
          ],
          beats: [
            { caption: "2025年8月3日，期盼已久的日子来啦！" },
            { say: "mom", text: "小念过生日！蛋糕来啦！" },
            { say: "laoye", text: "姥爷做了小念最爱吃的菜！" },
          ],
        },
        {
          scene: room,
          actors: [{ who: "dad", at: 0.5, pose: "cheer", face: "laugh" }],
          props: [
            { emoji: "🎈", x: 0.37, lift: 600, size: 120 },
            { emoji: "🎊", x: 0.64, lift: 640, size: 110 },
          ],
          beats: [
            { caption: "爸爸把妈妈买的装饰都挂了起来。" },
            { say: "dad", text: "气球、彩带，挂起来！" },
          ],
        },
        {
          scene: { place: "burst", tint: "#d6efff" },
          shot: "wide",
          actors: [],
          props: [{ thing: nian({ giggle: true }), x: 0.46, size: 520 }],
          beats: [
            { caption: "小念戴上了自己的生日帽，大大的！" },
          ],
        },
      ],
    },
    {
      layout: "1-1",
      panels: [
        {
          scene: room,
          actors: [
            { who: "mom", at: 0.32, pose: "hug", face: "laugh", facing: "right" },
            { who: "laoye", at: 0.72, pose: "stand", face: "happy", facing: "left" },
          ],
          props: [inArms(0.32)],
          beats: [
            { caption: "上回姥爷过生日，小念非要戴姥爷的帽子。" },
            { say: "mom", text: "这回呀，是你自己的生日帽！" },
            { say: "laoye", text: "比姥爷那顶还大！" },
          ],
        },
        {
          scene: { place: "living-room", time: "evening" },
          shot: "wide",
          actors: [
            { who: "shushu", at: 0.16, pose: "hold", face: "happy", facing: "right", hold: "🎁" },
            { who: "ayi", at: 0.34, pose: "wave", face: "happy", facing: "right" },
            { who: "gege", at: 0.5, pose: "cheer", face: "laugh", facing: "right" },
            { who: "gege", at: 0.62, pose: "wave", face: "happy", facing: "right", top: "#4fc3f7" },
            { who: "dad", at: 0.86, pose: "wave", face: "laugh", facing: "left" },
          ],
          beats: [
            { caption: "大舅、舅妈和两个哥哥也来给小念庆生啦！" },
            { say: "shushu", text: "小念，生日快乐！" },
            { say: "gege", text: "弟弟在哪儿呀？" },
          ],
        },
      ],
    },
    {
      layout: "1-1",
      panels: [
        {
          scene: { ...room, table: { from: 0.3, to: 0.66 } },
          shot: "wide",
          actors: everyone("laugh"),
          props: [
            { emoji: "🍲", x: 0.33, lift: 205, size: 90 },
            { emoji: "🎂", x: 0.62, lift: 205, size: 110 },
            inArms(0.5),
            ...balloons,
          ],
          beats: [
            { caption: "一大家人围在一起，桌子都坐不下啦！" },
            { say: "dad", text: "挤一挤，挤一挤！" },
          ],
        },
        {
          scene: { ...room, table: { from: 0.3, to: 0.7 } },
          actors: [
            { who: "ayi", at: 0.24, pose: "cheer", face: "laugh", facing: "right" },
            { who: "mom", at: 0.44, pose: "hug", face: "happy", facing: "right" },
            { who: "laoye", at: 0.78, pose: "cheer", face: "laugh", facing: "left" },
          ],
          props: [{ emoji: "🎂", x: 0.64, lift: 205, size: 120 }, inArms(0.44)],
          beats: [
            { say: "ayi", text: "祝小念生日快乐～" },
            { say: "laoye", text: "祝你生日快乐～" },
          ],
        },
      ],
    },
    {
      layout: "2-1",
      panels: [
        {
          scene: { ...room, table: { from: 0.28, to: 0.72 } },
          shot: "wide",
          actors: [],
          props: [
            { thing: nian({ blow: true }), x: 0.39, lift: 205, size: 400, front: true },
            { emoji: "🎂", x: 0.62, lift: 205, size: 150, front: true },
          ],
          beats: [
            { caption: "小念吹蜡烛，呼——一下就吹灭了！" },
          ],
        },
        {
          scene: room,
          actors: [{ who: "dad", at: 0.6, pose: "hold", face: "laugh", facing: "left", hold: "🎂" }],
          beats: [
            { caption: "他吹上了瘾，爸爸只好一遍遍重新点上。" },
            { say: "dad", text: "好好好，再点一次！" },
          ],
        },
        {
          scene: room,
          shot: "wide",
          actors: everyone("laugh", "cheer"),
          props: [inArms(0.5), ...balloons],
          beats: [
            { caption: "一大家人都乐开了花！" },
            { sfx: "哈哈哈！", at: [0.78, 0.12] },
          ],
        },
      ],
    },
  ],
};

export default story;
