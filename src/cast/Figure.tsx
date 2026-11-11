import type { Expression, Pose } from "../story/vocab.ts";
import { INK } from "./characters.ts";
import { chairTransform, seating, type Seating, type SeatKind } from "./chair.ts";
import { BackHair, FACES, Head, ow, type Mark } from "./Head.tsx";
import { POSE_ANGLES, type Hand } from "./poses.ts";
import { solve, type Limb, type Pt, type Skeleton } from "./rig.ts";
import type { CharacterSpec } from "./types.ts";

export const EMOJI_FONT = `"Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif`;

type FigureProps = {
  spec: CharacterSpec;
  pose?: Pose;
  face?: Expression;
  facing?: "left" | "right";
  talking?: boolean;
  hold?: string;
  blink?: boolean;
  /** 坐在椅子上；tip 是连人带椅子往后翘的角度 */
  seat?: SeatKind;
  tip?: number;
};

/** 一个角色，脚底中点在 (0, 0)。外面用 translate 放到舞台上 */
export function Figure({ spec, pose = "stand", face = "neutral", facing = "right", talking = false, hold, blink, seat, tip }: FigureProps) {
  const sk = solve(spec.body, POSE_ANGLES[pose]);
  const angles = POSE_ANGLES[pose];
  const flip = facing === "left" ? -1 : 1;
  const line = ow(spec) * 2;
  const { look, body } = spec;
  const longSleeve = look.top.sleeve === "long";
  const [hx, hy] = sk.head.c;
  const headT = `translate(${hx},${hy}) rotate(${sk.head.angle})`;
  const chair = seat ? seating(body, sk, seat, tip) : null;

  return (
    <g>
      {chair && <g transform={`scale(${flip},1) ${chairTransform(chair)}`}><Chair s={chair} spec={spec} /></g>}
      <g transform={chair ? mirrored(chair, flip) : undefined}>
        <FigureBody spec={spec} sk={sk} pose={pose} face={face} flip={flip} talking={talking} hold={hold} blink={blink}
          headT={headT} stool={!!angles.seat && !chair} line={line} longSleeve={longSleeve} />
      </g>
      {chair?.kind === "bed" && <g transform={`scale(${flip},1) ${chairTransform(chair)}`}><Blanket s={chair} spec={spec} /></g>}
    </g>
  );
}

/** 翻转层里的变换，搬到翻转层外面：转的方向和转轴都跟着镜像 */
function mirrored(s: Seating, flip: number): string {
  return `translate(0,${-s.rise}) rotate(${-s.tip * flip} ${s.pivot * flip} 0) translate(0,${s.dy})`;
}

type BodyProps = {
  spec: CharacterSpec; sk: Skeleton; pose: Pose; face: Expression; flip: number; talking: boolean; hold?: string; blink?: boolean;
  headT: string; stool: boolean; line: number; longSleeve: boolean;
};

function FigureBody({ spec, sk, pose, face, flip, talking, hold, blink, headT, stool, line, longSleeve }: BodyProps) {
  const angles = POSE_ANGLES[pose];
  const { look, body } = spec;
  return (
    <g>
      <g transform={`scale(${flip},1)`}>
        <g transform={headT}><BackHair spec={spec} /></g>
        <Arm limb={sk.armL} spec={spec} hand={angles.handL} long={longSleeve} shade />
        {stool && <Stool sk={sk} spec={spec} />}
        <Legs sk={sk} spec={spec} />
        <Torso sk={sk} spec={spec} />
        <Neck sk={sk} spec={spec} />
        <g transform={headT}><Head spec={spec} face={face} talking={talking} blink={blink} /></g>
        <Arm limb={sk.armR} spec={spec} hand={angles.handR} long={longSleeve} />
      </g>
      {hold && (
        <>
          <text x={((sk.armL.end[0] + sk.armR.end[0]) / 2) * flip} y={Math.min(sk.armL.end[1], sk.armR.end[1]) - body.hand * 1.6}
            fontSize={body.hand * 5.5} textAnchor="middle" dominantBaseline="central" fontFamily={EMOJI_FONT}>{hold}</text>
          <g transform={`scale(${flip},1)`}>
            <circle cx={sk.armR.end[0]} cy={sk.armR.end[1]} r={body.hand} fill={look.skin} stroke={INK} strokeWidth={line} />
          </g>
        </>
      )}
      <Marks marks={FACES[face].marks ?? []} sk={sk} spec={spec} flip={flip} />
      {pose === "wave" && <WaveLines at={sk.armR.end} r={body.hand} flip={flip} line={line} />}
    </g>
  );
}

