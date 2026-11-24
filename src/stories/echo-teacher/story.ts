import type { Actor, SceneSpec, Story } from "../../story/types.ts";

/**
 * 2026-11-21 的真事：小念还不会说整句长话，只会重复最后几个字。
 * 在家重复爸爸妈妈，在幼儿园重复老师，逗得老师和大家哈哈大笑。
 */
const home: SceneSpec = { place: "living-room", time: "day" };
/** 没有幼儿园场景，用暖色纯色底当教室 */
const classRoom: SceneSpec = { place: "plain", tint: "#fff2d9" };
/** 幼儿园的小伙伴 */
const buddy = (who: "gege" | "jiejie", at: number, top: string, extra: Partial<Actor> = {}): Actor =>
  ({ who, at, top, pose: "stand", face: "laugh", ...extra });

const story: Story = {
  id: "echo-teacher",
  title: "学老师说话",
  blurb: "小念还不会说长句子，只会接最后几个字，逗得幼儿园里哈哈大笑。",
  when: { date: "2026-11-21", label: "学老师" },
  credits: { by: ["nian", "dad", "mom"] },
  cover: {
    scene: home,
    actors: [
      { who: "laoye", at: 0.34, pose: "sit", seat: "sofa", face: "laugh", facing: "right" },
      { who: "nian", at: 0.52, pose: "stand", face: "laugh", facing: "left" },
      { who: "mom", at: 0.66, pose: "stand", face: "happy", facing: "left" },
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
            { who: "laoye", at: 0.24, pose: "sit", seat: "sofa", face: "laugh", facing: "right" },
            { who: "mom", at: 0.72, pose: "stand", face: "happy", facing: "left" },
          ],
          beats: [
            { caption: "2026年11月21日，姥爷说起小念在幼儿园的笑话。" },
            { say: "laoye", text: "这孩子，学老师说话可逗了！" },
          ],
        },
        {
          scene: home,
          shot: "close",
          focus: "nian",
          actors: [{ who: "nian", at: 0.5, pose: "stand", face: "happy" }],
          beats: [
            { caption: "小念现在还说不了整句长话。" },
          ],
        },
        {
          scene: home,
          shot: "medium",
          actors: [
            { who: "dad", at: 0.3, pose: "point", face: "happy", facing: "right" },
            { who: "nian", at: 0.7, pose: "stand", face: "laugh", facing: "left" },
          ],
          beats: [
            { say: "dad", text: "我们去洗手吃饭啦。" },
            { say: "nian", text: "吃饭啦！" },
          ],
        },
      ],
    },
    {
      layout: "2-1",
      panels: [
        {
          scene: classRoom,
          shot: "wide",
          actors: [
            { who: "ayi", at: 0.28, pose: "point", face: "happy", facing: "right" },
            { who: "nian", at: 0.72, pose: "stand", face: "happy", facing: "left" },
          ],
          beats: [
            { caption: "在幼儿园，老师一说长句子——" },
            { say: "ayi", text: "小朋友们，把小手放好了。" },
          ],
        },
        {
          scene: classRoom,
          shot: "close",
          focus: "nian",
          actors: [{ who: "nian", at: 0.5, pose: "stand", face: "laugh" }],
          beats: [
            { say: "nian", text: "放好了！" },
          ],
        },
        {
          scene: classRoom,
          shot: "medium",
          actors: [{ who: "ayi", at: 0.5, pose: "stand", face: "surprised" }],
          beats: [
            { say: "ayi", text: "咦，你接上啦？" },
          ],
        },
      ],
    },
    {
      layout: "1-2-1",
      panels: [
        {
          scene: classRoom,
          shot: "wide",
          actors: [
            { who: "ayi", at: 0.22, pose: "stand", face: "laugh", facing: "right" },
            { who: "nian", at: 0.43, pose: "stand", face: "laugh" },
            { who: "gege", at: 0.65, top: "#5b7fa6", pose: "stand", face: "laugh", facing: "left" },
            { who: "jiejie", at: 0.82, pose: "stand", face: "laugh", facing: "left" },
          ],
          beats: [
            { caption: "老师笑了，小朋友们也笑了。" },
          ],
        },
        {
          scene: classRoom,
          shot: "close",
          focus: "ayi",
          actors: [{ who: "ayi", at: 0.5, pose: "stand", face: "laugh" }],
          beats: [
            { say: "ayi", text: "哈哈，这孩子真逗！" },
          ],
        },
        {
          scene: classRoom,
          shot: "medium",
          actors: [buddy("gege", 0.5, "#5b7fa6")],
          beats: [
            { say: "gege", text: "他只会学尾巴！" },
          ],
        },
        {
          scene: classRoom,
          shot: "wide",
          actors: [
            { who: "ayi", at: 0.24, pose: "cheer", face: "laugh", facing: "right" },
            { who: "nian", at: 0.46, pose: "cheer", face: "laugh" },
            { who: "gege", at: 0.68, top: "#5b7fa6", pose: "cheer", face: "laugh", facing: "left" },
            { who: "jiejie", at: 0.84, pose: "cheer", face: "laugh", facing: "left" },
          ],
          beats: [
            { caption: "一屋子人都笑成一片。" },
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
            { who: "laoye", at: 0.24, pose: "sit", seat: "sofa", face: "laugh", facing: "right" },
            { who: "dad", at: 0.54, pose: "stand", face: "laugh" },
            { who: "mom", at: 0.78, pose: "stand", face: "laugh", facing: "left" },
          ],
          beats: [
            { caption: "姥爷把这事讲给爸爸妈妈听。" },
            { say: "laoye", text: "在家也这样，你说啥他接啥。" },
          ],
        },
        {
          scene: home,
          shot: "medium",
          actors: [{ who: "dad", at: 0.5, pose: "stand", face: "laugh" }],
          beats: [
            { say: "dad", text: "小念学话可真有意思！" },
          ],
        },
        {
          scene: home,
          shot: "close",
          focus: "mom",
          actors: [{ who: "mom", at: 0.5, pose: "stand", face: "laugh" }],
          beats: [
            { say: "mom", text: "哈哈哈，太逗了！" },
          ],
        },
      ],
    },
  ],
};

export default story;
