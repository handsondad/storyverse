import type { Prop, SceneSpec, Story } from "../../story/types.ts";

/**
 * 2026-09-20 的真事：小念和爸爸妈妈去成都看阿姨、叔叔和哥哥。哥哥表演吉他弹唱，
 * 小念也拿起小吉他像模像样地弹，唱「我有一个好妈妈」，爸爸跟着哼。
 * 叔叔阿姨说小念有音乐天赋，可以和哥哥组个组合，大家都哈哈大笑。
 */
const home: SceneSpec = { place: "living-room", time: "day" };
const note = (x: number, lift: number, size = 80): Prop => ({ emoji: "🎵", x, lift, size });

const story: Story = {
  id: "little-guitar",
  title: "小念的吉他组合",
  blurb: "在成都，哥哥弹吉他唱歌，小念也抱起小吉他唱「我有一个好妈妈」！",
  when: { date: "2026-09-20", label: "成都看哥哥" },
  credits: { by: ["nian", "dad", "mom"] },
  cover: {
    scene: home,
    actors: [
      { who: "gege", at: 0.36, pose: "hold", face: "happy", facing: "right", hold: "🎸" },
      { who: "nian", at: 0.64, pose: "hold", face: "laugh", facing: "left", hold: "🎸" },
    ],
    props: [note(0.43, 290), note(0.5, 330, 70), note(0.57, 300)],
  },
  pages: [
    {
      layout: "1-2",
      panels: [
        {
          scene: home,
          shot: "wide",
          actors: [
            { who: "dad", at: 0.1, pose: "stand", face: "happy", facing: "right" },
            { who: "nian", at: 0.22, pose: "wave", face: "happy", facing: "right" },
            { who: "mom", at: 0.34, pose: "wave", face: "happy", facing: "right" },
            { who: "ayi", at: 0.62, pose: "wave", face: "laugh", facing: "left" },
            { who: "shushu", at: 0.76, pose: "stand", face: "happy", facing: "left" },
            { who: "gege", at: 0.89, pose: "wave", face: "happy", facing: "left" },
          ],
          beats: [
            { caption: "2026年9月20日，小念和爸爸妈妈来到成都。" },
            { say: "ayi", text: "欢迎欢迎，快进来！" },
            { say: "nian", text: "阿姨好！哥哥好！" },
          ],
        },
        {
          scene: home,
          actors: [
            { who: "ayi", at: 0.34, pose: "point", face: "happy", facing: "right" },
            { who: "gege", at: 0.66, pose: "hold", face: "proud", facing: "left", hold: "🎸" },
          ],
          beats: [
            { say: "ayi", text: "哥哥，给大家弹一首！" },
            { say: "gege", text: "好嘞！" },
          ],
        },
        {
          scene: home,
          actors: [{ who: "gege", at: 0.5, pose: "hold", face: "happy", hold: "🎸" }],
          props: [note(0.41, 260, 60), note(0.6, 300, 56)],
          beats: [
            { caption: "到家后，哥哥表演了吉他弹唱。" },
            { say: "gege", text: "啦啦啦～啦啦～" },
          ],
        },
      ],
    },
    {
      layout: "2-1",
      panels: [
        {
          scene: home,
          shot: "close",
          actors: [{ who: "nian", at: 0.5, pose: "stand", face: "surprised" }],
          beats: [
            { say: "nian", text: "哥哥好厉害！", kind: "thought" },
          ],
        },
        {
          scene: home,
          actors: [{ who: "nian", at: 0.5, pose: "jump", face: "laugh" }],
          beats: [
            { caption: "小念特别开心。" },
            { say: "nian", text: "我也要试试！", kind: "shout" },
          ],
        },
        {
          scene: home,
          actors: [
            { who: "mom", at: 0.36, pose: "hold", face: "happy", facing: "right", hold: "🎸" },
            { who: "nian", at: 0.66, pose: "cheer", face: "surprised", facing: "left" },
          ],
          beats: [
            { say: "mom", text: "给，这是你的小吉他！" },
            { say: "nian", text: "哇！" },
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
            { who: "nian", at: 0.4, pose: "hold", face: "laugh", facing: "right", hold: "🎸" },
            { who: "dad", at: 0.66, pose: "stand", face: "happy", facing: "left" },
          ],
          props: [note(0.27, 300), note(0.53, 360, 70)],
          beats: [
            { caption: "小念像模像样地学着弹，嘴里还唱着——" },
            { say: "nian", text: "我有一个好妈妈，好妈妈……" },
            { say: "dad", text: "嗯嗯～嗯嗯嗯～" },
          ],
        },
        {
          scene: home,
          shot: "close",
          actors: [{ who: "mom", at: 0.5, pose: "stand", face: "happy" }],
          beats: [
            { say: "mom", text: "唱的是妈妈呀！" },
          ],
        },
        {
          scene: home,
          actors: [{ who: "gege", at: 0.5, pose: "point", face: "laugh" }],
          beats: [
            { say: "gege", text: "弟弟唱得真好！" },
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
            { who: "dad", at: 0.1, pose: "cheer", face: "laugh", facing: "right" },
            { who: "mom", at: 0.24, pose: "cheer", face: "laugh", facing: "right" },
            { who: "nian", at: 0.42, pose: "hold", face: "proud", facing: "right", hold: "🎸" },
            { who: "ayi", at: 0.62, pose: "cheer", face: "laugh", facing: "left" },
            { who: "shushu", at: 0.76, pose: "cheer", face: "laugh", facing: "left" },
            { who: "gege", at: 0.89, pose: "cheer", face: "laugh", facing: "left" },
          ],
          beats: [
            { caption: "大家都高兴得大笑，给小念鼓掌。" },
            { sfx: "啪啪啪！" },
          ],
        },
        {
          scene: home,
          actors: [
            { who: "shushu", at: 0.34, pose: "point", face: "laugh", facing: "right" },
            { who: "ayi", at: 0.68, pose: "stand", face: "happy", facing: "left" },
          ],
          beats: [
            { say: "shushu", text: "小念有音乐天赋呀！" },
            { say: "ayi", text: "跟哥哥搞个组合吧！" },
          ],
        },
        {
          scene: home,
          shot: "close",
          actors: [{ who: "nian", at: 0.5, pose: "hold", face: "confused", hold: "🎸" }],
          beats: [
            { say: "nian", text: "组合是什么呀？" },
          ],
        },
        {
          scene: home,
          actors: [
            { who: "gege", at: 0.34, pose: "hold", face: "laugh", facing: "right", hold: "🎸" },
            { who: "nian", at: 0.66, pose: "hold", face: "laugh", facing: "left", hold: "🎸" },
          ],
          beats: [
            { caption: "我们听完，都哈哈大笑。" },
            { sfx: "哈哈哈！", at: [0.5, 0.3] },
          ],
        },
      ],
    },
  ],
};

export default story;
