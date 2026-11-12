import type { SceneSpec, Story } from "../../story/types.ts";

/**
 * 2026-07-10 的真事：小念不知啥时候学会了用手指刷手机，一家人都尽量不让他看。
 * 谁一拿手机他就过来喊「看看看」；姥爷说「广告、广告」，他就说「看广告」。
 * 制止他时他喊「眼睛疼，眼睛疼」，妈妈说：你知道还看。
 */
const home: SceneSpec = { place: "living-room", time: "day" };

const story: Story = {
  id: "watch-ads",
  title: "看广告！",
  blurb: "姥爷说手机里只有广告，小念一拍手：那就看广告！",
  when: { date: "2026-07-10", label: "看广告" },
  credits: { by: ["nian", "dad", "mom"] },
  cover: {
    scene: home,
    actors: [
      { who: "nian", at: 0.32, pose: "cheer", face: "laugh", facing: "right" },
      { who: "laoye", at: 0.7, pose: "hold", face: "surprised", facing: "left" },
    ],
    props: [{ thing: { kind: "phone", show: "ad" }, x: 0.6, lift: 300, size: 110, front: true }],
  },
  pages: [
    {
      layout: "1-2",
      panels: [
        {
          scene: home,
          shot: "wide",
          actors: [
            { who: "nian", at: 0.3, pose: "hold", hold: "📱", face: "happy", facing: "right" },
            { who: "mom", at: 0.72, pose: "stand", face: "surprised", facing: "left" },
          ],
          beats: [
            { caption: "2026年7月10日，小念最近特别爱看动画片。" },
            { say: "mom", text: "哎，这么小就会刷手机了！" },
          ],
        },
        {
          scene: { place: "plain", tint: "#e6f4ff" },
          shot: "wide",
          actors: [],
          props: [{ thing: { kind: "phone", show: "swipe" }, x: 0.5, lift: 160, size: 330 }],
          beats: [
            { caption: "小手指一划，跟大人学得一模一样。" },
            { sfx: "唰！", at: [0.78, 0.4] },
          ],
        },
        {
          scene: home,
          actors: [
            { who: "dad", at: 0.3, pose: "shrug", face: "sad", facing: "right" },
            { who: "laoye", at: 0.7, pose: "stand", face: "sad", facing: "left" },
          ],
          beats: [
            { caption: "一家人都尽量不让他看手机。" },
          ],
        },
      ],
    },
    {
      layout: "2-1",
      panels: [
        {
          scene: home,
          actors: [{ who: "laoye", at: 0.5, pose: "hold", hold: "📱", face: "happy", facing: "left" }],
          beats: [
            { caption: "可只要谁一拿起手机——" },
          ],
        },
        {
          scene: home,
          shot: "wide",
          actors: [{ who: "nian", at: 0.5, pose: "run", face: "happy", facing: "right" }],
          beats: [
            { say: "nian", text: "看看看！", kind: "shout" },
            { sfx: "嗒嗒嗒", at: [0.25, 0.82] },
          ],
        },
        {
          scene: home,
          shot: "wide",
          actors: [
            { who: "nian", at: 0.3, pose: "point", face: "happy", facing: "right" },
            { who: "laoye", at: 0.68, pose: "shrug", face: "neutral", facing: "left" },
          ],
          beats: [
            { caption: "姥爷不想让他看，就说——" },
            { say: "laoye", text: "广告，广告！" },
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
            { who: "nian", at: 0.3, pose: "cheer", face: "laugh", facing: "right" },
            { who: "laoye", at: 0.7, pose: "stand", face: "surprised", facing: "left" },
          ],
          beats: [
            { caption: "结果小念说——" },
            { say: "nian", text: "看广告！", kind: "shout" },
          ],
        },
        {
          scene: { place: "plain", tint: "#f3ebe0" },
          shot: "close",
          actors: [{ who: "laoye", at: 0.5, pose: "stand", face: "laugh" }],
          beats: [
            { say: "laoye", text: "哈哈，广告也要看！" },
          ],
        },
        {
          scene: { place: "plain", tint: "#e8f6ec" },
          shot: "close",
          actors: [{ who: "mom", at: 0.5, pose: "stand", face: "laugh" }],
          beats: [
            { say: "mom", text: "太搞笑了！" },
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
            { who: "nian", at: 0.3, pose: "point", face: "sad", facing: "right" },
            { who: "mom", at: 0.7, pose: "hold", hold: "📱", face: "serious", facing: "left" },
          ],
          beats: [
            { caption: "不过，我们还是决定好好限制他看视频。" },
            { say: "mom", text: "不能再看啦！" },
          ],
        },
        {
          scene: { place: "plain", tint: "#ffe3dc" },
          shot: "close",
          actors: [{ who: "nian", at: 0.5, pose: "rub", face: "sad" }],
          beats: [
            { say: "nian", text: "眼睛疼，眼睛疼！" },
          ],
        },
        {
          scene: { place: "plain", tint: "#e8f6ec" },
          shot: "close",
          actors: [{ who: "mom", at: 0.5, pose: "stand", face: "confused" }],
          beats: [
            { say: "mom", text: "你知道还看！" },
          ],
        },
        {
          scene: home,
          shot: "wide",
          actors: [
            { who: "dad", at: 0.2, pose: "stand", face: "laugh", facing: "right" },
            { who: "nian", at: 0.4, pose: "rub", face: "sad" },
            { who: "mom", at: 0.6, pose: "stand", face: "laugh", facing: "left" },
            { who: "laoye", at: 0.82, pose: "stand", face: "laugh", facing: "left" },
          ],
          beats: [
            { caption: "也不知道他啥时候知道了「眼睛疼」！" },
          ],
        },
      ],
    },
  ],
};

export default story;
