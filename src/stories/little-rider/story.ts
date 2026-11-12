import type { Prop, SceneSpec, Story, Thing } from "../../story/types.ts";

/**
 * 2025-06-20 的真事：妈妈翻出自己小时候骑在摩托车上的照片，威风极了。
 * 小念看了也要骑车，骑上自己的大汽车用脚蹬着往前走，妈妈哈哈大笑。
 */
const room: SceneSpec = { place: "living-room", time: "day" };
const nian = (more: Partial<Thing> = {}): Thing => ({ kind: "baby", move: "sit", ...more });
/** 妈妈（pose: "hold"，面朝右，站在 at）手里拿着的老照片 */
const photoInHand = (at: number): Prop => ({ thing: { kind: "photo" }, x: at + 0.08, lift: 270, size: 160, front: true });
const riding = (x: number, size = 420, more: Partial<Thing> = {}): Prop => ({ thing: nian({ ride: true, giggle: true, ...more }), x, size });

const story: Story = {
  id: "little-rider",
  title: "小小骑手",
  blurb: "妈妈小时候骑摩托车的照片威风极了，小念看了，也骑上了自己的大汽车！",
  when: { date: "2025-06-20", label: "妈妈的老照片" },
  credits: { by: ["nian", "dad", "mom"] },
  cover: {
    scene: room,
    actors: [{ who: "mom", at: 0.36, pose: "hold", face: "laugh", facing: "right" }],
    props: [photoInHand(0.36), riding(0.64, 400)],
  },
  pages: [
    {
      layout: "1-2",
      panels: [
        {
          scene: room,
          shot: "wide",
          actors: [{ who: "mom", at: 0.3, pose: "hold", face: "happy", facing: "right" }],
          props: [photoInHand(0.3), { thing: { kind: "baby", move: "crawl" }, x: 0.66, size: 380 }],
          beats: [
            { caption: "2025年6月20日，妈妈翻出了自己小时候的照片。" },
            { say: "mom", text: "快看，这是妈妈小时候！" },
          ],
        },
        {
          scene: room,
          shot: "wide",
          actors: [],
          props: [{ thing: nian({ giggle: true }), x: 0.45, size: 450 }],
          beats: [
            { caption: "小念也要看看，妈妈小时候长什么样。" },
          ],
        },
        {
          scene: room,
          actors: [{ who: "mom", at: 0.5, pose: "wave", face: "happy" }],
          beats: [
            { say: "mom", text: "好好好，给你看！" },
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
          actors: [{ who: "mom", at: 0.38, pose: "crouch", face: "happy", facing: "right" }],
          props: [
            { thing: { kind: "photo" }, x: 0.47, lift: 150, size: 150, front: true },
            { thing: nian({ giggle: true }), x: 0.66, size: 340 },
          ],
          beats: [
            { caption: "妈妈蹲下来，给小念看照片。" },
          ],
        },
        {
          scene: { place: "plain", tint: "#f3e3c3" },
          shot: "wide",
          actors: [],
          props: [{ thing: { kind: "photo" }, x: 0.5, lift: 60, size: 640 }],
          beats: [
            { caption: "照片上，小小的妈妈骑在摩托车上，看起来十分威武！" },
          ],
        },
        {
          scene: room,
          shot: "wide",
          actors: [{ who: "mom", at: 0.3, pose: "hold", face: "proud", facing: "right" }],
          props: [photoInHand(0.3), { thing: nian({ giggle: true, flip: true }), x: 0.66, size: 400 }],
          beats: [
            { say: "mom", text: "妈妈小时候威不威风？" },
            { sfx: "哇！", at: [0.78, 0.3] },
          ],
        },
      ],
    },
    {
      layout: "1-1-1",
      panels: [
        {
          scene: room,
          shot: "wide",
          actors: [],
          props: [{ thing: nian({ giggle: true }), x: 0.45, size: 450 }],
          beats: [
            { caption: "小念看了，也要骑车！" },
          ],
        },
        {
          scene: room,
          shot: "wide",
          actors: [],
          props: [riding(0.45, 460)],
          beats: [
            { caption: "他骑上自己的大汽车，小脚一蹬一蹬往前走。" },
            { sfx: "蹬蹬蹬！", at: [0.72, 0.4] },
          ],
        },
        {
          scene: room,
          shot: "wide",
          actors: [{ who: "mom", at: 0.78, pose: "crouch", face: "surprised", facing: "left" }],
          props: [riding(0.38, 420)],
          beats: [
            { say: "mom", text: "哇，骑得真快！" },
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
          actors: [{ who: "mom", at: 0.24, pose: "hold", face: "laugh", facing: "right" }],
          props: [photoInHand(0.24), riding(0.62, 440)],
          beats: [
            { caption: "妈妈看着，哈哈大笑。" },
            { say: "mom", text: "哈哈哈，又一个小骑手！" },
          ],
        },
        {
          scene: room,
          shot: "close",
          actors: [{ who: "mom", at: 0.5, pose: "cheer", face: "laugh" }],
          beats: [
            { say: "mom", text: "跟妈妈小时候一样威风！" },
          ],
        },
        {
          scene: { place: "burst", tint: "#fff0c2" },
          shot: "wide",
          actors: [],
          props: [
            { thing: { kind: "photo" }, x: 0.45, lift: 460, size: 260 },
            riding(0.5, 380),
          ],
          beats: [
            { caption: "一大一小，两个威风的小骑手！" },
          ],
        },
      ],
    },
  ],
};

export default story;
