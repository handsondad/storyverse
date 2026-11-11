/**
 * 背景：都画在舞台坐标里（1600×1000，地面 880），并往四周多画一圈，镜头推到边上也不露白。
 * 同一页里有好几格，渐变 id 要带上 uid，免得互相串。
 */
import { INK } from "../cast/characters.ts";
import { EMOJI_FONT } from "../cast/Figure.tsx";
import { STAGE, stageX, thingHeight } from "../engine/stage.ts";
import type { Prop, SceneSpec, Thing } from "../story/types.ts";
import type { TimeOfDay } from "../story/vocab.ts";

const X0 = -500;
const W = STAGE.w + 1000;
const Y0 = -400;
const H = STAGE.h + 800;
const G = STAGE.ground;

const SKY: Record<TimeOfDay, [string, string]> = {
  morning: ["#bfe3ff", "#fff1d6"],
  day: ["#86cbff", "#e3f4ff"],
  evening: ["#ff9f7a", "#ffe0a8"],
  night: ["#1d2758", "#41508f"],
};

const line = { stroke: INK, strokeWidth: 6, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

export function Background({ scene, uid }: { scene: SceneSpec; uid: string }) {
  const time = scene.time ?? "day";
  switch (scene.place) {
    case "living-room": return <LivingRoom time={time} uid={uid} rain={scene.weather === "rain"} />;
    case "dining-room": return <DiningRoom time={time} uid={uid} rain={scene.weather === "rain"} />;
    case "bathroom": return <Bathroom />;
    case "hospital": return <Hospital />;
    case "bedroom": return <Bedroom time={time} uid={uid} rain={scene.weather === "rain"} />;
    case "park": return <Park time={time} uid={uid} rain={scene.weather === "rain"} />;
    case "museum": return <Museum time={time} uid={uid} tint={scene.tint ?? "#f4f0e6"} />;
    case "subway": return <Subway tint={scene.tint ?? "#e8f5e9"} />;
    case "plain": return <Plain tint={scene.tint ?? "#fff1c9"} />;
    case "burst": return <Burst tint={scene.tint ?? "#ffd166"} />;
  }
}

/** 天空：窗户里、公园里都用 */
function Sky({ time, uid, rain, x, y, w, h }: { time: TimeOfDay; uid: string; rain: boolean; x: number; y: number; w: number; h: number }) {
  const [top, bottom] = rain ? (time === "night" ? ["#1c2340", "#3a4466"] : ["#9fb0c4", "#d9e2ea"]) : SKY[time];
  const id = `sky-${uid}`;
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="1" stopColor={bottom} />
        </linearGradient>
      </defs>
      <rect x={x} y={y} width={w} height={h} fill={`url(#${id})`} />
    </g>
  );
}

function Celestial({ time, rain, sunAt, moonAt }: { time: TimeOfDay; rain: boolean; sunAt: [number, number]; moonAt: [number, number] }) {
  if (rain) return <Clouds y={sunAt[1] - 20} dark spread={[sunAt[0] - 260, sunAt[0] + 40]} />;
  if (time === "night") {
    return (
      <g>
        {stars(moonAt[0] - 700, moonAt[1] - 120, 900, 380, 18).map(([sx, sy, r], i) => <circle key={i} cx={sx} cy={sy} r={r} fill="#fff6c8" />)}
        <circle cx={moonAt[0]} cy={moonAt[1]} r={56} fill="#fff3b0" />
        <circle cx={moonAt[0] + 24} cy={moonAt[1] - 14} r={50} fill={SKY.night[0]} />
      </g>
    );
  }
  const color = time === "evening" ? "#ff8a4c" : "#ffd84d";
  return (
    <g>
      <circle cx={sunAt[0]} cy={sunAt[1]} r={110} fill={color} opacity={0.25} />
      <circle cx={sunAt[0]} cy={sunAt[1]} r={72} fill={color} />
    </g>
  );
}

