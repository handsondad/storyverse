import type { Prop, SceneSpec, Story, Thing } from "../../story/types.ts";

/**
 * 2025-07-11 的真事：一个阿姨送了小念一块拱形大木板（平衡板），能当跷跷板、滑滑梯。
 * 小念发明了好多玩法；有一回踩到板边，木板一翻，他也摔了个屁股墩儿，爸爸妈妈笑他贪玩。
 * 后来他好好练习，现在走在上面如履平地。摔一跤也不一定是坏事。
 */
const room: SceneSpec = { place: "living-room", time: "day" };
const baby = (move: Thing["move"], more: Partial<Thing> = {}): Thing => ({ kind: "baby", move, ...more });
const board = (more: Partial<Thing>, x = 0.5, size = 640): Prop => ({ thing: { kind: "board", ...more }, x, size });

const story: Story = {
  id: "balance-board",
  title: "会变的大木板",
  blurb: "阿姨送的拱形大木板，被小念玩出了好多花样——摔了一跤之后，他走得更稳啦！",
  when: { date: "2025-07-11", label: "大木板来啦" },
  credits: { by: ["nian", "dad", "mom"] },
  cover: {
    scene: room,
    actors: [
      { who: "dad", at: 0.28, pose: "cheer", face: "laugh", facing: "right" },
      { who: "mom", at: 0.72, pose: "cheer", face: "laugh", facing: "left" },
    ],
    props: [board({ shape: "arch", rider: baby("stand", { giggle: true }) }, 0.5, 440)],
  },
  pages: [
    {
      layout: "1-2",
      panels: [
        {
          scene: room,
          shot: "wide",
          actors: [
            { who: "ayi", at: 0.2, pose: "point", face: "happy", facing: "right" },
            { who: "mom", at: 0.84, pose: "wave", face: "happy", facing: "left" },
          ],
          props: [board({}, 0.46, 560), { thing: baby("crawl", { giggle: true }), x: 0.68, size: 320 }],
          beats: [
            { caption: "2025年7月11日，一个阿姨送给小念一块拱形的大木板。" },
            { say: "ayi", text: "能当跷跷板，也能当滑滑梯！" },
            { say: "mom", text: "谢谢阿姨！" },
          ],
        },
        {
          scene: room,
          shot: "wide",
          actors: [],
          props: [board({ rider: baby("sit", { giggle: true }) }, 0.5, 600)],
          beats: [
            { caption: "小念爱不释手，天天都要玩。" },
          ],
        },
        {
          scene: room,
          shot: "wide",
          actors: [],
          props: [board({ shape: "arch" }, 0.5, 600)],
          beats: [
            { caption: "木板很大，小念发明了好多玩法——" },
          ],
        },
      ],
    },
    {
      layout: "2-2",
      panels: [
        {
          scene: room,
          shot: "wide",
          actors: [{ who: "mom", at: 0.73, pose: "crouch", face: "laugh", facing: "left" }],
          props: [board({ tilt: 12, rider: baby("sit", { giggle: true }), spot: -0.62 }, 0.55, 480)],
          beats: [
            { caption: "和妈妈玩跷跷板，" },
            { say: "mom", text: "上去喽——" },
          ],
        },
        {
          scene: room,
          shot: "wide",
          actors: [{ who: "dad", at: 0.3, pose: "hold", face: "happy", facing: "right" }],
          props: [board({ shape: "slide", rider: baby("sit", { giggle: true }), spot: 0.1 }, 0.58)],
          beats: [
            { caption: "让爸爸立起来当滑滑梯，" },
            { sfx: "嗖——", at: [0.72, 0.36] },
          ],
        },
        {
          scene: room,
          shot: "wide",
          actors: [],
          props: [board({ tilt: -8, rider: baby("stand", { giggle: true }) }, 0.5, 580)],
          beats: [
            { caption: "站在上面摇摇晃晃走平衡木，" },
            { sfx: "摇啊摇～", at: [0.72, 0.3] },
          ],
        },
        {
          scene: room,
          shot: "wide",
          actors: [],
          props: [board({ shape: "arch", rider: baby("sit", { giggle: true }), lean: -55 }, 0.5, 580)],
          beats: [
            { caption: "还躺在拱顶上做仰卧起坐！" },
            { sfx: "一、二！", at: [0.74, 0.3] },
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
          actors: [],
          props: [board({ tilt: 20 }, 0.42, 620), { thing: baby("sit"), x: 0.66, size: 360 }],
          beats: [
            { caption: "有一回玩得正欢，小念一脚踩到木板边上——" },
            { sfx: "哐当！", at: [0.3, 0.3] },
            { sfx: "扑通！", at: [0.72, 0.3] },
          ],
        },
        {
          scene: room,
          actors: [
            { who: "mom", at: 0.3, pose: "point", face: "laugh", facing: "right" },
            { who: "dad", at: 0.7, pose: "stand", face: "laugh", facing: "left" },
          ],
          beats: [
            { caption: "这下轮到爸爸妈妈笑小念了。" },
            { say: "mom", text: "让你再这么贪玩！" },
            { say: "dad", text: "要注意保持平衡哦！" },
          ],
        },
        {
          scene: room,
          shot: "wide",
          actors: [],
          props: [board({ tilt: 5, rider: baby("stand"), spot: -0.3 }, 0.5, 600)],
          beats: [
            { caption: "之后，小念果然好好练习。" },
          ],
        },
      ],
    },
    {
      layout: "1-1",
      panels: [
        {
          scene: { place: "burst", tint: "#fff3b0" },
          shot: "wide",
          actors: [],
          props: [board({ shape: "arch", rider: baby("stand", { giggle: true }) }, 0.5, 680)],
          beats: [
            { caption: "现在，他走在上面如履平地，平衡好极了！" },
          ],
        },
        {
          scene: room,
          shot: "wide",
          actors: [
            { who: "dad", at: 0.2, pose: "cheer", face: "laugh", facing: "right" },
            { who: "mom", at: 0.8, pose: "cheer", face: "happy", facing: "left" },
          ],
          props: [board({ rider: baby("stand", { giggle: true }), spot: 0.2 }, 0.5, 600)],
          beats: [
            { caption: "看来当初摔一跤，也不一定是坏事呀！" },
            { say: "dad", text: "摔一跤，长本事！" },
            { say: "mom", text: "我们小念真棒！" },
          ],
        },
      ],
    },
  ],
};

export default story;
