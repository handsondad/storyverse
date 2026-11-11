import type { Expression } from "../story/vocab.ts";
import { INK } from "./characters.ts";
import type { CharacterSpec } from "./types.ts";

type Eyes = "open" | "happy" | "closed" | "wide" | "tight" | "down" | "up";
type Brows = "flat" | "raised" | "worried" | "angry" | "one-up";
type Mouth = "smile" | "grin" | "laugh" | "o" | "frown" | "wail" | "flat" | "talk" | "wavy" | "small" | "side" | "grit";

export type Mark = "!" | "?" | "anger" | "sweat" | "zzz" | "sparkle" | "tears";

type FaceSpec = { eyes: Eyes; brows: Brows; mouth: Mouth; talk?: Mouth; blush?: number; marks?: readonly Mark[] };

/** 每个表情由眼睛、眉毛、嘴巴和漫画符号拼起来；talk 是说话时换成的张嘴版本 */
export const FACES: Record<Expression, FaceSpec> = {
  neutral: { eyes: "open", brows: "flat", mouth: "smile", talk: "talk" },
  happy: { eyes: "happy", brows: "raised", mouth: "grin" },
  laugh: { eyes: "tight", brows: "raised", mouth: "laugh", blush: 1.4 },
  surprised: { eyes: "wide", brows: "raised", mouth: "o", marks: ["!"] },
  sad: { eyes: "down", brows: "worried", mouth: "frown", talk: "wail" },
  cry: { eyes: "tight", brows: "worried", mouth: "wail", marks: ["tears"] },
  angry: { eyes: "open", brows: "angry", mouth: "grit", marks: ["anger"] },
  scared: { eyes: "wide", brows: "worried", mouth: "wavy", marks: ["sweat"] },
  thinking: { eyes: "up", brows: "one-up", mouth: "side", talk: "talk" },
  confused: { eyes: "open", brows: "one-up", mouth: "wavy", talk: "talk", marks: ["?"] },
  shy: { eyes: "down", brows: "worried", mouth: "small", talk: "talk", blush: 2.2, marks: ["sweat"] },
  sleepy: { eyes: "closed", brows: "flat", mouth: "small", talk: "talk", marks: ["zzz"] },
  proud: { eyes: "happy", brows: "raised", mouth: "grin", marks: ["sparkle"] },
};

const EYE = "#2b201a";
const MOUTH = "#b5413a";
const TONGUE = "#ff8f8f";

/** 头往面朝的方向转一点，五官跟着偏 */
export const TURN = 0.09;

type HeadProps = { spec: CharacterSpec; face: Expression; talking: boolean; blink?: boolean };

/** 头发后面那一层（披到肩上的部分），要画在身体后面 */
export function BackHair({ spec }: { spec: CharacterSpec }) {
  const { headRx: rx, headRy: ry } = spec.body;
  const { hair, hairStyle } = spec.look;
  if (hairStyle !== "bob") return null;
  const p = (x: number, y: number) => `${x * rx},${y * ry}`;
  const d = `M ${p(-1.12, -0.2)} C ${p(-1.22, -1.05)} ${p(1.22, -1.05)} ${p(1.12, -0.2)}
    L ${p(1.18, 0.78)} C ${p(1.14, 1.0)} ${p(0.82, 1.02)} ${p(0.7, 0.88)} L ${p(-0.7, 0.88)}
    C ${p(-0.82, 1.02)} ${p(-1.14, 1.0)} ${p(-1.18, 0.78)} Z`;
  return <path d={d} fill={hair} stroke={INK} strokeWidth={ow(spec) * 2} strokeLinejoin="round" />;
}

export function ow(spec: CharacterSpec): number {
  return 3.2 + spec.body.limb * 0.06;
}

