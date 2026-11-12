import type { Actor, Prop, SceneSpec, Story } from "../../story/types.ts";

/**
 * 2026-02-09 的真事：小念对食物的味道有了感觉，吃东西前要闻一闻。
 * 姥爷爱吃姜，炒菜放得多；小念拿着姜说「姜」，往姥爷嘴里放。姥爷问你吃不吃，他闻了闻皱着眉说「辣」。
 * 一会儿看到蒜，闻了闻就吃起来了；蒜炒熟了不辣，爸爸尝了尝果然是。
 * 以后吃新东西他都先闻一闻再说吃不吃，妈妈说这是小小食物鉴赏家。
 * 小念一岁半，只说一个字一个字的话。饭桌的几格用同一套座位。
 */
const room: SceneSpec = { place: "dining-room", time: "day", table: { from: 0.31, to: 0.95 } };
const nian = (more: Partial<Actor>): Actor => ({ who: "nian", at: 0.2, seat: "high-chair", pose: "sit", facing: "right", ...more });
const laoye = (more: Partial<Actor>): Actor => ({ who: "laoye", at: 0.5, seat: "chair", pose: "sit", facing: "left", ...more });
const mom = (more: Partial<Actor>): Actor => ({ who: "mom", at: 0.8, seat: "chair", pose: "sit", facing: "left", ...more });
const dad = (more: Partial<Actor>): Actor => ({ who: "dad", at: 0.8, seat: "chair", pose: "sit", facing: "left", ...more });
const dishes: Prop[] = [
  { emoji: "🥘", x: 0.36, lift: 205, size: 80 },
  { emoji: "🫚", x: 0.62, lift: 205, size: 60 },
  { emoji: "🧄", x: 0.7, lift: 205, size: 55 },
  { emoji: "🍚", x: 0.92, lift: 205, size: 65 },
];
const floor: SceneSpec = { place: "dining-room", time: "day" };

const story: Story = {
  id: "smell-first",
  title: "小小食物鉴赏家",
  blurb: "吃东西前先闻一闻：姜，辣！蒜，香！小念的鼻子可厉害了。",
  when: { date: "2026-02-09", label: "闻一闻" },
  credits: { by: ["nian", "dad", "mom"] },
  cover: {
    scene: { ...room, table: { from: 0.48, to: 0.9 } },
    actors: [nian({ at: 0.36, pose: "sniff", hold: "🫚", face: "yuck" }), laoye({ at: 0.66, face: "laugh" })],
    props: [{ emoji: "🧄", x: 0.54, lift: 205, size: 55 }, { emoji: "🥘", x: 0.8, lift: 205, size: 80 }],
  },
  pages: [
    {
      layout: "1-2",
      panels: [
        {
          scene: room,
          shot: "wide",
          actors: [nian({ pose: "sniff", hold: "🍚", face: "thinking" }), laoye({ face: "happy" }), mom({ face: "laugh" })],
          props: [dishes[0], dishes[1], dishes[3]],
          beats: [
            { caption: "2026年2月9日，小念最近对食物的味道有了感觉。" },
            { say: "mom", text: "吃之前还要闻一闻！" },
          ],
        },
        {
          scene: floor,
          shot: "close",
          actors: [{ who: "nian", at: 0.36, pose: "sniff", hold: "🍚", face: "thinking" }],
          beats: [
            { caption: "吃东西的时候，非要闻一闻。" },
            { sfx: "嗅嗅" },
          ],
        },
        {
          scene: room,
          shot: "wide",
          actors: [laoye({ face: "happy" })],
          props: dishes,
          beats: [
            { caption: "姥爷爱吃姜，炒菜姜放得比较多。" },
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
          actors: [nian({ pose: "hold", hold: "🫚", face: "happy" }), laoye({ face: "surprised" })],
          beats: [
            { caption: "不知啥时候，小念就知道姥爷爱吃姜了。" },
            { say: "nian", text: "姜！" },
          ],
        },
        {
          scene: floor,
          shot: "close",
          actors: [{ who: "laoye", at: 0.64, pose: "stand", face: "laugh" }],
          beats: [
            { caption: "拿着姜就往姥爷嘴里放。" },
            { say: "laoye", text: "你吃不吃？" },
          ],
        },
        {
          scene: floor,
          shot: "medium",
          actors: [{ who: "nian", at: 0.36, pose: "sniff", hold: "🫚", face: "yuck" }],
          beats: [
            { caption: "小念闻了闻，皱着眉——" },
            { say: "nian", text: "辣！", kind: "shout" },
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
          actors: [nian({ face: "yuck" }), laoye({ face: "laugh" }), mom({ face: "laugh" })],
          props: [dishes[0], dishes[2], dishes[3]],
          beats: [
            { caption: "那小表情，太搞笑了！" },
            { sfx: "哈哈哈！" },
          ],
        },
        {
          scene: floor,
          shot: "close",
          actors: [{ who: "nian", at: 0.36, pose: "sniff", hold: "🧄", face: "thinking" }],
          beats: [
            { caption: "一会儿，他又看到蒜了，拿起来闻了闻……" },
          ],
        },
        {
          scene: floor,
          shot: "close",
          actors: [{ who: "nian", at: 0.36, pose: "hold", hold: "🧄", face: "happy" }],
          beats: [
            { caption: "结果就吃起来了！" },
            { sfx: "吧唧吧唧" },
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
          actors: [nian({ pose: "hold", hold: "🧄", face: "happy" }), laoye({ face: "happy" }), dad({ face: "confused" })],
          props: [dishes[0], dishes[3]],
          beats: [
            { caption: "其实蒜也辣呀——" },
            { say: "dad", text: "蒜不辣吗？" },
          ],
        },
        {
          scene: floor,
          shot: "close",
          actors: [{ who: "dad", at: 0.66, pose: "sniff", hold: "🧄", face: "surprised" }],
          beats: [
            { caption: "爸爸尝了尝——" },
            { say: "dad", text: "炒熟了，真不辣！" },
          ],
        },
        {
          scene: floor,
          shot: "close",
          actors: [{ who: "nian", at: 0.36, pose: "stand", face: "proud" }],
          beats: [
            { caption: "看来小念的鼻子还挺厉害！" },
          ],
        },
        {
          scene: room,
          shot: "wide",
          actors: [nian({ pose: "sniff", hold: "🍓", face: "thinking" }), laoye({ face: "laugh" }), mom({ face: "laugh" })],
          props: [dishes[0], dishes[3]],
          beats: [
            { caption: "以后每吃一样新东西，他都先闻一闻，才说吃或不吃！" },
            { say: "mom", text: "小小食物鉴赏家啦！" },
          ],
        },
      ],
    },
  ],
};

export default story;
