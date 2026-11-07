/**
 * 气泡排布：在格子里给每个气泡找位置。规矩（按重要程度）：
 * 1. 不挡脸；2. 气泡之间不重叠；3. 先说的在上面、左边；4. 尽量在说话人头顶附近；5. 少挡身体。
 * 在格子里按网格试所有位置，挑扣分最少的那个。都是页面坐标。
 */
import type { BubbleKind } from "../story/vocab.ts";
import { overlaps, type Rect } from "./layout.ts";
import { blockSize, wrap } from "./text.ts";

export const BUBBLE_FONT = 34;
export const CAPTION_FONT = 28;
const PAD = 14;
const STEP = 12;

export type Face = { readonly cx: number; readonly cy: number; readonly r: number; readonly top: number };

export type Speaker = { readonly face: Face } | null;

export type BubbleRequest = {
  readonly text: string;
  readonly kind: BubbleKind;
  readonly speaker: Speaker;
};

export type Tail = { readonly base: readonly [number, number]; readonly tip: readonly [number, number]; readonly width: number };

export type BubbleBox = Rect & {
  readonly lines: readonly string[];
  readonly fontSize: number;
  readonly tail: Tail | null;
  /** 文字区域（气泡形状往外扩的部分不算） */
  readonly text: Rect;
};

export type CaptionBox = Rect & { readonly lines: readonly string[]; readonly fontSize: number };

/** 每种气泡在文字外面多留多少 */
function padding(kind: BubbleKind): { x: number; y: number } {
  switch (kind) {
    case "shout": return { x: 40, y: 34 };
    case "thought": return { x: 34, y: 26 };
    default: return { x: 24, y: 16 };
  }
}

export function sizeBubble(text: string, kind: BubbleKind, panel: Rect): { w: number; h: number; lines: string[]; tw: number; th: number } {
  const maxText = Math.min(panel.w * 0.62, BUBBLE_FONT * 11);
  const lines = wrap(text, BUBBLE_FONT, maxText);
  const { w: tw, h: th } = blockSize(lines, BUBBLE_FONT);
  const p = padding(kind);
  return { w: tw + p.x * 2, h: th + p.y * 2, lines, tw, th };
}

export function placeCaptions(texts: readonly string[], panel: Rect): CaptionBox[] {
  return texts.map((text, i) => {
    const lines = wrap(text, CAPTION_FONT, panel.w * 0.66 - 28);
    const { w, h } = blockSize(lines, CAPTION_FONT, 1.3);
    const bw = w + 28;
    const bh = h + 18;
    const right = i % 2 === 1;
    const x = right ? panel.x + panel.w - bw - 10 : panel.x + 10;
    const y = right ? panel.y + panel.h - bh - 10 : panel.y + 10 + Math.floor(i / 2) * (bh + 8);
    return { x, y, w: bw, h: bh, lines, fontSize: CAPTION_FONT };
  });
}

export type Placement = { readonly bubbles: BubbleBox[]; readonly issues: string[] };

export function placeBubbles(reqs: readonly BubbleRequest[], panel: Rect, faces: readonly Face[], bodies: readonly Rect[], taken: readonly Rect[]): Placement {
  const placed: BubbleBox[] = [];
  const blocked: Rect[] = [...taken];
  const issues: string[] = [];

  for (const req of reqs) {
    const size = sizeBubble(req.text, req.kind, panel);
    const p = padding(req.kind);
    const pref = req.speaker
      ? { x: req.speaker.face.cx, y: req.speaker.face.top - 16 }
      : { x: panel.x + panel.w / 2, y: panel.y + PAD + size.h };
    let best: { rect: Rect; cost: number } | null = null;
    const maxX = panel.x + panel.w - PAD - size.w;
    const maxY = panel.y + panel.h - PAD - size.h;
    for (let y = panel.y + PAD; y <= maxY + 0.01; y += STEP) {
      for (let x = panel.x + PAD; x <= maxX + 0.01; x += STEP) {
        const rect = { x, y, w: size.w, h: size.h };
        let cost = score(rect, pref, faces, bodies, blocked, placed, req.speaker);
        // 尾巴不能穿过别的气泡，前面气泡的尾巴也不能被这个气泡压住
        const t = req.speaker ? tail(rect, req.speaker.face, panel) : null;
        if (t && blocked.some((b) => crosses(t, b))) cost += FACE_COST;
        if (placed.some((b) => b.tail && crosses(b.tail, rect))) cost += FACE_COST;
        if (!best || cost < best.cost) best = { rect, cost };
      }
    }
    if (!best) {
      // 格子比气泡还小：贴着左上角放，并报出来
      best = { rect: { x: panel.x + PAD, y: panel.y + PAD, w: size.w, h: size.h }, cost: Infinity };
      issues.push(`气泡「${req.text}」比格子还大，删几个字或换大一点的格子`);
    } else if (best.cost >= FACE_COST) {
      issues.push(`气泡「${req.text}」找不到不挡脸、不重叠的位置，删几个字、换景别或换版式`);
    }
    const r = best.rect;
    const text = { x: r.x + p.x, y: r.y + p.y, w: size.tw, h: size.th };
    const bubble: BubbleBox = { ...r, lines: size.lines, fontSize: BUBBLE_FONT, text, tail: req.speaker ? tail(r, req.speaker.face, panel) : null };
    placed.push(bubble);
    blocked.push(r);
  }
  return { bubbles: placed, issues };
}

