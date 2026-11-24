import type { SceneSpec, Story } from "../../story/types.ts";

/**
 * 2026-11-10 的真事：爸爸一抱住小念，他就喊「救我，救我」；妈妈在就喊「妈妈，救我」。
 * 好像爸爸欺负他了，其实是在搬救兵，爸爸妈妈每次都笑得不行。
 */
const home: SceneSpec = { place: "living-room", time: "day" };

const story: Story = {
  id: "save-me",
  title: "救我，救我",
  blurb: "爸爸一抱住小念，他就喊「救我，救我」——特别会搬救兵！",
  when: { date: "2026-11-10", label: "搬救兵" },
  credits: { by: ["nian", "dad", "mom"] },
  cover: {
    scene: home,
    actors: [
      { who: "dad", at: 0.38, pose: "hug", face: "laugh", facing: "right" },
      { who: "nian", at: 0.54, pose: "stand", face: "laugh", facing: "left" },
      { who: "mom", at: 0.68, pose: "point", face: "laugh", facing: "left" },
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
            { who: "dad", at: 0.34, pose: "hug", face: "laugh", facing: "right" },
            { who: "nian", at: 0.52, pose: "stand", face: "laugh", facing: "left" },
          ],
          beats: [
            { caption: "2026年11月10日，最近小念特别会搬救兵。" },
            { say: "dad", text: "来，跟爸爸去那边。" },
          ],
        },
        {
          scene: home,
          shot: "close",
          focus: "nian",
          actors: [{ who: "nian", at: 0.5, pose: "stand", face: "laugh" }],
          beats: [
            { say: "nian", text: "救我，救我！", kind: "shout" },
          ],
        },
        {
          scene: home,
          shot: "medium",
          actors: [{ who: "dad", at: 0.5, pose: "hug", face: "laugh" }],
          beats: [
            { say: "dad", text: "我又没欺负你！" },
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
            { who: "nian", at: 0.36, pose: "stand", face: "laugh", facing: "right" },
            { who: "mom", at: 0.7, pose: "point", face: "laugh", facing: "left" },
          ],
          beats: [
            { say: "nian", text: "妈妈，救我，救我！", kind: "shout" },
          ],
        },
        {
          scene: home,
          shot: "close",
          focus: "dad",
          actors: [{ who: "dad", at: 0.5, pose: "stand", face: "laugh" }],
          beats: [
            { caption: "好像爸爸真欺负他了似的。" },
          ],
        },
        {
          scene: home,
          shot: "medium",
          actors: [{ who: "mom", at: 0.5, pose: "stand", face: "laugh" }],
          beats: [
            { say: "mom", text: "怎么啦？" },
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
            { who: "dad", at: 0.32, pose: "hug", face: "laugh", facing: "right" },
            { who: "nian", at: 0.5, pose: "stand", face: "laugh", facing: "left" },
          ],
          beats: [
            { caption: "爸爸抱走他的时候，也一样。" },
          ],
        },
        {
          scene: home,
          shot: "medium",
          actors: [{ who: "nian", at: 0.5, pose: "stand", face: "laugh" }],
          beats: [
            { say: "nian", text: "救我，救我！", kind: "shout" },
          ],
        },
        {
          scene: home,
          shot: "close",
          focus: "mom",
          actors: [{ who: "mom", at: 0.5, pose: "stand", face: "laugh" }],
          beats: [
            { say: "mom", text: "爸爸又怎么啦？" },
          ],
        },
        {
          scene: home,
          shot: "wide",
          actors: [
            { who: "dad", at: 0.28, pose: "hug", face: "laugh", facing: "right" },
            { who: "nian", at: 0.48, pose: "stand", face: "laugh", facing: "left" },
            { who: "mom", at: 0.72, pose: "point", face: "laugh", facing: "left" },
          ],
          beats: [
            { caption: "小念一次比一次喊得响。" },
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
            { who: "dad", at: 0.26, pose: "cheer", face: "laugh", facing: "right" },
            { who: "nian", at: 0.5, pose: "cheer", face: "laugh" },
            { who: "mom", at: 0.74, pose: "cheer", face: "laugh", facing: "left" },
          ],
          beats: [
            { caption: "爸爸妈妈每次都笑得不行。" },
          ],
        },
        {
          scene: home,
          shot: "medium",
          actors: [{ who: "dad", at: 0.5, pose: "stand", face: "laugh" }],
          beats: [
            { say: "dad", text: "这孩子，太会搬救兵了！" },
          ],
        },
        {
          scene: home,
          shot: "close",
          focus: "mom",
          actors: [{ who: "mom", at: 0.5, pose: "stand", face: "laugh" }],
          beats: [
            { say: "mom", text: "哈哈，爸爸冤枉呀！" },
          ],
        },
      ],
    },
  ],
};

export default story;
