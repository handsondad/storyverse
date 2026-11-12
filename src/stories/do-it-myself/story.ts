import type { Actor, Prop, SceneSpec, Story } from "../../story/types.ts";

/**
 * 2026-09-02 的真事：最近小念啥事都要自己来。早上穿袜子，他大喊「不要」，一把把袜子扯掉；
 * 妈妈刚想再帮忙，他自己抓起袜子往脚上套，套反了、脚后跟还露着，还骄傲地宣布「宝宝自己来」。
 */
const room: SceneSpec = { place: "bedroom", time: "morning" };
const nian = (at: number, more: Partial<Actor> = {}): Actor => ({ who: "nian", at, pose: "sit", face: "neutral", facing: "right", feet: "bare", ...more });
const sock = (x: number, lift: number, size = 110): Prop => ({ thing: { kind: "sock" }, x, lift, size, front: true });

const story: Story = {
  id: "do-it-myself",
  title: "宝宝自己来！",
  blurb: "早上穿袜子，小念大喊「不要」，自己套上了——套反了也骄傲！",
  when: { date: "2026-09-02", label: "自己穿袜子" },
  credits: { by: ["nian", "dad", "mom"] },
  cover: {
    scene: room,
    actors: [
      nian(0.4, { pose: "cheer", face: "proud", feet: "wrong" }),
      { who: "mom", at: 0.68, pose: "crouch", face: "laugh", facing: "left" },
    ],
    props: [sock(0.53, 0, 100)],
  },
  pages: [
    {
      layout: "1-2",
      panels: [
        {
          scene: room,
          shot: "wide",
          actors: [
            nian(0.3, { face: "sleepy" }),
            { who: "mom", at: 0.56, pose: "crouch", face: "happy", facing: "left" },
          ],
          props: [sock(0.47, 150)],
          beats: [
            { caption: "2026年9月2日早上，小念起床了。" },
            { say: "mom", text: "来，妈妈给你穿袜子！" },
          ],
        },
        {
          scene: room,
          shot: "close",
          actors: [nian(0.5, { pose: "stand", face: "angry" })],
          beats: [
            { caption: "小念突然大喊——" },
            { say: "nian", text: "不要！", kind: "shout" },
          ],
        },
        {
          scene: room,
          shot: "wide",
          actors: [
            nian(0.3, { pose: "shrug", face: "angry" }),
            { who: "mom", at: 0.68, pose: "crouch", face: "surprised", facing: "left" },
          ],
          props: [{ thing: { kind: "sock" }, x: 0.5, lift: 420, size: 120 }],
          beats: [
            { caption: "一把就把袜子扯掉了！" },
            { sfx: "嗖！", at: [0.6, 0.25] },
          ],
        },
      ],
    },
    {
      layout: "2-1",
      panels: [
        {
          scene: room,
          actors: [{ who: "mom", at: 0.5, pose: "crouch", face: "confused", facing: "left" }],
          beats: [
            { say: "mom", text: "好好好，妈妈再帮你……" },
          ],
        },
        {
          scene: room,
          shot: "close",
          actors: [nian(0.5, { pose: "hold", face: "serious" })],
          props: [{ thing: { kind: "sock" }, x: 0.53, lift: 165, size: 75, front: true }],
          beats: [
            { caption: "话还没说完，小念自己抓起了袜子。" },
          ],
        },
        {
          scene: room,
          shot: "wide",
          actors: [nian(0.4, { pose: "tug", face: "serious" })],
          props: [sock(0.5, 60, 100)],
          beats: [
            { caption: "他板着小脸，一个劲儿往脚上套。" },
            { sfx: "嘿——哟！" },
          ],
        },
      ],
    },
    {
      layout: "1-2",
      panels: [
        {
          scene: { place: "plain", tint: "#e6f4ff" },
          actors: [],
          props: [{ thing: { kind: "sock", worn: "wrong" }, x: 0.5, lift: 60, size: 900 }],
          shot: "wide",
          beats: [
            { caption: "袜子套反了，脚后跟还露在外面。" },
          ],
        },
        {
          scene: room,
          shot: "close",
          actors: [{ who: "mom", at: 0.5, pose: "stand", face: "shy", facing: "left" }],
          beats: [
            { say: "mom", text: "嘿嘿，套反啦……", kind: "thought" },
          ],
        },
        {
          scene: { place: "burst", tint: "#ffe3b0" },
          actors: [nian(0.5, { pose: "cheer", face: "proud", feet: "wrong" })],
          beats: [
            { caption: "可小念骄傲地宣布——" },
            { say: "nian", text: "宝宝自己来！", kind: "shout" },
          ],
        },
      ],
    },
    {
      layout: "2-1",
      panels: [
        {
          scene: room,
          actors: [
            nian(0.32, { pose: "stand", face: "proud", feet: "wrong" }),
            { who: "mom", at: 0.68, pose: "crouch", face: "laugh", facing: "left" },
          ],
          beats: [
            { say: "mom", text: "好，宝宝自己来！" },
          ],
        },
        {
          scene: room,
          shot: "close",
          actors: [{ who: "mom", at: 0.5, pose: "stand", face: "happy" }],
          beats: [
            { caption: "最近小念穿衣服、拿东西，都要自己来。" },
            { say: "mom", text: "这是小念长大啦！" },
          ],
        },
        {
          scene: room,
          shot: "wide",
          actors: [
            nian(0.36, { pose: "walk", face: "proud", feet: "wrong" }),
            { who: "mom", at: 0.66, pose: "stand", face: "happy", facing: "left" },
          ],
          beats: [
            { caption: "他想自己管好自己的小世界呢！" },
          ],
        },
      ],
    },
  ],
};

export default story;
