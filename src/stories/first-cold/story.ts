import type { Prop, SceneSpec, Story, Thing } from "../../story/types.ts";

/**
 * 2025-02-06 的真事：小念出生后第一次生病，发烧、咳嗽。正赶上过年，附近医院放假，
 * 爸爸跑了好几家药店才买到退烧贴；第二天又一个人去儿童医院问大夫，开了咳嗽药，小念慢慢好了。
 */
const night: SceneSpec = { place: "bedroom", time: "night" };
const day: SceneSpec = { place: "bedroom", time: "day" };
const street: SceneSpec = { place: "street", time: "night" };
const clinic: SceneSpec = { place: "hospital", sign: "儿科" };
const sitting = (more: Partial<Thing> = {}): Thing => ({ kind: "baby", move: "sit", ...more });
/** 被大人抱着的小念：大人用 hug 姿势、面朝右站在 at，小念脸朝着大人 */
const inArms = (at: number, more: Partial<Thing> = {}): Prop =>
  ({ thing: sitting({ flip: true, ...more }), x: at + 110 / 1400, lift: 250, size: 380, front: true });
const box = (label: string, x: number, lift: number): Prop => ({ thing: { kind: "box", label }, x, lift, size: 120 });

const story: Story = {
  id: "first-cold",
  title: "小念第一次生病",
  blurb: "小念发烧又咳嗽，偏偏赶上过年，爸爸跑了一家又一家……",
  when: { date: "2025-02-06", label: "第一次生病" },
  credits: { by: ["nian", "dad", "mom"] },
  cover: {
    scene: night,
    actors: [
      { who: "mom", at: 0.42, pose: "hug", face: "sad", facing: "right" },
      { who: "dad", at: 0.76, pose: "hold", face: "scared", facing: "left", hold: "💊" },
    ],
    props: [inArms(0.42, { sick: true, patch: true })],
  },
  pages: [
    {
      layout: "1-2",
      panels: [
        {
          scene: night,
          shot: "wide",
          actors: [
            { who: "mom", at: 0.36, pose: "hug", face: "sad", facing: "right" },
            { who: "dad", at: 0.8, pose: "shrug", face: "scared", facing: "left" },
          ],
          props: [inArms(0.36, { sick: true })],
          beats: [
            { caption: "2025年2月6日，小念第一次生病了。" },
            { say: "mom", text: "有点发烧，还一直咳嗽……" },
            { say: "dad", text: "这可怎么办呀？" },
          ],
        },
        {
          scene: night,
          shot: "wide",
          actors: [],
          props: [{ thing: sitting({ sick: true }), x: 0.47, size: 440 }],
          beats: [
            { caption: "小脸烧得红红的，咳得睡不好。" },
            { sfx: "咳咳咳！" },
          ],
        },
        {
          scene: night,
          actors: [{ who: "dad", at: 0.5, pose: "hold", face: "confused", hold: "📱" }],
          beats: [
            { caption: "正赶上过年，附近的医院都放假了。" },
            { say: "dad", text: "我先去药店买点药！" },
          ],
        },
      ],
    },
    {
      layout: "1-1",
      panels: [
        {
          scene: street,
          shot: "wide",
          actors: [{ who: "dad", at: 0.86, pose: "run", face: "scared", facing: "left" }],
          beats: [
            { caption: "可街上的店也都关着门，爸爸跑了一家又一家……" },
            { say: "dad", text: "怎么都放假了？" },
          ],
        },
        {
          scene: { place: "pharmacy", table: { from: 0.5, to: 0.92 } },
          shot: "wide",
          actors: [
            { who: "dad", at: 0.3, pose: "stand", face: "happy", facing: "right" },
            { who: "ayi", at: 0.74, pose: "point", face: "neutral", facing: "left", outfit: "doctor" },
          ],
          props: [box("退烧贴", 0.6, 205)],
          beats: [
            { caption: "终于，找到一家还开门的药店！" },
            { say: "ayi", text: "孩子还小，先贴退烧贴，物理降温。" },
            { say: "dad", text: "太好了，谢谢您！" },
          ],
        },
      ],
    },
    {
      layout: "1-2",
      panels: [
        {
          scene: night,
          shot: "wide",
          actors: [
            { who: "mom", at: 0.36, pose: "hug", face: "neutral", facing: "right" },
            { who: "dad", at: 0.8, pose: "stand", face: "happy", facing: "left" },
          ],
          props: [inArms(0.36, { sick: true, patch: true })],
          beats: [
            { caption: "爸爸赶回家，给小念贴上了退烧贴。" },
            { say: "mom", text: "凉凉的，舒服点了吧？" },
          ],
        },
        {
          scene: night,
          shot: "wide",
          actors: [],
          props: [{ thing: sitting({ sick: true, patch: true }), x: 0.47, size: 440 }],
          beats: [
            { caption: "烧慢慢退了，可咳嗽还是没好。" },
            { sfx: "咳咳！" },
          ],
        },
        {
          scene: clinic,
          shot: "wide",
          actors: [{ who: "dad", at: 0.72, pose: "walk", face: "neutral", facing: "right" }],
          beats: [
            { caption: "第二天，爸爸一个人去了儿童医院。" },
          ],
        },
      ],
    },
    {
      layout: "2-1",
      panels: [
        {
          scene: clinic,
          shot: "wide",
          actors: [
            { who: "dad", at: 0.5, pose: "shrug", face: "sad", facing: "right" },
            { who: "shushu", at: 0.76, pose: "hold", face: "neutral", facing: "left", outfit: "doctor", hold: "🩺" },
          ],
          beats: [
            { say: "dad", text: "孩子咳嗽好几天了，怎么办？" },
            { say: "shushu", text: "我先给开点咳嗽药。" },
          ],
        },
        {
          scene: clinic,
          actors: [{ who: "shushu", at: 0.5, pose: "point", face: "neutral", outfit: "doctor" }],
          beats: [
            { say: "shushu", text: "要是烧得厉害，一定带孩子来。" },
          ],
        },
        {
          scene: day,
          shot: "wide",
          actors: [
            { who: "mom", at: 0.3, pose: "hug", face: "neutral", facing: "right" },
            { who: "dad", at: 0.62, pose: "hold", face: "happy", facing: "left", hold: "🥄" },
          ],
          props: [inArms(0.3, { sick: true }), box("咳嗽药", 0.86, 230)],
          beats: [
            { caption: "回到家，按大夫说的给小念喂了药。" },
            { say: "dad", text: "小念乖，张嘴——" },
          ],
        },
      ],
    },
    {
      layout: "1-1",
      panels: [
        {
          scene: day,
          shot: "wide",
          actors: [],
          props: [{ thing: sitting({ giggle: true }), x: 0.47, size: 440 }],
          beats: [
            { caption: "慢慢地，咳嗽少了，小念又笑了。" },
          ],
        },
        {
          scene: day,
          shot: "wide",
          actors: [
            { who: "dad", at: 0.2, pose: "stand", face: "shy", facing: "right" },
            { who: "mom", at: 0.46, pose: "hug", face: "happy", facing: "right" },
          ],
          props: [inArms(0.46)],
          beats: [
            { caption: "小念第一次生病，真让爸爸妈妈手足无措呀！" },
            { say: "dad", text: "可把我急坏了……" },
            { say: "mom", text: "下次咱们就有经验了。" },
          ],
        },
      ],
    },
  ],
};

export default story;