/** 固定的伪随机，同一个场景每次画出来都一样 */
function rand(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

function stars(x: number, y: number, w: number, h: number, n: number): [number, number, number][] {
  const r = rand(7);
  return Array.from({ length: n }, () => [x + r() * w, y + r() * h, 2 + r() * 3.5]);
}

function Clouds({ y, dark, spread }: { y: number; dark?: boolean; spread: [number, number] }) {
  const fill = dark ? "#c3ccd8" : "#ffffff";
  const at = [spread[0], (spread[0] + spread[1]) / 2 + 160, spread[1] + 260];
  return (
    <g fill={fill} opacity={dark ? 0.95 : 0.9}>
      {at.map((cx, i) => (
        <g key={i} transform={`translate(${cx},${y + (i % 2) * 50})`}>
          <ellipse rx={95} ry={38} />
          <circle cx={-40} cy={-24} r={42} />
          <circle cx={30} cy={-36} r={50} />
        </g>
      ))}
    </g>
  );
}

function Window({ x, y, w, h, time, uid, rain, curtain }: { x: number; y: number; w: number; h: number; time: TimeOfDay; uid: string; rain: boolean; curtain: string }) {
  return (
    <g>
      <rect x={x - 14} y={y - 14} width={w + 28} height={h + 28} rx={10} fill="#ffffff" {...line} />
      <svg x={x} y={y} width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <Sky time={time} uid={`${uid}-win`} rain={rain} x={0} y={0} w={w} h={h} />
        <Celestial time={time} rain={rain} sunAt={[w * 0.7, h * 0.3]} moonAt={[w * 0.72, h * 0.3]} />
        {rain && <Rain x={0} y={0} w={w} h={h} seed={3} />}
        {time !== "night" && !rain && <path d={`M 0,${h * 0.82} Q ${w * 0.3},${h * 0.62} ${w * 0.6},${h * 0.8} T ${w},${h * 0.76} L ${w},${h} L 0,${h} Z`} fill="#a8dc8c" />}
      </svg>
      <path d={`M ${x + w / 2},${y} L ${x + w / 2},${y + h} M ${x},${y + h / 2} L ${x + w},${y + h / 2}`} stroke="#ffffff" strokeWidth={12} />
      <path d={`M ${x + w / 2},${y} L ${x + w / 2},${y + h} M ${x},${y + h / 2} L ${x + w},${y + h / 2}`} stroke={INK} strokeWidth={3} opacity={0.4} />
      <path d={`M ${x - 40},${y - 30} Q ${x + 30},${y + h * 0.5} ${x - 10},${y + h + 40} L ${x - 70},${y + h + 40} L ${x - 70},${y - 30} Z`} fill={curtain} {...line} />
      <path d={`M ${x + w + 40},${y - 30} Q ${x + w - 30},${y + h * 0.5} ${x + w + 10},${y + h + 40} L ${x + w + 70},${y + h + 40} L ${x + w + 70},${y - 30} Z`} fill={curtain} {...line} />
      <rect x={x - 90} y={y - 46} width={w + 180} height={20} rx={10} fill="#c98b52" {...line} />
    </g>
  );
}

function Night({ time }: { time: TimeOfDay }) {
  if (time === "night") return <rect x={X0} y={Y0} width={W} height={H} fill="#1b2350" opacity={0.3} />;
  if (time === "evening") return <rect x={X0} y={Y0} width={W} height={H} fill="#ff9a5a" opacity={0.1} />;
  return null;
}

function Floor({ color, plank }: { color: string; plank: string }) {
  const r = rand(11);
  return (
    <g>
      <rect x={X0} y={G - 70} width={W} height={H} fill={color} />
      {Array.from({ length: 4 }, (_, i) => (
        <path key={i} d={`M ${X0},${G - 30 + i * 60} L ${X0 + W},${G - 30 + i * 60}`} stroke={plank} strokeWidth={4} />
      ))}
      {Array.from({ length: 22 }, (_, i) => {
        const row = i % 4;
        const x = X0 + r() * W;
        return <path key={`v${i}`} d={`M ${x},${G - 70 + row * 60 + (row ? 40 : 0)} l 0,${row ? 60 : 40}`} stroke={plank} strokeWidth={4} />;
      })}
      <rect x={X0} y={G - 84} width={W} height={18} fill="#ffffff" {...line} strokeWidth={4} />
    </g>
  );
}

function LivingRoom({ time, uid, rain }: { time: TimeOfDay; uid: string; rain: boolean }) {
  return (
    <g>
      <rect x={X0} y={Y0} width={W} height={H} fill="#fff1dc" />
      {Array.from({ length: 18 }, (_, i) => <rect key={i} x={X0 + i * 160} y={Y0} width={60} height={H} fill="#ffe7c7" />)}
      <rect x={X0} y={G - 250} width={W} height={180} fill="#f8dcbb" />
      <path d={`M ${X0},${G - 250} L ${X0 + W},${G - 250}`} {...line} strokeWidth={4} opacity={0.5} />
      <Window x={170} y={220} w={360} h={330} time={time} uid={uid} rain={rain} curtain="#ffb3a7" />
      <g>
        <rect x={700} y={250} width={180} height={140} rx={8} fill="#ffffff" {...line} />
        <rect x={718} y={268} width={144} height={104} fill="#d8f0ff" />
        <circle cx={830} cy={295} r={16} fill="#ffd84d" />
        <path d={`M 718,372 L 765,310 L 800,350 L 825,325 L 862,372 Z`} fill="#8fd18a" />
      </g>
      <Floor color="#e9c096" plank="#d9a97a" />
      <ellipse cx={800} cy={G + 20} rx={560} ry={70} fill="#f7c4a6" stroke={INK} strokeWidth={5} opacity={0.9} />
      <Sofa x={960} y={G - 300} w={520} />
      <g>
        <path d={`M 1565,${G - 10} L 1565,${G - 380}`} {...line} strokeWidth={10} />
        <path d={`M 1500,${G - 380} L 1630,${G - 380} L 1600,${G - 470} L 1530,${G - 470} Z`} fill={time === "night" ? "#fff3a6" : "#ffe9a8"} {...line} />
        {time === "night" && <circle cx={1565} cy={G - 400} r={130} fill="#fff3a6" opacity={0.25} />}
        <ellipse cx={1565} cy={G - 6} rx={50} ry={12} fill={INK} />
      </g>
      <Plant x={60} />
      <Night time={time} />
    </g>
  );
}

function Sofa({ x, y, w }: { x: number; y: number; w: number }) {
  const c = "#c7a3d9";
  const d = "#b48cc8";
  return (
    <g>
      <rect x={x} y={y} width={w} height={200} rx={40} fill={c} {...line} />
      <rect x={x - 30} y={y + 110} width={w + 60} height={150} rx={30} fill={d} {...line} />
      <rect x={x + 40} y={y + 120} width={w / 2 - 50} height={70} rx={22} fill={c} {...line} />
      <rect x={x + w / 2 + 10} y={y + 120} width={w / 2 - 50} height={70} rx={22} fill={c} {...line} />
      <rect x={x - 60} y={y + 80} width={80} height={190} rx={36} fill={c} {...line} />
      <rect x={x + w - 20} y={y + 80} width={80} height={190} rx={36} fill={c} {...line} />
      <rect x={x + 60} y={y + 30} width={110} height={90} rx={24} fill="#ffd166" {...line} transform={`rotate(-8 ${x + 115} ${y + 75})`} />
    </g>
  );
}

function Plant({ x }: { x: number }) {
  return (
    <g>
      <path d={`M ${x - 50},${G - 160} L ${x + 50},${G - 160} L ${x + 38},${G - 30} L ${x - 38},${G - 30} Z`} fill="#e88a5a" {...line} />
      {[-60, -20, 20, 60].map((a, i) => (
        <ellipse key={i} cx={x + a * 0.9} cy={G - 240 - (i % 2) * 40} rx={34} ry={78} fill={i % 2 ? "#5fb86a" : "#7bcb79"} {...line} transform={`rotate(${a * 0.6} ${x + a * 0.9} ${G - 240})`} />
      ))}
    </g>
  );
}

function DiningRoom({ time, uid, rain }: { time: TimeOfDay; uid: string; rain: boolean }) {
  return (
    <g>
      <rect x={X0} y={Y0} width={W} height={H} fill="#fdf0d8" />
      {Array.from({ length: 30 }, (_, i) => (
        <circle key={i} cx={X0 + (i % 10) * 270 + (Math.floor(i / 10) % 2) * 135} cy={Y0 + 200 + Math.floor(i / 10) * 200} r={14} fill="#f6dfb8" />
      ))}
      <rect x={X0} y={G - 300} width={W} height={230} fill="#cfe3c8" />
      <path d={`M ${X0},${G - 300} L ${X0 + W},${G - 300}`} {...line} strokeWidth={4} opacity={0.5} />
      <Window x={1080} y={200} w={330} h={300} time={time} uid={uid} rain={rain} curtain="#ffd28a" />
      <g>
        <circle cx={300} cy={260} r={70} fill="#ffffff" {...line} />
        <path d="M 300,260 L 300,215 M 300,260 L 332,276" {...line} strokeWidth={7} />
        <circle cx={300} cy={260} r={7} fill={INK} />
      </g>
      <g>
        <rect x={-180} y={G - 330} width={340} height={260} rx={16} fill="#c98b52" {...line} />
        <path d={`M -10,${G - 320} L -10,${G - 80}`} {...line} strokeWidth={4} opacity={0.6} />
        <circle cx={-30} cy={G - 200} r={9} fill={INK} />
        <circle cx={10} cy={G - 200} r={9} fill={INK} />
        <text x={-80} y={G - 375} fontSize={80} textAnchor="middle" fontFamily={EMOJI_FONT}>🫖</text>
        <text x={70} y={G - 375} fontSize={80} textAnchor="middle" fontFamily={EMOJI_FONT}>🍎</text>
      </g>
      <Floor color="#e3b98e" plank="#d2a273" />
      <g>
        <path d={`M 800,${Y0} L 800,150`} {...line} strokeWidth={5} />
        <path d="M 690,230 Q 800,110 910,230 Z" fill="#ffb84d" {...line} />
        {time === "night" || time === "evening" ? <ellipse cx={800} cy={245} rx={120} ry={30} fill="#fff3a6" opacity={0.5} /> : null}
      </g>
      <Night time={time} />
    </g>
  );
}

function Bathroom() {
  return (
    <g>
      <rect x={X0} y={Y0} width={W} height={H} fill="#e4f3fb" />
      {Array.from({ length: 22 }, (_, i) => <path key={`v${i}`} d={`M ${X0 + i * 120},${Y0} L ${X0 + i * 120},${G}`} stroke="#c9e3f0" strokeWidth={5} />)}
      {Array.from({ length: 14 }, (_, i) => <path key={`h${i}`} d={`M ${X0},${Y0 + i * 120} L ${X0 + W},${Y0 + i * 120}`} stroke="#c9e3f0" strokeWidth={5} />)}
      <rect x={X0} y={G - 40} width={W} height={H} fill="#b9d7e6" />
      <path d={`M ${X0},${G - 40} L ${X0 + W},${G - 40}`} {...line} strokeWidth={4} opacity={0.5} />
      <rect x={910} y={170} width={300} height={330} rx={150} fill="#d9f2ff" {...line} />
      <path d="M 960,260 L 1010,210 M 975,320 L 1060,235" stroke="#ffffff" strokeWidth={14} strokeLinecap="round" />
      <path d={`M 1110,${G - 470} l 0,-40 l -60,0`} {...line} strokeWidth={14} fill="none" />
      <path d={`M 1110,${G - 470} l 0,-40 l -60,0`} stroke="#cfd8dc" strokeWidth={6} fill="none" strokeLinecap="round" />
      <path d={`M 880,${G - 460} L 1240,${G - 460} Q 1230,${G - 330} 1060,${G - 320} Q 890,${G - 330} 880,${G - 460} Z`} fill="#ffffff" {...line} />
      <rect x={1030} y={G - 330} width={60} height={290} fill="#ffffff" {...line} />
      <rect x={1320} y={G - 560} width={110} height={260} rx={20} fill="#ff9fb2" {...line} />
      <path d={`M 1300,${G - 560} L 1450,${G - 560}`} {...line} strokeWidth={10} />
      <text x={950} y={G - 470} fontSize={70} textAnchor="middle" fontFamily={EMOJI_FONT}>🧼</text>
      <text x={1200} y={G - 470} fontSize={60} textAnchor="middle" fontFamily={EMOJI_FONT}>🪥</text>
    </g>
  );
}

/** 医院走廊：产房的双开门、扶手、长椅、挂钟 */
function Hospital() {
  return (
    <g>
      <rect x={X0} y={Y0} width={W} height={H} fill="#eaf6f1" />
      {[150, 750, 1350].map((x) => <rect key={x} x={x - 120} y={Y0 + 380} width={240} height={36} rx={10} fill="#ffffff" {...line} strokeWidth={4} />)}
      <rect x={X0} y={G - 280} width={W} height={210} fill="#cfe9df" />
      <path d={`M ${X0},${G - 300} L ${X0 + W},${G - 300}`} stroke={INK} strokeWidth={18} strokeLinecap="round" />
      <path d={`M ${X0},${G - 300} L ${X0 + W},${G - 300}`} stroke="#c9d3db" strokeWidth={10} strokeLinecap="round" />
      <g>
        <rect x={960} y={G - 560} width={440} height={490} fill="#9ecfe8" {...line} />
        <path d={`M 1180,${G - 560} L 1180,${G - 70}`} {...line} />
        {[1020, 1240].map((x) => <rect key={x} x={x} y={G - 500} width={100} height={120} rx={8} fill="#e3f4fb" {...line} strokeWidth={4} />)}
        {[1160, 1200].map((x) => <path key={x} d={`M ${x},${G - 340} l 0,60`} {...line} strokeWidth={8} />)}
        <rect x={1060} y={G - 650} width={240} height={70} rx={12} fill="#ff8fa3" {...line} />
        <text x={1180} y={G - 615} fontSize={44} textAnchor="middle" dominantBaseline="central" fill="#ffffff" className="story-font">产房</text>
      </g>
      <g>
        <circle cx={620} cy={300} r={64} fill="#ffffff" {...line} />
        <path d="M 620,300 L 648,316 M 620,300 L 620,250" {...line} strokeWidth={7} />
        <circle cx={620} cy={300} r={7} fill={INK} />
      </g>
      <g>
        <rect x={120} y={G - 200} width={360} height={36} rx={12} fill="#7fc4a8" {...line} />
        <rect x={130} y={G - 270} width={340} height={60} rx={14} fill="#7fc4a8" {...line} />
        {[150, 450].map((x) => <path key={x} d={`M ${x},${G - 164} L ${x},${G - 70}`} {...line} strokeWidth={10} />)}
      </g>
      <rect x={X0} y={G - 70} width={W} height={H} fill="#dfe7ec" />
      {Array.from({ length: 24 }, (_, i) => <path key={i} d={`M ${X0 + i * 120},${G - 70} L ${X0 + i * 120 - 40},${G + 400}`} stroke="#c8d3da" strokeWidth={4} />)}
      <path d={`M ${X0},${G - 70} L ${X0 + W},${G - 70}`} {...line} strokeWidth={4} opacity={0.5} />
    </g>
  );
}

/** 饭桌：画在人前面，桌面离地 TABLE_TOP */
export const TABLE_TOP = 205;

export function Table({ from, to }: { from: number; to: number }) {
  const x0 = stageX(from);
  const x1 = stageX(to);
  const top = G - TABLE_TOP;
  const wood = "#d9a066";
  return (
    <g>
      {[x0 + 40, x1 - 70].map((x) => <rect key={x} x={x} y={top + 20} width={30} height={TABLE_TOP - 20} rx={8} fill="#c48a52" {...line} />)}
      <rect x={x0} y={top + 18} width={x1 - x0} height={44} rx={8} fill="#c48a52" {...line} />
      <rect x={x0 - 24} y={top} width={x1 - x0 + 48} height={30} rx={12} fill={wood} {...line} />
      <path d={`M ${x0 + 10},${top + 9} L ${x1 - 10},${top + 9}`} stroke="#ffffff" strokeWidth={5} strokeLinecap="round" opacity={0.35} />
    </g>
  );
}

function Bedroom({ time, uid, rain }: { time: TimeOfDay; uid: string; rain: boolean }) {
  return (
    <g>
      <rect x={X0} y={Y0} width={W} height={H} fill="#ece8ff" />
      {stars(X0, Y0 + 300, W, 400, 26).map(([x, y, r], i) => <path key={i} d={sparkle(x, y, r * 3)} fill="#d7d0ff" />)}
      <Window x={560} y={200} w={300} h={300} time={time} uid={uid} rain={rain} curtain="#9cc7ff" />
      <g>
        <rect x={80} y={330} width={320} height={22} rx={8} fill="#c98b52" {...line} />
        <text x={150} y={318} fontSize={90} textAnchor="middle" fontFamily={EMOJI_FONT}>🧸</text>
        <text x={290} y={318} fontSize={80} textAnchor="middle" fontFamily={EMOJI_FONT}>🚀</text>
      </g>
      <Floor color="#dcb894" plank="#c99f78" />
      <ellipse cx={700} cy={G + 30} rx={420} ry={60} fill="#bfe0ff" stroke={INK} strokeWidth={5} opacity={0.85} />
      <Bed x={1060} />
      <Night time={time} />
      {time === "night" && <circle cx={1010} cy={G - 120} r={90} fill="#fff3a6" opacity={0.35} />}
      {time === "night" && <path d={sparkle(1010, G - 120, 30)} fill="#ffe066" {...line} strokeWidth={4} />}
    </g>
  );
}

function Bed({ x }: { x: number }) {
  return (
    <g>
      <rect x={x + 420} y={G - 420} width={60} height={420} rx={20} fill="#c98b52" {...line} />
      <rect x={x} y={G - 230} width={470} height={150} rx={24} fill="#ffffff" {...line} />
      <rect x={x + 300} y={G - 290} width={150} height={80} rx={34} fill="#fff8e6" {...line} />
      <path d={`M ${x - 10},${G - 220} Q ${x + 150},${G - 260} ${x + 290},${G - 230} L ${x + 300},${G - 70} L ${x - 10},${G - 70} Z`} fill="#8fc1ff" {...line} />
      {[[x + 60, G - 170], [x + 170, G - 130], [x + 240, G - 190]].map(([sx, sy], i) => <path key={i} d={sparkle(sx, sy, 16)} fill="#ffe066" />)}
      <rect x={x - 20} y={G - 80} width={510} height={30} rx={10} fill="#c98b52" {...line} />
      <rect x={x - 10} y={G - 50} width={30} height={50} fill="#c98b52" {...line} />
      <rect x={x + 450} y={G - 50} width={30} height={50} fill="#c98b52" {...line} />
    </g>
  );
}

function Park({ time, uid, rain }: { time: TimeOfDay; uid: string; rain: boolean }) {
  const night = time === "night";
  const grass = night ? "#4f7a5a" : "#9ed67b";
  return (
    <g>
      <Sky time={time} uid={uid} rain={rain} x={X0} y={Y0} w={W} h={H} />
      <Celestial time={time} rain={rain} sunAt={[1250, time === "evening" ? 470 : 170]} moonAt={[1250, 170]} />
      {!rain && !night && <Clouds y={210} spread={[150, 620]} />}
      <path d={`M ${X0},620 Q 200,480 520,600 T 1200,560 T 2100,600 L 2100,1400 L ${X0},1400 Z`} fill={night ? "#3e6150" : "#c4e8a8"} />
      <path d={`M ${X0},700 Q 300,600 700,690 T 1500,650 T 2100,700 L 2100,1400 L ${X0},1400 Z`} fill={night ? "#466d55" : "#ade08f"} />
      <Tree x={980} y={690} s={0.55} night={night} />
      <rect x={X0} y={G - 90} width={W} height={H} fill={grass} />
      <path d={`M ${X0},${G - 10} Q 400,${G - 40} 800,${G - 10} T 2100,${G - 10} L 2100,${G + 70} Q 1200,${G + 40} 800,${G + 70} T ${X0},${G + 60} Z`} fill={night ? "#8a8270" : "#f1ddb0"} />
      <Tree x={150} y={G - 60} s={1} night={night} />
      <Tree x={1480} y={G - 70} s={1.1} night={night} />
      {flowers().map(([fx, fy, c], i) => (
        <g key={i}>
          <circle cx={fx} cy={fy} r={11} fill={c} stroke={INK} strokeWidth={3} />
          <circle cx={fx} cy={fy} r={4} fill="#fff3b0" />
        </g>
      ))}
      {rain && [[420, G + 30, 120], [1050, G + 45, 150], [1330, G + 20, 90]].map(([px, py, rx], i) => (
        <ellipse key={i} cx={px} cy={py} rx={rx} ry={rx * 0.22} fill="#a6d4ff" stroke="#5aa5e6" strokeWidth={4} />
      ))}
      <Night time={time} />
    </g>
  );
}

function Tree({ x, y, s, night }: { x: number; y: number; s: number; night: boolean }) {
  const leaf = night ? "#3f7a4e" : "#6cc070";
  const leaf2 = night ? "#356b43" : "#5cae62";
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <path d="M -26,0 L -18,-230 L 18,-230 L 26,0 Z" fill="#a0703f" {...line} />
      <circle cx={-80} cy={-260} r={110} fill={leaf2} {...line} />
      <circle cx={80} cy={-270} r={110} fill={leaf2} {...line} />
      <circle cx={0} cy={-360} r={140} fill={leaf} {...line} />
    </g>
  );
}

