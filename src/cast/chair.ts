/**
 * 椅子和往后翘：画图（Figure）和排版（stage）都用这里算出来的同一套数，
 * 这样椅子翘起来、倒下去时，气泡和镜头还能找到脸。
 * 坐标和骨架一样：面朝右，脚底在 y = 0；面朝左时由外面整体翻转。
 */
import { POSE_ANGLES } from "./poses.ts";
import { rotate, solve, type Pt, type Skeleton } from "./rig.ts";
import type { BodySpec } from "./types.ts";

/** bed：医院的推床，配 pose: "recline" 半躺着，腿上盖被子 */
export const SEATS = ["chair", "high-chair", "bed"] as const;
export type SeatKind = (typeof SEATS)[number];

/** 儿童餐椅的座面离地多高（舞台单位），坐上去和大人一样高 */
const HIGH_SEAT = 180;
/** 推床床垫离地多高 */
const BED_TOP = 250;

export type Seating = {
  readonly kind: SeatKind;
  /** 座面 y（负数） */
  readonly seat: number;
  /** 后腿、前腿的 x */
  readonly back: number;
  readonly front: number;
  /** 靠背顶 y */
  readonly rest: number;
  /** 往后倒时绕着转的点：靠背最后面贴地的地方 */
  readonly pivot: number;
  /** 靠背和座面接在哪儿（x） */
  readonly hinge: number;
  /** 人整体往下挪多少，让屁股正好坐在座面上 */
  readonly dy: number;
  /** 往后翘了多少度 */
  readonly tip: number;
  /** 倒下去以后整体抬起多少，免得头钻到地板下面 */
  readonly rise: number;
  /** 骨架坐标 → 坐上椅子、翘起来以后的坐标 */
  readonly map: (p: Pt) => Pt;
};

export function seating(body: BodySpec, sk: Skeleton, kind: SeatKind, tip = 0): Seating {
  const sit = solve(body, POSE_ANGLES.sit);
  const chairSeat = sit.pelvis[1] + body.limb * 0.55;
  const seat = kind === "high-chair" ? Math.min(chairSeat, -HIGH_SEAT) : kind === "bed" ? -BED_TOP : chairSeat;
  const dy = seat - (sk.pelvis[1] + body.limb * 0.55);
  let back = sk.pelvis[0] - body.hip - body.limb * 1.2;
  let front = sk.pelvis[0] + body.hip + body.limb * 1.8;
  let rest = seat - body.torso * 0.85;
  let hinge = back;
  if (kind === "bed") {
    // 靠背顺着上半身斜着撑到头后面；床尾比脚再长一截，被子能盖住脚
    const top = rotate([0, -(body.torso + body.neck + body.headRy * 1.6)], sk.lean);
    hinge = sk.pelvis[0] - body.hip;
    back = Math.min(hinge, sk.pelvis[0] + top[0]) - body.limb;
    rest = seat + top[1];
    front = Math.max(sk.legL.end[0], sk.legR.end[0]) + body.limb * 2.2;
  }
  const pivot = back - body.limb * 0.9;
  const turn = (p: Pt): Pt => {
    const r = rotate([p[0] - pivot, p[1] + dy], -tip);
    return [r[0] + pivot, r[1]];
  };
  const r = Math.max(body.headRx, body.headRy);
  const lowest = Math.max(
    0,
    turn(sk.head.c)[1] + r,
    ...[sk.armL, sk.armR, sk.legL, sk.legR].flatMap((l) => [l.mid, l.end]).map((p) => turn(p)[1] + body.limb * 0.6),
  );
  const rise = tip > 0 ? lowest : 0;
  const map = (p: Pt): Pt => {
    const q = turn(p);
    return [q[0], q[1] - rise];
  };
  return { kind, seat, back, front, rest, pivot, hinge, dy, tip, rise, map };
}

/** 椅子本身（还没翘）的几个角，用来算整个人加椅子占多大地方 */
export function chairCorners(s: Seating): Pt[] {
  return [[s.pivot, s.rest], [s.front + 20, s.seat], [s.pivot, 0], [s.front + 20, 0]];
}

/** 椅子在舞台上转多少：先翘，再抬。dy 只对人生效 */
export function chairTransform(s: Seating): string {
  return `translate(0,${-s.rise}) rotate(${-s.tip} ${s.pivot} 0)`;
}

/** 椅子上的点 → 翘起来以后（不带 dy） */
export function chairPoint(s: Seating, p: Pt): Pt {
  const r = rotate([p[0] - s.pivot, p[1]], -s.tip);
  return [r[0] + s.pivot, r[1] - s.rise];
}
