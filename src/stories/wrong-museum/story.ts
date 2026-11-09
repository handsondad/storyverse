import type { Story } from "../../story/types.ts";

/**
 * 真实经历改写：2026-06-01 六一，妈妈把「工艺美术馆」看成「美术馆」，
 * 一家先去了中国美术馆，再坐八号线赶回工艺美术馆。
 */
const story: Story = {
  id: "wrong-museum",
  title: "走错美术馆",
  blurb: "六一要去工艺美术馆，妈妈扫一眼通知，却带到了另一个馆。",
  when: { date: "2026-06-01", label: "六一儿童节" },
  credits: {
    by: ["nian", "dad", "mom"],
  },
  cover: {
    scene: { place: "subway", time: "morning" },
    actors: [
      { who: "nian", at: "center", pose: "run", face: "surprised" },
      { who: "mom", at: "left", pose: "run", face: "scared" },
      { who: "dad", at: "right", pose: "run", face: "confused" },
    ],
    props: [{ emoji: "📱", x: 0.22, lift: 220, size: 80 }],
  },
  pages: [
    {
      layout: "1-2",
      panels: [
        {
          scene: { place: "living-room", time: "morning" },
          shot: "wide",
          actors: [
            { who: "nian", at: "left", pose: "cheer", face: "happy" },
            { who: "mom", at: "center", pose: "hold", face: "happy", hold: "📱" },
            { who: "dad", at: "right", pose: "wave", face: "happy" },
          ],
          beats: [
            { caption: "六一儿童节，妈妈公司有活动。" },
            { say: "mom", text: "走，去美术馆玩！" },
            { say: "nian", text: "太好啦！", kind: "shout" },
          ],
        },
        {
          scene: { place: "living-room", time: "morning" },
          shot: "medium",
          focus: "mom",
          actors: [{ who: "mom", at: "center", pose: "think", face: "thinking", hold: "📱" }],
          beats: [
            { caption: "妈妈扫了一眼通知。" },
            { say: "mom", text: "美术馆？就去那儿！", kind: "thought" },
          ],
        },
        {
          scene: { place: "park", time: "morning" },
          shot: "medium",
          actors: [
            { who: "nian", at: "center", pose: "walk", face: "happy" },
            { who: "dad", at: "left", pose: "walk", face: "proud" },
            { who: "mom", at: "right", pose: "walk", face: "happy" },
          ],
          beats: [
            { caption: "一家人出门，信心满满。" },
            { say: "dad", text: "今天一定很好玩。" },
          ],
        },
      ],
    },
    {
      layout: "2-1",
      panels: [
        {
          scene: { place: "museum", time: "morning", tint: "#eef2f6" },
          shot: "wide",
          actors: [
            { who: "nian", at: "center", pose: "jump", face: "happy" },
            { who: "dad", at: "left", pose: "point", face: "proud" },
            { who: "mom", at: "right", pose: "cheer", face: "happy" },
          ],
          props: [{ emoji: "🏛️", x: 0.5, lift: 520, size: 120 }],
          beats: [
            { caption: "中国美术馆——到了！" },
            { say: "nian", text: "我们到啦！", kind: "shout" },
          ],
        },
        {
          scene: { place: "museum", time: "morning", tint: "#eef2f6" },
          shot: "medium",
          actors: [
            { who: "mom", at: "left", pose: "think", face: "confused", hold: "📱" },
            { who: "dad", at: "right", pose: "stand", face: "confused" },
          ],
          beats: [
            { say: "mom", text: "不对啊……" },
            { say: "dad", text: "怎么了？" },
          ],
        },
        {
          scene: { place: "burst", tint: "#ffb4a2" },
          shot: "medium",
          actors: [
            { who: "mom", at: "center", pose: "shrug", face: "scared" },
            { who: "nian", at: "left", pose: "stand", face: "surprised" },
            { who: "dad", at: "right", pose: "stand", face: "surprised" },
          ],
          beats: [
            { caption: "通知写的是「工艺」美术馆！" },
            { say: "mom", text: "糟糕，走错了！", kind: "shout" },
            { say: "nian", text: "啊？！", kind: "shout" },
          ],
        },
      ],
    },
    {
      layout: "1-1-1",
      panels: [
        {
          scene: { place: "park", time: "morning" },
          shot: "wide",
          actors: [
            { who: "nian", at: "center", pose: "run", face: "scared" },
            { who: "mom", at: "left", pose: "run", face: "scared" },
            { who: "dad", at: "right", pose: "run", face: "surprised" },
          ],
          beats: [
            { caption: "改坐八号线，火急火燎往回赶！" },
            { say: "dad", text: "快跑！", kind: "shout" },
            { sfx: "噔噔噔！", color: "#ff9f43" },
          ],
        },
        {
          scene: { place: "subway", time: "morning" },
          shot: "medium",
          actors: [
            { who: "nian", at: "left", pose: "sit", face: "scared" },
            { who: "mom", at: "center", pose: "sit", face: "shy" },
            { who: "dad", at: "right", pose: "sit", face: "thinking" },
          ],
          beats: [
            { say: "mom", text: "幸好都在八号线。" },
            { say: "nian", text: "心都要跳出来了！" },
          ],
        },
        {
          scene: { place: "subway", time: "morning" },
          shot: "medium",
          actors: [
            { who: "dad", at: "left", pose: "think", face: "thinking" },
            { who: "mom", at: "right", pose: "stand", face: "shy" },
          ],
          beats: [
            { say: "dad", text: "家离对的馆很近……" },
            { say: "mom", text: "我们却跑更远了。" },
          ],
        },
      ],
    },
    {
      // 通栏三格：窄格并排两人时镜头会裁掉边上的人，妈妈说过话却出画
      layout: "1-1-1",
      panels: [
        {
          scene: { place: "museum", time: "day", tint: "#f3e6d4" },
          shot: "wide",
          actors: [
            { who: "nian", at: "center", pose: "cheer", face: "happy" },
            { who: "dad", at: "left", pose: "wave", face: "happy" },
            { who: "mom", at: "right", pose: "shrug", face: "shy" },
          ],
          props: [{ emoji: "🎨", x: 0.62, lift: 420, size: 100 }],
          beats: [
            { caption: "终于到了！工艺美术馆——活动还没结束。" },
            { say: "nian", text: "赶上了！", kind: "shout" },
            { sfx: "呼——", color: "#7cc4ff" },
          ],
        },
        {
          scene: { place: "museum", time: "day", tint: "#f3e6d4" },
          shot: "medium",
          focus: "mom",
          actors: [
            { who: "mom", at: 0.4, pose: "think", face: "shy" },
            { who: "dad", at: 0.6, pose: "shrug", face: "laugh" },
          ],
          beats: [
            { say: "mom", text: "下次我一定看仔细！" },
            { say: "dad", text: "这一上午太狼狈了。" },
          ],
        },
        {
          scene: { place: "burst", tint: "#ffd166" },
          shot: "wide",
          actors: [
            { who: "nian", at: "center", pose: "jump", face: "laugh" },
            { who: "mom", at: "left", pose: "cheer", face: "laugh" },
            { who: "dad", at: "right", pose: "cheer", face: "laugh" },
          ],
          beats: [
            { say: "nian", text: "可是好好笑！", kind: "shout" },
            { caption: "走了好多冤枉路，却留下好笑的六一。" },
          ],
        },
      ],
    },
  ],
};

export default story;
