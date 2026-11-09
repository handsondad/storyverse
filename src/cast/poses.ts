import type { Pose } from "../story/vocab.ts";

export type Hand = "mitten" | "open" | "point";

/**
 * 一个姿势 = 每个关节转多少度。都按面朝右设计。
 *
 * 胳膊、腿写成 [根部角度, 中间关节再转多少]，单位是度：
 * 0 是笔直朝下，正数往身体外侧抬（90 是平举，180 是举过头顶），负数往身体里面收。
 * L 是画面左边那只（离镜头远，画在身体后面），R 是画面右边那只（画在身体前面）。
 * 面朝右时，往前伸就是 R 往外抬、L 往里收。
 */
export type PoseAngles = {
  readonly armL: readonly [number, number];
  readonly armR: readonly [number, number];
  readonly legL: readonly [number, number];
  readonly legR: readonly [number, number];
  /** 上半身往前倾多少度 */
  readonly lean?: number;
  /** 头再歪多少度 */
  readonly tilt?: number;
  /** 离地多高（跳起来），按身高的比例 */
  readonly lift?: number;
  readonly handL?: Hand;
  readonly handR?: Hand;
  /** 屁股下面画一张小凳子 */
  readonly seat?: boolean;
  /** 大腿朝前时看起来短一点 */
  readonly thighScale?: number;
};

const legs = { legL: [4, 0], legR: [4, 0] } as const;

export const POSE_ANGLES: Record<Pose, PoseAngles> = {
  stand: { armL: [10, -6], armR: [10, -6], ...legs },
  wave: { armL: [10, -6], armR: [128, 38], ...legs, tilt: 6, handR: "open" },
  point: { armL: [10, -6], armR: [86, 0], ...legs, lean: 4, handR: "point" },
  cheer: { armL: [148, 12], armR: [148, 12], legL: [12, 0], legR: [12, 0], lift: 0.03, handL: "open", handR: "open" },
  jump: { armL: [140, 20], armR: [140, 20], legL: [22, -46], legR: [22, -46], lift: 0.14, handL: "open", handR: "open" },
  think: { armL: [-20, -70], armR: [6, -166], ...legs, tilt: 8 },
  walk: { armL: [20, -10], armR: [24, -26], legL: [12, 22], legR: [18, -8], lean: 3 },
  run: { armL: [48, 34], armR: [58, -84], legL: [34, 54], legR: [48, -64], lean: 12, lift: 0.03 },
  sit: { armL: [-22, -38], armR: [22, -48], legL: [-76, 76], legR: [76, -76], seat: true, thighScale: 0.82 },
  push: { armL: [-60, -20], armR: [62, 14], legL: [-84, 0], legR: [86, 0], lean: -14, tilt: -4, thighScale: 0.9 },
  crouch: { armL: [34, -56], armR: [38, -60], legL: [58, -96], legR: [58, -96], lean: 10 },
  shrug: { armL: [38, 78], armR: [38, 78], ...legs, tilt: -8, handL: "open", handR: "open" },
  hug: { armL: [-72, 4], armR: [76, -4], ...legs, lean: 6, handL: "open", handR: "open" },
  hold: { armL: [-14, -62], armR: [14, -96], ...legs },
};