export function Head({ spec, face, talking, blink }: HeadProps) {
  const { headRx: rx, headRy: ry } = spec.body;
  const { look } = spec;
  const f = FACES[face];
  const t = rx * TURN;
  const line = ow(spec) * 2;
  const eyes: Eyes = blink ? "closed" : f.eyes;
  const mouth: Mouth = talking ? (f.talk ?? f.mouth) : f.mouth;
  const ew = rx * 0.11 * look.eyeScale;
  const eh = ry * 0.16 * look.eyeScale;
  const ey = ry * 0.16;
  const ex = rx * 0.36;
  const blush = Math.min(1, look.blush * (f.blush ?? 1));

  return (
    <g>
      <Ear x={-rx * 0.97 + t * 0.4} y={ry * 0.14} rx={rx * 0.17} ry={ry * 0.24} spec={spec} />
      <Ear x={rx * 0.95 + t} y={ry * 0.14} rx={rx * 0.15} ry={ry * 0.22} spec={spec} />
      <ellipse cx={0} cy={0} rx={rx} ry={ry} fill={look.skin} stroke={INK} strokeWidth={line} />
      {blush > 0 && [-1, 1].map((s) => (
        <ellipse key={s} cx={s * rx * 0.6 + t * 0.8} cy={ry * 0.44} rx={rx * 0.15} ry={ry * 0.085} fill="#ff7b7b" opacity={blush * 0.55} />
      ))}
      {[-1, 1].map((s) => (
        <g key={s} transform={`translate(${s * ex + t},${ey})`}>
          <Eye kind={eyes} side={s as -1 | 1} ew={ew} eh={eh} line={line} />
        </g>
      ))}
      {[-1, 1].map((s) => (
        <Brow key={s} kind={f.brows} side={s as -1 | 1} x={s * ex + t} y={ey - eh - ry * 0.14} w={rx * 0.2} h={eh} color={look.hair} width={line * 1.05} />
      ))}
      <path d={`M ${t * 1.4 - rx * 0.04},${ry * 0.37} q ${rx * 0.04},${ry * 0.05} ${rx * 0.08},0`} fill="none" stroke={INK} strokeWidth={line * 0.6} strokeLinecap="round" opacity={0.6} />
      <g transform={`translate(${t * 1.2},${ry * 0.56})`}>
        <MouthShape kind={mouth} w={rx * 0.2} line={line} />
      </g>
      {look.wrinkles && <Wrinkles rx={rx} ry={ry} t={t} ex={ex + ew * 2.1} ey={ey} line={line} />}
      {look.mustache && <Mustache x={t * 1.3} y={ry * 0.45} w={rx * 0.38} h={ry * 0.16} color={look.mustache} line={line} />}
      {f.marks?.includes("tears") && [-1, 1].map((s) => (
        <path key={s} d={`M ${s * ex + t},${ey + eh * 0.6} q ${s * rx * 0.05},${ry * 0.3} ${s * rx * 0.02},${ry * 0.55}`}
          fill="none" stroke="#7cc4ff" strokeWidth={line * 1.6} strokeLinecap="round" opacity={0.9} />
      ))}
      {look.glasses && <Glasses x={ex} t={t} y={ey} w={ew * 3.3} h={eh * 2.5} color={look.glasses} line={line * 0.9} />}
      <FrontHair spec={spec} />
      {look.cap && <NurseCap rx={rx} ry={ry} t={t} color={look.cap} line={line} />}
    </g>
  );
}

function NurseCap({ rx, ry, t, color, line }: { rx: number; ry: number; t: number; color: string; line: number }) {
  const x = t * 0.6;
  const y = -ry * 1.12;
  const w = rx * 0.62;
  const h = ry * 0.36;
  const c = h * 0.32;
  return (
    <g>
      <path d={`M ${x - w},${y + h} L ${x - w * 0.8},${y} L ${x + w * 0.8},${y} L ${x + w},${y + h} Z`} fill={color} stroke={INK} strokeWidth={line * 0.8} strokeLinejoin="round" />
      <path d={`M ${x},${y + h / 2 - c} L ${x},${y + h / 2 + c} M ${x - c},${y + h / 2} L ${x + c},${y + h / 2}`} stroke="#ff6b81" strokeWidth={line * 0.9} strokeLinecap="round" />
    </g>
  );
}

function Ear({ x, y, rx, ry, spec }: { x: number; y: number; rx: number; ry: number; spec: CharacterSpec }) {
  return (
    <g>
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={spec.look.skin} stroke={INK} strokeWidth={ow(spec) * 2} />
      <path d={`M ${x - rx * 0.2},${y - ry * 0.4} q ${rx * 0.5},${ry * 0.4} 0,${ry * 0.8}`} fill="none" stroke={INK} strokeWidth={ow(spec)} opacity={0.35} strokeLinecap="round" />
    </g>
  );
}

