import type { Actor, Prop, SceneSpec, Story } from "../../story/types.ts";

/**
 * 2026-11-22 的真事：小念和爸爸在床上玩小天才学习机里学拼音、认东西的小游戏。
 * 游戏里一个冒火的炮弹砸中玩具小汽车，小汽车着火了；爸爸没在意，小念却一声不吭跑下床去找消防车，
 * 拿着消防车回来给学习机里的小汽车救火。妈妈听说后夸小念真聪明。
 */
const room: SceneSpec = { place: "bedroom", time: "day" };
const home: SceneSpec = { place: "living-room", time: "day" };
const screen: SceneSpec = { place: "plain", tint: "#e3f1ff" };
const pad = (x: number, lift: number, size: number, game?: "play" | "boom" | "fire"): Prop => ({ thing: { kind: "pad", game }, x, lift, size, front: true });
const onBed = (who: "nian" | "dad", at: number, more: Partial<Actor> = {}): Actor => ({ who, at, pose: "sit", perch: true, lift: 120, face: "happy", facing: "left", ...more });

const story: Story = {
  id: "fire-truck",
  title: "小小消防员",
  blurb: "学习机里的小汽车着火了，小念跳下床就去找消防车——他要去救火！",
  when: { date: "2026-11-22", label: "救火啦" },
  credits: { by: ["nian", "dad", "mom"] },
  cover: {
    scene: room,
    actors: [
      { who: "dad", at: 0.31, pose: "stand", face: "laugh", facing: "right" },
      { who: "nian", at: 0.47, pose: "hold", hold: "🚒", face: "serious", facing: "right" },
    ],
    props: [pad(0.645, 120, 150, "fire"), { emoji: "💦", x: 0.56, lift: 190, size: 70 }],
  },
  pages: [
    {
      layout: "1-2",
      panels: [
        {
          scene: room,
          shot: "wide",
          actors: [onBed("dad", 0.9), onBed("nian", 0.76, { facing: "right" })],
          props: [pad(0.83, 250, 130, "play")],
          beats: [
            { caption: "2026年11月22日，小念和爸爸在床上玩小天才。" },
            { caption: "里面的小游戏能学拼音、认东西。" },
          ],
        },
        {
          scene: screen,
          shot: "wide",
          actors: [],
          props: [pad(0.5, 160, 620, "boom")],
          beats: [
            { caption: "突然，飞来一个冒火的炮弹——" },
          ],
        },
        {
          scene: screen,
          shot: "wide",
          actors: [],
          props: [pad(0.5, 160, 620, "fire")],
          beats: [
            { caption: "砸到小汽车上，小汽车着火啦！" },
            { sfx: "砰！" },
          ],
        },
      ],
    },
    {
      layout: "2-1",
      panels: [
        {
          scene: room,
          shot: "medium",
          actors: [{ who: "dad", at: 0.5, pose: "stand", face: "neutral" }],
          beats: [
            { caption: "爸爸没太注意，接着往下玩。" },
            { say: "dad", text: "下一个，这是什么呀？" },
          ],
        },
        {
          scene: room,
          shot: "wide",
          actors: [{ who: "nian", at: 0.4, pose: "run", face: "serious", facing: "left" }],
          beats: [
            { caption: "小念却一声不吭，溜下床跑了。" },
            { sfx: "嗒嗒嗒" },
          ],
        },
        {
          scene: room,
          shot: "wide",
          actors: [{ who: "dad", at: 0.55, pose: "shrug", face: "confused", facing: "left" }],
          props: [pad(0.84, 120, 150, "fire")],
          beats: [
            { say: "dad", text: "咦？小念咋莫名其妙走了？", kind: "thought" },
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
            { who: "dad", at: 0.28, pose: "walk", face: "confused", facing: "right" },
            { who: "nian", at: 0.62, pose: "crouch", face: "serious", facing: "right" },
          ],
          props: [{ emoji: "🧺", x: 0.78, size: 170, front: true }, { emoji: "🧸", x: 0.76, lift: 120, size: 90 }],
          beats: [
            { caption: "爸爸跟过去一看，小念正在翻玩具。" },
            { say: "nian", text: "消防车！消防车呢？" },
          ],
        },
        {
          scene: home,
          shot: "close",
          actors: [{ who: "nian", at: 0.5, pose: "point", face: "serious" }],
          beats: [
            { say: "nian", text: "爸爸，帮我找！" },
          ],
        },
        {
          scene: home,
          shot: "close",
          actors: [{ who: "dad", at: 0.5, pose: "stand", face: "surprised" }],
          beats: [
            { caption: "爸爸一下就明白了！" },
            { say: "dad", text: "噢——要去救火！" },
          ],
        },
      ],
    },
    {
      layout: "1-1",
      panels: [
        {
          scene: home,
          shot: "wide",
          actors: [
            { who: "dad", at: 0.36, pose: "hold", hold: "🚒", face: "laugh", facing: "right" },
            { who: "nian", at: 0.64, pose: "cheer", face: "laugh", facing: "left" },
          ],
          props: [{ emoji: "🧺", x: 0.12, size: 160, front: true }],
          beats: [
            { caption: "爸爸赶快帮着翻，找到啦！" },
            { say: "dad", text: "消防车在这儿！" },
          ],
        },
        {
          scene: room,
          shot: "wide",
          actors: [{ who: "nian", at: 0.48, pose: "hold", hold: "🚒", face: "serious", facing: "right" }],
          props: [pad(0.82, 120, 240, "fire"), { emoji: "💦", x: 0.64, lift: 240, size: 90 }],
          beats: [
            { caption: "小念举着消防车，给学习机里的小汽车救火！" },
            { say: "nian", text: "呜哇呜哇，救火！", kind: "shout" },
          ],
        },
      ],
    },
    {
      layout: "1-2",
      panels: [
        {
          scene: room,
          shot: "wide",
          actors: [
            onBed("dad", 0.92, { face: "laugh" }),
            { who: "nian", at: 0.4, pose: "hold", hold: "🚒", face: "proud", facing: "right" },
          ],
          props: [pad(0.8, 120, 170, "fire")],
          beats: [
            { sfx: "哈哈哈！" },
            { say: "dad", text: "原来你是去找消防车呀！" },
          ],
        },
        {
          scene: { ...home, time: "evening" },
          shot: "medium",
          actors: [
            { who: "dad", at: 0.3, pose: "point", face: "laugh", facing: "right" },
            { who: "mom", at: 0.7, pose: "stand", face: "surprised", facing: "left" },
          ],
          beats: [
            { caption: "晚上，爸爸把这件事讲给妈妈听。" },
            { say: "dad", text: "小汽车一着火，他就去找消防车！" },
          ],
        },
        {
          scene: { ...home, time: "evening" },
          shot: "wide",
          actors: [
            { who: "mom", at: 0.36, pose: "cheer", face: "laugh", facing: "right" },
            { who: "nian", at: 0.62, pose: "hold", hold: "🚒", face: "proud", facing: "left" },
          ],
          beats: [
            { say: "mom", text: "小念真聪明！" },
            { caption: "小小消防员，出动啦！" },
          ],
        },
      ],
    },
  ],
};

export default story;