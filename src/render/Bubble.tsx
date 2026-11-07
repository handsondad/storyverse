import { CAST, INK } from "../cast/characters.ts";
import type { CaptionBox } from "../engine/bubbles.ts";
import type { PanelBubble, Sfx } from "../engine/compose.ts";

const STROKE = 4.5;
const LINE_H = 1.28;

export function BubbleView({ b }: { b: PanelBubble }) {
  const fill = b.kind === "shout" ? "#ffffff" : CAST[b.speaker].bubble;
  const dashed = b.kind === "whisper" ? { strokeDasharray: "12 9" } : {};
  return (
    <g>
      {b.kind === "thought" ? <ThoughtShape b={b} fill={fill} /> : (
        <>
          {b.tail && <path d={tailPath(b, 0)} fill={fill} stroke={INK} strokeWidth={STROKE} strokeLinejoin="round" {...dashed} />}
          <path d={b.kind === "shout" ? spikyPath(b) : roundRect(b)} fill={fill} stroke={INK} strokeWidth={b.kind === "shout" ? STROKE * 1.3 : STROKE} strokeLinejoin="round" {...dashed} />
          {b.tail && <path d={tailPath(b, STROKE + 2)} fill={fill} />}
        </>
      )}
      <Lines lines={b.lines} box={b.text} size={b.fontSize} color={b.kind === "whisper" ? "#7a6a52" : INK} bold={b.kind === "shout"} />
    </g>
  );
}

function Lines({ lines, box, size, color, bold, align = "middle" }: { lines: readonly string[]; box: { x: number; y: number; w: number; h: number }; size: number; color: string; bold?: boolean; align?: "middle" | "start" }) {
  const x = align === "middle" ? box.x + box.w / 2 : box.x;
  return (
    <text className="story-font" fontSize={size} fill={color} textAnchor={align} stroke={bold ? color : undefined} strokeWidth={bold ? 0.8 : undefined}>
      {lines.map((l, i) => (
        <tspan key={i} x={x} y={box.y + i * size * LINE_H + size * 0.95}>{l}</tspan>
      ))}
    </text>
  );
}

function roundRect({ x, y, w, h }: { x: number; y: number; w: number; h: number }): string {
  const r = Math.min(h / 2, w / 2, 44);
  return `M ${x + r},${y} H ${x + w - r} A ${r} ${r} 0 0 1 ${x + w},${y + r} V ${y + h - r} A ${r} ${r} 0 0 1 ${x + w - r},${y + h}
    H ${x + r} A ${r} ${r} 0 0 1 ${x},${y + h - r} V ${y + r} A ${r} ${r} 0 0 1 ${x + r},${y} Z`;
}

/** 尾巴：一个弯一点的三角形。inset > 0 时往气泡里缩，用来盖住接缝处的描边 */
function tailPath(b: PanelBubble, inset: number): string {
  const t = b.tail!;
  const [bx, by] = t.base;
  const [tx, ty] = t.tip;
  const dx = tx - bx;
  const dy = ty - by;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const half = (t.width / 2) * (inset ? 0.78 : 1);
  const back = inset ? 10 : 0;
  // 底边沿着气泡的边
  const horizontal = Math.abs(by - b.y) < 6 || Math.abs(by - (b.y + b.h)) < 6;
  const [px, py] = horizontal ? [1, 0] : [0, 1];
  const b1 = [bx - px * half - ux * back, by - py * half - uy * back];
  const b2 = [bx + px * half - ux * back, by + py * half - uy * back];
  const tip = [tx - ux * inset * 1.4, ty - uy * inset * 1.4];
  const bend = 0.25;
  const c1 = [b1[0] + dx * 0.5 + -uy * t.width * bend, b1[1] + dy * 0.5 + ux * t.width * bend];
  const c2 = [b2[0] + dx * 0.5 + -uy * t.width * bend, b2[1] + dy * 0.5 + ux * t.width * bend];
  return `M ${b1} Q ${c1} ${tip} Q ${c2} ${b2} Z`;
}