const pts = (...ps: Pt[]) => ps.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" L ");
const limbPath = (l: Limb) => `M ${pts(l.root, l.mid, l.end)}`;

/** 沿着一条胳膊或腿，从 a 到 b（0～1，按长度）截一段 */
function slice(l: Limb, a: number, b: number): string {
  const seg = [l.root, l.mid, l.end];
  const lens = [dist(seg[0], seg[1]), dist(seg[1], seg[2])];
  const total = lens[0] + lens[1];
  const at = (k: number): Pt => {
    const d = k * total;
    if (d <= lens[0]) return lerp(seg[0], seg[1], lens[0] ? d / lens[0] : 0);
    return lerp(seg[1], seg[2], lens[1] ? (d - lens[0]) / lens[1] : 0);
  };
  const out: Pt[] = [at(a)];
  const midK = lens[0] / total;
  if (a < midK && b > midK) out.push(seg[1]);
  out.push(at(b));
  return `M ${pts(...out)}`;
}

function cut(l: Limb, k: number): { p: Pt; n: Pt } {
  const total = dist(l.root, l.mid) + dist(l.mid, l.end);
  const d = k * total;
  const first = dist(l.root, l.mid);
  const [a, b, t] = d <= first ? [l.root, l.mid, d / first] : [l.mid, l.end, (d - first) / dist(l.mid, l.end)];
  const p = lerp(a, b, t);
  const len = dist(a, b) || 1;
  return { p, n: [-(b[1] - a[1]) / len, (b[0] - a[0]) / len] };
}

