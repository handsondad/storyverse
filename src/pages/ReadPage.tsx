import { useEffect, useMemo, useRef, type TouchEvent } from "react";
import { CoverView, PageView } from "../render/PageView.tsx";
import { STORIES } from "../stories/index.ts";
import { creditLine } from "../story/script.ts";
import type { Story } from "../story/types.ts";
import { shelfMemory } from "./shelfMemory.ts";
import { byDate, yearOf } from "./timeline.ts";
import { useStoryPlayer } from "./useStoryPlayer.ts";

type Props = {
  story: Story;
  /** 0 = 封面，1…n = 页码 */
  page: number;
};

/** 手指横着划过这么远才算翻页，免得上下滚动时误翻 */
const SWIPE = 60;

export function ReadPage({ story, page }: Props) {
  const total = story.pages.length;
  const at = Math.max(0, Math.min(page, total));
  const prev = at > 0 ? `#/read/${story.id}/${at - 1}` : null;
  const next = at < total ? `#/read/${story.id}/${at + 1}` : null;
  const touch = useRef<{ x: number; y: number } | null>(null);
  const player = useStoryPlayer(story, at, next);
  const { toggle } = player;
  const nextStory = useMemo(() => {
    const ordered = [...STORIES].sort(byDate);
    const i = ordered.findIndex((s) => s.id === story.id);
    return i >= 0 ? ordered[i + 1] : undefined;
  }, [story.id]);

  useEffect(() => {
    shelfMemory.open = yearOf(story);
    shelfMemory.picked = story.id;
  }, [story]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === "ArrowLeft" && prev) location.hash = prev;
      else if (e.key === "ArrowRight" && next) location.hash = next;
      else if (e.key === " " && !(e.target instanceof HTMLButtonElement)) {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next, toggle]);

  const onTouchStart = (e: TouchEvent) => {
    const t = e.touches[0];
    touch.current = e.touches.length === 1 ? { x: t.clientX, y: t.clientY } : null;
  };
  const onTouchEnd = (e: TouchEvent) => {
    const start = touch.current;
    touch.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < SWIPE || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    const to = dx < 0 ? next : prev;
    if (to) location.hash = to;
  };

  return (
    <div className="app">
      <div className="topbar">
        <a className="btn ghost" href="#/">← 书架</a>
        <h1>{story.title}</h1>
        <span className="meta no-snap">{creditLine(story)}</span>
      </div>

      <div className={player.playing ? "reader playing" : "reader"} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {at === 0 ? <CoverView story={story} snap /> : <PageView story={story} n={at} reveal={player.reveal} />}

        {at === total && !player.reveal && (
          <div className="the-end no-snap">
            <h2>讲完啦</h2>
            <p>{creditLine(story)}</p>
            {story.credits.note && <p>{story.credits.note}</p>}
            {nextStory && (
              <div className="the-end-actions">
                <a className="btn ghost" href="#/">回书架</a>
                <a className="btn" href={`#/read/${nextStory.id}/0`}>下一本：《{nextStory.title}》</a>
              </div>
            )}
          </div>
        )}
        <div className="pager no-snap">
          {prev ? <a className="btn ghost" href={prev}>上一页</a> : <button className="btn ghost" disabled>上一页</button>}
          <span className="count">{at === 0 ? "封面" : `${at} / ${total}`}</span>
          {next ? <a className="btn" href={next}>{at === 0 ? "开始看" : "下一页"}</a> : <a className="btn" href="#/">回书架</a>}
          <button className={player.playing ? "btn ghost" : "btn play"} onClick={toggle}>
            {player.playing ? "⏸ 暂停" : "▶ 听故事"}
          </button>
        </div>
        <p className="hint no-snap">左右滑动或按 ← → 翻页，空格键听故事</p>
      </div>
    </div>
  );
}
