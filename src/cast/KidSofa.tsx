import { INK } from "./characters.ts";

const CLOTH = "#6cc28e";
const SHADE = "#4fa874";

/**
 * 小孩的单人小沙发（侧面，朝右）：厚厚的座垫、往后斜的软靠背、圆圆的扶手、四个小短脚。
 * back / front 是座面的后边和前边，seat 是座面 y，rest 是靠背顶 y，bottom 是地面 y。
 * 人坐上去（seat: "sofa"）和单独摆着（kind: "sofa"）都用它。
 */
export function KidSofa({ back, front, seat, rest, bottom, line }: { back: number; front: number; seat: number; rest: number; bottom: number; line: number }) {
  const depth = front - back;
  const foot = depth * 0.12;
  const pad = depth * 0.22;
  const restW = depth * 0.34;
  const lean = (seat - rest) * 0.22;
  const arm = seat - (seat - rest) * 0.3;
  return (
    <g stroke={INK} strokeWidth={line} strokeLinejoin="round">
      {[back + depth * 0.12, front - depth * 0.12].map((x) => (
        <rect key={x} x={x - foot * 0.45} y={bottom - foot} width={foot * 0.9} height={foot} rx={foot * 0.3} fill="#b07a4a" />
      ))}
      <path d={`M ${back + restW * 0.2},${seat + pad * 0.5} L ${back - lean},${rest + restW * 0.4} Q ${back - lean + restW * 0.05},${rest} ${back - lean + restW * 0.55},${rest} Q ${back + restW},${rest + restW * 0.1} ${back + restW * 1.1},${seat} Z`} fill={SHADE} />
      <rect x={back - lean * 0.2} y={seat} width={depth + lean * 0.2} height={bottom - foot - seat} rx={pad * 0.5} fill={SHADE} />
      <rect x={back - lean * 0.35} y={arm} width={depth * 0.98 + lean * 0.35} height={(seat - arm) + pad * 0.9} rx={pad * 0.6} fill={CLOTH} />
      <path d={`M ${back + depth * 0.12},${arm + pad * 0.35} Q ${back + depth * 0.5},${arm + pad * 0.15} ${front - depth * 0.1},${arm + pad * 0.35}`} fill="none" stroke="#ffffff" strokeWidth={line * 0.9} strokeLinecap="round" opacity={0.6} />
    </g>
  );
}
