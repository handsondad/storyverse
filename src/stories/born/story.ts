import type { Actor, Prop, SceneSpec, Story } from "../../story/types.ts";

/**
 * 2024-08-02 小念出生那天的真事：护士推妈妈出产房，让爸爸念宝宝腕带上的信息核对，
 * 腕带上明明是 16:04，爸爸激动得念成了 14:02。
 */
const hall: SceneSpec = { place: "hospital", time: "day" };
/** 半躺在推床上的妈妈；宝宝要配 baby() 一起放 */
const mom = (at: number, facing: "left" | "right", more: Partial<Actor> = {}): Actor =>
  ({ who: "mom", at, pose: "recline", seat: "bed", face: "happy", facing, ...more });
/** 妈妈怀里的宝宝：mom 站在 at，宝宝在她胸口前面 */
const baby = (at: number, facing: "left" | "right"): Prop =>
  ({ thing: { kind: "baby" }, x: at + (facing === "right" ? -20 : 20) / 1400, lift: 290, size: 180, front: true });

const story: Story = {
  id: "born",
  title: "爸爸读错了时间",
  blurb: "小念出生那天，爸爸念腕带上的时间，一激动念错了……",
  when: { date: "2024-08-02", label: "小念出生" },
  credits: { by: ["nian", "dad", "mom"] },
  cover: {
    scene: hall,
    actors: [
      mom(0.46, "right"),
      { who: "dad", at: 0.64, pose: "shrug", face: "shy", facing: "left" },
    ],
    props: [baby(0.46, "right")],
  },
  pages: [
    {
      layout: "1-2",
      panels: [
        {
          scene: hall,
          shot: "wide",
          actors: [{ who: "dad", at: 0.5, pose: "walk", face: "thinking", facing: "right" }],
          beats: [
            { caption: "2024年8月2日，爸爸在产房门口等呀等。" },
            { say: "dad", text: "怎么还不出来呀？" },
          ],
        },
        {
          scene: hall,
          shot: "wide",
          actors: [
            mom(0.36, "left"),
            { who: "ayi", outfit: "nurse", at: 0.6, pose: "hug", face: "happy", facing: "left" },
          ],
          props: [baby(0.36, "left")],
          beats: [
            { caption: "门开了，护士阿姨推着妈妈和宝宝出来了。" },
            { say: "ayi", text: "妈妈和宝宝都很好！" },
          ],
        },
        {
          scene: { place: "burst", tint: "#ffe28a" },
          actors: [{ who: "dad", at: 0.5, pose: "cheer", face: "laugh" }],
          beats: [
            { say: "dad", text: "太好啦，我当爸爸啦！", kind: "shout" },
          ],
        },
      ],
    },
    {
      layout: "1-2",
      panels: [
        {
          scene: hall,
          shot: "wide",
          actors: [
            { who: "dad", at: 0.16, pose: "stand", face: "happy", facing: "right" },
            mom(0.44, "right"),
            { who: "ayi", outfit: "nurse", at: 0.8, pose: "hold", face: "neutral", facing: "left", hold: "📋" },
          ],
          props: [baby(0.44, "right")],
          beats: [
            { caption: "护士阿姨要和爸爸核对宝宝腕带上的信息。" },
            { say: "ayi", text: "来，您念一下腕带。" },
          ],
        },
        {
          scene: { place: "plain", tint: "#dff1fb" },
          shot: "wide",
          actors: [],
          props: [{ thing: { kind: "band", label: "男 16:04" }, x: 0.5, lift: 110, size: 900 }],
          beats: [
            { caption: "腕带上写着：男，16:04。" },
          ],
        },
        {
          scene: hall,
          actors: [
            { who: "dad", at: 0.34, pose: "stand", face: "proud", facing: "right" },
            { who: "ayi", outfit: "nurse", at: 0.68, pose: "stand", face: "surprised", facing: "left" },
          ],
          beats: [
            { say: "dad", text: "男孩，14点02分！" },
            { say: "ayi", text: "啊？什么情况？", kind: "shout" },
          ],
        },
      ],
    },
    {
      layout: "2-1",
      panels: [
        {
          scene: hall,
          actors: [{ who: "dad", at: 0.5, pose: "stand", face: "surprised" }],
          beats: [
            { caption: "爸爸赶紧凑近，认认真真又看了一遍。" },
            { say: "dad", text: "哦……是16点04分！" },
          ],
        },
        {
          scene: hall,
          shot: "close",
          actors: [{ who: "dad", at: 0.5, pose: "shrug", face: "shy" }],
          beats: [
            { say: "dad", text: "太激动，连时间都不认识了！" },
          ],
        },
        {
          scene: hall,
          shot: "wide",
          actors: [
            { who: "dad", at: 0.16, pose: "shrug", face: "shy", facing: "right" },
            mom(0.44, "right", { face: "laugh" }),
            { who: "ayi", outfit: "nurse", at: 0.8, pose: "stand", face: "laugh", facing: "left" },
          ],
          props: [baby(0.44, "right")],
          beats: [
            { caption: "护士阿姨和妈妈都哈哈大笑起来。" },
            { sfx: "哈哈哈" },
          ],
        },
      ],
    },
    {
      layout: "1-1",
      panels: [
        {
          scene: hall,
          shot: "wide",
          actors: [
            mom(0.4, "right"),
            { who: "dad", at: 0.7, pose: "hug", face: "happy", facing: "left" },
          ],
          props: [baby(0.4, "right")],
          beats: [
            { caption: "就这样，16点04分，小念来到了我们家。" },
            { say: "dad", text: "欢迎你，小念！" },
          ],
        },
        {
          scene: { place: "living-room", time: "day" },
          actors: [
            { who: "dad", at: 0.32, pose: "shrug", face: "shy", facing: "right" },
            { who: "nian", at: 0.66, pose: "point", face: "laugh", facing: "left" },
          ],
          beats: [
            { caption: "现在说起这件事，小念还会笑个不停。" },
            { say: "nian", text: "爸爸，我是16点04分！" },
            { say: "dad", text: "记住啦，记住啦！" },
          ],
        },
      ],
    },
  ],
};

export default story;
