import type { Actor, SceneSpec, Story } from "../../story/types.ts";

/**
 * 2026-03-20 的真事：一个叔叔送给小念一个小沙发，大小正合适。
 * 小念往后一仰，还摆了个动作，像个小小领导；爸爸妈妈笑着说这是专为小念做的小沙发。
 */
const home: SceneSpec = { place: "living-room", time: "day" };
const onSofa = (at: number, more: Partial<Actor> = {}): Actor => ({ who: "nian", at, seat: "sofa", pose: "boss", face: "proud", facing: "right", ...more });

const story: Story = {
  id: "little-sofa",
  title: "小念的小沙发",
  blurb: "叔叔送来一个小沙发，小念往后一仰——好一个小小领导！",
  when: { date: "2026-03-20", label: "小沙发" },
  credits: { by: ["nian", "dad", "mom"] },
  cover: {
    scene: home,
    actors: [onSofa(0.5)],
  },
  pages: [
    {
      layout: "1-2",
      panels: [
        {
          scene: home,
          shot: "wide",
          actors: [
            { who: "nian", at: 0.22, pose: "cheer", face: "surprised", facing: "right" },
            { who: "shushu", at: 0.72, pose: "point", face: "happy", facing: "left" },
          ],
          props: [{ thing: { kind: "sofa" }, x: 0.48, size: 220 }],
          beats: [
            { caption: "2026年3月20日，一个叔叔送给小念一个小沙发。" },
            { say: "shushu", text: "小念，这是给你的！" },
            { say: "nian", text: "哇！沙发！" },
          ],
        },
        {
          scene: home,
          actors: [onSofa(0.5, { pose: "sit", face: "laugh" })],
          beats: [
            { caption: "小念坐上去，大小正合适！" },
          ],
        },
        {
          scene: home,
          actors: [onSofa(0.5, { face: "happy" })],
          beats: [
            { caption: "他往后一仰，还摆了个动作——" },
          ],
        },
      ],
    },
    {
      layout: "1-1",
      panels: [
        {
          scene: { place: "burst", tint: "#ffe9a8" },
          shot: "wide",
          actors: [onSofa(0.5)],
          beats: [
            { caption: "像个小小领导似的，还挺有那个样子！" },
            { sfx: "派头十足！" },
          ],
        },
        {
          scene: home,
          shot: "wide",
          actors: [
            { who: "dad", at: 0.18, pose: "point", face: "laugh", facing: "right" },
            onSofa(0.5),
            { who: "mom", at: 0.82, pose: "cheer", face: "laugh", facing: "left" },
          ],
          beats: [
            { caption: "爸爸妈妈都笑了。" },
            { say: "dad", text: "瞧这架势！" },
            { say: "mom", text: "这是专为小念做的小沙发呀！" },
          ],
        },
      ],
    },
  ],
};

export default story;