const dist = (a: Pt, b: Pt) => Math.hypot(b[0] - a[0], b[1] - a[1]);
const lerp = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const round = { fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

function Arm({ limb, spec, hand = "mitten", long, shade }: { limb: Limb; spec: CharacterSpec; hand?: Hand; long: boolean; shade?: boolean }) {
  const { body, look } = spec;
  const o = ow(spec);
  const w = body.limb * 0.92;
  const sleeveEnd = long ? 0.93 : 0.36;
  const sleeveW = w + (long ? 2 : 6);
  const cuff = cut(limb, sleeveEnd);
  return (
    <g>
      <path d={limbPath(limb)} {...round} stroke={INK} strokeWidth={w + o * 2} />
      <path d={slice(limb, 0, sleeveEnd)} {...round} stroke={INK} strokeWidth={sleeveW + o * 2} />
      <path d={limbPath(limb)} {...round} stroke={look.skin} strokeWidth={w} />
      <path d={slice(limb, 0, sleeveEnd)} {...round} stroke={look.top.color} strokeWidth={sleeveW} />
      <path d={`M ${cuff.p[0] + (cuff.n[0] * sleeveW) / 2},${cuff.p[1] + (cuff.n[1] * sleeveW) / 2} L ${cuff.p[0] - (cuff.n[0] * sleeveW) / 2},${cuff.p[1] - (cuff.n[1] * sleeveW) / 2}`}
        stroke={INK} strokeWidth={o * 1.2} strokeLinecap="round" />
      {shade && <path d={slice(limb, 0, sleeveEnd)} {...round} stroke="#000" strokeOpacity={0.08} strokeWidth={sleeveW} />}
      <HandShape at={limb.end} from={limb.mid} kind={hand} spec={spec} />
    </g>
  );
}

function HandShape({ at, from, kind, spec }: { at: Pt; from: Pt; kind: Hand; spec: CharacterSpec }) {
  const r = spec.body.hand * (kind === "open" ? 1.12 : 1);
  const line = ow(spec) * 2;
  const len = dist(from, at) || 1;
  const dir: Pt = [(at[0] - from[0]) / len, (at[1] - from[1]) / len];
  return (
    <g>
      {kind === "point" && (
        <>
          <path d={`M ${at[0]},${at[1]} l ${dir[0] * r * 1.7},${dir[1] * r * 1.7}`} {...round} stroke={INK} strokeWidth={r * 0.7 + line} />
          <path d={`M ${at[0]},${at[1]} l ${dir[0] * r * 1.7},${dir[1] * r * 1.7}`} {...round} stroke={spec.look.skin} strokeWidth={r * 0.7} />
        </>
      )}
      <circle cx={at[0]} cy={at[1]} r={r} fill={spec.look.skin} stroke={INK} strokeWidth={line} />
      {kind === "open" && (
        <path d={`M ${at[0] - r * 0.35},${at[1] - r * 0.15} l 0,${-r * 0.5} M ${at[0] + r * 0.1},${at[1] - r * 0.25} l 0,${-r * 0.55}`}
          {...round} stroke={INK} strokeWidth={line * 0.5} opacity={0.5} />
      )}
    </g>
  );
}

function Legs({ sk, spec }: { sk: Skeleton; spec: CharacterSpec }) {
  const { body, look } = spec;
  const o = ow(spec);
  const w = body.limb;
  const legs = [sk.legL, sk.legR];
  const kind = look.bottom.kind;
  const total = body.thigh + body.shin;
  const cover = kind === "pants" ? 0.96 : kind === "shorts" ? (body.thigh * 0.62) / total : 0;
  const pelvisRect = { x: sk.pelvis[0] - body.hip - w * 0.6, y: sk.pelvis[1] - w * 0.9, w: body.hip * 2 + w * 1.2, h: w * 1.5 };
  return (
    <g>
      {legs.map((l, i) => <path key={`o${i}`} d={limbPath(l)} {...round} stroke={INK} strokeWidth={w + o * 2} />)}
      {legs.map((l, i) => <path key={`f${i}`} d={limbPath(l)} {...round} stroke={look.skin} strokeWidth={w} />)}
      {look.socks && legs.map((l, i) => <path key={`s${i}`} d={slice(l, 0.84, 0.97)} {...round} stroke={look.socks} strokeWidth={w} />)}
      {cover > 0 && (
        <g>
          {legs.map((l, i) => <path key={`co${i}`} d={slice(l, 0, cover)} {...round} stroke={INK} strokeWidth={w + 4 + o * 2} />)}
          <rect {...rectProps(pelvisRect)} rx={w * 0.5} fill="none" stroke={INK} strokeWidth={o * 2} />
          <rect {...rectProps(pelvisRect)} rx={w * 0.5} fill={look.bottom.color} />
          {legs.map((l, i) => <path key={`cf${i}`} d={slice(l, 0, cover)} {...round} stroke={look.bottom.color} strokeWidth={w + 4} />)}
        </g>
      )}
      {legs.map((l, i) => <Shoe key={`sh${i}`} leg={l} spec={spec} />)}
      {kind === "skirt" && <Skirt sk={sk} spec={spec} />}
    </g>
  );
}

const rectProps = (r: { x: number; y: number; w: number; h: number }) => ({ x: r.x, y: r.y, width: r.w, height: r.h });

function Shoe({ leg, spec }: { leg: Limb; spec: CharacterSpec }) {
  const w = spec.body.limb;
  const len = dist(leg.mid, leg.end) || 1;
  const d: Pt = [(leg.end[0] - leg.mid[0]) / len, (leg.end[1] - leg.mid[1]) / len];
  const f: Pt = [d[1], -d[0]];
  const c: Pt = [leg.end[0] + f[0] * w * 0.32 + d[0] * w * 0.05, leg.end[1] + f[1] * w * 0.32 + d[1] * w * 0.05];
  const angle = (Math.atan2(f[1], f[0]) * 180) / Math.PI;
  return (
    <ellipse cx={c[0]} cy={c[1]} rx={w * 0.98} ry={w * 0.55} transform={`rotate(${angle} ${c[0]} ${c[1]})`}
      fill={spec.look.shoes} stroke={INK} strokeWidth={ow(spec) * 2} />
  );
}

function Skirt({ sk, spec }: { sk: Skeleton; spec: CharacterSpec }) {
  const { body, look } = spec;
  const [px, py] = sk.pelvis;
  const top = py - body.limb * 1.2;
  const knees = Math.max(sk.legL.mid[1], sk.legR.mid[1]);
  const hem = Math.min(py + body.thigh * 0.78, knees + body.limb * 0.3);
  const spread = Math.max(sk.legL.root[0] - sk.legL.mid[0], sk.legR.mid[0] - sk.legR.root[0], 0);
  const tw = body.hip + body.limb * 0.6;
  const bwL = body.hip + body.thigh * 0.5 + Math.max(0, sk.legL.root[0] - sk.legL.mid[0]) * 0.6;
  const bwR = body.hip + body.thigh * 0.5 + Math.max(0, sk.legR.mid[0] - sk.legR.root[0]) * 0.6 + spread * 0.1;
  const d = `M ${px - tw},${top} L ${px + tw},${top} L ${px + bwR},${hem}
    Q ${px},${hem + body.limb * 0.7} ${px - bwL},${hem} Z`;
  return <path d={d} fill={look.bottom.color} stroke={INK} strokeWidth={ow(spec) * 2} strokeLinejoin="round" />;
}

function Torso({ sk, spec }: { sk: Skeleton; spec: CharacterSpec }) {
  const { body, look } = spec;
  const o = ow(spec);
  const w = body.limb;
  const [px, py] = sk.pelvis;
  const rot = (x: number, y: number): Pt => {
    const a = (sk.lean * Math.PI) / 180;
    return [sk.shoulderC[0] + x * Math.cos(a) - y * Math.sin(a), sk.shoulderC[1] + x * Math.sin(a) + y * Math.cos(a)];
  };
  const sl = rot(-body.shoulder - w * 0.35, w * 0.25);
  const sr = rot(body.shoulder + w * 0.35, w * 0.25);
  const peak = rot(0, -w * 0.55);
  const hemY = py + (look.bottom.kind === "skirt" ? -w * 0.6 : w * 0.15);
  const flare = look.top.collar === "round" ? w * 0.25 : 0;
  const wl: Pt = [px - body.hip - w * 0.6 - flare, hemY];
  const wr: Pt = [px + body.hip + w * 0.6 + flare, hemY];
  const d = `M ${wl[0]},${wl[1]} L ${sl[0]},${sl[1]} Q ${peak[0]},${peak[1]} ${sr[0]},${sr[1]} L ${wr[0]},${wr[1]} Q ${px},${hemY + w * 0.25} ${wl[0]},${wl[1]} Z`;
  return (
    <g>
      <path d={d} fill={look.top.color} stroke={INK} strokeWidth={o * 2} strokeLinejoin="round" />
      <Collar sk={sk} spec={spec} rot={rot} />
    </g>
  );
}

function Collar({ spec, rot }: { sk: Skeleton; spec: CharacterSpec; rot: (x: number, y: number) => Pt }) {
  const { body, look } = spec;
  const o = ow(spec);
  const w = body.limb;
  if (look.top.collar === "round") {
    const a = rot(-w * 0.75, -w * 0.25);
    const b = rot(w * 0.75, -w * 0.25);
    const c = rot(0, w * 0.45);
    return <path d={`M ${a[0]},${a[1]} Q ${c[0]},${c[1]} ${b[0]},${b[1]}`} fill="none" stroke={INK} strokeWidth={o * 1.4} opacity={0.5} strokeLinecap="round" />;
  }
  if (look.top.collar === "shirt") {
    const l1 = rot(-w * 0.9, -w * 0.35);
    const l2 = rot(-w * 0.15, w * 1.0);
    const l3 = rot(-w * 0.95, w * 0.55);
    const r1 = rot(w * 0.9, -w * 0.35);
    const r2 = rot(w * 0.15, w * 1.0);
    const r3 = rot(w * 0.95, w * 0.55);
    const btn = [rot(0, w * 1.6), rot(0, w * 2.6), rot(0, w * 3.6)];
    return (
      <g>
        <path d={`M ${l1} L ${l2} L ${l3} Z M ${r1} L ${r2} L ${r3} Z`} fill="#ffffff" stroke={INK} strokeWidth={o * 1.4} strokeLinejoin="round" />
        {btn.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={w * 0.12} fill={INK} opacity={0.5} />)}
      </g>
    );
  }
  return null;
}