function flowers(): [number, number, string][] {
  const r = rand(5);
  const colors = ["#ff8fab", "#ffd166", "#ffffff", "#b39ddb"];
  return Array.from({ length: 16 }, (_, i) => [X0 + 200 + r() * (W - 400), G - 70 + r() * 40 + (i % 2) * 110, colors[i % colors.length]]);
}

/** 美术馆外景：台阶 + 柱廊。tint 换墙色，好区分「中国美术馆」和「工艺美术馆」 */
function Museum({ time, uid, tint }: { time: TimeOfDay; uid: string; tint: string }) {
  const night = time === "night";
  return (
    <g>
      <Sky time={time} uid={uid} rain={false} x={X0} y={Y0} w={W} h={H} />
      <Celestial time={time} rain={false} sunAt={[1280, 160]} moonAt={[1280, 160]} />
      {!night && time !== "evening" && <Clouds y={180} spread={[80, 500]} />}
      <rect x={X0} y={G - 40} width={W} height={H} fill={night ? "#6b7368" : "#c5cfc0"} />
      <rect x={120} y={G - 620} width={1360} height={580} fill={tint} {...line} />
      <rect x={80} y={G - 650} width={1440} height={50} fill="#d4c4a8" {...line} />
      {[220, 420, 620, 820, 1020, 1220].map((x) => (
        <g key={x}>
          <rect x={x} y={G - 560} width={70} height={420} fill="#fffaf0" {...line} />
          <rect x={x - 10} y={G - 580} width={90} height={28} fill="#e8dcc8" {...line} />
        </g>
      ))}
      <rect x={680} y={G - 420} width={240} height={280} fill={night ? "#2a3558" : "#b8d8f0"} {...line} />
      <path d={`M 680,${G - 420} L 800,${G - 420} L 800,${G - 140} L 680,${G - 140} Z`} fill="#ffffff" opacity={0.25} />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M ${40 + i * 30},${G - 40 - i * 28} H ${1560 - i * 30} L ${1560 - i * 30},${G - i * 28} H ${40 + i * 30} Z`}
          fill={i % 2 ? "#ebe4d6" : "#f7f1e6"} stroke={INK} strokeWidth={4} />
      ))}
      <Night time={time} />
    </g>
  );
}

/** 地铁车厢：绿色八号线味道，座位 + 拉手 */
function Subway({ tint }: { tint: string }) {
  return (
    <g>
      <rect x={X0} y={Y0} width={W} height={H} fill="#1f2a33" />
      <rect x={60} y={120} width={1480} height={780} rx={40} fill={tint} {...line} />
      <rect x={100} y={160} width={400} height={260} rx={16} fill="#9fd0e8" {...line} />
      <rect x={560} y={160} width={400} height={260} rx={16} fill="#9fd0e8" {...line} />
      <rect x={1020} y={160} width={400} height={260} rx={16} fill="#9fd0e8" {...line} />
      <rect x={100} y={G - 220} width={1400} height={160} rx={20} fill="#2f9e6b" {...line} />
      {[180, 420, 660, 900, 1140, 1380].map((x) => (
        <rect key={x} x={x} y={G - 200} width={160} height={120} rx={18} fill="#248a5b" {...line} />
      ))}
      {[280, 560, 840, 1120, 1400].map((x) => (
        <g key={x}>
          <path d={`M ${x},220 L ${x},520`} stroke={INK} strokeWidth={10} strokeLinecap="round" />
          <path d={`M ${x},220 L ${x},520`} stroke="#cfd8dc" strokeWidth={5} strokeLinecap="round" />
          <ellipse cx={x} cy={200} rx={28} ry={14} fill="#ffb74d" {...line} />
        </g>
      ))}
      <rect x={700} y={480} width={200} height={280} rx={12} fill="#90caf9" {...line} />
      <text x={800} y={640} fontSize={72} textAnchor="middle" fill={INK} opacity={0.35} className="story-font">8</text>
      <rect x={X0} y={G - 20} width={W} height={H} fill="#37474f" />
      <path d={`M ${X0},${G - 20} H ${X0 + W}`} stroke="#90a4ae" strokeWidth={8} />
    </g>
  );
}

function Plain({ tint }: { tint: string }) {
  return (
    <g>
      <rect x={X0} y={Y0} width={W} height={H} fill={tint} />
      {Array.from({ length: 30 * 18 }, (_, i) => {
        const cx = X0 + (i % 30) * 90 + (Math.floor(i / 30) % 2) * 45;
        const cy = Y0 + Math.floor(i / 30) * 90;
        return <circle key={i} cx={cx} cy={cy} r={9} fill="#ffffff" opacity={0.35} />;
      })}
    </g>
  );
}

function Burst({ tint }: { tint: string }) {
  const cx = STAGE.w / 2;
  const cy = STAGE.h / 2;
  const n = 36;
  const R = 2000;
  return (
    <g>
      <rect x={X0} y={Y0} width={W} height={H} fill="#ffffff" />
      {Array.from({ length: n }, (_, i) => {
        const a0 = (i / n) * Math.PI * 2;
        const a1 = ((i + 0.5) / n) * Math.PI * 2;
        return <path key={i} d={`M ${cx},${cy} L ${cx + Math.cos(a0) * R},${cy + Math.sin(a0) * R} L ${cx + Math.cos(a1) * R},${cy + Math.sin(a1) * R} Z`} fill={tint} />;
      })}
      <circle cx={cx} cy={cy} r={260} fill="#ffffff" opacity={0.85} />
    </g>
  );
}

function sparkle(x: number, y: number, r: number): string {
  const k = r * 0.3;
  return `M ${x},${y - r} Q ${x + k},${y - k} ${x + r},${y} Q ${x + k},${y + k} ${x},${y + r} Q ${x - k},${y + k} ${x - r},${y} Q ${x - k},${y - k} ${x},${y - r} Z`;
}

/** 下雨：斜斜的雨丝，画在角色前面 */
export function Rain({ x = X0, y = Y0, w = W, h = H, seed = 1 }: { x?: number; y?: number; w?: number; h?: number; seed?: number }) {
  const r = rand(seed * 97);
  const n = Math.round((w * h) / 9000);
  return (
    <g stroke="#ffffff" strokeWidth={4} strokeLinecap="round" opacity={0.7}>
      {Array.from({ length: n }, (_, i) => {
        const sx = x + r() * w;
        const sy = y + r() * h;
        return <path key={i} d={`M ${sx},${sy} l -10,34`} stroke={i % 3 ? "#ffffff" : "#bfe0ff"} />;
      })}
    </g>
  );
}

export function PropView({ prop, uid }: { prop: Prop; uid: string }) {
  const size = prop.size ?? 90;
  const x = stageX(prop.x);
  const bottom = STAGE.ground - (prop.lift ?? 0);
  const y = bottom - (prop.thing ? thingHeight(prop.thing, size) : size) / 2;
  const id = `glow-${uid}`;
  return (
    <g>
      {prop.glow && (
        <>
          <defs>
            <radialGradient id={id}>
              <stop offset="0" stopColor={prop.glow} stopOpacity={0.85} />
              <stop offset="1" stopColor={prop.glow} stopOpacity={0} />
            </radialGradient>
          </defs>
          <circle cx={x} cy={y} r={size * 1.1} fill={`url(#${id})`} />
        </>
      )}
      {(prop.lift ?? 0) < 10 && <ellipse cx={x} cy={STAGE.ground} rx={size * 0.4} ry={size * 0.08} fill="#000" opacity={0.12} />}
      {prop.thing
        ? <ThingView x={x} bottom={bottom} w={size} thing={prop.thing} />
        : <text x={x} y={y} fontSize={size} textAnchor="middle" dominantBaseline="central" fontFamily={EMOJI_FONT}>{prop.emoji}</text>}
    </g>
  );
}

