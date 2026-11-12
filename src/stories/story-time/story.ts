import type { Actor, SceneSpec, Story } from "../../story/types.ts";

/**
 * 2026-05-19 的真事：小念特别爱听故事，每晚睡觉都要妈妈讲。有一次让爸爸讲，小念说「闪电麦坤」，
 * 爸爸一脸茫然；妈妈上完厕所回来说，那是一本故事书的主人公。小念记住了书里的人物，每次讲故事都去找这本书。
 * 爸爸分析和他喜欢汽车有关系：小念是个汽车小小爱好者。
 * 闪电麦坤是别人家的动画角色，只写名字、不画他；书上只画个小赛车表情。
 */
const room: SceneSpec = { place: "bedroom", time: "night" };
const nian = (more: Partial<Actor> = {}): Actor => ({ who: "nian", at: 0.76, pose: "sit", perch: true, lift: 120, face: "happy", facing: "left", ...more });
const reader = (who: "mom" | "dad", more: Partial<Actor> = {}): Actor => ({ who, at: 0.42, pose: "sit", face: "happy", facing: "right", ...more });
const close = (tint: string): SceneSpec => ({ place: "plain", tint });

const story: Story = {
  id: "story-time",
  title: "闪电麦坤是谁？",
  blurb: "小念要听「闪电麦坤」，爸爸一脸茫然——原来是故事书里的主人公！",
  when: { date: "2026-05-19", label: "听故事" },
  credits: { by: ["nian", "dad", "mom"] },
  cover: {
    scene: room,
    actors: [
      { who: "mom", at: 0.16, pose: "walk", face: "laugh", facing: "right" },
      reader("dad", { pose: "hold", hold: "📕", face: "confused" }),
      nian({ face: "laugh" }),
    ],
  },
  pages: [
    {
      layout: "1-2",
      panels: [
        {
          scene: room,
          shot: "wide",
          actors: [reader("mom", { pose: "hold", hold: "📕" }), nian()],
          beats: [
            { caption: "2026年5月19日，小念最近特别爱听故事。" },
            { say: "mom", text: "好，妈妈给你讲！" },
          ],
        },
        {
          scene: room,
          shot: "close",
          actors: [{ who: "nian", at: 0.5, pose: "stand", face: "happy" }],
          beats: [
            { caption: "每晚睡觉，都要妈妈讲故事。" },
          ],
        },
        {
          scene: room,
          shot: "wide",
          actors: [
            { who: "dad", at: 0.3, pose: "walk", face: "happy", facing: "right" },
            { who: "mom", at: 0.66, pose: "walk", face: "neutral", facing: "left" },
          ],
          beats: [
            { caption: "有一次，让爸爸来讲。" },
            { say: "mom", text: "我去趟厕所，爸爸讲！" },
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
          actors: [reader("dad", { face: "neutral" }), nian({ pose: "sit", face: "happy" })],
          beats: [
            { say: "nian", text: "闪电麦坤！", kind: "shout" },
          ],
        },
        {
          scene: room,
          shot: "close",
          actors: [{ who: "dad", at: 0.5, pose: "stand", face: "confused" }],
          beats: [
            { say: "dad", text: "闪电……啥？" },
          ],
        },
        {
          scene: room,
          shot: "wide",
          actors: [reader("dad", { pose: "shrug", face: "confused" }), nian({ face: "laugh" })],
          beats: [
            { caption: "爸爸都不知道这是啥呀，一脸茫然。" },
            { say: "nian", text: "闪电麦坤！" },
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
          actors: [
            { who: "mom", at: 0.18, pose: "walk", face: "laugh", facing: "right" },
            reader("dad", { face: "surprised" }),
            nian({ face: "happy" }),
          ],
          beats: [
            { caption: "幸好妈妈刚上完厕所回来。" },
            { say: "mom", text: "人家说的是故事书里的主人公，" },
            { say: "mom", text: "叫闪电麦坤！" },
          ],
        },
        {
          scene: room,
          shot: "close",
          actors: [{ who: "dad", at: 0.5, pose: "stand", face: "surprised" }],
          beats: [
            { say: "dad", text: "原来是这样！" },
          ],
        },
        {
          scene: close("#ffe9c2"),
          shot: "wide",
          actors: [],
          props: [
            { emoji: "📕", x: 0.45, lift: 120, size: 420 },
            { emoji: "🏎️", x: 0.6, lift: 60, size: 260, front: true },
          ],
          beats: [
            { caption: "原来小念都记住故事书里的人物了！" },
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
          actors: [{ who: "nian", at: 0.4, pose: "hold", hold: "📕", face: "proud", facing: "right" }],
          props: [{ emoji: "📚", x: 0.6, size: 120, front: true }],
          beats: [
            { caption: "小念特别爱听这个故事，每次讲故事，就开始找这本书。" },
            { say: "nian", text: "这本！" },
          ],
        },
        {
          scene: room,
          shot: "close",
          actors: [{ who: "dad", at: 0.5, pose: "think", face: "thinking" }],
          beats: [
            { say: "dad", text: "应该和他喜欢汽车有关系。" },
          ],
        },
        {
          scene: room,
          shot: "medium",
          actors: [{ who: "nian", at: 0.5, pose: "hold", hold: "🚗", face: "laugh" }],
          beats: [
            { sfx: "嘀嘀！" },
          ],
        },
        {
          scene: room,
          shot: "wide",
          actors: [
            { who: "dad", at: 0.2, pose: "stand", face: "laugh", facing: "right" },
            { who: "nian", at: 0.45, pose: "hold", hold: "🏎️", face: "proud", facing: "right" },
            { who: "mom", at: 0.66, pose: "stand", face: "laugh", facing: "left" },
          ],
          beats: [
            { caption: "小念，是个汽车小小爱好者！" },
          ],
        },
      ],
    },
  ],
};

export default story;