function Neck({ sk, spec }: { sk: Skeleton; spec: CharacterSpec }) {
  const w = spec.body.limb * 0.85;
  const d = `M ${sk.shoulderC[0]},${sk.shoulderC[1] - w * 0.2} L ${sk.neckTop[0]},${sk.neckTop[1]}`;
  return (
    <g>
      <path d={d} {...round} stroke={INK} strokeWidth={w + ow(spec) * 2} />
      <path d={d} {...round} stroke={spec.look.skin} strokeWidth={w} />
    </g>
  );
}

function Stool({ sk, spec }: { sk: Skeleton; spec: CharacterSpec }) {
  const { body } = spec;
  const o = ow(spec);
  const seatY = sk.pelvis[1] + body.limb * 0.55;
  const half = body.hip + body.limb * 1.3;
  const cx = sk.pelvis[0] - body.limb * 0.3;
  const wood = "#c98b52";
  return (
    <g stroke={INK} strokeWidth={o * 2} strokeLinejoin="round">
      <path d={`M ${cx - half * 0.75},${seatY} L ${cx - half * 0.85},0 M ${cx + half * 0.75},${seatY} L ${cx + half * 0.85},0`} stroke={INK} strokeWidth={body.limb * 0.45 + o * 2} strokeLinecap="round" />
      <path d={`M ${cx - half * 0.75},${seatY} L ${cx - half * 0.85},0 M ${cx + half * 0.75},${seatY} L ${cx + half * 0.85},0`} stroke={wood} strokeWidth={body.limb * 0.45} strokeLinecap="round" />
      <rect x={cx - half} y={seatY - body.limb * 0.1} width={half * 2} height={body.limb * 0.6} rx={body.limb * 0.3} fill={wood} />
    </g>
  );
}