function Eye({ kind, side, ew, eh, line }: { kind: Eyes; side: -1 | 1; ew: number; eh: number; line: number }) {
  const stroke = { fill: "none", stroke: EYE, strokeWidth: line * 1.15, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (kind) {
    case "open":
      return (
        <g>
          <ellipse rx={ew} ry={eh} fill={EYE} />
          <circle cx={-ew * 0.3} cy={-eh * 0.38} r={ew * 0.36} fill="#fff" />
        </g>
      );
    case "wide":
      return (
        <g>
          <ellipse rx={ew * 1.45} ry={eh * 1.2} fill="#fff" stroke={EYE} strokeWidth={line * 0.8} />
          <circle r={ew * 0.62} fill={EYE} />
          <circle cx={-ew * 0.2} cy={-ew * 0.25} r={ew * 0.22} fill="#fff" />
        </g>
      );
    case "up":
      return (
        <g>
          <ellipse rx={ew * 1.3} ry={eh * 1.1} fill="#fff" stroke={EYE} strokeWidth={line * 0.7} />
          <ellipse cx={ew * 0.35} cy={-eh * 0.4} rx={ew * 0.75} ry={eh * 0.65} fill={EYE} />
        </g>
      );
    case "happy":
      return <path d={`M ${-ew * 1.2},${eh * 0.25} Q 0,${-eh * 1.15} ${ew * 1.2},${eh * 0.25}`} {...stroke} />;
    case "closed":
      return <path d={`M ${-ew * 1.2},0 Q 0,${eh * 0.8} ${ew * 1.2},0`} {...stroke} />;
    case "tight":
      return <path d={`M ${-side * ew * 1.1},${-eh * 0.65} L ${side * ew * 0.9},0 L ${-side * ew * 1.1},${eh * 0.65}`} {...stroke} />;
    case "down":
      return (
        <g>
          <path d={`M ${-ew},0 A ${ew} ${eh} 0 0 0 ${ew},0 Z`} fill={EYE} />
          <path d={`M ${-ew * 1.25},${side * -eh * 0.12} L ${ew * 1.25},${side * eh * 0.12}`} {...stroke} strokeWidth={line} />
        </g>
      );
  }
}

function Brow({ kind, side, x, y, w, h, color, width }: { kind: Brows; side: -1 | 1; x: number; y: number; w: number; h: number; color: string; width: number }) {
  // inner 是靠鼻梁那一头
  let inner = 0;
  let outer = 0;
  let lift = 0;
  switch (kind) {
    case "flat": break;
    case "raised": lift = -h * 0.45; break;
    case "worried": inner = -h * 0.5; outer = h * 0.15; break;
    case "angry": inner = h * 0.35; outer = -h * 0.35; break;
    case "one-up": lift = side > 0 ? -h * 0.6 : 0; outer = side > 0 ? -h * 0.15 : 0; break;
  }
  const ix = x - side * w * 0.5;
  const ox = x + side * w * 0.5;
  return (
    <path d={`M ${ix},${y + lift + inner} Q ${x},${y + lift - h * 0.25} ${ox},${y + lift + outer}`}
      fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" />
  );
}

function MouthShape({ kind, w, line }: { kind: Mouth; w: number; line: number }) {
  const stroke = { fill: "none", stroke: INK, strokeWidth: line, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const open = { fill: MOUTH, stroke: INK, strokeWidth: line * 0.9, strokeLinejoin: "round" as const };
  switch (kind) {
    case "smile": return <path d={`M ${-w * 0.75},0 Q 0,${w * 0.7} ${w * 0.75},0`} {...stroke} />;
    case "small": return <path d={`M ${-w * 0.42},0 Q 0,${w * 0.38} ${w * 0.42},0`} {...stroke} />;
    case "flat": return <path d={`M ${-w * 0.55},${w * 0.1} L ${w * 0.55},${w * 0.1}`} {...stroke} />;
    case "side": return <path d={`M ${-w * 0.15},${w * 0.12} Q ${w * 0.35},${w * 0.3} ${w * 0.8},${-w * 0.08}`} {...stroke} />;
    case "frown": return <path d={`M ${-w * 0.7},${w * 0.35} Q 0,${-w * 0.35} ${w * 0.7},${w * 0.35}`} {...stroke} />;
    case "wavy": return <path d={`M ${-w * 0.8},0 q ${w * 0.2},${-w * 0.25} ${w * 0.4},0 t ${w * 0.4},0 t ${w * 0.4},0 t ${w * 0.4},0`} {...stroke} />;
    case "o": return <ellipse cy={w * 0.15} rx={w * 0.38} ry={w * 0.5} {...open} />;
    case "talk":
      return <path d={`M ${-w * 0.6},0 Q 0,${w * 1.05} ${w * 0.6},0 Q 0,${-w * 0.12} ${-w * 0.6},0 Z`} {...open} />;
    case "grin":
      return (
        <g>
          <path d={`M ${-w * 1.0},${-w * 0.12} Q 0,${w * 1.55} ${w * 1.0},${-w * 0.12} Q 0,${w * 0.08} ${-w * 1.0},${-w * 0.12} Z`} {...open} />
          <ellipse cy={w * 0.5} rx={w * 0.4} ry={w * 0.18} fill={TONGUE} />
        </g>
      );
    case "laugh":
      return (
        <g>
          <path d={`M ${-w * 1.3},${-w * 0.2} Q 0,${w * 2.2} ${w * 1.3},${-w * 0.2} Q 0,${w * 0.05} ${-w * 1.3},${-w * 0.2} Z`} {...open} />
          <ellipse cy={w * 0.8} rx={w * 0.55} ry={w * 0.25} fill={TONGUE} />
        </g>
      );
    case "wail":
      return <path d={`M ${-w * 0.8},${w * 0.55} Q 0,${-w * 0.75} ${w * 0.8},${w * 0.55} Q 0,${w * 0.3} ${-w * 0.8},${w * 0.55} Z`} {...open} />;
    case "grit":
      return (
        <g>
          <rect x={-w * 0.75} y={-w * 0.05} width={w * 1.5} height={w * 0.6} rx={w * 0.2} fill="#fff" stroke={INK} strokeWidth={line * 0.9} />
          <path d={`M ${-w * 0.75},${w * 0.25} L ${w * 0.75},${w * 0.25}`} stroke={INK} strokeWidth={line * 0.5} />
        </g>
      );
  }
}

function Glasses({ x, t, y, w, h, color, line }: { x: number; t: number; y: number; w: number; h: number; color: string; line: number }) {
  return (
    <g fill="#ffffff" fillOpacity={0.18} stroke={color} strokeWidth={line}>
      <rect x={-x + t - w / 2} y={y - h / 2} width={w} height={h} rx={h * 0.35} />
      <rect x={x + t - w / 2} y={y - h / 2} width={w} height={h} rx={h * 0.35} />
      <path d={`M ${-x + t + w / 2},${y - h * 0.1} Q ${t},${y - h * 0.35} ${x + t - w / 2},${y - h * 0.1}`} fill="none" />
    </g>
  );
}

function Wrinkles({ rx, ry, t, ex, ey, line }: { rx: number; ry: number; t: number; ex: number; ey: number; line: number }) {
  const s = { fill: "none", stroke: INK, strokeWidth: line * 0.55, strokeLinecap: "round" as const, opacity: 0.4 };
  return (
    <g>
      {[-1, 1].map((side) => (
        <path key={side} d={`M ${side * ex + t},${ey - ry * 0.07} l ${side * rx * 0.08},${-ry * 0.05} M ${side * ex + t},${ey + ry * 0.03} l ${side * rx * 0.09},${ry * 0.02}`} {...s} />
      ))}
      <path d={`M ${t - rx * 0.3},${-ry * 0.5} Q ${t},${-ry * 0.58} ${t + rx * 0.3},${-ry * 0.5} M ${t - rx * 0.22},${-ry * 0.38} Q ${t},${-ry * 0.45} ${t + rx * 0.22},${-ry * 0.38}`} {...s} />
    </g>
  );
}

function Mustache({ x, y, w, h, color, line }: { x: number; y: number; w: number; h: number; color: string; line: number }) {
  const d = `M ${x - w},${y + h * 0.5} Q ${x - w * 0.55},${y - h} ${x},${y - h * 0.15} Q ${x + w * 0.55},${y - h} ${x + w},${y + h * 0.5}
    Q ${x + w * 0.45},${y + h * 0.65} ${x},${y + h * 0.15} Q ${x - w * 0.45},${y + h * 0.65} ${x - w},${y + h * 0.5} Z`;
  return <path d={d} fill={color} stroke={INK} strokeWidth={line * 0.45} strokeLinejoin="round" />;
}

function FrontHair({ spec }: { spec: CharacterSpec }) {
  const { headRx: rx, headRy: ry } = spec.body;
  const { hair, hairStyle, accent } = spec.look;
  const p = (x: number, y: number) => `${x * rx},${y * ry}`;
  const common = { fill: hair, stroke: INK, strokeWidth: ow(spec) * 2, strokeLinejoin: "round" as const };
  if (hairStyle === "receding") {
    const side = (s: number) => `M ${p(s * 1.1, 0.12)} C ${p(s * 1.24, -0.24)} ${p(s * 1.12, -0.62)} ${p(s * 0.7, -0.8)}
      C ${p(s * 0.66, -0.56)} ${p(s * 0.7, -0.3)} ${p(s * 0.82, -0.04)} Z`;
    return (
      <g>
        <path d={`${side(-1)} ${side(1)}`} {...common} strokeWidth={ow(spec) * 1.4} />
        <path d={`M ${p(-0.16, -0.98)} q ${rx * 0.1},${-ry * 0.16} ${rx * 0.22},${-ry * 0.02} M ${p(0.08, -1.0)} q ${rx * 0.08},${-ry * 0.12} ${rx * 0.18},0`}
          fill="none" stroke={INK} strokeWidth={ow(spec) * 1.2} strokeLinecap="round" opacity={0.55} />
      </g>
    );
  }
  if (hairStyle === "spiky") {
    const d = `M ${p(-1.05, 0.12)} C ${p(-1.14, -0.55)} ${p(-0.78, -1.02)} ${p(-0.32, -1.08)}
      L ${p(-0.2, -1.36)} L ${p(0.02, -1.1)} L ${p(0.3, -1.32)} L ${p(0.38, -1.05)}
      C ${p(0.82, -0.98)} ${p(1.14, -0.56)} ${p(1.05, 0.12)}
      L ${p(0.92, -0.06)} L ${p(0.8, -0.36)} L ${p(0.6, -0.22)} L ${p(0.44, -0.46)} L ${p(0.22, -0.24)}
      L ${p(0.02, -0.5)} L ${p(-0.2, -0.27)} L ${p(-0.42, -0.48)} L ${p(-0.62, -0.25)} L ${p(-0.82, -0.4)} L ${p(-0.93, -0.06)} Z`;
    return <path d={d} {...common} />;
  }
  if (hairStyle === "short") {
    const d = `M ${p(-1.03, 0.02)} C ${p(-1.1, -0.72)} ${p(-0.55, -1.16)} ${p(0.05, -1.13)}
      C ${p(0.64, -1.12)} ${p(1.1, -0.72)} ${p(1.03, 0.02)}
      L ${p(0.93, -0.22)} C ${p(0.84, -0.5)} ${p(0.55, -0.62)} ${p(0.22, -0.6)}
      C ${p(-0.08, -0.58)} ${p(-0.3, -0.66)} ${p(-0.42, -0.82)}
      C ${p(-0.56, -0.56)} ${p(-0.8, -0.46)} ${p(-0.94, -0.2)} Z`;
    return <path d={d} {...common} />;
  }
  const d = `M ${p(-1.08, 0.34)} C ${p(-1.18, -0.6)} ${p(-0.62, -1.14)} ${p(0.02, -1.12)}
    C ${p(0.66, -1.14)} ${p(1.18, -0.6)} ${p(1.08, 0.34)}
    L ${p(0.95, 0.36)} C ${p(0.94, -0.04)} ${p(0.82, -0.3)} ${p(0.56, -0.44)}
    C ${p(0.3, -0.3)} ${p(0.0, -0.36)} ${p(-0.22, -0.52)}
    C ${p(-0.46, -0.36)} ${p(-0.82, -0.18)} ${p(-0.95, 0.36)} Z`;
  return (
    <g>
      <path d={d} {...common} />
      {accent && (
        <rect x={rx * 0.42} y={-ry * 0.74} width={rx * 0.34} height={ry * 0.14} rx={ry * 0.06}
          fill={accent} stroke={INK} strokeWidth={ow(spec) * 1.4} transform={`rotate(-28 ${rx * 0.59} ${-ry * 0.67})`} />
      )}
    </g>
  );
}
