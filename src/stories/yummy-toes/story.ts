import type { Prop, SceneSpec, Story, Thing } from "../../story/types.ts";

/**
 * 2025-01-10 的真事：五个月大的小念小手小脚越来越灵活，爱抓着脚丫玩。
 * 这天妈妈看见他把脚趾头塞进了嘴里，问他好不好吃，他呜呜地叫，一直咯咯笑。
 */
const room: SceneSpec = { place: "bedroom", time: "day" };
const close: SceneSpec = { place: "plain", tint: "#fff0f4" };
/** 躺在爬行垫上的小念 */
const onMat = (kick: Thing["kick"], giggle = false): Prop =>
  ({ thing: { kind: "baby", kick, giggle }, x: 0.46, size: 460, front: true });
/** 小念的特写 */
const closeUp = (kick: Thing["kick"], giggle = false): Prop =>
  ({ thing: { kind: "baby", kick, giggle }, x: 0.52, lift: 40, size: 900 });

const story: Story = {
  id: "yummy-toes",
  title: "小脚丫好吃吗",
  blurb: "五个月大的小念，竟然把自己的脚趾头塞进了小嘴里……",
  when: { date: "2025-01-10", label: "五个月大" },
  credits: { by: ["nian", "dad", "mom"] },
  cover: {
    scene: room,
    actors: [{ who: "mom", at: 0.17, pose: "crouch", face: "laugh", facing: "right" }],
    props: [onMat("toes")],
  },
  pages: [
    {
      layout: "1-2",
      panels: [
        {
          scene: room,
          shot: "wide",
          actors: [{ who: "mom", at: 0.18, pose: "crouch", face: "happy", facing: "right" }],
          props: [onMat("up", true)],
          beats: [
            { caption: "不知从什么时候起，小念的小手小脚越来越灵活了。" },
            { say: "mom", text: "小念，你在玩什么呀？" },
          ],
        },
        {
          scene: close,
          actors: [],
          props: [closeUp("grab")],
          beats: [
            { caption: "他最爱用小手抓着自己的小脚丫玩。" },
          ],
        },
        {
          scene: room,
          actors: [{ who: "mom", at: 0.5, pose: "stand", face: "happy" }],
          beats: [
            { say: "mom", text: "小手抓小脚，抓得真牢！" },
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
          actors: [{ who: "mom", at: 0.18, pose: "crouch", face: "surprised", facing: "right" }],
          props: [onMat("toes")],
          beats: [
            { caption: "2025年1月10日，妈妈看到了特别有意思的一幕——" },
          ],
        },
        {
          scene: close,
          actors: [],
          props: [closeUp("toes")],
          beats: [
            { caption: "小念竟然把脚趾头放进了小嘴里！" },
            { sfx: "吧唧" },
          ],
        },
        {
          scene: room,
          shot: "wide",
          actors: [{ who: "mom", at: 0.18, pose: "crouch", face: "laugh", facing: "right" }],
          props: [onMat("toes")],
          beats: [
            { say: "mom", text: "哈哈，小念，脚丫好吃吗？" },
          ],
        },
      ],
    },
    {
      layout: "2-1",
      panels: [
        {
          scene: close,
          actors: [],
          props: [closeUp("grab", true)],
          beats: [
            { caption: "小念「呜呜」地叫，啥也听不懂，" },
          ],
        },
        {
          scene: room,
          actors: [{ who: "mom", at: 0.5, pose: "stand", face: "laugh" }],
          beats: [
            { caption: "还一个劲儿地咯咯笑。" },
            { say: "mom", text: "哈哈哈，真是个小吃货！" },
          ],
        },
        {
          scene: room,
          shot: "wide",
          actors: [{ who: "mom", at: 0.18, pose: "crouch", face: "laugh", facing: "right" }],
          props: [onMat("up", true)],
          beats: [
            { caption: "原来，小脚丫是小念自己最好玩的玩具呀！" },
          ],
        },
      ],
    },
  ],
};

export default story;
