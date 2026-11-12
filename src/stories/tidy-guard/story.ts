import type { Prop, SceneSpec, Story } from "../../story/types.ts";

/**
 * 2026-10-02 的真事：最近小念帮爸爸把鞋摆正；拿了个东西用一下，又原样放回去。
 * 以前他玩完都是一扔。爸爸不解，妈妈说这是小念长大的一个阶段：东西放哪儿，他可在意了。
 */
const home: SceneSpec = { place: "living-room", time: "day" };
const withTable: SceneSpec = { ...home, table: { from: 0.52, to: 0.86 } };
const shoes = (x: number, messy = false, size = 240): Prop => ({ thing: { kind: "shoes", messy }, x, size, front: true });
const book: Prop = { emoji: "📘", x: 0.69, lift: 205, size: 110 };

const story: Story = {
  id: "tidy-guard",
  title: "秩序小卫士",
  blurb: "爸爸的鞋摆正，用完的东西放回原处——小念成了家里的秩序小卫士！",
  when: { date: "2026-10-02", label: "秩序小卫士" },
  credits: { by: ["nian", "dad", "mom"] },
  cover: {
    scene: home,
    actors: [
      { who: "nian", at: 0.32, pose: "crouch", face: "serious", facing: "right" },
      { who: "dad", at: 0.72, pose: "think", face: "confused", facing: "left" },
    ],
    props: [shoes(0.5)],
  },
  pages: [
    {
      layout: "1-2",
      panels: [
        {
          scene: home,
          shot: "wide",
          actors: [
            { who: "nian", at: 0.24, pose: "walk", face: "neutral", facing: "right" },
            { who: "dad", at: 0.78, pose: "stand", face: "happy", facing: "left" },
          ],
          props: [shoes(0.5, true)],
          beats: [
            { caption: "2026年10月2日，爸爸的鞋东一只、西一只。" },
          ],
        },
        {
          scene: { place: "plain", tint: "#fff0c2" },
          shot: "close",
          actors: [{ who: "nian", at: 0.5, pose: "point", face: "serious", facing: "right" }],
          beats: [
            { say: "nian", text: "鞋子歪了！" },
          ],
        },
        {
          scene: home,
          shot: "wide",
          actors: [{ who: "nian", at: 0.36, pose: "crouch", face: "serious", facing: "right" }],
          props: [shoes(0.56)],
          beats: [
            { caption: "小念蹲下来，把鞋摆得整整齐齐。" },
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
          actors: [
            { who: "nian", at: 0.4, pose: "stand", face: "proud", facing: "right" },
            { who: "dad", at: 0.74, pose: "stand", face: "surprised", facing: "left" },
          ],
          props: [shoes(0.56)],
          beats: [
            { say: "dad", text: "哟，帮爸爸摆鞋呀？" },
            { say: "nian", text: "放好了！" },
          ],
        },
        {
          scene: home,
          actors: [{ who: "nian", at: 0.5, pose: "hold", hold: "📘", face: "happy", facing: "right" }],
          beats: [
            { caption: "他拿了本小书，看了一会儿——" },
          ],
        },
        {
          scene: withTable,
          shot: "wide",
          actors: [{ who: "nian", at: 0.44, pose: "point", face: "serious", facing: "right" }],
          props: [book],
          beats: [
            { caption: "又原样放了回去，摆得正正的。" },
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
          actors: [{ who: "nian", at: 0.4, pose: "shrug", face: "laugh", facing: "right" }],
          props: [
            { emoji: "🧸", x: 0.16, size: 110 },
            { emoji: "🚗", x: 0.62, size: 100 },
            { emoji: "📘", x: 0.78, lift: 30, size: 90 },
            { thing: { kind: "ball" }, x: 0.7, lift: 260, size: 60 },
          ],
          beats: [
            { caption: "以前的小念可不是这样，玩完都是一扔！" },
            { sfx: "咚！", at: [0.84, 0.3] },
          ],
        },
        {
          scene: home,
          shot: "close",
          actors: [{ who: "dad", at: 0.5, pose: "think", face: "confused", facing: "right" }],
          beats: [
            { say: "dad", text: "这孩子怎么变了？" },
          ],
        },
        {
          scene: home,
          shot: "close",
          actors: [{ who: "mom", at: 0.5, pose: "stand", face: "happy", facing: "left" }],
          beats: [
            { say: "mom", text: "这是小念长大啦！" },
          ],
        },
      ],
    },
    {
      layout: "2-1",
      panels: [
        {
          scene: home,
          actors: [
            { who: "dad", at: 0.3, pose: "stand", face: "surprised", facing: "right" },
            { who: "mom", at: 0.7, pose: "point", face: "happy", facing: "left" },
          ],
          beats: [
            { caption: "妈妈说，东西放在哪儿，小念记得清清楚楚。" },
            { say: "mom", text: "动一点儿，他都不乐意！" },
          ],
        },
        {
          scene: { place: "plain", tint: "#e3f0ff" },
          shot: "close",
          actors: [{ who: "dad", at: 0.5, pose: "stand", face: "laugh" }],
          beats: [
            { say: "dad", text: "还是妈妈懂小念！" },
          ],
        },
        {
          scene: { place: "burst", tint: "#d8f0ff" },
          shot: "wide",
          actors: [
            { who: "dad", at: 0.2, pose: "cheer", face: "laugh", facing: "right" },
            { who: "nian", at: 0.46, pose: "cheer", face: "proud" },
            { who: "mom", at: 0.82, pose: "stand", face: "happy", facing: "left" },
          ],
          props: [shoes(0.63, false, 200)],
          beats: [
            { say: "dad", text: "原来是个秩序小卫士！" },
          ],
        },
      ],
    },
  ],
};

export default story;
