import type { Prop, SceneSpec, Story, Thing } from "../../story/types.ts";

/**
 * 2024-10-02 的真事：两个月大的小念躺着最爱蹬脚丫。爸爸抛来一个小球，正好落在他脚上，
 * 小球跟着脚丫转过来转过去，就是不掉。爸爸说小念有踢足球的天赋。
 */
const room: SceneSpec = { place: "living-room", time: "day" };
const close: SceneSpec = { place: "plain", tint: "#e8f6ff" };
/** 躺在爬行垫上的小念 */
const onMat = (kick: Thing["kick"], ball = false): Prop =>
  ({ thing: { kind: "baby", kick, ball }, x: 0.46, size: 460, front: true });
/** 小念蹬腿的特写 */
const closeUp = (kick: Thing["kick"], ball = false): Prop =>
  ({ thing: { kind: "baby", kick, ball }, x: 0.47, lift: 40, size: 900 });

const story: Story = {
  id: "kick-ball",
  title: "小脚丫会转球",
  blurb: "两个月大的小念躺着蹬脚丫，爸爸抛来的小球，在他脚上转个不停……",
  when: { date: "2024-10-02", label: "两个月大" },
  credits: { by: ["nian", "dad", "mom"] },
  cover: {
    scene: room,
    actors: [{ who: "dad", at: 0.2, pose: "cheer", face: "laugh", facing: "right" }],
    props: [onMat("right", true)],
  },
  pages: [
    {
      layout: "1-2",
      panels: [
        {
          scene: room,
          shot: "wide",
          actors: [{ who: "dad", at: 0.16, pose: "crouch", face: "happy", facing: "right" }],
          props: [onMat("up")],
          beats: [
            { caption: "2024年10月2日，小念两个月大，还只会躺着玩。" },
            { say: "dad", text: "小念又在做运动啦！" },
          ],
        },
        {
          scene: close,
          actors: [],
          props: [closeUp("left")],
          beats: [
            { caption: "他最爱的运动，就是躺着蹬脚丫：蹬！蹬！" },
          ],
        },
        {
          scene: room,
          actors: [{ who: "dad", at: 0.5, pose: "hold", face: "happy", facing: "right" }],
          props: [{ thing: { kind: "ball" }, x: 0.5 + 70 / 1400, lift: 300, size: 80, front: true }],
          beats: [
            { say: "dad", text: "小念，给你个小球玩！" },
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
          actors: [{ who: "dad", at: 0.16, pose: "crouch", face: "happy", facing: "right" }],
          props: [onMat("up"), { thing: { kind: "ball" }, x: 0.32, lift: 330, size: 60 }],
          beats: [
            { caption: "爸爸轻轻一抛……" },
          ],
        },
        {
          scene: close,
          actors: [],
          props: [closeUp("up", true)],
          beats: [
            { caption: "正好落在小念蹬起来的脚丫上！" },
          ],
        },
        {
          scene: room,
          shot: "wide",
          actors: [{ who: "dad", at: 0.16, pose: "crouch", face: "surprised", facing: "right" }],
          props: [onMat("right", true)],
          beats: [
            { caption: "小念接着蹬，小球跟着转过来、转过去。" },
            { sfx: "咕噜噜" },
          ],
        },
      ],
    },
    {
      layout: "1-2",
      panels: [
        {
          scene: close,
          actors: [],
          props: [closeUp("left", true)],
          beats: [
            { caption: "转了一圈又一圈，小球就是不掉下来！" },
          ],
        },
        {
          scene: room,
          actors: [{ who: "dad", at: 0.5, pose: "stand", face: "surprised" }],
          beats: [
            { say: "dad", text: "哇！球像粘在他脚上一样！" },
          ],
        },
        {
          scene: { place: "burst", tint: "#c9f0d6" },
          actors: [{ who: "dad", at: 0.5, pose: "cheer", face: "proud" }],
          beats: [
            { say: "dad", text: "小念有踢足球的天赋呀！", kind: "shout" },
          ],
        },
      ],
    },
    {
      layout: "1",
      panels: [
        {
          scene: room,
          shot: "wide",
          actors: [{ who: "dad", at: 0.24, pose: "crouch", face: "laugh", facing: "right" }],
          props: [onMat("up", true)],
          beats: [
            { caption: "两个月大的小念，已经会用小脚丫「转球」啦！" },
            { say: "dad", text: "将来说不定是个足球小将！" },
          ],
        },
      ],
    },
  ],
};

export default story;