function ThingView(p: { x: number; bottom: number; w: number; thing: Thing }) {
  switch (p.thing.kind) {
    case "pillow": return <Pillow {...p} />;
    case "baby": return <Baby {...p} />;
    case "band": return <Band {...p} />;
  }
}

/** 裹在襁褓里睡着的小宝宝，头朝左 */
function Baby({ x, bottom, w }: { x: number; bottom: number; w: number }) {
  const h = w * 0.62;
  const cy = bottom - h / 2;
  const r = h * 0.4;
  const hx = x - w * 0.28;
  const hy = cy - h * 0.04;
  const wrap = "#cfe6ff";
  const eye = { fill: "none", stroke: INK, strokeWidth: 4, strokeLinecap: "round" as const };
  return (
    <g>
      <ellipse cx={x + w * 0.08} cy={cy} rx={w * 0.42} ry={h * 0.46} fill={wrap} {...line} strokeWidth={5} />
      <circle cx={hx} cy={hy} r={r * 1.28} fill={wrap} {...line} strokeWidth={5} />
      <path d={`M ${x - w * 0.05},${cy - h * 0.32} Q ${x + w * 0.15},${cy + h * 0.05} ${x + w * 0.42},${cy - h * 0.1}`} fill="none" stroke="#ffffff" strokeWidth={6} strokeLinecap="round" opacity={0.8} />
      <path d={`M ${x + w * 0.02},${cy + h * 0.38} Q ${x + w * 0.2},${cy + h * 0.1} ${x + w * 0.46},${cy + h * 0.12}`} fill="none" stroke={INK} strokeWidth={3} opacity={0.3} />
      <circle cx={hx} cy={hy} r={r} fill="#ffd9b8" {...line} strokeWidth={4} />
      <path d={`M ${hx - r * 0.15},${hy - r * 0.95} q ${r * 0.25},${-r * 0.3} ${r * 0.35},${r * 0.05}`} fill="none" stroke="#3b2a20" strokeWidth={5} strokeLinecap="round" />
      <path d={`M ${hx - r * 0.5},${hy - r * 0.05} q ${r * 0.16},${r * 0.14} ${r * 0.32},0 M ${hx + r * 0.18},${hy - r * 0.05} q ${r * 0.16},${r * 0.14} ${r * 0.32},0`} {...eye} />
      <path d={`M ${hx - r * 0.12},${hy + r * 0.38} q ${r * 0.12},${r * 0.12} ${r * 0.24},0`} {...eye} strokeWidth={3.5} />
      {[-1, 1].map((s) => <ellipse key={s} cx={hx + s * r * 0.55} cy={hy + r * 0.3} rx={r * 0.18} ry={r * 0.1} fill="#ff7b7b" opacity={0.45} />)}
    </g>
  );
}

