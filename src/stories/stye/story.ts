import type { Prop, SceneSpec, Story, Thing } from "../../story/types.ts";

/**
 * 2025-06-09 的真事：小念十个月，眼睛有点肿，爸爸妈妈以为是蚊子咬；
 * 一位阿姨说是麦粒肿，爸爸头一回听说。去医院确认后点了眼药，几天就好了。
 * 这会儿小念还是宝宝，不会说话，用 sfx 和旁白表达。
 */
const home: SceneSpec = { place: "living-room", time: "day" };
const clinic: SceneSpec = { place: "hospital", sign: "眼科", time: "day" };
/** 坐着的小念：十个月，胎毛还在 */
const sitting = (more: Partial<Thing> = {}): Thing => ({ kind: "baby", move: "sit", hair: "fuzz", ...more });
/** 被妈妈抱着的小念 */
const inArms = (at: number, more: Partial<Thing> = {}): Prop =>
  ({ thing: sitting({ flip: true, ...more }), x: at + 110 / 1400, lift: 250, size: 380, front: true });
/** 眼药盒 */
const eyeDrop: Prop = { thing: { kind: "box", label: "眼药" }, x: 0.56, lift: 330, size: 130, front: true };

const story: Story = {
  id: "stye",
  title: "眼睛肿了",
  blurb: "小念眼睛肿了好几天，幸亏遇见一位阿姨说出「麦粒肿」。",
  when: { date: "2025-06-09", label: "眼肿了" },
  credits: { by: ["nian", "dad", "mom"] },
  cover: {
    scene: home,
    actors: [
      { who: "mom", at: 0.4, pose: "hug", face: "sad", facing: "right" },
      { who: "dad", at: 0.72, pose: "hold", face: "confused", facing: "left", hold: "💊" },
    ],
    props: [inArms(0.4, { sick: true })],
  },
  pages: [
    {
      layout: "1-2",
      panels: [
        {
          scene: home,
          shot: "wide",
          actors: [
            { who: "mom", at: 0.36, pose: "hug", face: "sad", facing: "right" },
            { who: "dad", at: 0.76, pose: "point", face: "confused", facing: "left" },
          ],
          props: [inArms(0.36, { sick: true })],
          beats: [
            { caption: "2025年6月9日，小念十个月，眼睛有点肿。" },
            { say: "mom", text: "咦，眼睛怎么肿了？" },
          ],
        },
        {
          scene: { place: "plain", tint: "#fff0f4" },
          shot: "wide",
          actors: [],
          props: [{ thing: sitting({ sick: true }), x: 0.47, size: 620 }],
          beats: [
            { caption: "他老是揉眼睛，又说不出来。" },
            { sfx: "嗯！嗯！", at: [0.8, 0.3] },
          ],
        },
        {
          scene: home,
          shot: "medium",
          actors: [
            { who: "dad", at: 0.34, pose: "think", face: "confused", facing: "right" },
            { who: "mom", at: 0.66, pose: "think", face: "thinking", facing: "left" },
          ],
          beats: [
            { say: "dad", text: "是不是蚊子咬的？" },
            { say: "mom", text: "看着像叮了一个包。" },
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
            { who: "mom", at: 0.24, pose: "hug", face: "sad", facing: "right" },
            { who: "ayi", at: 0.74, pose: "point", face: "serious", facing: "left" },
          ],
          props: [inArms(0.24, { sick: true })],
          beats: [
            { caption: "过了几天，眼睛还是肿着。" },
            { say: "ayi", text: "哎呀，这像是麦粒肿。" },
          ],
        },
        {
          scene: home,
          shot: "close",
          focus: "dad",
          actors: [{ who: "dad", at: 0.5, pose: "think", face: "confused" }],
          beats: [
            { say: "dad", text: "麦粒肿？那是什么？" },
          ],
        },
        {
          scene: home,
          shot: "medium",
          actors: [{ who: "mom", at: 0.5, pose: "stand", face: "surprised" }],
          beats: [
            { say: "mom", text: "听着不像蚊子咬呀。" },
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
            { who: "dad", at: 0.32, pose: "point", face: "serious", facing: "right" },
            { who: "mom", at: 0.68, pose: "stand", face: "serious", facing: "left" },
          ],
          beats: [
            { caption: "爸爸妈妈一商量，决定带小念去医院。" },
          ],
        },
        {
          scene: clinic,
          shot: "wide",
          actors: [
            { who: "mom", at: 0.26, pose: "hug", face: "neutral", facing: "right" },
            { who: "ayi", at: 0.76, pose: "point", face: "serious", facing: "left", outfit: "doctor" },
          ],
          props: [inArms(0.26, { sick: true })],
          beats: [
            { caption: "医生阿姨仔细看了看小念的眼睛。" },
          ],
        },
        {
          scene: clinic,
          shot: "close",
          focus: "ayi",
          actors: [{ who: "ayi", at: 0.5, pose: "point", face: "serious", outfit: "doctor" }],
          beats: [
            { say: "ayi", text: "是麦粒肿，可能是不卫生引起的。" },
          ],
        },
        {
          scene: clinic,
          shot: "medium",
          actors: [
            { who: "dad", at: 0.32, pose: "stand", face: "surprised", facing: "right" },
            { who: "mom", at: 0.68, pose: "stand", face: "thinking", facing: "left" },
          ],
          beats: [
            { caption: "爸爸这才听明白。" },
          ],
        },
      ],
    },
    {
      layout: "1-1-1",
      panels: [
        {
          scene: clinic,
          shot: "close",
          focus: "ayi",
          actors: [{ who: "ayi", at: 0.38, pose: "hold", face: "serious", outfit: "doctor" }],
          props: [eyeDrop],
          beats: [
            { say: "ayi", text: "先点眼药，观察几天。" },
          ],
        },
        {
          scene: clinic,
          shot: "medium",
          actors: [{ who: "dad", at: 0.5, pose: "stand", face: "serious" }],
          beats: [
            { say: "dad", text: "要是严重了再去？" },
          ],
        },
        {
          scene: clinic,
          shot: "medium",
          actors: [{ who: "ayi", at: 0.5, pose: "stand", face: "happy", outfit: "doctor" }],
          beats: [
            { say: "ayi", text: "对，先别着急。" },
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
          actors: [{ who: "mom", at: 0.22, pose: "crouch", face: "happy", facing: "right" }],
          props: [{ thing: sitting({ giggle: true, hair: "fuzz" }), x: 0.5, size: 440 }],
          beats: [
            { caption: "小念抵抗力强，过了几天，眼睛真的好了。" },
          ],
        },
        {
          scene: home,
          shot: "medium",
          actors: [{ who: "dad", at: 0.5, pose: "stand", face: "laugh" }],
          beats: [
            { say: "dad", text: "唉，爸爸真是不懂啊！" },
          ],
        },
        {
          scene: home,
          shot: "close",
          focus: "mom",
          actors: [{ who: "mom", at: 0.5, pose: "stand", face: "laugh" }],
          beats: [
            { say: "mom", text: "幸亏遇见那个阿姨！" },
          ],
        },
      ],
    },
  ],
};

export default story;
