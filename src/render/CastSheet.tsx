import { CAST, INK, type CharacterId } from "../cast/characters.ts";
import { Figure } from "../cast/Figure.tsx";
import { POSE_ANGLES } from "../cast/poses.ts";
import { solve } from "../cast/rig.ts";
import { EXPRESSION_LABELS, POSE_LABELS } from "../story/labels.ts";
import { EXPRESSIONS, POSES } from "../story/vocab.ts";

const W = 1600;
const COLS = 7;
const CELL_W = W / COLS;
const POSE_H = 360;
const FACE_H = 260;
const TITLE_H = 90;
const SECTION_H = 56;

/** 角色样张：所有姿势（全身）+ 所有表情（半身），给孩子挑、给 agent 自查 */
export function CastSheet({ id }: { id: CharacterId }) {
  const spec = CAST[id];
  const stand = solve(spec.body, POSE_ANGLES.stand);
  const height = -stand.top;
  const poseRows = Math.ceil(POSES.length / COLS);
  const faceRows = Math.ceil(EXPRESSIONS.length / COLS);
  const H = TITLE_H + SECTION_H + poseRows * POSE_H + SECTION_H + faceRows * FACE_H + 30;
  const all = POSES.map((p) => solve(spec.body, POSE_ANGLES[p]).bounds);
  const tallest = Math.max(height, 400, ...all.map((b) => -b.minY));
  const widest = Math.max(...all.map((b) => Math.max(-b.minX, b.maxX) * 2));
  const poseScale = Math.min((POSE_H - 100) / tallest, (CELL_W - 40) / widest);
  const [hx, hy0] = stand.head.c;
  const hy = hy0 - spec.body.headRy * 0.12;
  const headBox = spec.body.headRx * 3.4;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="sheet" data-snap role="img" aria-label={`${spec.name}的样张`}>
      <rect width={W} height={H} fill="#fffdf8" />
      <text x={40} y={60} fontSize={44} fill={INK} className="story-font">{spec.name}</text>
      <text x={40 + spec.name.length * 46 + 20} y={60} fontSize={26} fill="#8b7a5c" className="story-font">{spec.age} · {spec.about}</text>

      <text x={40} y={TITLE_H + 38} fontSize={30} fill={INK} className="story-font">姿势</text>
      {POSES.map((pose, i) => {
        const cx = (i % COLS) * CELL_W + CELL_W / 2;
        const top = TITLE_H + SECTION_H + Math.floor(i / COLS) * POSE_H;
        return (
          <g key={pose}>
            <rect x={cx - CELL_W / 2 + 8} y={top + 4} width={CELL_W - 16} height={POSE_H - 12} rx={18} fill="#fff" stroke="#ffe0cc" strokeWidth={3} />
            <ellipse cx={cx} cy={top + POSE_H - 62} rx={70} ry={10} fill="#000" opacity={0.06} />
            <g transform={`translate(${cx},${top + POSE_H - 62}) scale(${poseScale})`}>
              <Figure spec={spec} pose={pose} face={pose === "think" ? "thinking" : pose === "cheer" || pose === "jump" ? "happy" : "neutral"} hold={pose === "hold" ? "🎁" : undefined} />
            </g>
            <text x={cx} y={top + POSE_H - 22} fontSize={26} textAnchor="middle" fill="#8b7a5c" className="story-font">{POSE_LABELS[pose]} {pose}</text>
          </g>
        );
      })}

      <text x={40} y={TITLE_H + SECTION_H + poseRows * POSE_H + 38} fontSize={30} fill={INK} className="story-font">表情</text>
      {EXPRESSIONS.map((face, i) => {
        const x = (i % COLS) * CELL_W;
        const top = TITLE_H + SECTION_H * 2 + poseRows * POSE_H + Math.floor(i / COLS) * FACE_H;
        return (
          <g key={face}>
            <rect x={x + 8} y={top + 4} width={CELL_W - 16} height={FACE_H - 12} rx={18} fill="#fff" stroke="#ffe0cc" strokeWidth={3} />
            <svg x={x + 8} y={top + 4} width={CELL_W - 16} height={FACE_H - 60}
              viewBox={`${hx - headBox / 2} ${hy - headBox * 0.62} ${headBox} ${headBox * 0.92}`} preserveAspectRatio="xMidYMid meet">
              <Figure spec={spec} face={face} />
            </svg>
            <text x={x + CELL_W / 2} y={top + FACE_H - 24} fontSize={26} textAnchor="middle" fill="#8b7a5c" className="story-font">{EXPRESSION_LABELS[face]} {face}</text>
          </g>
        );
      })}
    </svg>
  );
}