/** 腕带特写：胖乎乎的小手腕上套一条腕带，上面写着字 */
function Band({ x, bottom, w, thing }: { x: number; bottom: number; w: number; thing: Thing }) {
  const h = w * 0.42;
  const cy = bottom - h / 2;
  const arm = h * 0.62;
  const bw = w * 0.62;
  const bh = h * 0.78;
  return (
    <g>
      <rect x={x - w * 0.5} y={cy - arm / 2} width={w * 0.86} height={arm} rx={arm / 2} fill="#ffd9b8" {...line} strokeWidth={5} />
      <circle cx={x + w * 0.38} cy={cy} r={arm * 0.72} fill="#ffd9b8" {...line} strokeWidth={5} />
      <path d={`M ${x + w * 0.38},${cy - arm * 0.3} q ${arm * 0.3},${arm * 0.3} 0,${arm * 0.6}`} fill="none" stroke={INK} strokeWidth={3} opacity={0.4} />
      <rect x={x - bw / 2 - w * 0.06} y={cy - bh / 2} width={bw} height={bh} rx={18} fill="#ffffff" {...line} strokeWidth={5} />
      <rect x={x - bw / 2 - w * 0.06} y={cy - bh / 2} width={bw * 0.16} height={bh} rx={14} fill="#9fd3ff" {...line} strokeWidth={4} />
      {thing.label && (
        <text x={x - w * 0.06 + bw * 0.08} y={cy} fontSize={bh * 0.42} textAnchor="middle" dominantBaseline="central" fill={INK} className="story-font">{thing.label}</text>
      )}
    </g>
  );
}

