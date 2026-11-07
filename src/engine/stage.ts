import { CAST } from "../cast/characters.ts";
import { POSE_ANGLES } from "../cast/poses.ts";
import { solve, type Skeleton } from "../cast/rig.ts";
import type { CharacterSpec } from "../cast/types.ts";
import type { Actor, Panel, Prop } from "../story/types.ts";
import { SLOTS } from "../story/vocab.ts";

/** 每一格的舞台：1600×1000，地面在 880 */
export const STAGE = { w: 1600, h: 1000, ground: 880 } as const;

/** 背景往舞台四周多画的宽度。窄格子的镜头会比舞台高，靠这一圈补上，不露白 */
export const BLEED = { x: 500, y: 400 } as const;

/** 站位 0～1 换成舞台横坐标，两边各留 100 */
export const stageX = (f: number) => 100 + f * (STAGE.w - 200);

export type Box = { minX: number; maxX: number; minY: number; maxY: number };

export type PlacedActor = {
  readonly actor: Actor;
  readonly spec: CharacterSpec;
  readonly x: number;
  readonly facing: "left" | "right";
  readonly skeleton: Skeleton;
  /** 舞台坐标下的头（用于对焦、躲开脸、气泡尾巴） */
  readonly head: { readonly cx: number; readonly cy: number; readonly rx: number; readonly ry: number; readonly top: number };
  readonly box: Box;
};

export function actorX(a: Actor): number {
  return stageX(typeof a.at === "number" ? a.at : SLOTS[a.at]);
}

/** 不写朝向时，朝着别的角色站；只有一个人就朝舞台中间 */
export function defaultFacing(a: Actor, all: readonly Actor[]): "left" | "right" {
  if (a.facing) return a.facing;
  const x = actorX(a);
  const others = all.filter((o) => o !== a).map(actorX);
  const target = others.length ? others.reduce((s, v) => s + v, 0) / others.length : STAGE.w / 2;
  return target < x - 1 ? "left" : "right";
}

/** squeeze < 1：窄格子里装不下时，按比例往大家的中间收拢，左右次序不变 */
export function placeActors(panel: Pick<Panel, "actors">, squeeze = 1): PlacedActor[] {
  const xs = panel.actors.map(actorX);
  const mid = xs.length ? (Math.min(...xs) + Math.max(...xs)) / 2 : STAGE.w / 2;
  return panel.actors.map((actor, i) => {
    const spec = CAST[actor.who];
    const x = mid + (xs[i] - mid) * squeeze;
    const facing = defaultFacing(actor, panel.actors);
    const skeleton = solve(spec.body, POSE_ANGLES[actor.pose ?? "stand"]);
    const flip = facing === "left" ? -1 : 1;
    const g = STAGE.ground;
    const b = skeleton.bounds;
    const box = flip > 0
      ? { minX: x + b.minX, maxX: x + b.maxX, minY: g + b.minY, maxY: g + b.maxY }
      : { minX: x - b.maxX, maxX: x - b.minX, minY: g + b.minY, maxY: g + b.maxY };
    const h = skeleton.head;
    return {
      actor, spec, x, facing, skeleton, box,
      head: { cx: x + h.c[0] * flip, cy: g + h.c[1], rx: h.rx, ry: h.ry, top: g + skeleton.top },
    };
  });
}

export function propBox(p: Prop): Box {
  const size = p.size ?? 90;
  const x = stageX(p.x);
  const y = STAGE.ground - (p.lift ?? 0);
  return { minX: x - size / 2, maxX: x + size / 2, minY: y - size, maxY: y };
}
