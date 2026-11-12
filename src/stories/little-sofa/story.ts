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
          scene: { place: "burst", tint: "#ffe9a8" },
          shot: "close",
          actors: [{ who: "nian", at: 0.5, pose: "cheer", face: "happy" }],
          beats: [
            { caption: "小念高兴极了！" },
            { say: "nian", text: "我的小沙发！", kind: "shout" },
          ],
        },
        {
          scene: home,
          actors: [{ who: "shushu", at: 0.5, pose: "point", face: "happy", facing: "left" }],
          beats: [
            { say: "shushu", text: "快坐上去试试！" },
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
          actors: [{ who: "nian", at: 0.3, pose: "walk", face: "happy", facing: "right" }],
          props: [{ thing: { kind: "sofa" }, x: 0.68, size: 220 }],
          beats: [
            { caption: "小念走过去，转身一坐——" },
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
          shot: "wide",
          actors: [
            onSofa(0.32, { pose: "sit", face: "happy" }),
            { who: "shushu", at: 0.72, pose: "stand", face: "happy", facing: "left" },
          ],
          beats: [
            { say: "shushu", text: "不大不小，刚刚好！" },
            { say: "nian", text: "我坐着正好！" },
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
          actors: [onSofa(0.5, { face: "happy" })],
          beats: [
            { caption: "他往后一仰，还摆了个动作——" },
          ],
        },
        {
          scene: home,
          shot: "close",
          actors: [onSofa(0.5)],
          beats: [
            { caption: "两只小手往脑后一抱，小腿一翘。" },
          ],
        },
        {
          scene: home,
          actors: [
            { who: "dad", at: 0.3, pose: "stand", face: "surprised", facing: "right" },
            { who: "mom", at: 0.7, pose: "point", face: "surprised", facing: "right" },
          ],
          beats: [
            { say: "mom", text: "哟，快看小念！" },
          ],
        },
        {
          scene: { place: "burst", tint: "#ffe9a8" },
          shot: "wide",
          actors: [onSofa(0.5)],
          beats: [
            { caption: "像个小小领导似的，还挺有那个样子！" },
            { sfx: "派头十足！" },
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
        {
          scene: home,
          actors: [onSofa(0.5, { pose: "sit", face: "happy" })],
          beats: [
            { say: "nian", text: "谢谢叔叔！" },
          ],
        },
        {
          scene: home,
          actors: [{ who: "shushu", at: 0.5, pose: "wave", face: "laugh", facing: "left" }],
          beats: [
            { say: "shushu", text: "喜欢就好！" },
          ],
        },
      ],
    },
  ],
};

export default story;