/** 乳胶枕：一高一低两道弧，上面一排排透气小孔。密封着的时候套一层透明袋子 */
function Pillow({ x, bottom, w, thing }: { x: number; bottom: number; w: number; thing: Thing }) {
  const bag = thing.sealed ? 30 : 0;
  const h = thingHeight(thing, w) - bag;
  const y = bottom - bag / 2;
  const L = x - w / 2;
  const R = x + w / 2;
  const T = y - h;
  const r = Math.min(h * 0.35, 22);
  const d = `M ${L},${y - r} Q ${L},${y} ${L + r},${y} L ${R - r},${y} Q ${R},${y} ${R},${y - r}
    C ${R},${T + h * 0.05} ${R - w * 0.2},${T - h * 0.06} ${x + w * 0.16},${T + h * 0.08}
    Q ${x},${T + h * 0.24} ${x - w * 0.18},${T + h * 0.16}
    C ${L + w * 0.18},${T + h * 0.08} ${L},${T + h * 0.18} ${L},${y - r} Z`;
  const holes: [number, number][] = [];
  const rows = Math.max(1, Math.floor((h * 0.55) / 22));
  for (let i = 0; i < rows; i += 1) {
    const hy = y - h * 0.22 - i * 22;
    for (let hx = L + 34 + (i % 2) * 14; hx < R - 30; hx += 30) holes.push([hx, hy]);
  }
  return (
    <g>
      <path d={d} fill="#fff4d6" {...line} strokeWidth={5} />
      <path d={`M ${L + 20},${y - h * 0.12} Q ${x},${y - h * 0.02} ${R - 20},${y - h * 0.12}`} stroke="#e9d6a6" strokeWidth={6} fill="none" strokeLinecap="round" />
      {holes.map(([hx, hy], i) => <circle key={i} cx={hx} cy={hy} r={3.5} fill="#e2cc96" />)}
      {thing.sealed && (
        <g>
          <rect x={L - 18} y={T - bag / 2 - 8} width={w + 36} height={h + bag + 8} rx={14} fill="#cfe8ff" fillOpacity={0.45} stroke="#6fa8d6" strokeWidth={4} />
          {[L - 18, R + 18].map((sx) => (
            <path key={sx} d={`M ${sx},${T - bag / 2 - 8} ${Array.from({ length: 6 }, (_, k) => `l ${k % 2 ? 8 : -8},${(h + bag + 8) / 6}`).join(" ")}`}
              fill="none" stroke="#6fa8d6" strokeWidth={3} />
          ))}
          <path d={`M ${L + 10},${T - 4} l 40,${h * 0.5} M ${L + 34},${T - 8} l 24,${h * 0.35}`} stroke="#ffffff" strokeWidth={6} strokeLinecap="round" opacity={0.8} />
          {thing.label && (
            <g>
              <rect x={R - 96} y={T - bag / 2 - 2} width={84} height={34} rx={6} fill="#ffd166" {...line} strokeWidth={3} />
              <text x={R - 54} y={T - bag / 2 + 16} fontSize={24} textAnchor="middle" dominantBaseline="central" fill={INK} className="story-font">{thing.label}</text>
            </g>
          )}
        </g>
      )}
    </g>
  );
}
