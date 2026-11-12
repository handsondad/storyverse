import type { Prop, SceneSpec, Story, Thing } from "../../story/types.ts";

/**
 * 2025-12-12 的真事：小念迷上了爸爸妈妈放在桌上的眼镜。他比桌子矮、够不着，急得支支吾吾，
 * 大人好一阵才明白。之后他总要戴，妈妈怕近视镜看坏眼睛总拦着；爸爸看着直乐：像个小小博士！
 */
const room: SceneSpec = { place: "living-room", time: "day", table: { from: 0.45, to: 0.8 } };
const floor: SceneSpec = { place: "living-room", time: "day" };
const nian = (move: Thing["move"], more: Partial<Thing> = {}): Thing => ({ kind: "baby", move, hair: "fuzz", ...more });
const onTable: Prop[] = [
  { thing: { kind: "glasses" }, x: 0.57, lift: 205, size: 120 },
  { thing: { kind: "glasses" }, x: 0.68, lift: 205, size: 120 },
];

const story: Story = {
  id: "big-glasses",
  title: "小念的大眼镜",
  blurb: "小念迷上了爸爸妈妈的眼镜，戴上就成了小小博士！",
  when: { date: "2025-12-12", label: "大眼镜" },
  credits: { by: ["nian", "dad", "mom"] },
  cover: {
    scene: floor,
    actors: [{ who: "dad", at: 0.33, pose: "point", face: "laugh", facing: "right" }],
    props: [{ thing: nian("sit", { specs: true, giggle: true }), x: 0.6, size: 380, front: true }],
  },
  pages: [
    {
      layout: "1-1-1",
      panels: [
        {
          scene: { place: "plain", tint: "#e8f4ff" },
          shot: "wide",
          actors: [],
          props: [
            { thing: { kind: "glasses" }, x: 0.4, lift: 140, size: 260 },
            { thing: { kind: "glasses" }, x: 0.62, lift: 140, size: 260 },
          ],
          beats: [
            { caption: "2025年12月12日，小念发现了好玩的东西。" },
          ],
        },
        {
          scene: floor,
          shot: "wide",
          actors: [],
          props: [{ thing: nian("stand"), x: 0.45, size: 420 }],
          beats: [
            { caption: "一看到桌上的眼镜，他就往桌子边跑。" },
            { sfx: "嗒嗒嗒" },
          ],
        },
        {
          scene: room,
          shot: "wide",
          actors: [],
          props: [...onTable, { thing: nian("stand", { reach: true }), x: 0.41, size: 280, front: true }],
          beats: [
            { caption: "他比桌子矮，够不着，急得支支吾吾。" },
            { sfx: "嗯！啊啊！" },
          ],
        },
      ],
    },
    {
      layout: "1-2",
      panels: [
        {
          scene: floor,
          shot: "wide",
          actors: [
            { who: "mom", at: 0.26, face: "confused", facing: "right" },
            { who: "dad", at: 0.76, pose: "think", face: "thinking", facing: "left" },
          ],
          props: [{ thing: nian("stand", { reach: true }), x: 0.5, size: 320 }],
          beats: [
            { caption: "爸爸妈妈一开始都猜不出来。" },
            { say: "mom", text: "宝宝，你要啥呀？" },
            { say: "dad", text: "要水？还是要小球？" },
          ],
        },
        {
          scene: floor,
          shot: "wide",
          actors: [],
          props: [{ thing: nian("stand", { reach: true }), x: 0.46, size: 450 }],
          beats: [
            { caption: "小念急得直摇头，小手一个劲儿往上够。" },
            { sfx: "嗯嗯！", at: [0.78, 0.35] },
          ],
        },
        {
          scene: { place: "plain", tint: "#dff1ff" },
          shot: "wide",
          actors: [],
          props: [{ thing: { kind: "glasses" }, x: 0.5, lift: 160, size: 520 }],
          beats: [
            { caption: "后来终于明白：他喜欢上了眼镜！" },
          ],
        },
      ],
    },
    {
      layout: "1-2-1",
      panels: [
        {
          scene: room,
          shot: "wide",
          actors: [],
          props: [onTable[1], { thing: nian("sit", { specs: true, giggle: true }), x: 0.34, size: 440, front: true }],
          beats: [
            { caption: "从那以后，小念总是要戴眼镜。" },
            { sfx: "嘿嘿！" },
          ],
        },
        {
          scene: { place: "plain", tint: "#fff0c2" },
          shot: "wide",
          actors: [],
          props: [{ thing: nian("sit", { specs: true, giggle: true }), x: 0.47, size: 1000 }],
          beats: [
            { caption: "大大的眼镜，挂在小小的脸上。" },
          ],
        },
        {
          scene: floor,
          shot: "close",
          actors: [{ who: "mom", at: 0.5, pose: "stand", face: "scared" }],
          beats: [
            { say: "mom", text: "哎呀，快摘下来！", kind: "shout" },
          ],
        },
        {
          scene: floor,
          shot: "wide",
          actors: [{ who: "mom", at: 0.62, pose: "crouch", face: "surprised", facing: "left" }],
          props: [{ thing: nian("sit", { specs: true }), x: 0.34, size: 440 }],
          beats: [
            { caption: "妈妈怕小念看坏了眼，总要拦着他。" },
            { say: "mom", text: "不行！近视镜会把眼睛看坏的。" },
          ],
        },
      ],
    },
    {
      layout: "2-1",
      panels: [
        {
          scene: floor,
          shot: "wide",
          actors: [{ who: "dad", at: 0.34, pose: "point", face: "laugh", facing: "right" }],
          props: [{ thing: nian("sit", { specs: true, giggle: true }), x: 0.62, size: 360 }],
          beats: [
            { caption: "爸爸倒看着直乐。" },
            { say: "dad", text: "哈哈，像个小小博士！" },
          ],
        },
        {
          scene: floor,
          shot: "close",
          actors: [{ who: "dad", at: 0.5, pose: "wave", face: "laugh" }],
          beats: [
            { say: "dad", text: "小博士，请多指教！" },
          ],
        },
        {
          scene: { place: "burst", tint: "#fff0c2" },
          shot: "wide",
          actors: [],
          props: [{ thing: nian("sit", { specs: true, hat: "grad", giggle: true }), x: 0.5, size: 520 }],
          beats: [
            { caption: "小小博士，驾到！" },
            { sfx: "哈哈哈！" },
          ],
        },
      ],
    },
  ],
};

export default story;
