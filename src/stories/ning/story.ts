import type { SceneSpec, Story } from "../../story/types.ts";

/**
 * 2026-08-20 的真事：小念脾气又涨了，不让他干什么就「不要、不要」，其实就是非要自己干；
 * 问他这样好不好，他总反驳。爸爸觉得是情绪的能力长了，懂得宣泄、说得清了；
 * 妈妈说要和小念商量着来，他都是个小大人了。爸爸想到，用姥爷的话就是「拧」！
 */
const home: SceneSpec = { place: "living-room", time: "day" };

const story: Story = {
  id: "ning",
  title: "拧！",
  blurb: "不让干的偏要干，问他好不好，他说「不要」。用姥爷的话说，这叫「拧」！",
  when: { date: "2026-08-20", label: "拧" },
  credits: { by: ["nian", "dad", "mom"] },
  cover: {
    scene: home,
    actors: [
      { who: "dad", at: 0.24, pose: "crouch", face: "confused", facing: "right" },
      { who: "nian", at: 0.5, pose: "jump", face: "angry", facing: "left" },
      { who: "mom", at: 0.76, pose: "crouch", face: "happy", facing: "left" },
    ],
  },
  pages: [
    {
      layout: "1-2",
      panels: [
        {
          scene: home,
          shot: "wide",
          actors: [
            { who: "nian", at: 0.34, pose: "jump", face: "angry", facing: "right" },
            { who: "dad", at: 0.68, pose: "crouch", face: "neutral", facing: "left" },
          ],
          beats: [
            { caption: "2026年8月20日，小念最近脾气又涨了。" },
            { say: "dad", text: "这个不可以哦。" },
            { say: "nian", text: "不要、不要！", kind: "shout" },
          ],
        },
        {
          scene: home,
          shot: "close",
          actors: [{ who: "nian", at: 0.5, pose: "stand", face: "angry" }],
          beats: [
            { caption: "不让他干什么，就「不要、不要」。" },
          ],
        },
        {
          scene: home,
          shot: "wide",
          actors: [{ who: "nian", at: 0.45, pose: "walk", face: "serious", facing: "right" }],
          beats: [
            { caption: "其实就是要自己干，非干不可。" },
            { sfx: "哼！" },
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
            { who: "nian", at: 0.32, pose: "stand", face: "serious", facing: "right" },
            { who: "mom", at: 0.68, pose: "crouch", face: "happy", facing: "left" },
          ],
          beats: [
            { say: "mom", text: "这样做好不好？" },
          ],
        },
        {
          scene: home,
          shot: "close",
          actors: [{ who: "nian", at: 0.5, pose: "stand", face: "angry" }],
          beats: [
            { say: "nian", text: "不好！", kind: "shout" },
          ],
        },
        {
          scene: home,
          shot: "wide",
          actors: [
            { who: "dad", at: 0.25, pose: "shrug", face: "confused", facing: "right" },
            { who: "nian", at: 0.5, pose: "stand", face: "serious", facing: "right" },
            { who: "mom", at: 0.75, pose: "shrug", face: "surprised", facing: "left" },
          ],
          beats: [
            { caption: "问他这样做好不好，他总是给你反驳。" },
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
            { who: "dad", at: 0.3, pose: "think", face: "thinking", facing: "right" },
            { who: "mom", at: 0.7, pose: "stand", face: "neutral", facing: "left" },
          ],
          beats: [
            { caption: "爸爸琢磨了一下——" },
            { say: "dad", text: "这是他情绪的能力长了！" },
          ],
        },
        {
          scene: home,
          shot: "close",
          actors: [{ who: "dad", at: 0.5, pose: "stand", face: "happy" }],
          beats: [
            { say: "dad", text: "懂得宣泄，说得清清楚楚。" },
          ],
        },
        {
          scene: home,
          shot: "close",
          actors: [{ who: "mom", at: 0.5, pose: "stand", face: "happy" }],
          beats: [
            { say: "mom", text: "那要和小念商量着来。" },
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
            { who: "nian", at: 0.34, pose: "stand", face: "proud", facing: "right" },
            { who: "mom", at: 0.66, pose: "crouch", face: "laugh", facing: "left" },
          ],
          beats: [
            { caption: "妈妈觉得，他都是一个小大人了。" },
          ],
        },
        {
          scene: home,
          shot: "close",
          actors: [{ who: "dad", at: 0.5, pose: "stand", face: "thinking" }],
          beats: [
            { say: "dad", text: "用姥爷的话说，就是——" },
          ],
        },
        {
          scene: home,
          shot: "wide",
          actors: [
            { who: "dad", at: 0.22, pose: "point", face: "laugh", facing: "right" },
            { who: "nian", at: 0.5, pose: "stand", face: "angry", facing: "right" },
            { who: "laoye", at: 0.78, pose: "stand", face: "laugh", facing: "left" },
          ],
          beats: [
            { say: "dad", text: "拧！", kind: "shout" },
            { sfx: "哈哈哈！" },
          ],
        },
      ],
    },
  ],
};

export default story;
