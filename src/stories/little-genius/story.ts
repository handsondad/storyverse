import type { Actor, Prop, SceneSpec, Story } from "../../story/types.ts";

/**
 * 2026-10-20 的真事：小念迷上了小天才学习机里的儿歌，一边听一边蹦床。
 * 他不认字，却能从几十首歌里精准找到喜欢的那几首；爸爸后来发现他是认每首歌后面的小图片。
 * 爸爸感叹小念记性真好，夸他是个小天才（和学习机的名字呼应）。
 */
const home: SceneSpec = { place: "living-room", time: "day" };
const note = (x: number, lift: number, size = 80): Prop => ({ emoji: "🎵", x, lift, size });
const TRAMP = 420;
const tramp = (x: number): Prop => ({ thing: { kind: "trampoline" }, x, size: TRAMP });
const bouncing = (at: number): Actor => ({ who: "nian", at, pose: "jump", face: "laugh", lift: TRAMP * 0.2 });
const pad = (x: number, size: number, lift = 0, pick?: number): Prop => ({ thing: { kind: "pad", pick }, x, lift, size });

const story: Story = {
  id: "little-genius",
  title: "小念的记忆力",
  blurb: "小念不认字，却能从几十首儿歌里一下找到最爱的那首——原来他是认小图片的！",
  when: { date: "2026-10-20", label: "小天才" },
  credits: { by: ["nian", "dad", "mom"] },
  cover: {
    scene: home,
    actors: [bouncing(0.6)],
    props: [tramp(0.6), pad(0.24, 240), note(0.18, 300), note(0.32, 360, 70)],
  },
  pages: [
    {
      layout: "1-2",
      panels: [
        {
          scene: home,
          shot: "wide",
          actors: [bouncing(0.6)],
          props: [tramp(0.6), pad(0.24, 240), note(0.18, 300), note(0.32, 360, 70)],
          beats: [
            { caption: "2026年10月20日，小念最近迷上了小天才学习机。" },
            { caption: "他最爱一边听儿歌，一边蹦床。" },
            { sfx: "蹦！蹦！" },
          ],
        },
        {
          scene: home,
          actors: [{ who: "dad", at: 0.5, pose: "think", face: "thinking" }],
          beats: [
            { caption: "爸爸猜——" },
            { say: "dad", text: "儿歌的节奏，正合着蹦床吧？", kind: "thought" },
          ],
        },
        {
          scene: { place: "plain", tint: "#ffeccc" },
          shot: "wide",
          actors: [bouncing(0.5)],
          props: [tramp(0.5), note(0.3, 560), note(0.7, 620, 70)],
          beats: [
            { caption: "反正小念总是玩得不亦乐乎！" },
          ],
        },
      ],
    },
    {
      layout: "1-2",
      panels: [
        {
          scene: { ...home, table: { from: 0.46, to: 0.8 } },
          shot: "wide",
          actors: [
            { who: "dad", at: 0.12, pose: "stand", face: "surprised", facing: "right" },
            { who: "nian", at: 0.36, pose: "point", face: "happy", facing: "right" },
          ],
          props: [pad(0.63, 300, 205)],
          beats: [
            { caption: "小念还不认字，选歌却特别厉害。" },
            { say: "nian", text: "要这个！" },
          ],
        },
        {
          scene: { place: "plain", tint: "#e3f1ff" },
          actors: [],
          props: [pad(0.5, 620, 160, 3)],
          beats: [
            { caption: "几十首歌里，一下就找到最爱的那几首。" },
          ],
        },
        {
          scene: home,
          actors: [{ who: "dad", at: 0.5, pose: "shrug", face: "confused" }],
          beats: [
            { caption: "爸爸琢磨不透。" },
            { say: "dad", text: "他是怎么认出来的？" },
          ],
        },
      ],
    },
    {
      layout: "1-1",
      panels: [
        {
          scene: { place: "plain", tint: "#fff3d6" },
          shot: "wide",
          actors: [{ who: "dad", at: 0.14, pose: "point", face: "surprised", facing: "right" }],
          props: [pad(0.62, 600, 220, 0)],
          beats: [
            { caption: "后来爸爸发现：每首歌后面都有个小图片！" },
            { say: "dad", text: "原来他是看图认歌的！" },
          ],
        },
        {
          scene: home,
          shot: "wide",
          actors: [
            { who: "dad", at: 0.34, pose: "cheer", face: "laugh", facing: "right" },
            { who: "nian", at: 0.62, pose: "stand", face: "proud", facing: "left" },
          ],
          beats: [
            { caption: "几十个小图差别不大，小念却认得一清二楚。" },
            { say: "dad", text: "哎呀，小念记性真好！" },
          ],
        },
      ],
    },
    {
      layout: "1-1",
      panels: [
        {
          scene: home,
          actors: [
            { who: "dad", at: 0.34, pose: "point", face: "happy", facing: "right" },
            { who: "nian", at: 0.64, pose: "cheer", face: "laugh", facing: "left" },
          ],
          beats: [
            { say: "dad", text: "你呀，才是真正的小天才！" },
            { say: "nian", text: "我是小天才！" },
          ],
        },
        {
          scene: { place: "burst", tint: "#ffe9a8" },
          shot: "wide",
          actors: [{ who: "nian", at: 0.36, pose: "cheer", face: "proud", facing: "right" }],
          props: [pad(0.66, 380, 120, 3)],
          beats: [
            { caption: "小天才学习机，遇上了真正的小天才！" },
            { sfx: "哈哈哈！" },
          ],
        },
      ],
    },
  ],
};

export default story;
