import type { Actor, SceneSpec, Story } from "../../story/types.ts";

/**
 * 2026-11-24 的真事：小念学了幼儿园老师教的「哼，生气！」——叉着腰、仰着头。
 * 不顺意就说生气；爸爸妈妈有理时也照样叉腰仰头学他，一家人笑成一片。
 */
const home: SceneSpec = { place: "living-room", time: "day" };
/** 叉腰仰头说「哼，生气！」 */
const pout = (who: Actor["who"], at: number, extra: Partial<Actor> = {}): Actor =>
  ({ who, at, pose: "pout", face: "serious", ...extra });

const story: Story = {
  id: "im-angry",
  title: "哼，生气！",
  blurb: "小念叉着腰仰头说「哼，生气！」，爸爸妈妈有理时也照样学他。",
  when: { date: "2026-11-24", label: "生气了" },
  credits: { by: ["nian", "dad", "mom"] },
  cover: {
    scene: home,
    actors: [
      pout("nian", 0.45),
      { who: "laoye", at: 0.68, pose: "sit", seat: "sofa", face: "laugh", facing: "left" },
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
            pout("nian", 0.42, { facing: "right" }),
            { who: "laoye", at: 0.74, pose: "sit", seat: "sofa", face: "laugh", facing: "left" },
          ],
          beats: [
            { caption: "2026年11月24日，小念最近总爱叉着腰、仰着头——" },
            { say: "nian", text: "哼，生气！", kind: "shout" },
          ],
        },
        {
          scene: home,
          shot: "close",
          focus: "nian",
          actors: [pout("nian", 0.5)],
          beats: [
            { caption: "姥爷说，这是幼儿园老师教的。" },
          ],
        },
        {
          scene: home,
          shot: "medium",
          actors: [{ who: "laoye", at: 0.5, pose: "sit", seat: "sofa", face: "laugh" }],
          beats: [
            { say: "laoye", text: "哈哈哈，老师教的！" },
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
            { who: "mom", at: 0.24, pose: "stand", face: "happy", facing: "right" },
            pout("nian", 0.58, { facing: "left" }),
          ],
          beats: [
            { caption: "现在有点不顺他意，他就说生气了。" },
            { say: "nian", text: "哼，生气！" },
          ],
        },
        {
          scene: home,
          shot: "close",
          focus: "dad",
          actors: [{ who: "dad", at: 0.5, pose: "stand", face: "laugh" }],
          beats: [
            { caption: "不是之前跟你闹的那种，是会「说」生气了。" },
          ],
        },
        {
          scene: home,
          shot: "medium",
          actors: [{ who: "mom", at: 0.5, pose: "stand", face: "laugh" }],
          beats: [
            { say: "mom", text: "这孩子，真有意思！" },
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
            pout("nian", 0.34, { facing: "right" }),
            pout("dad", 0.66, { facing: "left" }),
          ],
          beats: [
            { caption: "爸爸妈妈要是觉得自己有理——" },
          ],
        },
        {
          scene: home,
          shot: "close",
          focus: "dad",
          actors: [pout("dad", 0.5)],
          beats: [
            { say: "dad", text: "哼，生气！" },
          ],
        },
        {
          scene: home,
          shot: "close",
          focus: "mom",
          actors: [pout("mom", 0.5)],
          beats: [
            { say: "mom", text: "哼，生气！" },
          ],
        },
        {
          scene: home,
          shot: "wide",
          actors: [
            pout("dad", 0.24, { facing: "right" }),
            { who: "nian", at: 0.5, pose: "stand", face: "surprised" },
            pout("mom", 0.76, { facing: "left" }),
          ],
          beats: [
            { caption: "也照样叉着腰、仰着头，对着小念说。" },
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
            { caption: "小念愣了一下，一家人笑得直不起腰。" },
          ],
        },
        {
          scene: home,
          shot: "medium",
          actors: [pout("dad", 0.5, { face: "laugh" })],
          beats: [
            { say: "dad", text: "这回轮到我们生气啦！" },
          ],
        },
        {
          scene: home,
          shot: "close",
          focus: "nian",
          actors: [{ who: "nian", at: 0.5, pose: "cheer", face: "laugh" }],
          beats: [
            { say: "nian", text: "哈哈哈！" },
          ],
        },
      ],
    },
  ],
};

export default story;
