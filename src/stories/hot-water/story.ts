import type { Prop, SceneSpec, Story, Thing } from "../../story/types.ts";

/**
 * 2025-02-20 的真事：小念的小手不知什么时候烫伤了。爸爸猜是洗手时玩水龙头，拧到最左边出了热水，
 * 但到现在也说不准。妈妈给他抹了药膏、包扎好；后来小念一看见冒热气的水就喊「烫烫烫」。
 * 不画伤口：烫着的手只是红红的一团，包扎后是白纱布。
 */
const room: SceneSpec = { place: "bedroom", time: "day" };
const sitting = (more: Partial<Thing> = {}): Thing => ({ kind: "baby", move: "sit", ...more });
/** 被大人抱着的小念：大人用 hug 姿势、面朝右站在 at，小念脸朝外，伸着那只手 */
const inArms = (at: number, more: Partial<Thing> = {}): Prop =>
  ({ thing: sitting(more), x: at + 110 / 1400, lift: 250, size: 380, front: true });
/** 卧室床上的小念，脸朝左边的妈妈 */
const onBed = (more: Partial<Thing> = {}): Prop =>
  ({ thing: sitting({ flip: true, ...more }), x: 0.84, lift: 230, size: 360 });

const story: Story = {
  id: "hot-water",
  title: "烫烫烫！",
  blurb: "小念的小手不知怎么烫伤了。从那以后，他一看见热气就喊：烫烫烫！",
  when: { date: "2025-02-20", label: "小手烫伤了" },
  credits: { by: ["nian", "dad", "mom"] },
  cover: {
    scene: room,
    actors: [
      { who: "mom", at: 0.42, pose: "hug", face: "happy", facing: "right" },
      { who: "dad", at: 0.74, pose: "shrug", face: "shy", facing: "left" },
    ],
    props: [inArms(0.42, { hand: "bandage" })],
  },
  pages: [
    {
      layout: "1-2",
      panels: [
        {
          scene: room,
          shot: "wide",
          actors: [
            { who: "mom", at: 0.3, pose: "hug", face: "surprised", facing: "right" },
            { who: "dad", at: 0.66, pose: "stand", face: "scared", facing: "left" },
          ],
          props: [inArms(0.3, { cry: true, hand: "red" })],
          beats: [
            { caption: "2025年2月20日，发生了一件不好的事。" },
            { say: "mom", text: "小念的手怎么红了？" },
            { say: "dad", text: "像是烫着了！" },
          ],
        },
        {
          scene: { place: "plain", tint: "#ffe6e0" },
          actors: [],
          props: [{ thing: sitting({ cry: true, hand: "red" }), x: 0.44, size: 600 }],
          beats: [
            { caption: "不知道什么时候，小念的小手被烫伤了。" },
          ],
        },
        {
          scene: room,
          actors: [{ who: "dad", at: 0.5, pose: "think", face: "thinking" }],
          beats: [
            { say: "dad", text: "会不会是洗手的时候……", kind: "thought" },
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
            { thing: sitting({ hand: "red" }), x: 0.36, size: 520 },
            { emoji: "🚰", x: 0.66, lift: 380, size: 170 },
            { thing: { kind: "steam" }, x: 0.62, lift: 160, size: 120 },
          ],
          beats: [
            { caption: "小念最爱玩水龙头，拧到最左边，出来的就是很烫的水。" },
          ],
        },
        {
          scene: { place: "bathroom" },
          actors: [{ who: "dad", at: 0.5, pose: "think", face: "sad" }],
          beats: [
            { say: "dad", text: "大人受得了，小念的小手太嫩了。" },
          ],
        },
        {
          scene: room,
          shot: "wide",
          actors: [
            { who: "dad", at: 0.24, pose: "shrug", face: "confused", facing: "right" },
            { who: "mom", at: 0.5, pose: "hug", face: "sad", facing: "right" },
          ],
          props: [inArms(0.5, { hand: "red" })],
          beats: [
            { caption: "不过这只是爸爸的猜测，到现在也不知道是怎么烫的。" },
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
          actors: [{ who: "mom", at: 0.67, pose: "hold", face: "neutral", facing: "right", hold: "🧴" }],
          props: [onBed({ hand: "red" })],
          beats: [
            { caption: "妈妈细心地给小念抹上药膏，" },
            { say: "mom", text: "抹点药，一会儿就不疼了。" },
          ],
        },
        {
          scene: { place: "plain", tint: "#eef6ea" },
          actors: [],
          props: [{ thing: sitting({ hand: "bandage" }), x: 0.44, size: 600 }],
          beats: [
            { caption: "再轻轻地包扎好。" },
          ],
        },
        {
          scene: room,
          actors: [{ who: "dad", at: 0.5, pose: "point", face: "shy" }],
          beats: [
            { say: "dad", text: "以后洗手，爸爸先试水温！" },
          ],
        },
      ],
    },
    {
      layout: "1-1",
      panels: [
        {
          scene: { place: "plain", tint: "#fff1c9" },
          actors: [],
          props: [
            { thing: sitting({ giggle: true }), x: 0.38, size: 520 },
            { emoji: "☕", x: 0.66, lift: 40, size: 160 },
            { thing: { kind: "steam" }, x: 0.66, lift: 200, size: 90 },
          ],
          beats: [
            { caption: "后来，小念一看见冒热气的水，就会喊——" },
            { sfx: "烫烫烫！", at: [0.5, 0.32] },
          ],
        },
        {
          scene: room,
          shot: "wide",
          actors: [
            { who: "dad", at: 0.24, pose: "stand", face: "laugh", facing: "right" },
            { who: "mom", at: 0.5, pose: "hug", face: "laugh", facing: "right" },
          ],
          props: [inArms(0.5)],
          beats: [
            { caption: "看来是吃一堑，长一智呀！" },
            { say: "mom", text: "对，烫烫，不能摸！" },
          ],
        },
      ],
    },
  ],
};

export default story;
