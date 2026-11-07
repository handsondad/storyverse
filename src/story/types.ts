/**
 * 一个故事 = 一份数据。agent 只写这份数据，画面由引擎按数据画出来。
 *
 * 舞台坐标：每一格里都是一个 1600×1000 的舞台，地面在 y = 880，角色脚踩地面。
 * 镜头（shot）决定这一格从舞台里框出哪一块，所以同一个站位，远景、中景、特写都能用。
 */
import type { CharacterId } from "../cast/characters.ts";
import type { LayoutId } from "../engine/layout.ts";
import type { BubbleKind, Expression, Place, Pose, Shot, Slot, TimeOfDay, Weather } from "./vocab.ts";

export type Actor = {
  readonly who: CharacterId;
  /** 站在哪儿：left / center / right，或 0～1 */
  readonly at: Slot | number;
  readonly pose?: Pose;
  readonly face?: Expression;
  /** 朝哪边，默认朝舞台中间 */
  readonly facing?: "left" | "right";
  /** 手里拿的东西，一个表情符号，比如 "☂️"；配 pose: "hold" 最自然 */
  readonly hold?: string;
};

/** 舞台上的道具：一个表情符号 */
export type Prop = {
  readonly emoji: string;
  /** 横向位置 0～1 */
  readonly x: number;
  /** 离地多高（舞台单位），默认 0 就是放在地上 */
  readonly lift?: number;
  /** 多大（舞台单位），默认 90 */
  readonly size?: number;
  /** 发光，用在有魔法的东西上 */
  readonly glow?: string;
};

/**
 * 一格里按顺序发生的事。翻页看时全都显示；动态漫画里一个一个出现，配音按这个顺序读。
 */
export type Beat =
  /** 旁白框，放在格子左上角 */
  | { readonly caption: string }
  /** 角色说话 */
  | { readonly say: CharacterId; readonly text: string; readonly kind?: BubbleKind }
  /** 拟声字：砰！哗啦！at 是在格子里的位置（0～1），默认右上 */
  | { readonly sfx: string; readonly at?: readonly [number, number]; readonly color?: string };

export type SceneSpec = {
  readonly place: Place;
  readonly time?: TimeOfDay;
  readonly weather?: Weather;
  /** plain / burst 用的底色 */
  readonly tint?: string;
};

export type Panel = {
  readonly scene: SceneSpec;
  readonly shot?: Shot;
  /** 特写对准谁；不写就对准第一个说话的人 */
  readonly focus?: CharacterId;
  readonly actors: readonly Actor[];
  readonly props?: readonly Prop[];
  readonly beats: readonly Beat[];
};

export type Page = {
  readonly layout: LayoutId;
  readonly panels: readonly Panel[];
};

export type Credits = {
  /**
   * 一起编故事的人：只能是固定角色（小念 / 爸爸 / 妈妈）。
   * 他们既是故事里的人，也是创作者；不要写家里其他人的名字。
   */
  readonly by: readonly CharacterId[];
  /** 完成日期，YYYY-MM-DD */
  readonly date: string;
  readonly note?: string;
};

export type Story = {
  /** 和目录名一样，小写字母和短横线 */
  readonly id: string;
  readonly title: string;
  /** 一句话介绍，显示在书架上 */
  readonly blurb: string;
  readonly credits: Credits;
  /** 封面画面：一个舞台，只有画，没有气泡 */
  readonly cover: Omit<Panel, "beats" | "shot">;
  readonly pages: readonly Page[];
};
