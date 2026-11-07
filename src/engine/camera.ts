/**
 * 镜头：根据景别和格子的宽高比，从舞台上框出一块。框出来的宽高比和格子完全一致，
 * 所以舞台坐标到页面坐标只差一个平移和一个缩放。
 */
import type { Shot } from "../story/vocab.ts";
import type { Rect } from "./layout.ts";
import { STAGE, type Box, type PlacedActor } from "./stage.ts";

export type CameraInput = {
  readonly aspect: number;
  readonly shot: Shot;
  readonly actors: readonly PlacedActor[];
  readonly focus?: PlacedActor;
  readonly props?: readonly Box[];
  /** 这一格有气泡，头顶要多留地方 */
  readonly bubbles: boolean;
};

export function frame({ aspect, shot, actors, focus, props = [], bubbles }: CameraInput): Rect {
  if (actors.length === 0) return fit(aspect, { minX: 200, maxX: 1400, minY: 300, maxY: STAGE.h }, 0);

  let content: Box;
  let headroom: number;
  if (shot === "close") {
    const a = focus ?? actors[0];
    const r = Math.max(a.head.rx, a.head.ry);
    content = { minX: a.head.cx - r * 1.5, maxX: a.head.cx + r * 1.5, minY: a.head.top - r * 0.05, maxY: a.head.cy + a.head.ry * 1.9 };
    headroom = bubbles ? 0.6 : 0.12;
  } else if (shot === "medium") {
    const tallest = Math.max(...actors.map((a) => STAGE.ground - a.head.top));
    content = {
      minX: Math.min(...actors.map((a) => a.box.minX)) - 60,
      maxX: Math.max(...actors.map((a) => a.box.maxX)) + 60,
      minY: Math.min(...actors.map((a) => a.box.minY)),
      maxY: STAGE.ground - tallest * 0.26,
    };
    headroom = bubbles ? 0.5 : 0.12;
  } else {
    const boxes = [...actors.map((a) => a.box), ...props];
    const minX = Math.min(...boxes.map((b) => b.minX)) - 140;
    const maxX = Math.max(...boxes.map((b) => b.maxX)) + 140;
    const grow = Math.max(0, 1150 - (maxX - minX)) / 2;
    content = { minX: minX - grow, maxX: maxX + grow, minY: Math.min(...boxes.map((b) => b.minY)), maxY: STAGE.ground + 80 };
    headroom = bubbles ? 0.45 : 0.25;
  }
  return fit(aspect, content, headroom);
}

/** 先按内容和头顶空间算出一个框，再补成格子的宽高比，最后尽量留在舞台里 */
function fit(aspect: number, c: Box, headroom: number): Rect {
  const top = c.minY - (c.maxY - c.minY) * headroom;
  let w = c.maxX - c.minX;
  let h = c.maxY - top;
  if (w / h < aspect) w = h * aspect;
  else h = w / aspect;
  if (w > STAGE.w) { w = STAGE.w; h = w / aspect; }
  if (h > STAGE.h) { h = STAGE.h; w = h * aspect; }
  const cx = (c.minX + c.maxX) / 2;
  // 框比人窄时左右对等裁切，不要先保一边再保另一边（后写的会把先写的顶掉）
  const x = clamp(cx - w / 2, 0, STAGE.w - w);
  // 多出来的高度先往下补（多看点地面），到了舞台底再往上
  const y = clamp(Math.min(top, STAGE.h - h), 0, STAGE.h - h);
  return { x, y, w, h };
}

const clamp = (v: number, lo: number, hi: number) => (hi < lo ? (lo + hi) / 2 : Math.min(hi, Math.max(lo, v)));