function spikyPath({ x, y, w, h }: { x: number; y: number; w: number; h: number }): string {
  const spike = 20;
  const ix = x + spike;
  const iy = y + spike;
  const iw = w - spike * 2;
  const ih = h - spike * 2;
  const per = 2 * (iw + ih);
  const n = Math.max(12, Math.round(per / 34)) * 2;
  const pts: string[] = [];
  for (let i = 0; i < n; i++) {
    const d = (i / n) * per;
    let px: number, py: number, nx: number, ny: number;
    if (d < iw) { px = ix + d; py = iy; nx = 0; ny = -1; }
    else if (d < iw + ih) { px = ix + iw; py = iy + d - iw; nx = 1; ny = 0; }
    else if (d < iw * 2 + ih) { px = ix + iw - (d - iw - ih); py = iy + ih; nx = 0; ny = 1; }
    else { px = ix; py = iy + ih - (d - iw * 2 - ih); nx = -1; ny = 0; }
    const out = i % 2 === 0 ? spike : -spike * 0.15;
    pts.push(`${(px + nx * out).toFixed(1)},${(py + ny * out).toFixed(1)}`);
  }
  return `M ${pts.join(" L ")} Z`;
}

function ThoughtShape({ b, fill }: { b: PanelBubble; fill: string }) {
  const r = 24;
  const bumps: [number, number][] = [];
  const inset = r * 0.8;
  const x0 = b.x + inset;
  const y0 = b.y + inset;
  const w = b.w - inset * 2;
  const h = b.h - inset * 2;
  const nx = Math.max(2, Math.round(w / (r * 1.5)));
  const ny = Math.max(1, Math.round(h / (r * 1.5)));
  for (let i = 0; i <= nx; i++) { bumps.push([x0 + (w * i) / nx, y0]); bumps.push([x0 + (w * i) / nx, y0 + h]); }
  for (let j = 1; j < ny; j++) { bumps.push([x0, y0 + (h * j) / ny]); bumps.push([x0 + w, y0 + (h * j) / ny]); }
  const dots = b.tail ? [0.35, 0.65, 0.9].map((k, i) => {
    const [bx, by] = b.tail!.base;
    const [tx, ty] = b.tail!.tip;
    return { x: bx + (tx - bx) * k, y: by + (ty - by) * k, r: 13 - i * 3.5 };
  }) : [];
  return (
    <g>
      {bumps.map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={r} fill={fill} stroke={INK} strokeWidth={STROKE} />)}
      <rect x={x0} y={y0} width={w} height={h} fill={fill} />
      {bumps.map(([cx, cy], i) => <circle key={`f${i}`} cx={cx} cy={cy} r={r - STROKE / 2} fill={fill} />)}
      {dots.map((d, i) => <circle key={`d${i}`} cx={d.x} cy={d.y} r={d.r} fill={fill} stroke={INK} strokeWidth={STROKE * 0.8} />)}
    </g>
  );
}

export function CaptionView({ c }: { c: CaptionBox }) {
  return (
    <g>
      <rect x={c.x} y={c.y} width={c.w} height={c.h} rx={8} fill="#fff3c4" stroke={INK} strokeWidth={STROKE} />
      <Lines lines={c.lines} box={{ x: c.x + 14, y: c.y + 9, w: c.w - 28, h: c.h - 18 }} size={c.fontSize} color={INK} align="start" />
    </g>
  );
}

export function SfxView({ s }: { s: Sfx }) {
  return (
    <text className="story-font" x={s.x} y={s.y} fontSize={s.size} textAnchor="middle" dominantBaseline="central"
      transform={`rotate(${s.angle} ${s.x} ${s.y})`} fill={s.color} stroke={INK} strokeWidth={s.size * 0.09}
      strokeLinejoin="round" paintOrder="stroke">{s.text}</text>
  );
}
