import type { Actor, SceneSpec, Story } from "../../story/types.ts";

/**
 * 2026-11-27 的真事：晚上地上玩完玩具，小念一个箭步窜上床，妈妈追上去，
 * 两人滚到床中央，妈妈一条腿压在小念肚子上。小念说「妈妈压扁！」笑翻全家。
 */
const night: SceneSpec = { place: "bedroom", time: "night" };
/** 躺在床上：床垫顶面在 G-230，把脚抬到床垫高度 */
const lying = (who: Actor["who"], at: number, extra: Partial<Actor> = {}): Actor =>
  ({ who, at, pose: "recline", lift: 230, ...extra });

const story: Story = {
  id: "mom-squash",
  title: "妈妈压扁",
  blurb: "妈妈一条腿压在小念肚子上，小念说「妈妈压扁！」笑翻了全家。",
  when: { date: "2026-11-27", label: "压扁了" },
  credits: { by: ["nian", "dad", "mom"] },
  cover: {
    scene: night,
    actors: [lying("nian", 0.5, { face: "laugh", facing: "left" })],
  },
  pages: [
    {
      layout: "1-2",
      panels: [
        {
          scene: night,
          shot: "wide",
          actors: [
            { who: "mom", at: 0.3, pose: "crouch", face: "laugh", facing: "right" },
            { who: "nian", at: 0.52, pose: "crouch", face: "laugh", facing: "left" },
          ],
          props: [
            { emoji: "🚗", x: 0.4, size: 100 },
            { emoji: "🧸", x: 0.58, size: 100 },
          ],
          beats: [
            { caption: "2026年11月27日晚上，妈妈和小念在地上玩玩具。" },
            { say: "mom", text: "玩得真开心呀！" },
          ],
        },
        {
          scene: night,
          shot: "medium",
          actors: [
            { who: "mom", at: 0.3, pose: "point", face: "happy", facing: "right" },
            { who: "nian", at: 0.7, pose: "stand", face: "happy", facing: "left" },
          ],
          beats: [
            { say: "mom", text: "好啦，该睡觉啦！" },
          ],
        },
        {
          scene: night,
          shot: "wide",
          actors: [
            { who: "nian", at: 0.66, pose: "jump", lift: 0.3, face: "laugh", facing: "right" },
            { who: "mom", at: 0.36, pose: "walk", face: "happy", facing: "right" },
          ],
          beats: [
            { caption: "小念一个箭步就上了床！" },
            { sfx: "嗖——" },
          ],
        },
      ],
    },
    {
      layout: "2-1",
      panels: [
        {
          scene: night,
          shot: "wide",
          actors: [
            lying("mom", 0.66, { face: "laugh", facing: "left" }),
            lying("nian", 0.84, { face: "laugh", facing: "left" }),
          ],
          beats: [
            { caption: "妈妈追上床，两人翻滚着到了床中央。" },
          ],
        },
        {
          scene: night,
          shot: "medium",
          actors: [lying("nian", 0.5, { face: "serious", facing: "right" })],
          beats: [
            { caption: "妈妈把一条腿搭在了小念肚子上。" },
            { say: "nian", text: "妈妈压扁！", kind: "shout" },
          ],
        },
        {
          scene: night,
          shot: "medium",
          actors: [{ who: "mom", at: 0.5, pose: "stand", face: "laugh" }],
          beats: [
            { say: "mom", text: "哈哈哈，压扁？" },
          ],
        },
      ],
    },
    {
      layout: "1-2-1",
      panels: [
        {
          scene: night,
          shot: "wide",
          actors: [
            { who: "dad", at: 0.24, pose: "stand", face: "laugh", facing: "right" },
            lying("mom", 0.66, { face: "laugh", facing: "left" }),
            lying("nian", 0.84, { face: "laugh", facing: "left" }),
          ],
          beats: [
            { caption: "爸爸听了，也和妈妈一起大笑。" },
          ],
        },
        {
          scene: night,
          shot: "close",
          focus: "mom",
          actors: [{ who: "mom", at: 0.5, pose: "stand", face: "laugh" }],
          beats: [
            { say: "mom", text: "小念都会用「压扁」了！" },
          ],
        },
        {
          scene: night,
          shot: "close",
          focus: "dad",
          actors: [{ who: "dad", at: 0.5, pose: "stand", face: "laugh" }],
          beats: [
            { say: "dad", text: "意思还挺对，哈哈哈！" },
          ],
        },
        {
          scene: night,
          shot: "wide",
          actors: [
            { who: "dad", at: 0.24, pose: "stand", face: "laugh", facing: "right" },
            lying("mom", 0.66, { face: "laugh", facing: "left" }),
            lying("nian", 0.84, { face: "laugh", facing: "left" }),
          ],
          beats: [
            { caption: "小念也跟着一起笑。" },
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
            lying("mom", 0.66, { face: "laugh", facing: "left" }),
            lying("nian", 0.84, { face: "laugh", facing: "left" }),
          ],
          beats: [
            { caption: "哈哈哈，太有意思了。" },
          ],
        },
        {
          scene: night,
          shot: "close",
          focus: "nian",
          actors: [lying("nian", 0.5, { face: "laugh", facing: "right" })],
          beats: [
            { say: "nian", text: "妈妈压扁！" },
          ],
        },
        {
          scene: night,
          shot: "medium",
          actors: [{ who: "dad", at: 0.5, pose: "stand", face: "laugh" }],
          beats: [
            { sfx: "哈哈哈！" },
          ],
        },
      ],
    },
  ],
};

export default story;
