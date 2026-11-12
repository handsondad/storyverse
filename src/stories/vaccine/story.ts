import type { Prop, SceneSpec, Story, Thing } from "../../story/types.ts";

/**
 * 2024-11-10 的真事：小念三个多月，爸爸妈妈带他去卫生院打疫苗。
 * 妈妈以为他会疼得哭，结果他一声都没哭；爸爸给他点赞。
 */
const hall: SceneSpec = { place: "hospital", sign: "接种室" };
const sitting = (more: Partial<Thing> = {}): Thing => ({ kind: "baby", move: "sit", ...more });
/** 被大人抱着的小念：大人用 hug 姿势、面朝右站在 at，小念脸朝外（朝右） */
const inArms = (at: number): Prop =>
  ({ thing: sitting(), x: at + 110 / 1400, lift: 250, size: 380, front: true });

const story: Story = {
  id: "vaccine",
  title: "勇敢的小念",
  blurb: "第一次去卫生院打疫苗，妈妈以为小念会哭，结果……",
  when: { date: "2024-11-10", label: "打疫苗" },
  credits: { by: ["nian", "dad", "mom"] },
  cover: {
    scene: hall,
    actors: [
      { who: "mom", at: 0.4, pose: "hug", face: "happy", facing: "right" },
      { who: "dad", at: 0.7, pose: "hold", face: "proud", facing: "left", hold: "👍" },
    ],
    props: [inArms(0.4)],
  },
  pages: [
    {
      layout: "1-2",
      panels: [
        {
          scene: hall,
          shot: "wide",
          actors: [
            { who: "dad", at: 0.4, pose: "walk", face: "happy", facing: "right" },
            { who: "mom", at: 0.64, pose: "hug", face: "neutral", facing: "right" },
          ],
          props: [inArms(0.64)],
          beats: [
            { caption: "2024年11月10日，爸爸妈妈带小念去卫生院打疫苗。" },
            { say: "dad", text: "接种室到啦！" },
          ],
        },
        {
          scene: hall,
          shot: "wide",
          actors: [],
          props: [{ thing: sitting(), x: 0.48, size: 460 }],
          beats: [
            { caption: "小念才三个多月，睁大眼睛东看看、西看看。" },
          ],
        },
        {
          scene: hall,
          actors: [{ who: "mom", at: 0.5, pose: "think", face: "scared" }],
          beats: [
            { say: "mom", text: "打针可疼了，小念肯定要哭……", kind: "thought" },
          ],
        },
      ],
    },
    {
      layout: "2-1",
      panels: [
        {
          scene: hall,
          actors: [
            { who: "mom", at: 0.3, pose: "hug", face: "scared", facing: "right" },
            { who: "dad", at: 0.72, pose: "stand", face: "happy", facing: "left" },
          ],
          props: [inArms(0.3)],
          beats: [
            { say: "dad", text: "别紧张，有我们陪着呢。" },
          ],
        },
        {
          scene: hall,
          actors: [
            { who: "mom", at: 0.3, pose: "hug", face: "neutral", facing: "right" },
            { who: "ayi", at: 0.72, pose: "hold", face: "happy", facing: "left", outfit: "doctor", hold: "💉" },
          ],
          props: [inArms(0.3)],
          beats: [
            { say: "ayi", text: "宝宝不怕，一下就好。" },
          ],
        },
        {
          scene: { place: "plain", tint: "#e3f1ff" },
          shot: "wide",
          actors: [],
          props: [
            { thing: sitting(), x: 0.44, size: 950 },
            { emoji: "💉", x: 0.6, lift: 30, size: 230, front: true },
          ],
          beats: [
            { caption: "大夫阿姨在小念腿上轻轻一扎——" },
          ],
        },
      ],
    },
    {
      layout: "1-1",
      panels: [
        {
          scene: hall,
          shot: "wide",
          actors: [
            { who: "mom", at: 0.36, pose: "hug", face: "surprised", facing: "right" },
            { who: "ayi", at: 0.76, pose: "stand", face: "happy", facing: "left", outfit: "doctor" },
          ],
          props: [inArms(0.36)],
          beats: [
            { say: "mom", text: "咦？他没哭？" },
          ],
        },
        {
          scene: hall,
          shot: "wide",
          actors: [],
          props: [{ thing: sitting(), x: 0.48, size: 460 }],
          beats: [
            { caption: "小念眨眨眼睛，一声都没哭！" },
          ],
        },
      ],
    },
    {
      layout: "1-2-1",
      panels: [
        {
          scene: hall,
          actors: [
            { who: "dad", at: 0.16, pose: "stand", face: "happy", facing: "right" },
            { who: "mom", at: 0.38, pose: "hug", face: "laugh", facing: "right" },
            { who: "ayi", at: 0.82, pose: "stand", face: "happy", facing: "left", outfit: "doctor" },
          ],
          props: [inArms(0.38)],
          beats: [
            { say: "ayi", text: "这宝宝真坚强！" },
            { say: "mom", text: "比我想的勇敢多啦！" },
          ],
        },
        {
          scene: hall,
          shot: "close",
          actors: [{ who: "dad", at: 0.45, pose: "stand", face: "proud", facing: "right" }],
          props: [{ emoji: "👍", x: 0.545, lift: 450, size: 110, front: true }],
          beats: [
            { say: "dad", text: "小念真厉害，爸爸给你点赞！" },
          ],
        },
        {
          scene: hall,
          actors: [{ who: "mom", at: 0.5, pose: "stand", face: "shy" }],
          beats: [
            { say: "mom", text: "原来妈妈是白担心啦！" },
          ],
        },
        {
          scene: { place: "burst", tint: "#ffd6a0" },
          shot: "wide",
          actors: [],
          props: [{ thing: sitting(), x: 0.47, size: 560 }, { emoji: "🏅", x: 0.62, lift: 250, size: 130 }],
          beats: [
            { caption: "勇敢的小念！" },
          ],
        },
      ],
    },
  ],
};

export default story;
