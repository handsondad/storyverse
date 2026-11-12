import type { SceneSpec, Story } from "../../story/types.ts";

/**
 * 2026-08-09 的真事：最近小念话可多了，爸爸妈妈说什么他就学什么。
 * 爸爸妈妈平时叫对方大名；一次妈妈让爸爸去冲奶，小念突然喊了爸爸的大名，让爸爸冲奶。
 * 从那以后他常常来一句爸爸的大名，妈妈每次都笑得合不拢嘴。
 * 不写真名：书里爸爸的大名一律写成「某某某」。
 */
const home: SceneSpec = { place: "living-room", time: "day" };

const story: Story = {
  id: "big-name",
  title: "小小复读机",
  blurb: "爸爸妈妈说啥小念学啥——这回，他喊起了爸爸的大名！",
  when: { date: "2026-08-09", label: "喊爸爸大名" },
  credits: { by: ["nian", "dad", "mom"] },
  cover: {
    scene: home,
    actors: [
      { who: "mom", at: 0.22, pose: "cheer", face: "laugh", facing: "right" },
      { who: "nian", at: 0.48, pose: "point", face: "proud", facing: "right" },
      { who: "dad", at: 0.76, pose: "hold", hold: "🍼", face: "surprised", facing: "left" },
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
            { who: "nian", at: 0.3, pose: "cheer", face: "happy", facing: "right" },
            { who: "mom", at: 0.72, pose: "wave", face: "happy", facing: "left" },
          ],
          beats: [
            { caption: "2026年8月9日，最近小念的话可多啦！" },
            { say: "mom", text: "吃饭啦！" },
            { say: "nian", text: "吃饭啦！" },
          ],
        },
        {
          scene: home,
          actors: [
            { who: "dad", at: 0.32, pose: "point", face: "happy", facing: "right" },
            { who: "nian", at: 0.72, pose: "point", face: "happy", facing: "left" },
          ],
          beats: [
            { say: "dad", text: "好嘞！" },
            { say: "nian", text: "好嘞！" },
          ],
        },
        {
          scene: { place: "burst", tint: "#ffe9a8" },
          shot: "close",
          actors: [{ who: "nian", at: 0.5, pose: "stand", face: "proud" }],
          beats: [
            { caption: "爸爸妈妈说啥，他就学啥，像个小复读机！" },
          ],
        },
      ],
    },
    {
      layout: "2-1",
      panels: [
        {
          scene: home,
          actors: [
            { who: "dad", at: 0.3, pose: "stand", face: "neutral", facing: "right" },
            { who: "mom", at: 0.7, pose: "point", face: "happy", facing: "left" },
          ],
          beats: [
            { caption: "爸爸妈妈平时，都叫对方的大名。" },
            { say: "mom", text: "某某某，给小念冲奶去！" },
          ],
        },
        {
          scene: { place: "plain", tint: "#fff0c2" },
          shot: "close",
          actors: [{ who: "nian", at: 0.5, pose: "stand", face: "thinking" }],
          beats: [
            { caption: "小念在旁边，听得可认真了。" },
          ],
        },
        {
          scene: home,
          shot: "wide",
          actors: [
            { who: "dad", at: 0.24, pose: "walk", face: "neutral", facing: "left" },
            { who: "nian", at: 0.62, pose: "point", face: "serious", facing: "left" },
            { who: "mom", at: 0.84, pose: "stand", face: "surprised", facing: "left" },
          ],
          beats: [
            { caption: "突然，小念喊了一声——" },
            { say: "nian", text: "某某某！冲奶！", kind: "shout" },
          ],
        },
      ],
    },
    {
      layout: "1-2",
      panels: [
        {
          scene: home,
          actors: [
            { who: "dad", at: 0.3, pose: "shrug", face: "confused", facing: "right" },
            { who: "mom", at: 0.7, pose: "stand", face: "laugh", facing: "left" },
          ],
          beats: [
            { caption: "爸爸没听清楚。" },
            { say: "dad", text: "啊？谁在叫我？" },
            { say: "mom", text: "是小念在叫你的大名！", kind: "whisper" },
          ],
        },
        {
          scene: { place: "plain", tint: "#e3f0ff" },
          shot: "close",
          actors: [{ who: "dad", at: 0.5, pose: "stand", face: "surprised" }],
          beats: [
            { say: "dad", text: "原来是让我冲奶呀！" },
          ],
        },
        {
          scene: home,
          actors: [
            { who: "dad", at: 0.3, pose: "hold", hold: "🍼", face: "laugh", facing: "right" },
            { who: "nian", at: 0.7, pose: "cheer", face: "happy", facing: "left" },
          ],
          beats: [
            { say: "dad", text: "好嘞，这就冲！" },
          ],
        },
      ],
    },
    {
      layout: "2-1",
      panels: [
        {
          scene: { place: "burst", tint: "#ffd6cc" },
          shot: "wide",
          actors: [{ who: "nian", at: 0.5, pose: "point", face: "proud" }],
          beats: [
            { caption: "从那以后，小念常常来一句爸爸的大名。" },
            { say: "nian", text: "某某某！", kind: "shout" },
          ],
        },
        {
          scene: { place: "plain", tint: "#e3f0ff" },
          shot: "close",
          actors: [{ who: "dad", at: 0.5, pose: "stand", face: "shy" }],
          beats: [
            { say: "dad", text: "哎……在呢！" },
          ],
        },
        {
          scene: home,
          shot: "wide",
          actors: [
            { who: "dad", at: 0.22, pose: "shrug", face: "shy", facing: "right" },
            { who: "nian", at: 0.48, pose: "cheer", face: "proud" },
            { who: "mom", at: 0.76, pose: "stand", face: "laugh", facing: "left" },
          ],
          beats: [
            { caption: "每次，妈妈都笑得合不拢嘴！" },
            { sfx: "哈哈哈！" },
          ],
        },
      ],
    },
  ],
};

export default story;
