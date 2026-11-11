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
          scene: { place: "plain", tint: "#e8f4ee" },
          actors: [{ who: "mom", at: 0.5, pose: "think", face: "scared" }],
          beats: [
            { say: "mom", text: "打针可疼了，小念肯定要哭……", kind: "thought" },
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
      ],
    },
    {
      layout: "2-1",
      panels: [
        {
          scene: { place: "plain", tint: "#e3f1ff" },
          actors: [],
          props: [
            { thing: sitting(), x: 0.44, size: 600 },
            { emoji: "💉", x: 0.55, lift: 20, size: 150, front: true },
          ],
          beats: [
            { caption: "大夫阿姨在小念腿上轻轻一扎——" },
          ],
        },
        {
          scene: hall,
          actors: [{ who: "mom", at: 0.5, pose: "stand", face: "surprised" }],
          beats: [
            { say: "mom", text: "咦？他没哭？" },
          ],
        },
        {
          scene: { place: "burst", tint: "#fff3b0" },
          actors: [],
          props: [{ thing: sitting(), x: 0.47, size: 600, glow: "#fff6c2" }],
          beats: [
            { caption: "小念眨眨眼睛，一声都没哭！" },
          ],
        },
      ],
    },
    {
      layout: "1-2",
      panels: [
        {
          scene: hall,
          shot: "wide",
          actors: [
            { who: "dad", at: 0.16, pose: "stand", face: "happy", facing: "right" },
            { who: "mom", at: 0.42, pose: "hug", face: "laugh", facing: "right" },
            { who: "ayi", at: 0.78, pose: "stand", face: "happy", facing: "left", outfit: "doctor" },
          ],
          props: [inArms(0.42)],
          beats: [
            { say: "ayi", text: "这宝宝真坚强！" },
            { say: "mom", text: "比我想的勇敢多啦！" },
          ],
        },
        {
          scene: hall,
          actors: [{ who: "dad", at: 0.5, pose: "hold", face: "proud", hold: "👍" }],
          beats: [
            { say: "dad", text: "小念真厉害，爸爸给你点赞！" },
          ],
        },
        {
          scene: { place: "burst", tint: "#ffd6a0" },
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
