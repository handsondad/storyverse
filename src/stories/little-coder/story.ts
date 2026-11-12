import type { Actor, Prop, SceneSpec, Story, Thing } from "../../story/types.ts";

/**
 * 2025-11-02 的真事：小念对爸爸的电脑特别感兴趣，老是像模像样地坐到电脑前看屏幕里的代码，
 * 好像看得懂似的。爸爸每次都认真给他讲，妈妈在一旁听着好气又好笑：程序员父子！
 */
const desk: SceneSpec = { place: "living-room", time: "day", table: { from: 0.45, to: 0.8 } };
const nian = (move: Thing["move"], more: Partial<Thing> = {}): Thing => ({ kind: "baby", move, hair: "fuzz", ...more });
const DAD = 0.36;
const dad = (more: Partial<Actor> = {}): Actor => ({ who: "dad", at: DAD, seat: "chair", pose: "sit", facing: "right", ...more });
/** 坐在爸爸腿上、脸朝电脑的小念 */
const onLap = (more: Partial<Thing> = {}): Prop => ({ thing: nian("sit", more), x: DAD + 70 / 1400, lift: 150, size: 300, front: true });
const monitor: Prop = { thing: { kind: "screen" }, x: 0.62, lift: 205, size: 320 };

const story: Story = {
  id: "little-coder",
  title: "小小程序员",
  blurb: "小念老是坐到爸爸电脑前，盯着代码看得可认真了——程序员父子上线啦！",
  when: { date: "2025-11-02", label: "小小程序员" },
  credits: { by: ["nian", "dad", "mom"] },
  cover: {
    scene: desk,
    actors: [dad({ face: "happy" })],
    props: [monitor, onLap({ giggle: true })],
  },
  pages: [
    {
      layout: "1-2",
      panels: [
        {
          scene: desk,
          shot: "wide",
          actors: [dad({ face: "neutral" })],
          props: [monitor, { thing: nian("crawl", { flip: true, giggle: true }), x: 0.14, size: 300 }],
          beats: [
            { caption: "2025年11月2日，小念这几天特别逗。" },
            { say: "dad", text: "嗯？小念又来啦？" },
          ],
        },
        {
          scene: { place: "plain", tint: "#e3f1ff" },
          actors: [],
          props: [
            { thing: nian("sit"), x: 0.37, size: 360 },
            { thing: { kind: "screen" }, x: 0.63, lift: 110, size: 230 },
          ],
          beats: [
            { caption: "他对爸爸的电脑特别感兴趣，" },
          ],
        },
        {
          scene: { place: "plain", tint: "#26324d" },
          actors: [],
          props: [{ thing: { kind: "screen" }, x: 0.5, lift: 80, size: 640 }],
          beats: [
            { caption: "盯着屏幕里的代码，好像他看得懂似的！" },
          ],
        },
      ],
    },
    {
      layout: "1-1",
      panels: [
        {
          scene: desk,
          shot: "wide",
          actors: [dad({ face: "happy" })],
          props: [monitor, onLap()],
          beats: [
            { caption: "每次这样，爸爸都特别认真地给小念讲解。" },
            { say: "dad", text: "这一行呀，是让电脑画个圆。" },
          ],
        },
        {
          scene: desk,
          shot: "wide",
          actors: [
            dad({ face: "happy" }),
            { who: "mom", at: 0.12, pose: "shrug", face: "laugh", facing: "right" },
          ],
          props: [monitor, onLap({ giggle: true })],
          beats: [
            { caption: "妈妈在一旁听着，好气又好笑。" },
            { say: "mom", text: "你俩呀，真是一对程序员父子！" },
          ],
        },
      ],
    },
    {
      layout: "1-1",
      panels: [
        {
          scene: { place: "burst", tint: "#d6efff" },
          actors: [],
          props: [
            { thing: nian("sit", { giggle: true }), x: 0.36, size: 460 },
            { thing: { kind: "screen" }, x: 0.68, lift: 40, size: 280 },
          ],
          beats: [
            { caption: "我们小念，是小小程序员！" },
          ],
        },
        {
          scene: desk,
          shot: "wide",
          actors: [
            dad({ face: "laugh" }),
            { who: "mom", at: 0.12, pose: "cheer", face: "laugh", facing: "right" },
          ],
          props: [monitor, onLap({ giggle: true })],
          beats: [
            { sfx: "哈哈哈！" },
          ],
        },
      ],
    },
  ],
};

export default story;
