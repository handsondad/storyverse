import type { Prop, SceneSpec, Story, Thing } from "../../story/types.ts";

/**
 * 2026-10-17 的真事：小念最近特别喜欢拼图。妈妈买了拼图纸板，他一会儿就全拼完了。
 * 爸爸在边上看出来，他是按形状对上的，没注意纸板上的画连不连得上；爸爸正得意，小念已经开始撕纸板上的图案了。
 * 爸爸连忙制止，他笑呵呵拿着跑了，边跑边撕，还冲爸爸坏笑。爸爸哎了一声，只能干摇头。
 */
const home: SceneSpec = { place: "living-room", time: "day" };
const close = (tint: string): SceneSpec => ({ place: "plain", tint });
const board = (pieces?: Thing["pieces"]): Prop => ({ thing: { kind: "puzzle", ...(pieces ? { pieces } : {}) }, x: 0.5, lift: 40, size: 520 });
const bits = (x: number): Prop[] => [
  { emoji: "🧩", x, size: 70, front: true },
  { emoji: "🧩", x: x + 0.06, size: 60, front: true },
];

const story: Story = {
  id: "puzzle-time",
  title: "拼图和破坏大王",
  blurb: "小念一会儿就拼完了拼图，爸爸正得意自己看出了门道——小念已经开始撕了！",
  when: { date: "2026-10-17", label: "拼图" },
  credits: { by: ["nian", "dad", "mom"] },
  cover: {
    scene: home,
    actors: [
      { who: "dad", at: 0.31, pose: "shrug", face: "sad", facing: "right" },
      { who: "nian", at: 0.69, pose: "hold", hold: "🧩", face: "laugh", facing: "left" },
    ],
    props: [{ thing: { kind: "puzzle", pieces: "torn" }, x: 0.5, size: 180, front: true }],
  },
  pages: [
    {
      layout: "1-2",
      panels: [
        {
          scene: home,
          shot: "wide",
          actors: [
            { who: "nian", at: 0.3, pose: "cheer", face: "happy", facing: "right" },
            { who: "mom", at: 0.72, pose: "hold", hold: "🧩", face: "happy", facing: "left" },
          ],
          beats: [
            { caption: "2026年10月17日，小念最近特别喜欢拼图。" },
            { say: "mom", text: "妈妈买了拼图，来拼吧！" },
            { say: "nian", text: "我来拼！" },
          ],
        },
        {
          scene: home,
          shot: "wide",
          actors: [{ who: "nian", at: 0.36, pose: "crouch", face: "serious", facing: "right" }],
          props: bits(0.5),
          beats: [
            { caption: "开始兴致很好，动手能力也强了。" },
            { sfx: "咔嗒" },
          ],
        },
        {
          scene: close("#fff0c2"),
          shot: "wide",
          actors: [],
          props: [board()],
          beats: [
            { caption: "一会儿，就全拼完了！" },
          ],
        },
      ],
    },
    {
      layout: "2-1",
      panels: [
        {
          scene: home,
          shot: "wide",
          actors: [
            { who: "nian", at: 0.3, pose: "crouch", face: "happy", facing: "right" },
            { who: "dad", at: 0.7, pose: "think", face: "thinking", facing: "left" },
          ],
          props: bits(0.44),
          beats: [
            { caption: "爸爸在边上看着，发现——" },
          ],
        },
        {
          scene: close("#e6f0ff"),
          shot: "close",
          actors: [{ who: "dad", at: 0.5, pose: "stand", face: "surprised" }],
          beats: [
            { say: "dad", text: "他是看形状对上的！" },
          ],
        },
        {
          scene: close("#fff0c2"),
          shot: "wide",
          actors: [],
          props: [board("mixed")],
          beats: [
            { caption: "形状都对上了，可纸板上的画，他好像没注意连不连得上。" },
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
            { who: "dad", at: 0.3, pose: "point", face: "proud", facing: "right" },
            { who: "nian", at: 0.7, pose: "hold", hold: "🧩", face: "laugh", facing: "left" },
          ],
          beats: [
            { caption: "爸爸正得意自己的观察呢，小念已经开始当破坏大王了！" },
            { say: "dad", text: "我看得没错吧！" },
            { sfx: "嘶啦！" },
          ],
        },
        {
          scene: close("#ffe3dc"),
          shot: "wide",
          actors: [],
          props: [board("torn")],
          beats: [
            { caption: "好几块纸板上的图案，都被撕掉了。" },
          ],
        },
        {
          scene: close("#e6f0ff"),
          shot: "close",
          actors: [{ who: "dad", at: 0.5, pose: "stand", face: "surprised" }],
          beats: [
            { say: "dad", text: "别撕啦！", kind: "shout" },
          ],
        },
      ],
    },
    {
      layout: "1-2-1",
      panels: [
        {
          scene: home,
          shot: "wide",
          actors: [
            { who: "nian", at: 0.68, pose: "run", face: "laugh", facing: "right" },
            { who: "dad", at: 0.3, pose: "run", face: "surprised", facing: "right" },
          ],
          beats: [
            { caption: "结果小念笑呵呵地拿着跑了，一边跑一边撕。" },
            { sfx: "嘶啦嘶啦" },
          ],
        },
        {
          scene: close("#fff0c2"),
          shot: "close",
          actors: [{ who: "nian", at: 0.5, pose: "hold", hold: "🧩", face: "proud" }],
          beats: [
            { caption: "还冲爸爸坏笑。" },
            { say: "nian", text: "嘿嘿！" },
          ],
        },
        {
          scene: close("#e6f0ff"),
          shot: "close",
          actors: [{ who: "dad", at: 0.5, pose: "stand", face: "sad" }],
          beats: [
            { say: "dad", text: "哎——" },
          ],
        },
        {
          scene: home,
          shot: "wide",
          actors: [
            { who: "dad", at: 0.35, pose: "shrug", face: "sad", facing: "right" },
            { who: "nian", at: 0.78, pose: "run", face: "laugh", facing: "right" },
          ],
          beats: [
            { caption: "爸爸只能干摇头！" },
          ],
        },
      ],
    },
  ],
};

export default story;
