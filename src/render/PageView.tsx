import { INK } from "../cast/characters.ts";
import { composeCover, composePage, COVER_TITLE_H } from "../engine/compose.ts";
import { PAGE } from "../engine/layout.ts";
import { blockSize, wrap } from "../engine/text.ts";
import { creditLine } from "../story/script.ts";
import type { Story } from "../story/types.ts";
import { PanelView } from "./PanelView.tsx";

/** 动态漫画放到哪儿了：前面的格子全显示，这一格显示到第 beat 个，后面的格子先空着 */
export type Reveal = { readonly panel: number; readonly beat: number };

/** 一页漫画。n 从 1 数 */
export function PageView({ story, n, snap = true, reveal }: { story: Story; n: number; snap?: boolean; reveal?: Reveal }) {
  const page = story.pages[n - 1];
  const layouts = composePage(page);
  return (
    <svg viewBox={`0 0 ${PAGE.w} ${PAGE.h}`} className="page-svg" role="img" aria-label={`${story.title} 第 ${n} 页`}
      data-snap={snap ? "" : undefined} data-pages={story.pages.length}>
      <rect width={PAGE.w} height={PAGE.h} fill="#fffdf8" />
      {page.panels.map((panel, i) => {
        const l = layouts[i];
        if (!l) return null;
        if (reveal && i > reveal.panel) {
          return <rect key={i} x={l.rect.x} y={l.rect.y} width={l.rect.w} height={l.rect.h} rx={12} fill="#fff3e4" stroke="#f1dcc4" strokeWidth={6} />;
        }
        const upTo = reveal && i === reveal.panel ? reveal.beat : Infinity;
        return <g key={i} className={reveal ? "panel-in" : undefined}><PanelView panel={panel} layout={l} uid={`${story.id}-${n}-${i}`} upTo={upTo} /></g>;
      })}
      <text x={PAGE.w / 2} y={PAGE.h - 10} fontSize={18} textAnchor="middle" fill="#b8a88a" className="story-font">{n}</text>
    </svg>
  );
}

/** 封面：整页一个远景，上面一块书名牌，下面一条署名 */
export function CoverView({ story, snap = false, className = "page-svg" }: { story: Story; snap?: boolean; className?: string }) {
  const layout = composeCover(story);
  const size = 92;
  const lines = wrap(story.title, size, PAGE.w - 200);
  const block = blockSize(lines, size, 1.15);
  const boardW = Math.min(PAGE.w - 100, block.w + 120);
  const boardH = block.h + 70;
  const by = Math.max(60, (COVER_TITLE_H - boardH) / 2 + 40);
  const credit = creditLine(story);
  return (
    <svg viewBox={`0 0 ${PAGE.w} ${PAGE.h}`} className={className} role="img" aria-label={`${story.title} 封面`}
      data-snap={snap ? "" : undefined} data-pages={story.pages.length}>
      <PanelView panel={{ ...story.cover, props: layout.props, beats: [] }} layout={layout} uid={`${story.id}-cover`} border={false} />
      <g transform={`rotate(-2 ${PAGE.w / 2} ${by + boardH / 2})`}>
        <rect x={(PAGE.w - boardW) / 2 + 8} y={by + 10} width={boardW} height={boardH} rx={36} fill={INK} opacity={0.25} />
        <rect x={(PAGE.w - boardW) / 2} y={by} width={boardW} height={boardH} rx={36} fill="#fffdf8" stroke={INK} strokeWidth={8} />
        <text className="story-font" fontSize={size} fill="#ff8a3d" textAnchor="middle" stroke={INK} strokeWidth={3} paintOrder="stroke">
          {lines.map((l, i) => <tspan key={i} x={PAGE.w / 2} y={by + 35 + i * size * 1.15 + size * 0.92}>{l}</tspan>)}
        </text>
      </g>
      {credit && (
        <g>
          <rect x={60} y={PAGE.h - 120} width={PAGE.w - 120} height={70} rx={35} fill="#fffdf8" stroke={INK} strokeWidth={6} opacity={0.95} />
          <text className="story-font" x={PAGE.w / 2} y={PAGE.h - 75} fontSize={30} textAnchor="middle" fill={INK}>{credit}</text>
        </g>
      )}
    </svg>
  );
}