/** 医院推床：斜靠背、白床垫、金属架子和轮子；远处一侧有护栏 */
function Bed({ s, spec }: { s: Seating; spec: CharacterSpec }) {
  const o = ow(spec) * 2;
  const metal = "#aab6c2";
  const sheet = "#eef6ff";
  const frame = [
    `M ${s.back + 40},${s.seat + 30} L ${s.back + 40},-24`,
    `M ${s.front - 40},${s.seat + 30} L ${s.front - 40},-24`,
    `M ${s.back + 20},${s.seat + 44} L ${s.front - 20},${s.seat + 44}`,
  ].join(" ");
  const rail = `M ${s.hinge + 30},${s.seat - 46} L ${s.front - 70},${s.seat - 46} M ${s.hinge + 40},${s.seat - 46} L ${s.hinge + 40},${s.seat} M ${s.front - 80},${s.seat - 46} L ${s.front - 80},${s.seat}`;
  const rest = `M ${s.hinge + 10},${s.seat + 6} L ${s.back + 30},${s.rest}`;
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <path d={`${frame} ${rail}`} fill="none" stroke={INK} strokeWidth={12 + o} />
      <path d={`${frame} ${rail}`} fill="none" stroke={metal} strokeWidth={12} />
      {[s.back + 40, s.front - 40].map((x) => <circle key={x} cx={x} cy={-16} r={16} fill="#5d6670" stroke={INK} strokeWidth={o} />)}
      <path d={rest} fill="none" stroke={INK} strokeWidth={46 + o} />
      <path d={rest} fill="none" stroke={sheet} strokeWidth={46} />
      <rect x={s.back + 10} y={s.seat - 4} width={s.front - s.back - 10} height={36} rx={16} fill={sheet} stroke={INK} strokeWidth={o} />
    </g>
  );
}

