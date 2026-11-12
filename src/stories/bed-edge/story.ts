import type { Prop, SceneSpec, Story, Thing } from "../../story/types.ts";

/**
 * 2025-01-20 的真事：小念会趴、会坐、会爬了。爸爸陪他在床上玩，低头看了一眼手机，
 * 小念就爬到床边翻了下去，磕了小脑袋。妈妈跑进来一问，爸爸支支吾吾，妈妈一猜就中。
 */
const room: SceneSpec = { place: "bedroom", time: "day" };
/** 床上的小念：卧室的床垫离地 230 */
const onBed = (x: number, move: Thing["move"], more: Partial<Thing> = {}): Prop =>
  ({ thing: { kind: "baby", move, ...more }, x, lift: 230, size: 360 });
/** 被大人抱在怀里的小念：大人用 hug 姿势、面朝右站在 at */
const inArms = (at: number, cry = false): Prop =>
  ({ thing: { kind: "baby", move: "sit", cry, flip: true }, x: at + 110 / 1400, lift: 250, size: 380, front: true });

const story: Story = {
  id: "bed-edge",
  title: "爸爸只看了一眼手机",
  blurb: "爸爸低头看了一眼手机，小念就爬到床边翻了下去……妈妈一猜就中！",
  when: { date: "2025-01-20", label: "会爬了" },
  credits: { by: ["nian", "dad", "mom"] },
  cover: {
    scene: room,
    actors: [{ who: "dad", at: 0.58, pose: "hold", face: "happy", facing: "right", hold: "📱" }],
    props: [onBed(0.76, "crawl")],
  },
  pages: [
    {
      layout: "1-2",
      panels: [
        {
          scene: room,
          shot: "wide",
          actors: [
            { who: "mom", at: 0.2, pose: "point", face: "neutral", facing: "right" },
            { who: "dad", at: 0.5, pose: "stand", face: "happy", facing: "left" },
          ],
          props: [onBed(0.82, "sit")],
          beats: [
            { caption: "2025年1月20日，小念会趴、会坐，还会爬了。" },
            { say: "mom", text: "看好他，别让他爬到床边！" },
            { say: "dad", text: "放心吧！" },
          ],
        },
        {
          scene: room,
          shot: "wide",
          actors: [{ who: "dad", at: 0.55, pose: "wave", face: "laugh", facing: "right" }],
          props: [onBed(0.86, "crawl")],
          beats: [
            { caption: "爸爸陪小念在床上玩。" },
            { say: "dad", text: "小念，爬过来！" },
          ],
        },
        {
          scene: room,
          actors: [{ who: "dad", at: 0.5, pose: "hold", face: "happy", hold: "📱" }],
          beats: [
            { caption: "爸爸低头看了一下手机……" },
          ],
        },
      ],
    },
    {
      layout: "2-1",
      panels: [
        {
          scene: room,
          shot: "wide",
          actors: [{ who: "dad", at: 0.5, pose: "hold", face: "happy", facing: "left", hold: "📱" }],
          props: [onBed(0.75, "crawl")],
          beats: [
            { caption: "就这一会儿，小念飞快地爬到了床边！" },
          ],
        },
        {
          scene: room,
          actors: [{ who: "dad", at: 0.5, pose: "hug", face: "scared", facing: "right" }],
          beats: [
            { say: "dad", text: "哎——小念！", kind: "shout" },
          ],
        },
        {
          scene: { place: "burst", tint: "#ffd6d6" },
          shot: "wide",
          actors: [],
          props: [{ thing: { kind: "baby", move: "sit", cry: true }, x: 0.47, size: 620 }],
          beats: [
            { caption: "爸爸还没伸手，小念就翻到地上，磕了小脑袋。" },
            { sfx: "咚！哇——" },
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
          actors: [{ who: "dad", at: 0.4, pose: "hug", face: "scared", facing: "right" }],
          props: [inArms(0.4, true)],
          beats: [
            { caption: "小念哇哇大哭，爸爸赶紧抱起来哄。" },
            { say: "dad", text: "不哭不哭，爸爸抱抱！" },
          ],
        },
        {
          scene: room,
          actors: [{ who: "mom", at: 0.5, pose: "run", face: "surprised", facing: "left" }],
          beats: [
            { caption: "妈妈听见哭声，赶紧跑进屋里。" },
            { say: "mom", text: "怎么啦？出什么事了？" },
          ],
        },
        {
          scene: room,
          actors: [{ who: "dad", at: 0.5, pose: "shrug", face: "shy" }],
          beats: [
            { say: "dad", text: "呃……这个……那个……" },
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
            { who: "mom", at: 0.36, pose: "point", face: "angry", facing: "right" },
            { who: "dad", at: 0.66, pose: "stand", face: "scared", facing: "left" },
          ],
          beats: [
            { say: "mom", text: "你是不是看手机了？", kind: "shout" },
          ],
        },
        {
          scene: room,
          shot: "close",
          actors: [{ who: "dad", at: 0.5, pose: "stand", face: "shy" }],
          beats: [
            { say: "dad", text: "就……就看了一眼……" },
          ],
        },
        {
          scene: room,
          shot: "wide",
          actors: [
            { who: "dad", at: 0.24, pose: "stand", face: "shy", facing: "right" },
            { who: "mom", at: 0.52, pose: "hug", face: "neutral", facing: "right" },
          ],
          props: [inArms(0.52)],
          beats: [
            { caption: "像长了后眼的妈妈，和粗心的爸爸！" },
            { say: "mom", text: "宝宝会爬了，眼睛可不能离开！" },
            { say: "dad", text: "我记住了……" },
          ],
        },
      ],
    },
  ],
};

export default story;
