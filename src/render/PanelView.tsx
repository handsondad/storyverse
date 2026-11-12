import { INK } from "../cast/characters.ts";
import { Figure } from "../cast/Figure.tsx";
import type { PanelLayout } from "../engine/compose.ts";
import { STAGE } from "../engine/stage.ts";
import { Background, PropView, Rain, Table } from "../scenes/Scene.tsx";
import type { Panel } from "../story/types.ts";
import { BubbleView, CaptionView, SfxView } from "./Bubble.tsx";

type Props = {
  panel: Omit<Panel, "beats"> & { beats?: Panel["beats"] };
  layout: PanelLayout;
  uid: string;
  /** 动态漫画用：只显示到第几个 beat；不写就全显示 */
  upTo?: number;
  border?: boolean;
};

export function PanelView({ panel, layout, uid, upTo = Infinity, border = true }: Props) {
  const { rect, camera } = layout;
  const beats = panel.beats ?? [];
  const talking = new Set(beats.flatMap((b) => ("say" in b && b.kind !== "thought" ? [b.say] : [])));
  const clip = `clip-${uid}`;
  return (
    <g>
      <defs>
        <clipPath id={clip}><rect x={rect.x} y={rect.y} width={rect.w} height={rect.h} rx={border ? 12 : 0} /></clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        <svg x={rect.x} y={rect.y} width={rect.w} height={rect.h} viewBox={`${camera.x} ${camera.y} ${camera.w} ${camera.h}`} preserveAspectRatio="none">
          <Background scene={panel.scene} uid={uid} />
          {(panel.props ?? []).map((p, i) => !p.front && <PropView key={i} prop={p} uid={`${uid}-p${i}`} />)}
          {layout.actors.map((a, i) => (
            <g key={i} transform={`translate(${a.x},${STAGE.ground})`}>
              <ellipse cx={0} cy={4} rx={a.spec.body.shoulder * 1.6} ry={a.spec.body.limb * 0.5} fill="#000" opacity={0.12} />
              <Figure spec={a.spec} pose={a.actor.pose} face={a.actor.face} facing={a.facing} hold={a.actor.hold}
                talking={talking.has(a.actor.who)} seat={a.actor.seat} tip={a.actor.tip} perch={a.actor.perch} />
            </g>
          ))}
          {panel.scene.table && <Table {...panel.scene.table} counter={panel.scene.place === "pharmacy"} />}
          {(panel.props ?? []).map((p, i) => p.front && <PropView key={i} prop={p} uid={`${uid}-p${i}`} />)}
          {panel.scene.weather === "rain" && (panel.scene.place === "park" || panel.scene.place === "museum") && (
            <Rain seed={uid.length + rect.x} />
          )}
        </svg>
      </g>
      {border && <rect x={rect.x} y={rect.y} width={rect.w} height={rect.h} rx={12} fill="none" stroke={INK} strokeWidth={6} />}
      {layout.captions.filter((c) => c.beat <= upTo).map((c) => <g key={`c${c.beat}`} className="pop"><CaptionView c={c} /></g>)}
      {layout.bubbles.filter((b) => b.beat <= upTo).map((b) => <g key={`b${b.beat}`} className="pop"><BubbleView b={b} /></g>)}
      {layout.sfx.filter((s) => s.beat <= upTo).map((s) => <g key={`s${s.beat}`} className="pop"><SfxView s={s} /></g>)}
    </g>
  );
}
