import type { Prop, SceneSpec, Story, Thing } from "../../story/types.ts";

/**
 * 2025-03-10 的真事：姥爷过生日。妈妈准备了蛋糕，爸爸做了一桌菜，
 * 小念的礼物是姥爷提议、爸爸推出来的小光头；唱生日歌时他还非要戴姥爷的生日帽。
 */
const room: SceneSpec = { place: "dining-room", time: "evening" };
const sitting = (more: Partial<Thing> = {}): Thing => ({ kind: "baby", move: "sit", ...more });
/** 被大人抱着的小念：大人用 hug 姿势站在 at；toward 是大人朝哪边，out 是小念脸朝外 */
const inArms = (at: number, toward: "left" | "right", more: Partial<Thing> = {}, out = false): Prop => {
  const side = toward === "right" ? 1 : -1;
  return {
    thing: sitting({ flip: (toward === "right") !== out, ...more }),
    x: at + side * 110 / 1400, lift: 250, size: 380, front: true,
  };
};
const bald: Partial<Thing> = { hair: "bald" };
const hatted: Partial<Thing> = { hair: "bald", hat: "party" };

const story: Story = {
  id: "laoye-birthday",
  title: "送给姥爷的小光头",
  blurb: "姥爷过生日，妈妈送蛋糕，爸爸做饭菜，小念送的是——一个亮亮的小光头！",
  when: { date: "2025-03-10", label: "姥爷生日" },
  credits: { by: ["nian", "dad", "mom"] },
  cover: {
    scene: room,
    actors: [
      { who: "mom", at: 0.4, pose: "hug", face: "laugh", facing: "right" },
      { who: "laoye", at: 0.66, pose: "hold", face: "laugh", facing: "left", hold: "🎂" },
    ],
    props: [inArms(0.4, "right", hatted, true)],
  },
  pages: [
    {
      layout: "1-2",
      panels: [
        {
          scene: room,
          shot: "wide",
          actors: [
            { who: "mom", at: 0.22, pose: "hold", face: "happy", facing: "right", hold: "🎂" },
            { who: "laoye", at: 0.5, pose: "stand", face: "laugh" },
            { who: "dad", at: 0.78, pose: "hold", face: "proud", facing: "left", hold: "🍗" },
          ],
          beats: [
            { caption: "2025年3月10日，今天是姥爷的生日。" },
            { say: "mom", text: "爸，生日快乐！蛋糕来啦！" },
            { say: "dad", text: "一桌好菜，都是我做的！" },
          ],
        },
        {
          scene: { place: "plain", tint: "#fff1c9" },
          actors: [],
          props: [{ thing: sitting({ hair: "fuzz" }), x: 0.47, size: 600 }],
          beats: [
            { caption: "那小念给姥爷准备了什么呢？" },
          ],
        },
        {
          scene: room,
          actors: [
            { who: "laoye", at: 0.34, pose: "point", face: "happy", facing: "right" },
            { who: "dad", at: 0.66, pose: "stand", face: "surprised", facing: "left" },
          ],
          beats: [
            { say: "laoye", text: "给小念理个小亮头，给我庆祝生日！" },
            { say: "dad", text: "好嘞！" },
          ],
        },
      ],
    },
    {
      layout: "2-1",
      panels: [
        {
          scene: { place: "plain", tint: "#e3f1ff" },
          actors: [],
          props: [
            { thing: sitting({ hair: "fuzz" }), x: 0.42, size: 560 },
            { thing: { kind: "clipper" }, x: 0.52, lift: 260, size: 200 },
          ],
          beats: [
            { caption: "爸爸拿起推子，给小念理发。" },
            { sfx: "嗡嗡——", at: [0.68, 0.3] },
          ],
        },
        {
          scene: { place: "burst", tint: "#fff3b0" },
          actors: [],
          props: [{ thing: sitting(bald), x: 0.47, size: 600, glow: "#fff6c2" }],
          beats: [
            { caption: "一会儿工夫，小念变成了亮亮的小光头！" },
          ],
        },
        {
          scene: room,
          shot: "wide",
          actors: [
            { who: "dad", at: 0.18, pose: "stand", face: "proud", facing: "right" },
            { who: "mom", at: 0.44, pose: "hug", face: "happy", facing: "right" },
            { who: "laoye", at: 0.8, pose: "cheer", face: "laugh", facing: "left" },
          ],
          props: [inArms(0.44, "right", bald, true)],
          beats: [
            { say: "laoye", text: "哈哈，这个生日礼物我喜欢！" },
            { say: "mom", text: "小脑袋亮得能照镜子啦！" },
          ],
        },
      ],
    },
    {
      layout: "1-2",
      panels: [
        {
          scene: { ...room, table: { from: 0.26, to: 0.62 } },
          shot: "wide",
          actors: [
            { who: "dad", at: 0.12, pose: "stand", face: "happy", facing: "right" },
            { who: "laoye", at: 0.36, seat: "chair", pose: "sit", face: "laugh", facing: "right", hat: "party" },
            { who: "mom", at: 0.8, pose: "hug", face: "happy", facing: "left" },
          ],
          props: [
            { emoji: "🎂", x: 0.52, lift: 205, size: 130 },
            inArms(0.8, "left", bald, true),
          ],
          beats: [
            { caption: "晚上，大家围着蛋糕给姥爷唱生日歌。" },
            { say: "dad", text: "祝你生日快乐～" },
            { say: "mom", text: "祝姥爷生日快乐～" },
          ],
        },
        {
          scene: room,
          actors: [
            { who: "mom", at: 0.3, pose: "hug", face: "surprised", facing: "right" },
            { who: "laoye", at: 0.7, pose: "stand", face: "laugh", facing: "left", hat: "party" },
          ],
          props: [inArms(0.3, "right", bald, true)],
          beats: [
            { caption: "唱着唱着，小念伸着小手，非要姥爷的生日帽。" },
            { say: "laoye", text: "哟，你也想戴呀？" },
          ],
        },
        {
          scene: { place: "burst", tint: "#ffd6e4" },
          actors: [],
          props: [{ thing: sitting(hatted), x: 0.47, size: 560 }],
          beats: [
            { caption: "小光头戴上生日帽，神气极了！" },
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
            { who: "mom", at: 0.34, pose: "hug", face: "laugh", facing: "right" },
            { who: "laoye", at: 0.72, pose: "stand", face: "happy", facing: "left" },
          ],
          props: [inArms(0.34, "right", hatted, true)],
          beats: [
            { say: "mom", text: "等你过生日，给你来个大大的生日帽！" },
          ],
        },
        {
          scene: room,
          shot: "wide",
          actors: [
            { who: "dad", at: 0.16, pose: "cheer", face: "laugh", facing: "right" },
            { who: "mom", at: 0.44, pose: "hug", face: "laugh", facing: "right" },
            { who: "laoye", at: 0.8, pose: "cheer", face: "laugh", facing: "left" },
          ],
          props: [inArms(0.44, "right", hatted, true)],
          beats: [
            { caption: "全家人都哈哈大笑起来。" },
            { sfx: "哈哈哈！" },
          ],
        },
      ],
    },
  ],
};

export default story;