const FACE_COST = 100000;
/** 气泡和说话人的脸之间至少留这么宽，尾巴才画得出来 */
const TAIL_GAP = 30;

function score(r: Rect, pref: { x: number; y: number }, faces: readonly Face[], bodies: readonly Rect[], blocked: readonly Rect[], earlier: readonly Rect[], speaker: Speaker): number {
  let cost = 0;
  for (const f of faces) {
    const depth = circleRectDepth(f, r);
    if (depth > 0) cost += FACE_COST + depth * 50;
  }
  for (const b of blocked) if (overlaps(r, b, 10)) cost += FACE_COST;
  for (const b of bodies) cost += overlapArea(r, b) * 0.02;
  // 先说的先读：后面的气泡不能比前面的更靠上又更靠左
  const cx = r.x + r.w / 2;
  const cy = r.y + r.h / 2;
  for (const e of earlier) {
    const ex = e.x + e.w / 2;
    const ey = e.y + e.h / 2;
    if (cy < ey - 20 && cx < ex + 20) cost += 20000;
    if (r.x + r.w < e.x + 10 && Math.abs(cy - ey) < (r.h + e.h) / 2) cost += 20000;
  }
  const bottom = r.y + r.h;
  const dx = Math.abs(cx - pref.x);
  const dy = bottom - pref.y;
  cost += dx * 1.2 + (dy > 0 ? dy * 4 : -dy * 0.7);
  if (speaker) {
    // 尾巴太长不好看；贴着脸又没地方画尾巴
    cost += Math.max(0, Math.hypot(cx - speaker.face.cx, cy - speaker.face.cy) - 320) * 2;
    cost += circleRectDepth({ ...speaker.face, r: speaker.face.r + TAIL_GAP }, r) * 200;
  }
  return cost;
}

/** 尾巴这条线有没有穿进矩形里 */
function crosses(t: Tail, r: Rect): boolean {
  for (let i = 0; i <= 12; i++) {
    const x = t.base[0] + ((t.tip[0] - t.base[0]) * i) / 12;
    const y = t.base[1] + ((t.tip[1] - t.base[1]) * i) / 12;
    if (x > r.x + 4 && x < r.x + r.w - 4 && y > r.y + 4 && y < r.y + r.h - 4) return true;
  }
  return false;
}

/** 圆和矩形重叠多深（像素），不重叠为 0 */
function circleRectDepth(f: Face, r: Rect): number {
  const nx = Math.max(r.x, Math.min(f.cx, r.x + r.w));
  const ny = Math.max(r.y, Math.min(f.cy, r.y + r.h));
  const d = Math.hypot(f.cx - nx, f.cy - ny);
  return Math.max(0, f.r - d);
}

function overlapArea(a: Rect, b: Rect): number {
  const w = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
  const h = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
  return w > 0 && h > 0 ? w * h : 0;
}

/** 尾巴从气泡边上朝说话人的头伸过去，停在脸外面一点 */
function tail(r: Rect, face: Face, panel: Rect): Tail | null {
  const bx = r.x + r.w / 2;
  const by = r.y + r.h / 2;
  const dx = bx - face.cx;
  const dy = by - face.cy;
  const d = Math.hypot(dx, dy) || 1;
  let tip: [number, number] = [face.cx + (dx / d) * face.r * 1.12, face.cy + (dy / d) * face.r * 1.12];
  tip = [Math.max(panel.x + 6, Math.min(panel.x + panel.w - 6, tip[0])), Math.max(panel.y + 6, Math.min(panel.y + panel.h - 6, tip[1]))];
  if (tip[0] > r.x && tip[0] < r.x + r.w && tip[1] > r.y && tip[1] < r.y + r.h) return null;
  const inset = Math.min(r.h / 2, 30);
  let base: [number, number];
  if (tip[1] >= r.y + r.h) base = [clampTo(tip[0], r.x + inset, r.x + r.w - inset), r.y + r.h - 4];
  else if (tip[1] <= r.y) base = [clampTo(tip[0], r.x + inset, r.x + r.w - inset), r.y + 4];
  else if (tip[0] < r.x) base = [r.x + 4, clampTo(tip[1], r.y + inset, r.y + r.h - inset)];
  else base = [r.x + r.w - 4, clampTo(tip[1], r.y + inset, r.y + r.h - inset)];
  // 尾巴最长 200，太远就只朝那个方向伸一截
  const len = Math.hypot(tip[0] - base[0], tip[1] - base[1]);
  if (len > 200) tip = [base[0] + ((tip[0] - base[0]) / len) * 200, base[1] + ((tip[1] - base[1]) / len) * 200];
  if (len < 12) return null;
  return { base, tip, width: Math.min(34, r.w * 0.28) };
}

const clampTo = (v: number, lo: number, hi: number) => (hi < lo ? (lo + hi) / 2 : Math.min(hi, Math.max(lo, v)));
