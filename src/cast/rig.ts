/**
 * 骨架：给定身体尺寸和姿势角度，算出每个关节在哪儿。纯函数，画图、排气泡、检查器都用它。
 * 坐标按面朝右，脚底在 y = 0，往上是负数；面朝左时由画图那一层整体翻转。
 */
import type { PoseAngles } from "./poses.ts";
import type { BodySpec } from "./types.ts";

export type Pt = readonly [number, number];

export type Limb = { readonly root: Pt; readonly mid: Pt; readonly end: Pt };

export type Skeleton = {
  readonly pelvis: Pt;
  readonly shoulderC: Pt;
  readonly neckTop: Pt;
  readonly armL: Limb;
  readonly armR: Limb;
  readonly legL: Limb;
  readonly legR: Limb;
  readonly head: { readonly c: Pt; readonly rx: number; readonly ry: number; readonly angle: number };
  /** 上半身倾斜角（度） */
  readonly lean: number;
  /** 头顶（含头发）的 y */
  readonly top: number;
  readonly bounds: { readonly minX: number; readonly maxX: number; readonly minY: number; readonly maxY: number };
};

const rad = (deg: number) => (deg * Math.PI) / 180;

export const add = (a: Pt, b: Pt): Pt => [a[0] + b[0], a[1] + b[1]];
export const scale = (a: Pt, k: number): Pt => [a[0] * k, a[1] * k];

/** 顺时针（画面上）转 deg 度 */
export function rotate(p: Pt, deg: number): Pt {
  const a = rad(deg);
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [p[0] * c - p[1] * s, p[0] * s + p[1] * c];
}

/** side：-1 左边那只，+1 右边那只；angle 从朝下开始往外侧量 */
function limbDir(side: -1 | 1, angle: number): Pt {
  const a = rad(angle);
  return [side * Math.sin(a), Math.cos(a)];
}

function limb(root: Pt, side: -1 | 1, [a, b]: readonly [number, number], len1: number, len2: number, spin: number): Limb {
  const mid = add(root, rotate(scale(limbDir(side, a), len1), spin));
  const end = add(mid, rotate(scale(limbDir(side, a + b), len2), spin));
  return { root, mid, end };
}

const shift = (l: Limb, d: Pt): Limb => ({ root: add(l.root, d), mid: add(l.mid, d), end: add(l.end, d) });

/** 头发高出脸的部分，按脸的竖半径算 */
export const HAIR_RISE = 0.34;

export function solve(body: BodySpec, pose: PoseAngles): Skeleton {
  const lean = pose.lean ?? 0;
  const thigh = body.thigh * (pose.thighScale ?? 1);

  // 先把胯放在原点摆好两条腿，再整体抬到脚踩地面
  const legL0 = limb([-body.hip, 0], -1, pose.legL, thigh, body.shin, 0);
  const legR0 = limb([body.hip, 0], 1, pose.legR, thigh, body.shin, 0);
  const sole = body.limb * 0.55;
  const lowest = Math.max(legL0.end[1], legR0.end[1]);
  const height = body.thigh + body.shin + body.torso + body.neck + body.headRy * 1.9;
  const pelvisY = -lowest - sole - (pose.lift ?? 0) * height;
  const up: Pt = [0, pelvisY];
  const pelvis: Pt = up;
  const legL = shift(legL0, up);
  const legR = shift(legR0, up);

  const shoulderC = add(pelvis, rotate([0, -body.torso], lean));
  const shoulderL = add(shoulderC, rotate([-body.shoulder, 0], lean));
  const shoulderR = add(shoulderC, rotate([body.shoulder, 0], lean));
  const armL = limb(shoulderL, -1, pose.armL, body.upperArm, body.foreArm, lean);
  const armR = limb(shoulderR, 1, pose.armR, body.upperArm, body.foreArm, lean);

  const neckTop = add(shoulderC, rotate([0, -body.neck], lean));
  const headAngle = lean + (pose.tilt ?? 0);
  const headC = add(neckTop, rotate([0, -body.headRy * 0.9], headAngle));
  const top = headC[1] - body.headRy * (1 + HAIR_RISE);

  const xs: number[] = [];
  const ys: number[] = [];
  for (const l of [armL, armR, legL, legR]) {
    for (const p of [l.root, l.mid, l.end]) {
      xs.push(p[0] - body.limb, p[0] + body.limb);
      ys.push(p[1] - body.limb, p[1] + body.limb);
    }
  }
  xs.push(headC[0] - body.headRx * 1.1, headC[0] + body.headRx * 1.1);
  ys.push(top, 0);

  return {
    pelvis, shoulderC, neckTop, armL, armR, legL, legR,
    head: { c: headC, rx: body.headRx, ry: body.headRy, angle: headAngle },
    lean,
    top,
    bounds: { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) },
  };
}
