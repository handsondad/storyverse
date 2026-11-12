import type { Prop, SceneSpec, Story, Thing } from "../../story/types.ts";

/**
 * 2024-08-12 前后的真事：小念出生十来天，脐带快掉了。爸爸总把纸尿裤包得严严实实，
 * 捂住了肚脐，肚脐周围发了炎。妈妈细心发现，换了透气的纸尿裤，肚脐才长好。
 */
const room: SceneSpec = { place: "bedroom", time: "day" };
const close: SceneSpec = { place: "plain", tint: "#fff3e6" };
/** 躺在大床上的小念 */
const onBed = (diaper: Thing["diaper"], navel: Thing["navel"] = "stump"): Prop =>
  ({ thing: { kind: "baby", diaper, navel }, x: 0.814, lift: 200, size: 300 });
/** 小念的肚子特写 */
const closeUp = (diaper: Thing["diaper"], navel: Thing["navel"] = "stump"): Prop =>
  ({ thing: { kind: "baby", diaper, navel }, x: 0.5, lift: 100, size: 1000 });

const story: Story = {
  id: "belly-button",
  title: "小肚脐要透气",
  blurb: "爸爸把纸尿裤包得严严实实，小念的肚脐却红了……多亏妈妈细心！",
  when: { date: "2024-08-12", label: "出生第10天" },
  credits: { by: ["nian", "dad", "mom"] },
  cover: {
    scene: room,
    actors: [
      { who: "dad", at: 0.54, pose: "stand", face: "shy", facing: "right" },
      { who: "mom", at: 0.66, pose: "point", face: "happy", facing: "right" },
    ],
    props: [onBed("airy", "healed")],
  },
  pages: [
    {
      layout: "1-2",
      panels: [
        {
          scene: room,
          shot: "wide",
          actors: [
            { who: "dad", at: 0.42, pose: "stand", face: "happy", facing: "right" },
            { who: "mom", at: 0.6, pose: "point", face: "happy", facing: "right" },
          ],
          props: [onBed("low")],
          beats: [
            { caption: "小念出生十来天了，肚脐上的脐带快要掉了。" },
            { say: "mom", text: "这几天肚脐要保持干爽哦。" },
          ],
        },
        {
          scene: room,
          shot: "wide",
          actors: [{ who: "dad", at: 0.6, pose: "hold", face: "proud", facing: "right" }],
          props: [onBed("high")],
          beats: [
            { caption: "可爸爸每次换纸尿裤，都包得严严实实。" },
            { say: "dad", text: "包紧点，肚子不着凉！" },
          ],
        },
        {
          scene: close,
          shot: "wide",
          actors: [],
          props: [closeUp("high")],
          beats: [
            { caption: "纸尿裤的边，正好把小肚脐捂住了。" },
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
          actors: [{ who: "mom", at: 0.6, pose: "point", face: "confused", facing: "right" }],
          props: [onBed("low", "sore")],
          beats: [
            { caption: "这天妈妈换尿布，特意看了看肚脐。" },
            { say: "mom", text: "咦？这儿怎么红红的？" },
          ],
        },
        {
          scene: close,
          shot: "wide",
          actors: [],
          props: [closeUp("low", "sore")],
          beats: [
            { caption: "脐带连着肚脐的地方，红了一圈，有点发炎了！" },
          ],
        },
        {
          scene: room,
          actors: [
            { who: "dad", at: 0.36, pose: "stand", face: "scared", facing: "right" },
            { who: "mom", at: 0.64, pose: "point", face: "angry", facing: "left" },
          ],
          beats: [
            { say: "mom", text: "纸尿裤捂着肚脐，不透气呀！", kind: "shout" },
            { say: "dad", text: "啊？我一点都没发现……" },
          ],
        },
      ],
    },
    {
      layout: "1-2",
      panels: [
        {
          scene: { place: "burst", tint: "#ffd6d6" },
          actors: [{ who: "dad", at: 0.5, pose: "shrug", face: "scared" }],
          beats: [
            { caption: "差点闯了大祸！多亏妈妈发现得早。" },
            { say: "dad", text: "幸亏有妈妈！" },
          ],
        },
        {
          scene: close,
          shot: "wide",
          actors: [],
          props: [closeUp("airy", "sore")],
          beats: [
            { caption: "妈妈换上透气的纸尿裤，边往下折，露出肚脐。" },
          ],
        },
        {
          scene: room,
          actors: [
            { who: "mom", at: 0.36, pose: "point", face: "happy", facing: "right" },
            { who: "dad", at: 0.64, pose: "think", face: "thinking", facing: "left" },
          ],
          beats: [
            { say: "mom", text: "肚脐要透气，才长得好。" },
            { say: "dad", text: "原来这里面有学问！" },
          ],
        },
      ],
    },
    {
      layout: "1-1",
      panels: [
        {
          scene: room,
          shot: "wide",
          actors: [
            { who: "dad", at: 0.42, pose: "cheer", face: "laugh", facing: "right" },
            { who: "mom", at: 0.6, pose: "stand", face: "proud", facing: "right" },
          ],
          props: [onBed("airy", "healed")],
          beats: [
            { caption: "过了几天，脐带掉了，小念的肚脐长得好好的！" },
            { say: "mom", text: "干干净净，不红啦。" },
            { say: "dad", text: "太好啦！" },
          ],
        },
        {
          scene: room,
          actors: [
            { who: "dad", at: 0.36, pose: "hold", face: "shy", facing: "right", hold: "📖" },
            { who: "mom", at: 0.66, pose: "stand", face: "laugh", facing: "left" },
          ],
          beats: [
            { caption: "爸爸呀，真是缺少护理知识！哈哈！" },
            { say: "dad", text: "我得好好学学怎么照顾宝宝。" },
            { say: "mom", text: "先从换纸尿裤学起吧！" },
          ],
        },
      ],
    },
  ],
};

export default story;
