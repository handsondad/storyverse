import type { Prop, SceneSpec, Story } from "../../story/types.ts";

/**
 * 2026-05-20 的真事：2017 年买的乳胶枕一直密封着，拆开以后鼓不起来，
 * 爸爸和小念拍了一下午，总算鼓起来一些。
 */
const room: SceneSpec = { place: "bedroom", time: "day" };
const evening: SceneSpec = { place: "bedroom", time: "evening" };
/** 地上的枕头；puff 是鼓起来多少 */
const pillow = (x: number, puff: number, more: Partial<Prop> = {}): Prop => ({ thing: { kind: "pillow", puff }, x, size: 230, ...more });
const sealed: Prop = { thing: { kind: "pillow", puff: 0.1, sealed: true, label: "2017" }, x: 0.55, size: 230 };

const story: Story = {
  id: "latex-pillow",
  title: "睡了九年的枕头",
  blurb: "密封了九年的乳胶枕，拆开却鼓不起来。爸爸和小念拍呀拍……",
  when: { date: "2026-05-20", label: "拆新枕头" },
  credits: { by: ["nian", "dad", "mom"] },
  cover: {
    scene: room,
    actors: [
      { who: "dad", at: 0.34, pose: "crouch", face: "happy", facing: "right" },
      { who: "nian", at: 0.66, pose: "crouch", face: "laugh", facing: "left" },
    ],
    props: [pillow(0.5, 0.35, { size: 270, front: true })],
  },
  pages: [
    {
      layout: "1-2",
      panels: [
        {
          scene: room,
          shot: "wide",
          actors: [
            { who: "mom", at: 0.36, pose: "hold", face: "happy", facing: "right" },
            { who: "dad", at: 0.62, pose: "stand", face: "surprised" },
          ],
          props: [{ ...sealed, x: 0.374, lift: 250, front: true }],
          beats: [
            { caption: "这天，妈妈翻出一个2017年买的乳胶枕。" },
            { say: "mom", text: "它一直封着，还没拆过呢！" },
          ],
        },
        {
          scene: room,
          actors: [{ who: "dad", at: 0.5, pose: "think", face: "thinking" }],
          beats: [
            { caption: "当年，爸爸一直不让拆：" },
            { say: "dad", text: "先留着，等小念长大再用！" },
          ],
        },
        {
          scene: room,
          actors: [
            { who: "mom", at: 0.4, pose: "point", face: "happy", facing: "right" },
            { who: "nian", at: 0.62, pose: "cheer", face: "happy" },
          ],
          beats: [
            { say: "mom", text: "新的我用，旧枕头给小念！" },
            { say: "nian", text: "好耶！" },
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
          actors: [{ who: "dad", at: 0.4, pose: "crouch", face: "happy", facing: "right", hold: "✂️" }],
          props: [{ ...sealed, x: 0.6, front: true }],
          beats: [
            { caption: "妈妈让爸爸把密封袋剪开。" },
            { sfx: "咔嚓" },
          ],
        },
        {
          scene: room,
          shot: "wide",
          actors: [{ who: "nian", at: 0.36, pose: "crouch", face: "surprised", facing: "right" }],
          props: [pillow(0.54, 0.05, { front: true })],
          beats: [
            { say: "nian", text: "咦？它怎么不变大？" },
          ],
        },
        {
          scene: room,
          shot: "wide",
          actors: [
            { who: "mom", at: 0.2, pose: "stand", face: "confused", facing: "right" },
            { who: "dad", at: 0.62, pose: "shrug", face: "scared", facing: "left" },
          ],
          props: [pillow(0.41, 0.08)],
          beats: [
            { caption: "等了好一会儿，枕头还是扁扁的。" },
            { say: "mom", text: "不是一拆开就鼓起来吗？" },
            { say: "dad", text: "再……再等等？" },
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
          actors: [{ who: "mom", at: 0.42, pose: "hold", face: "surprised", hold: "📱" }],
          props: [pillow(0.64, 0.08)],
          beats: [
            { caption: "妈妈上网一查：压得紧紧的乳胶枕，最好早点拆开。" },
            { say: "mom", text: "放了九年，难怪弹不回来！" },
          ],
        },
        {
          scene: room,
          actors: [
            { who: "mom", at: 0.35, pose: "point", face: "angry", facing: "right" },
            { who: "dad", at: 0.65, pose: "stand", face: "scared" },
          ],
          beats: [
            { say: "mom", text: "都怪你，非要等小念长大！", kind: "shout" },
          ],
        },
        {
          scene: room,
          actors: [
            { who: "dad", at: 0.38, pose: "stand", face: "shy", facing: "right" },
            { who: "nian", at: 0.64, pose: "cheer", face: "happy" },
          ],
          beats: [
            { say: "dad", text: "是我不对，我来补救！" },
            { say: "nian", text: "我也帮忙！" },
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
          actors: [
            { who: "dad", at: 0.33, pose: "crouch", face: "happy", facing: "right" },
            { who: "nian", at: 0.67, pose: "crouch", face: "happy", facing: "left" },
          ],
          props: [pillow(0.5, 0.12, { size: 260, front: true })],
          beats: [
            { caption: "爸爸和小念一起拍枕头：啪！啪！啪！" },
            { say: "nian", text: "枕头，快醒醒！" },
          ],
        },
        {
          scene: evening,
          shot: "wide",
          actors: [
            { who: "dad", at: 0.33, pose: "crouch", face: "proud", facing: "right" },
            { who: "nian", at: 0.67, pose: "crouch", face: "surprised", facing: "left" },
          ],
          props: [pillow(0.5, 0.3, { size: 260, front: true })],
          beats: [
            { caption: "拍呀拍，一直拍到太阳下山。" },
            { say: "nian", text: "好像大了一点！" },
          ],
        },
        {
          scene: evening,
          shot: "wide",
          actors: [
            { who: "dad", at: 0.25, pose: "cheer", face: "proud" },
            { who: "nian", at: 0.45, pose: "jump", face: "laugh" },
            { who: "mom", at: 0.8, pose: "stand", face: "happy", facing: "left" },
          ],
          props: [pillow(0.62, 0.45)],
          beats: [
            { caption: "虽然回不到原来的样子，可它真的鼓起来了些。" },
            { say: "dad", text: "我们成功啦！" },
            { say: "mom", text: "嗯，比刚才强多啦。" },
          ],
        },
      ],
    },
    {
      layout: "1-1",
      panels: [
        {
          scene: evening,
          shot: "wide",
          actors: [
            { who: "dad", at: 0.25, pose: "stand", face: "proud" },
            { who: "nian", at: 0.5, pose: "hold", face: "proud", facing: "left" },
            { who: "mom", at: 0.75, pose: "stand", face: "happy", facing: "left" },
          ],
          props: [pillow(0.486, 0.45, { lift: 110, size: 190, front: true })],
          beats: [
            { caption: "妈妈消了气，爸爸和小念可有成就感啦！" },
            { say: "mom", text: "这回不生气啦。" },
          ],
        },
        {
          scene: evening,
          actors: [
            { who: "mom", at: 0.3, pose: "stand", face: "happy", facing: "right" },
            { who: "nian", at: 0.7, pose: "cheer", face: "happy", facing: "left" },
          ],
          beats: [
            { caption: "好东西别一直攒着，趁它最好的时候用起来！" },
            { say: "mom", text: "需要的时候再买，买了就好好用。" },
            { say: "nian", text: "新玩具，今天就玩！" },
          ],
        },
      ],
    },
  ],
};

export default story;