/** 盖在腿上的被子，画在人前面 */
function Blanket({ s, spec }: { s: Seating; spec: CharacterSpec }) {
  const o = ow(spec) * 2;
  const { limb, hip } = spec.body;
  const x0 = s.hinge - hip * 0.4;
  const x1 = s.front - 6;
  const top = s.seat - limb * 2.1;
  const y1 = s.seat + 14;
  const d = `M ${x0},${y1} L ${x0},${top + 30} Q ${x0 + 10},${top} ${x0 + 60},${top + 6}
    Q ${(x0 + x1) / 2},${top - 10} ${x1 - 40},${top + 10} Q ${x1},${top + 14} ${x1},${top + 50} L ${x1},${y1} Z`;
  return (
    <g>
      <path d={d} fill="#bfe0ff" stroke={INK} strokeWidth={o} strokeLinejoin="round" />
      <path d={`M ${x0 + 30},${top + 34} Q ${(x0 + x1) / 2},${top + 20} ${x1 - 30},${top + 38}`} fill="none" stroke="#ffffff" strokeWidth={8} strokeLinecap="round" opacity={0.7} />
      {[0.3, 0.55, 0.8].map((k) => <circle key={k} cx={x0 + (x1 - x0) * k} cy={y1 - 22} r={7} fill="#ffffff" opacity={0.8} />)}
    </g>
  );
}

/** 带靠背的椅子；high-chair 是小孩的高脚餐椅，多一根踏脚横杆 */
function Chair({ s, spec }: { s: Seating; spec: CharacterSpec }) {
  if (s.kind === "bed") return <Bed s={s} spec={spec} />;
  const o = ow(spec) * 2;
  const high = s.kind === "high-chair";
  const wood = high ? "#f4b26a" : "#c98b52";
  const w = 15;
  const splay = high ? 22 : 6;
  const legs = [
    `M ${s.back + 10},${s.seat} L ${s.back - splay},0`,
    `M ${s.front - 10},${s.seat} L ${s.front + splay},0`,
    `M ${s.back + 6},${s.seat} L ${s.pivot + w / 2},${s.rest + 20}`,
  ].join(" ");
  const bar = high ? `M ${s.back - splay * 0.4},${s.seat * 0.4} L ${s.front + splay * 0.4},${s.seat * 0.4}` : "";
  const restH = (s.seat - s.rest) * 0.5;
  // 另一侧的两条腿，错开一点画在后面，侧面看也是四条腿
  const far = `M ${s.back + 24},${s.seat} L ${s.back + 14 - splay},-12 M ${s.front + 4},${s.seat} L ${s.front + 14 + splay},-12`;
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <path d={far} fill="none" stroke={INK} strokeWidth={w + o} />
      <path d={far} fill="none" stroke={wood} strokeWidth={w} />
      <path d={far} fill="none" stroke="#000" strokeOpacity={0.18} strokeWidth={w} />
      <path d={`${legs} ${bar}`} fill="none" stroke={INK} strokeWidth={w + o} />
      <path d={`${legs} ${bar}`} fill="none" stroke={wood} strokeWidth={w} />
      <rect x={s.pivot} y={s.rest} width={w * 2.2} height={restH} rx={w} fill={wood} stroke={INK} strokeWidth={o} />
      <rect x={s.back - 8} y={s.seat - 6} width={s.front - s.back + 22} height={22} rx={10} fill={wood} stroke={INK} strokeWidth={o} />
    </g>
  );
}

