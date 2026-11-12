import type { Prop, SceneSpec, Story, Thing } from "../../story/types.ts";

/**
 * 2025-05-30 起的真事：叔叔阿姨送来一个小餐椅，小念从此上餐桌吃饭。
 * 后来餐椅被小念一点点「拆」了：保护带扯断、垫子扯烂（姥爷缝好又烂了）、钉子震出来、爸爸用绳子绑上。
 * 好好的餐椅快不能用了，小念真是个破坏王。
 */
const room: SceneSpec = { place: "dining-room", time: "day" };
const atTable: SceneSpec = { ...room, table: { from: 0.56, to: 0.95 } };
const baby = (more: Partial<Thing> = {}): Thing => ({ kind: "baby", move: "sit", hair: "fuzz", ...more });
const chair = (x: number, more: Partial<Thing> = {}, size = 400): Prop => ({ thing: { kind: "highchair", ...more }, x, size });
const wrecked: Partial<Thing> = { strap: "torn", cushion: "gone", nails: true, rope: true };

const story: Story = {
  id: "broken-chair",
  title: "小念是个破坏王",
  blurb: "叔叔阿姨送来的小餐椅，被小念扯断带子、扯烂垫子、震松钉子……",
  when: { date: "2025-05-30", label: "小餐椅" },
  credits: { by: ["nian", "dad", "mom"] },
  cover: {
    scene: room,
    actors: [],
    props: [chair(0.5, { ...wrecked, rider: baby({ giggle: true }) }, 520)],
  },
  pages: [
    {
      layout: "1-2",
      panels: [
        {
          scene: room,
          shot: "wide",
          actors: [
            { who: "mom", at: 0.18, pose: "hug", face: "happy", facing: "right" },
            { who: "ayi", at: 0.72, pose: "point", face: "happy", facing: "left" },
            { who: "shushu", at: 0.86, pose: "stand", face: "happy", facing: "left" },
          ],
          props: [
            { thing: baby({ giggle: true }), x: 0.18 + 110 / 1400, lift: 250, size: 380, front: true },
            chair(0.5),
          ],
          beats: [
            { caption: "2025年5月30日，叔叔阿姨送来一个小餐椅。" },
            { say: "ayi", text: "给小念的，试试看！" },
            { say: "mom", text: "正需要呢，太谢谢啦！" },
          ],
        },
        {
          scene: atTable,
          shot: "wide",
          actors: [],
          props: [chair(0.42, { rider: baby({ giggle: true }) }), { emoji: "🍚", x: 0.62, lift: 205, size: 80 }, { emoji: "🥣", x: 0.72, lift: 205, size: 80 }],
          beats: [
            { caption: "从此，小念也上餐桌吃饭啦。" },
          ],
        },
        {
          scene: room,
          actors: [{ who: "mom", at: 0.5, pose: "cheer", face: "laugh" }],
          beats: [
            { caption: "坐上小餐椅，吃饭方便多了。" },
            { say: "mom", text: "真方便！" },
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
          actors: [],
          props: [chair(0.5, { strap: "torn", rider: baby({ giggle: true }) })],
          beats: [
            { caption: "后面的事就有意思了：先是保护带被扯断了，" },
            { sfx: "嘣！" },
          ],
        },
        {
          scene: room,
          shot: "wide",
          actors: [],
          props: [chair(0.4, { strap: "torn", cushion: "gone" }, 340), { thing: { kind: "cushion", cushion: "torn" }, x: 0.62, size: 200 }],
          beats: [
            { caption: "接着，垫子被扯烂扔了。" },
            { sfx: "嘶啦！" },
          ],
        },
        {
          scene: room,
          shot: "wide",
          actors: [{ who: "laoye", at: 0.5, pose: "sit", face: "happy", facing: "right" }],
          props: [{ thing: { kind: "cushion", cushion: "patched" }, x: 0.53, lift: 200, size: 200, front: true }],
          beats: [
            { caption: "姥爷给缝补上了，" },
            { say: "laoye", text: "缝好喽，可别再扯啦。" },
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
          actors: [],
          props: [chair(0.5, { strap: "torn", cushion: "torn", rider: baby({ giggle: true }) })],
          beats: [
            { caption: "结果，还是烂了。" },
            { sfx: "嘶啦！" },
          ],
        },
        {
          scene: room,
          shot: "wide",
          actors: [],
          props: [chair(0.5, { strap: "torn", cushion: "gone", nails: true, rider: baby({ giggle: true }) })],
          beats: [
            { caption: "最后，连钉子都给震起来了！" },
            { sfx: "咯噔咯噔", at: [0.6, 0.26] },
          ],
        },
        {
          scene: room,
          shot: "wide",
          actors: [{ who: "dad", at: 0.3, pose: "crouch", face: "happy", facing: "right" }],
          props: [chair(0.62, { strap: "torn", cushion: "gone", nails: true, rope: true })],
          beats: [
            { caption: "爸爸只好用绳子绑结实。" },
            { say: "dad", text: "再撑一阵吧！" },
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
          actors: [
            { who: "dad", at: 0.14, pose: "shrug", face: "confused", facing: "right" },
            { who: "mom", at: 0.86, pose: "shrug", face: "laugh", facing: "left" },
          ],
          props: [chair(0.5, { ...wrecked, rider: baby({ giggle: true }) })],
          beats: [
            { caption: "现在，好好的餐椅都快不能用了。" },
            { say: "mom", text: "这椅子可遭罪了！" },
            { say: "dad", text: "拆都拆不下来了。" },
          ],
        },
        {
          scene: { place: "burst", tint: "#ffd9c2" },
          shot: "wide",
          actors: [],
          props: [chair(0.5, { ...wrecked, rider: baby({ giggle: true }) }, 460)],
          beats: [
            { caption: "想想，小念真是一个破坏王！" },
            { sfx: "哈哈哈！" },
          ],
        },
      ],
    },
  ],
};

export default story;
