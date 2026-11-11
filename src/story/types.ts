/**
 * 一个故事 = 一份数据。agent 只写这份数据，画面由引擎按数据画出来。
 *
 * 舞台坐标：每一格里都是一个 1600×1000 的舞台，地面在 y = 880，角色脚踩地面。
 * 镜头（shot）决定这一格从舞台里框出哪一块，所以同一个站位，远景、中景、特写都能用。
 */
import type { SeatKind } from "../cast/chair.ts";
import type { CharacterId, CreatorId } from "../cast/characters.ts";
import type { LayoutId } from "../engine/layout.ts";
import type { BubbleKind, Expression, Place, Pose, Shot, Slot, ThingKind, TimeOfDay, Weather } from "./vocab.ts";

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
  /** 坐在椅子上（配 pose: "sit" 或 "push"）：chair 大人的椅子，high-chair 小孩的高脚餐椅 */
  readonly seat?: SeatKind;
  /** 连人带椅子往后翘多少度：15～30 是前腿翘起来，80 左右是整个倒在地上 */
  readonly tip?: number;
};

/** 表情符号里没有的东西，由引擎画出来 */
export type Thing = {
  /** pillow 乳胶枕；baby 裹在襁褓里的小宝宝；band 宝宝手腕上的腕带（特写） */
  readonly kind: ThingKind;
  /** 枕头鼓起来多少：0 扁扁的，1 是它本来该有的样子 */
  readonly puff?: number;
  /** 枕头还装在密封袋里 */
  readonly sealed?: boolean;
  /** 枕头袋子上的小标签，或者腕带上写的字 */
  readonly label?: string;
};

/** 舞台上的道具：一个表情符号，或者一个画出来的东西（emoji 和 thing 写一个） */
export type Prop = {
  readonly emoji?: string;
  readonly thing?: Thing;
  /** 横向位置 0～1 */
  readonly x: number;
  /** 离地多高（舞台单位），默认 0 就是放在地上 */
  readonly lift?: number;
  /** 多大（舞台单位），默认 90 */
  readonly size?: number;
  /** 发光，用在有魔法的东西上 */
  readonly glow?: string;
  /** 画在人前面：拿在手里、抱在怀里的东西 */
  readonly front?: boolean;
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
  /** 一张饭桌，画在人前面；from / to 是左右两头的位置（0～1） */
  readonly table?: { readonly from: number; readonly to: number };
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
   * 一起编故事的人：只能是小念 / 爸爸 / 妈妈。他们既是故事里的人，也是创作者。
   * 姥爷这样的角色可以出场，但不署名；不要写家里人的真名。
   */
  readonly by: readonly CreatorId[];
  readonly note?: string;
};

export type Story = {
  /** 和目录名一样，小写字母和短横线 */
  readonly id: string;
  readonly title: string;
  /** 一句话介绍，显示在书架上 */
  readonly blurb: string;
  /** 故事发生在哪天；编出来的故事写第一次讲它的那天。首页的时间绳按这个排 */
  readonly when: {
    /** YYYY-MM-DD */
    readonly date: string;
    /** 那天是什么日子，比如「六一儿童节」，≤8 个字 */
    readonly label?: string;
  };
  readonly credits: Credits;
  /** 封面画面：一个舞台，只有画，没有气泡 */
  readonly cover: Omit<Panel, "beats" | "shot">;
  readonly pages: readonly Page[];
};