/** 漫画符号：画在翻转层外面，所以"？"和"Zz"不会左右反过来 */
function Marks({ marks, sk, spec, flip }: { marks: readonly Mark[]; sk: Skeleton; spec: CharacterSpec; flip: number }) {
  const { headRx: rx, headRy: ry } = spec.body;
  const cx = sk.head.c[0] * flip;
  const cy = sk.head.c[1];
  const line = ow(spec) * 2;
  const front = flip;
  return (
    <g>
      {marks.map((m) => {
        switch (m) {
          case "!":
            return (
              <g key={m} transform={`translate(${cx + front * rx * 1.05},${cy - ry * 1.3}) rotate(${front * 12})`}>
                <path d={`M 0,${-ry * 0.42} L 0,${ry * 0.05}`} stroke={INK} strokeWidth={rx * 0.16 + line} strokeLinecap="round" />
                <path d={`M 0,${-ry * 0.42} L 0,${ry * 0.05}`} stroke="#ff6b4a" strokeWidth={rx * 0.16} strokeLinecap="round" />
                <circle cy={ry * 0.27} r={rx * 0.08 + line / 2} fill={INK} />
                <circle cy={ry * 0.27} r={rx * 0.08} fill="#ff6b4a" />
              </g>
            );
          case "?":
            return (
              <text key={m} x={cx + front * rx * 1.0} y={cy - ry * 1.15} fontSize={ry * 0.75} fontWeight={700} textAnchor="middle"
                fill="#5b8def" stroke={INK} strokeWidth={line * 0.6} paintOrder="stroke" className="story-font">?</text>
            );
          case "zzz":
            return (
              <text key={m} x={cx + front * rx * 0.95} y={cy - ry * 1.1} fontSize={ry * 0.45} textAnchor="middle"
                fill="#8b7ad8" stroke="#fff" strokeWidth={line} paintOrder="stroke" className="story-font">Zz</text>
            );
          case "anger": {
            const x = cx + front * rx * 0.72;
            const y = cy - ry * 0.82;
            const s = rx * 0.13;
            return (
              <g key={m} transform={`translate(${x},${y})`} stroke="#e8453c" strokeWidth={line * 1.1} fill="none" strokeLinecap="round">
                <path d={`M ${-s},${-s * 0.3} Q ${-s * 0.3},${-s * 0.3} ${-s * 0.3},${-s}`} />
                <path d={`M ${s},${-s * 0.3} Q ${s * 0.3},${-s * 0.3} ${s * 0.3},${-s}`} />
                <path d={`M ${-s},${s * 0.3} Q ${-s * 0.3},${s * 0.3} ${-s * 0.3},${s}`} />
                <path d={`M ${s},${s * 0.3} Q ${s * 0.3},${s * 0.3} ${s * 0.3},${s}`} />
              </g>
            );
          }
          case "sweat": {
            const x = cx - front * rx * 0.98;
            const y = cy - ry * 0.45;
            const s = rx * 0.12;
            return (
              <path key={m} d={`M ${x},${y - s * 1.6} Q ${x + s},${y} ${x},${y + s * 0.4} Q ${x - s},${y} ${x},${y - s * 1.6} Z`}
                fill="#bfe6ff" stroke="#4aa3df" strokeWidth={line * 0.6} />
            );
          }
          case "sparkle":
            return (
              <g key={m} fill="#ffd166" stroke={INK} strokeWidth={line * 0.4}>
                {[[1.15, -0.9, 1], [-1.2, -0.6, 0.7], [0.9, -1.35, 0.55]].map(([dx, dy, k], i) => (
                  <path key={i} d={star(cx + front * dx * rx, cy + dy * ry, rx * 0.16 * k)} />
                ))}
              </g>
            );
          default:
            return null;
        }
      })}
    </g>
  );
}

function star(x: number, y: number, r: number): string {
  const k = r * 0.28;
  return `M ${x},${y - r} Q ${x + k},${y - k} ${x + r},${y} Q ${x + k},${y + k} ${x},${y + r} Q ${x - k},${y + k} ${x - r},${y} Q ${x - k},${y - k} ${x},${y - r} Z`;
}

function WaveLines({ at, r, flip, line }: { at: Pt; r: number; flip: number; line: number }) {
  const x = at[0] * flip;
  const y = at[1];
  return (
    <g fill="none" stroke={INK} strokeWidth={line * 0.7} strokeLinecap="round" opacity={0.6}>
      <path d={`M ${x + flip * r * 1.7},${y - r * 1.2} q ${flip * r * 0.6},${r * 1.2} 0,${r * 2.4}`} />
      <path d={`M ${x - flip * r * 1.7},${y - r * 1.2} q ${-flip * r * 0.6},${r * 1.2} 0,${r * 2.4}`} />
    </g>
  );
}
