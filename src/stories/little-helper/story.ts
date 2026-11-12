import type { Prop, SceneSpec, Story } from "../../story/types.ts";

/**
 * 2026-11-01 的真事：最近小念很会干活，帮爸爸扫地、给妈妈拿东西。
 * 妈妈不小心把水洒在地上，正要去拿抹布，小念摇摇晃晃跑进卫生间，抽出两张纸巾，蹲下有模有样地擦；
 * 擦完抬头求表扬，妈妈夸了他，他还拍手叫好。
 */
const home: SceneSpec = { place: "living-room", time: "day" };
const puddle = (x: number, size = 300): Prop => ({ thing: { kind: "puddle" }, x, size });

const story: Story = {
  id: "little-helper",
  title: "暖心的小大人",
  blurb: "妈妈把水洒了，小念抽来两张纸巾，蹲下就擦——擦完还要表扬！",
  when: { date: "2026-11-01", label: "小帮手" },
  credits: { by: ["nian", "dad", "mom"] },
  cover: {
    scene: home,
    actors: [
      { who: "nian", at: 0.34, pose: "wipe", face: "serious", facing: "right" },
      { who: "mom", at: 0.74, pose: "hold", hold: "🥛", face: "surprised", facing: "left" },
    ],
    props: [puddle(0.49, 260), { thing: { kind: "tissue" }, x: 0.45, lift: 8, size: 80, front: true }],
  },
  pages: [
    {
      layout: "1-2",
      panels: [
        {
          scene: home,
          shot: "wide",
          actors: [
            { who: "nian", at: 0.3, pose: "hold", face: "proud", facing: "right" },
            { who: "dad", at: 0.72, pose: "stand", face: "happy", facing: "left" },
          ],
          props: [{ emoji: "🧹", x: 0.35, lift: 120, size: 260, front: true }],
          beats: [
            { caption: "2026年11月1日，最近小念可会干活啦！" },
            { say: "nian", text: "我帮爸爸扫地！" },
            { say: "dad", text: "扫得真干净！" },
          ],
        },
        {
          scene: home,
          actors: [
            { who: "nian", at: 0.3, pose: "hold", hold: "📱", face: "happy", facing: "right" },
            { who: "mom", at: 0.7, pose: "crouch", face: "happy", facing: "left" },
          ],
          beats: [
            { caption: "还给妈妈拿东西。" },
            { say: "mom", text: "谢谢小念！" },
          ],
        },
        {
          scene: home,
          shot: "wide",
          actors: [{ who: "mom", at: 0.36, pose: "hold", hold: "🥛", face: "surprised", facing: "right" }],
          props: [puddle(0.6)],
          beats: [
            { caption: "这天，妈妈不小心把水洒在了地上。" },
            { sfx: "哗啦！", at: [0.66, 0.3] },
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
            { who: "nian", at: 0.24, pose: "stand", face: "surprised", facing: "right" },
            { who: "mom", at: 0.76, pose: "walk", face: "sad", facing: "right" },
          ],
          props: [puddle(0.5, 260)],
          beats: [
            { say: "mom", text: "哎呀，我去拿抹布。" },
          ],
        },
        {
          scene: home,
          shot: "wide",
          actors: [{ who: "nian", at: 0.5, pose: "run", face: "serious", facing: "left" }],
          beats: [
            { caption: "小念一转身，摇摇晃晃跑进卫生间——" },
            { sfx: "嗒嗒嗒", at: [0.28, 0.82] },
          ],
        },
        {
          scene: { place: "bathroom", time: "day" },
          shot: "medium",
          actors: [{ who: "nian", at: 0.48, pose: "hold", face: "proud", facing: "right" }],
          props: [{ thing: { kind: "tissue" }, x: 0.49, lift: 140, size: 110, front: true }],
          beats: [
            { caption: "抽出了两张纸巾！" },
            { sfx: "唰！唰！" },
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
          actors: [
            { who: "nian", at: 0.36, pose: "wipe", face: "serious", facing: "right" },
            { who: "mom", at: 0.8, pose: "stand", face: "surprised", facing: "left" },
          ],
          props: [puddle(0.5, 240), { thing: { kind: "tissue" }, x: 0.47, lift: 8, size: 80, front: true }],
          beats: [
            { caption: "他蹲在地上，有模有样地擦了起来。" },
            { say: "mom", text: "咦？", kind: "thought" },
          ],
        },
        {
          scene: home,
          shot: "close",
          actors: [{ who: "nian", at: 0.5, pose: "stand", face: "proud" }],
          beats: [
            { caption: "擦完，还抬起头求表扬。" },
            { say: "nian", text: "擦干净啦！" },
          ],
        },
        {
          scene: home,
          shot: "close",
          actors: [{ who: "mom", at: 0.5, pose: "stand", face: "laugh" }],
          beats: [
            { say: "mom", text: "小念真棒！" },
          ],
        },
      ],
    },
    {
      layout: "2-1",
      panels: [
        {
          scene: { place: "burst", tint: "#ffe9a8" },
          actors: [{ who: "nian", at: 0.5, pose: "cheer", face: "laugh" }],
          beats: [
            { caption: "小念还给自己拍手叫好！" },
            { sfx: "啪啪啪！" },
          ],
        },
        {
          scene: home,
          shot: "close",
          actors: [{ who: "dad", at: 0.5, pose: "stand", face: "laugh", facing: "left" }],
          beats: [
            { say: "dad", text: "哈哈哈，小大人！" },
          ],
        },
        {
          scene: home,
          shot: "wide",
          actors: [
            { who: "dad", at: 0.22, pose: "stand", face: "happy", facing: "right" },
            { who: "nian", at: 0.5, pose: "stand", face: "proud" },
            { who: "mom", at: 0.68, pose: "hug", face: "happy", facing: "left" },
          ],
          beats: [
            { caption: "小念学着大人的样子，在关心家里人呢。" },
          ],
        },
      ],
    },
  ],
};

export default story;
