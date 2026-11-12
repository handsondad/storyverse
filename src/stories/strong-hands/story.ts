import type { Prop, SceneSpec, Story, Thing } from "../../story/types.ts";

/**
 * 2026-01-10 的真事：小念最近特别爱拧瓶盖、开柜子，翻箱倒柜。
 * 姥爷在厨房做饭，小念跑进卫生间把洗衣液大桶的盖子拧开了，倒了一地，在那儿瞎玩；姥爷发现时气坏了，他还笑。
 * 妈妈回来让爸爸把瓶盖拧紧，爸爸哼了一声：我都拧紧了，你都拧不开，咱们小念比你手劲儿都大。妈妈也无语了。
 * 这时小念一岁五个月，还不怎么会说话，只给他笑声。
 */
const home: SceneSpec = { place: "living-room", time: "day" };
const bath: SceneSpec = { place: "bathroom", time: "day" };
const jug = (x: number, cap?: Thing["cap"], size = 200): Prop => ({ thing: { kind: "jug", ...(cap ? { cap } : {}) }, x, size, front: true });

const story: Story = {
  id: "strong-hands",
  title: "小念的手劲儿",
  blurb: "洗衣液大桶的盖子，小念一拧就开——爸爸说，他比妈妈手劲儿都大！",
  when: { date: "2026-01-10", label: "拧瓶盖" },
  credits: { by: ["nian", "dad", "mom"] },
  cover: {
    scene: bath,
    actors: [
      { who: "nian", at: 0.32, pose: "crouch", face: "laugh", facing: "right" },
      { who: "laoye", at: 0.72, pose: "shrug", face: "angry", facing: "left" },
    ],
    props: [jug(0.51, "spill", 150)],
  },
  pages: [
    {
      layout: "1-2",
      panels: [
        {
          scene: home,
          shot: "wide",
          actors: [
            { who: "nian", at: 0.3, pose: "hold", hold: "🧴", face: "happy", facing: "right" },
            { who: "mom", at: 0.78, pose: "stand", face: "angry", facing: "left" },
          ],
          props: [
            { emoji: "🧸", x: 0.47, size: 90, front: true },
            { emoji: "📚", x: 0.56, size: 80, front: true },
            { emoji: "🧦", x: 0.63, size: 70, front: true },
          ],
          beats: [
            { caption: "2026年1月10日，小念最近特别爱拧瓶盖、开柜子。" },
            { say: "mom", text: "又翻箱倒柜啦！" },
          ],
        },
        {
          scene: { place: "plain", tint: "#ffe9c2" },
          shot: "close",
          actors: [{ who: "nian", at: 0.5, pose: "stand", face: "proud" }],
          beats: [
            { caption: "说白了，就是翻箱倒柜，又顽皮又气人。" },
          ],
        },
        {
          scene: { place: "dining-room", time: "day" },
          shot: "wide",
          actors: [
            { who: "laoye", at: 0.66, pose: "hold", hold: "🍳", face: "happy", facing: "left" },
            { who: "nian", at: 0.3, pose: "walk", face: "happy", facing: "left" },
          ],
          beats: [
            { caption: "一次，姥爷在厨房做饭。" },
            { say: "laoye", text: "小念，自己玩会儿啊！" },
          ],
        },
      ],
    },
    {
      layout: "2-1",
      panels: [
        {
          scene: bath,
          shot: "wide",
          actors: [{ who: "nian", at: 0.3, pose: "walk", face: "happy", facing: "right" }],
          props: [jug(0.68)],
          beats: [
            { caption: "小念跑进卫生间，盯上了洗衣液大桶——" },
          ],
        },
        {
          scene: { place: "plain", tint: "#e6f4ff" },
          shot: "wide",
          actors: [],
          props: [jug(0.55, "off", 420)],
          beats: [
            { caption: "不知怎么，竟把盖子拧开了！" },
            { sfx: "咔！" },
          ],
        },
        {
          scene: bath,
          shot: "wide",
          actors: [{ who: "nian", at: 0.24, pose: "crouch", face: "laugh", facing: "right" }],
          props: [jug(0.6, "spill", 220)],
          beats: [
            { caption: "那可要很大的力气！洗衣液倒了一地，他就在那儿瞎玩。" },
            { sfx: "啪嗒啪嗒" },
          ],
        },
      ],
    },
    {
      layout: "1-2",
      panels: [
        {
          scene: bath,
          shot: "wide",
          actors: [
            { who: "nian", at: 0.2, pose: "crouch", face: "laugh", facing: "right" },
            { who: "laoye", at: 0.82, pose: "stand", face: "surprised", facing: "left" },
          ],
          props: [jug(0.5, "spill", 180)],
          beats: [
            { caption: "等姥爷发现，已经一地了！" },
            { say: "laoye", text: "哎哟！", kind: "shout" },
          ],
        },
        {
          scene: { place: "plain", tint: "#f3ebe0" },
          shot: "close",
          actors: [{ who: "laoye", at: 0.5, pose: "stand", face: "angry" }],
          beats: [
            { caption: "把姥爷气的——" },
            { say: "laoye", text: "你这个小家伙！" },
          ],
        },
        {
          scene: { place: "plain", tint: "#fff0c2" },
          shot: "close",
          actors: [{ who: "nian", at: 0.5, pose: "stand", face: "laugh" }],
          beats: [
            { caption: "他还笑呢！" },
            { sfx: "嘻嘻" },
          ],
        },
      ],
    },
    {
      layout: "1-2-1",
      panels: [
        {
          scene: { place: "living-room", time: "evening" },
          shot: "wide",
          actors: [
            { who: "dad", at: 0.3, pose: "stand", face: "neutral", facing: "right" },
            { who: "mom", at: 0.7, pose: "point", face: "serious", facing: "left" },
          ],
          beats: [
            { caption: "妈妈回来，和爸爸说——" },
            { say: "mom", text: "以后把瓶盖拧紧呀！" },
          ],
        },
        {
          scene: { place: "plain", tint: "#e6f0ff" },
          shot: "close",
          actors: [{ who: "dad", at: 0.5, pose: "stand", face: "proud" }],
          beats: [
            { say: "dad", text: "哼，我都拧紧了，你都拧不开！" },
          ],
        },
        {
          scene: { place: "plain", tint: "#e8f6ec" },
          shot: "close",
          actors: [{ who: "mom", at: 0.5, pose: "stand", face: "surprised" }],
          beats: [
            { say: "mom", text: "啊？" },
          ],
        },
        {
          scene: { place: "living-room", time: "evening" },
          shot: "wide",
          actors: [
            { who: "dad", at: 0.22, pose: "point", face: "laugh", facing: "right" },
            { who: "nian", at: 0.5, pose: "cheer", face: "proud", facing: "right" },
            { who: "mom", at: 0.78, pose: "stand", face: "confused", facing: "left" },
          ],
          beats: [
            { say: "dad", text: "咱们小念比你手劲儿都大！" },
            { caption: "听完，妈妈也无语了。" },
          ],
        },
      ],
    },
  ],
};

export default story;
