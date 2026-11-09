import type { Story } from "../../story/types.ts";

/**
 * 样板故事：把旧书「会发光的小雨鞋」改写成小念、爸爸、妈妈一起出门找彩虹。
 * 用来验证角色、背景、版式、气泡整条链路都能跑通。
 */
const story: Story = {
  id: "glowing-boots",
  title: "会发光的小雨鞋",
  blurb: "门口出现一双会发光的雨鞋，小念和爸爸妈妈一起去找彩虹。",
  when: { date: "2026-04-22" },
  credits: {
    by: ["nian", "dad", "mom"],
    date: "2026-11-07",
  },
  cover: {
    scene: { place: "park", time: "morning", weather: "rain" },
    actors: [
      { who: "nian", at: "center", pose: "cheer", face: "happy" },
      { who: "dad", at: "left", pose: "wave", face: "happy" },
      { who: "mom", at: "right", pose: "wave", face: "laugh" },
    ],
    props: [
      { emoji: "🌈", x: 0.78, lift: 480, size: 160 },
      { emoji: "👢", x: 0.5, lift: 20, size: 100, glow: "#7cc4ff" },
    ],
  },
  pages: [
    {
      layout: "1-2",
      panels: [
        {
          scene: { place: "living-room", time: "morning", weather: "rain" },
          shot: "wide",
          actors: [
            { who: "nian", at: "left", pose: "crouch", face: "surprised" },
            { who: "mom", at: "right", pose: "stand", face: "happy" },
          ],
          props: [{ emoji: "👢", x: 0.48, glow: "#7cc4ff", size: 110 }],
          beats: [
            { caption: "清晨，门口发现了一双会发光的小雨鞋。" },
            { say: "nian", text: "咦？它们在发光！", kind: "shout" },
            { say: "mom", text: "好像在对我们眨眼睛呢。" },
          ],
        },
        {
          scene: { place: "living-room", time: "morning" },
          shot: "medium",
          actors: [
            { who: "nian", at: "left", pose: "hold", face: "surprised", hold: "👢" },
            { who: "dad", at: "right", pose: "think", face: "thinking" },
          ],
          beats: [
            { say: "nian", text: "雨鞋说——今天要去找彩虹！" },
            { say: "dad", text: "那我们一起去，好不好？" },
          ],
        },
        {
          scene: { place: "park", time: "morning", weather: "rain" },
          shot: "wide",
          actors: [
            { who: "nian", at: "center", pose: "run", face: "happy", hold: "🎒" },
            { who: "mom", at: "left", pose: "walk", face: "happy" },
            { who: "dad", at: "right", pose: "walk", face: "proud" },
          ],
          beats: [
            { caption: "一家人背上小书包，蹦蹦跳跳地出发了。" },
            { sfx: "嗒嗒嗒！" },
          ],
        },
      ],
    },
    {
      layout: "2-1",
      panels: [
        {
          scene: { place: "park", time: "day" },
          shot: "medium",
          actors: [
            { who: "nian", at: "left", pose: "crouch", face: "surprised" },
            { who: "mom", at: "right", pose: "point", face: "happy" },
          ],
          props: [{ emoji: "💧", x: 0.35, lift: 20, size: 70 }],
          beats: [
            { caption: "第一站：森林边的小溪。" },
            { say: "mom", text: "水面像一条会唱歌的银丝带。" },
            { say: "nian", text: "雨鞋亮起了蓝色的光！", kind: "shout" },
            { sfx: "叮！", color: "#7cc4ff" },
          ],
        },
        {
          scene: { place: "park", time: "day" },
          shot: "close",
          focus: "nian",
          actors: [{ who: "nian", at: "center", pose: "hold", face: "happy", hold: "💧" }],
          beats: [
            { say: "nian", text: "小鱼送给我一颗圆圆的水珠。" },
          ],
        },
        {
          scene: { place: "park", time: "day" },
          shot: "wide",
          actors: [
            { who: "nian", at: "center", pose: "run", face: "laugh" },
            { who: "dad", at: "left", pose: "wave", face: "happy" },
            { who: "mom", at: "right", pose: "cheer", face: "happy" },
          ],
          props: [
            { emoji: "💨", x: 0.4, lift: 420, size: 90 },
            { emoji: "🌼", x: 0.62, lift: 380, size: 80 },
            { emoji: "🌼", x: 0.9, lift: 200, size: 70 },
          ],
          beats: [
            { caption: "第二站：风车山坡，蒲公英满天飞。" },
            { say: "nian", text: "绿色的光！薄荷叶也来了！" },
            { say: "dad", text: "小心脚下，别摔着。" },
          ],
        },
      ],
    },
    {
      layout: "1-1-1",
      panels: [
        {
          scene: { place: "park", time: "evening", weather: "rain" },
          shot: "wide",
          actors: [
            { who: "nian", at: "center", pose: "stand", face: "surprised", hold: "🪶" },
            { who: "mom", at: "left", pose: "stand", face: "happy" },
            { who: "dad", at: "right", pose: "point", face: "proud" },
          ],
          props: [{ emoji: "🌈", x: 0.62, lift: 520, size: 140 }],
          beats: [
            { caption: "第三站：云朵田野，天空低低的。" },
            { say: "dad", text: "看！彩虹出来了！" },
            { say: "nian", text: "雨鞋亮起了金色的光！", kind: "shout" },
            { sfx: "叮！", color: "#ffd166" },
          ],
        },
        {
          scene: { place: "park", time: "evening" },
          shot: "medium",
          actors: [
            { who: "nian", at: "center", pose: "hold", face: "thinking", hold: "✨" },
            { who: "mom", at: "left", pose: "hug", face: "happy" },
            { who: "dad", at: "right", pose: "stand", face: "happy" },
          ],
          beats: [
            { caption: "水珠、薄荷叶和羽毛放在掌心。" },
            { say: "nian", text: "我希望……大家天天开心！", kind: "thought" },
            { say: "mom", text: "愿望听到了。" },
          ],
        },
        {
          scene: { place: "bedroom", time: "night" },
          shot: "medium",
          actors: [
            { who: "nian", at: "center", pose: "sit", face: "sleepy" },
            { who: "dad", at: "left", pose: "sit", face: "happy" },
            { who: "mom", at: "right", pose: "sit", face: "happy" },
          ],
          props: [{ emoji: "👢", x: 0.82, lift: 40, size: 90, glow: "#ffd166" }],
          beats: [
            { caption: "晚上，雨鞋安静地放在床边。" },
            { say: "nian", text: "明天……还去找彩虹吗？", kind: "whisper" },
            { say: "dad", text: "只要你想去，我们都陪你。" },
            { say: "mom", text: "晚安，小念。" },
          ],
        },
      ],
    },
  ],
};

export default story;
