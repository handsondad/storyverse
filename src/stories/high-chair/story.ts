import type { Actor, Prop, SceneSpec, Story } from "../../story/types.ts";

/**
 * 2026-11-08 吃饭时的真事：小念蹬桌子翘餐椅，妈妈去洗手，最后连人带椅子摔倒了。
 * 饭桌的几格都用同一套座位，翻页时桌子、椅子不会跳。
 */
const room: SceneSpec = { place: "dining-room", time: "day", table: { from: 0.31, to: 0.95 } };
/** 站着说话的几格不画桌子，免得桌子横在人身上 */
const floor: SceneSpec = { place: "dining-room", time: "day" };
const nian = (more: Partial<Actor>): Actor => ({ who: "nian", at: 0.2, seat: "high-chair", pose: "sit", facing: "right", ...more });
/** 往后翘的时候人整个往后仰，往桌子挪一点，脚还够得着桌边 */
const pushing = (tip: number, more: Partial<Actor> = {}): Actor => nian({ at: 0.24, pose: "push", tip, face: "laugh", ...more });
const mom = (more: Partial<Actor>): Actor => ({ who: "mom", at: 0.56, seat: "chair", pose: "sit", facing: "left", ...more });
const laoye = (more: Partial<Actor>): Actor => ({ who: "laoye", at: 0.84, seat: "chair", pose: "sit", facing: "left", ...more });
const dishes: Prop[] = [
  { emoji: "🍚", x: 0.4, lift: 205, size: 70 },
  { emoji: "🍲", x: 0.7, lift: 205, size: 90 },
  { emoji: "🥦", x: 0.94, lift: 205, size: 60 },
];

const story: Story = {
  id: "high-chair",
  title: "餐椅不是跷跷板",
  blurb: "小念吃饭时蹬桌子翘椅子，妈妈一走，咣当——",
  when: { date: "2026-11-08" },
  credits: { by: ["nian", "dad", "mom"] },
  cover: {
    scene: { ...room, table: { from: 0.48, to: 0.8 } },
    actors: [
      nian({ at: 0.44, pose: "push", tip: 20, face: "laugh" }),
      laoye({ seat: undefined, at: 0.66, pose: "shrug", face: "scared" }),
    ],
    props: [{ emoji: "🍚", x: 0.56, lift: 205, size: 70 }],
  },
  pages: [
    {
      layout: "1-2",
      panels: [
        {
          scene: room,
          shot: "wide",
          actors: [nian({ face: "happy" }), mom({ face: "happy" }), laoye({ face: "happy" })],
          props: dishes,
          beats: [
            { caption: "这天，小念和妈妈、姥爷一起吃饭。" },
            { say: "laoye", text: "来，多吃点菜。" },
          ],
        },
        {
          scene: room,
          shot: "wide",
          actors: [pushing(18)],
          props: dishes.slice(0, 1),
          beats: [
            { caption: "小念脚一蹬桌子，椅子前腿就翘起来了。" },
            { say: "nian", text: "翘起来啦！好好玩！" },
            { sfx: "嘎吱" },
          ],
        },
        {
          scene: room,
          actors: [pushing(12, { face: "happy" }), mom({ face: "surprised" })],
          props: dishes,
          beats: [
            { say: "mom", text: "别蹬了，会往后摔倒的！", kind: "shout" },
            { say: "nian", text: "不会的，好玩！" },
          ],
        },
      ],
    },
    {
      layout: "2-1",
      panels: [
        {
          scene: room,
          actors: [mom({ at: 0.5, seat: undefined, pose: "walk", face: "neutral", facing: "left" }), laoye({ face: "happy" })],
          props: dishes,
          beats: [
            { say: "mom", text: "我去洗洗手，马上回来。" },
            { say: "laoye", text: "去吧，我看着他。" },
          ],
        },
        {
          scene: { place: "bathroom" },
          shot: "wide",
          actors: [{ who: "mom", at: 0.5, pose: "hold", face: "neutral", facing: "right" }],
          beats: [
            { caption: "妈妈去卫生间洗手了。" },
            { sfx: "哗啦啦" },
          ],
        },
        {
          scene: room,
          shot: "wide",
          actors: [pushing(28), laoye({ seat: undefined, at: 0.7, pose: "hug", face: "scared" })],
          props: [dishes[0], { ...dishes[1], x: 0.52 }, dishes[2]],
          beats: [
            { caption: "妈妈一走，小念蹬得更起劲了。" },
            { say: "laoye", text: "快坐好！要摔啦！", kind: "shout" },
            { say: "nian", text: "再高一点！" },
          ],
        },
      ],
    },
    {
      layout: "1-1",
      panels: [
        {
          scene: room,
          shot: "wide",
          actors: [pushing(80, { face: "surprised" }), laoye({ seat: undefined, at: 0.7, pose: "shrug", face: "scared" })],
          props: dishes,
          beats: [
            { caption: "用力太大，小念连人带椅子往后倒了。" },
            { sfx: "咣当！", color: "#ff6b4a" },
            { say: "laoye", text: "哎呀！", kind: "shout" },
          ],
        },
        {
          scene: { place: "bathroom" },
          actors: [{ who: "mom", at: 0.4, pose: "run", face: "surprised", facing: "left" }],
          beats: [
            { say: "mom", text: "什么声音？！", kind: "shout" },
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
            pushing(80, { face: "cry" }),
            { who: "mom", at: 0.38, pose: "run", face: "scared", facing: "left" },
            laoye({ seat: undefined, at: 0.8, pose: "stand", face: "sad" }),
          ],
          props: [{ ...dishes[0], x: 0.56 }, { ...dishes[1], x: 0.9 }],
          beats: [
            { caption: "妈妈跑出来一看，小念摔在地上，哇哇大哭。" },
            { say: "nian", text: "呜哇——好疼！", kind: "shout" },
          ],
        },
        {
          scene: floor,
          actors: [
            { who: "nian", at: 0.4, pose: "stand", face: "cry" },
            { who: "mom", at: 0.63, pose: "hug", face: "sad", facing: "left" },
          ],
          beats: [
            { say: "mom", text: "快让妈妈看看，哪儿疼？" },
          ],
        },
        {
          scene: floor,
          actors: [{ who: "laoye", at: 0.5, pose: "think", face: "sad" }],
          beats: [
            { say: "laoye", text: "应该是磕到头了。" },
          ],
        },
      ],
    },
    {
      layout: "2-1",
      panels: [
        {
          scene: floor,
          actors: [
            { who: "nian", at: 0.4, pose: "stand", face: "sad" },
            { who: "mom", at: 0.6, pose: "stand", face: "happy", facing: "left" },
          ],
          beats: [
            { caption: "幸好没有大碍，小念记住了这次教训。" },
            { say: "nian", text: "我再也不蹬桌子了。" },
          ],
        },
        {
          scene: { place: "plain", tint: "#d8f0d2" },
          shot: "wide",
          actors: [{ who: "nian", at: 0.5, seat: "high-chair", pose: "sit", face: "proud" }],
          beats: [
            { caption: "四条椅子腿都着地，才最安全。" },
          ],
        },
        {
          scene: room,
          shot: "wide",
          actors: [nian({ face: "happy" }), mom({ face: "happy" }), laoye({ face: "laugh" })],
          props: dishes,
          beats: [
            { say: "mom", text: "坐得真稳，接着吃饭吧！" },
            { say: "laoye", text: "这下记住啦。" },
          ],
        },
      ],
    },
  ],
};

export default story;
