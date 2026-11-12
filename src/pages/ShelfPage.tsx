import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { CAST, CHARACTER_IDS } from "../cast/characters.ts";
import { CoverView } from "../render/PageView.tsx";
import { creditLine } from "../story/script.ts";
import type { Story } from "../story/types.ts";
import { STORIES } from "../stories/index.ts";
import { shelfMemory } from "./shelfMemory.ts";
import { ago, byYear, COMPACT, fullDate, layoutLine, monthDay, sizeFor, yearOf } from "./timeline.ts";

/** 鼠标按住挪过这么多像素才算拖绳子，不算点 */
const DRAG = 5;

export function ShelfPage() {
  const scroller = useRef<HTMLDivElement>(null);
  const [room, setRoom] = useState(0);
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    // 少给两个像素，免得小数取整后多出一截能滑的地方
    const ro = new ResizeObserver(() => setRoom(Math.max(0, el.clientWidth - 2)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const size = sizeFor(room);

  const latest = useMemo(() => {
    const years = [...byYear(STORIES).values()];
    const last = years[years.length - 1] ?? [];
    return last[last.length - 1] as Story | undefined;
  }, []);
  const [open, setOpen] = useState<number | null>(shelfMemory.open !== undefined ? shelfMemory.open : latest ? yearOf(latest) : null);
  const [picked, setPicked] = useState(shelfMemory.picked ?? latest?.id);
  const [peek, setPeek] = useState<string | null>(null);
  const { items, width } = useMemo(() => layoutLine(STORIES, open, room, size), [open, room, size]);
  const tags = items.flatMap((it) => (it.kind === "story" ? [it.story] : []));
  const shown = STORIES.find((s) => s.id === (peek ?? picked));
  useEffect(() => {
    shelfMemory.open = open;
    shelfMemory.picked = picked;
  }, [open, picked]);

  // 开合一年以后，把那一年的开头挪到眼前；从书里回来时，把刚看的那本挪到正中
  const pending = useRef<number | null>(open);
  const back = useRef(shelfMemory.picked !== undefined ? picked : undefined);
  useLayoutEffect(() => {
    const el = scroller.current;
    const year = pending.current;
    if (!el || year === null || !room) return;
    pending.current = null;
    const tag = back.current && items.find((i) => i.kind === "story" && i.story.id === back.current);
    back.current = undefined;
    if (tag) {
      el.scrollTo({ left: Math.max(0, tag.x - el.clientWidth / 2) });
      return;
    }
    const it = items.find((i) => i.kind !== "story" && i.year === year);
    if (!it) return;
    const w = it.kind === "flag" ? size.flagW : size.yearW;
    el.scrollTo({ left: Math.max(0, it.x - size.pad - w / 2), behavior: "smooth" });
  }, [items, room, size]);

  const toggle = (year: number, stories: readonly Story[] = []) => {
    setOpen((o) => (o === year ? null : year));
    if (stories.length) setPicked(stories[stories.length - 1].id);
    pending.current = year;
  };

  const [edges, setEdges] = useState({ left: false, right: false });
  const updateEdges = useCallback(() => {
    const el = scroller.current;
    if (el) setEdges({ left: el.scrollLeft > 4, right: el.scrollLeft < el.scrollWidth - el.clientWidth - 4 });
  }, []);
  useEffect(updateEdges, [items, room, updateEdges]);

  // 没有滚动条：电脑上按住拖、或者滚轮，都能让绳子左右走；手机上手指直接滑
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    let drag: { x: number; left: number; moved: boolean } | null = null;
    let draggedAt = 0;
    const down = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button === 0) drag = { x: e.clientX, left: el.scrollLeft, moved: false };
    };
    const move = (e: PointerEvent) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) > DRAG) {
        drag.moved = true;
        el.classList.add("dragging");
      }
      if (drag.moved) el.scrollLeft = drag.left - dx;
    };
    const up = () => {
      if (drag?.moved) draggedAt = Date.now();
      drag = null;
      el.classList.remove("dragging");
    };
    // 拖完松手时浏览器会补一个点击，别让它点开年份
    const click = (e: MouseEvent) => {
      if (Date.now() - draggedAt < 80) {
        e.stopPropagation();
        e.preventDefault();
      }
    };
    const wheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const max = el.scrollWidth - el.clientWidth;
      // 滚到头了就让页面接着上下滚
      if (max <= 0 || (e.deltaY < 0 && el.scrollLeft <= 0) || (e.deltaY > 0 && el.scrollLeft >= max - 1)) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    el.addEventListener("click", click, true);
    el.addEventListener("wheel", wheel, { passive: false });
    return () => {
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      el.removeEventListener("click", click, true);
      el.removeEventListener("wheel", wheel);
    };
  }, []);

  const onKey = (e: KeyboardEvent) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    const i = tags.findIndex((t) => t.id === picked);
    const next = tags[i < 0 ? 0 : i + (e.key === "ArrowLeft" ? -1 : 1)];
    if (!next) return;
    e.preventDefault();
    setPicked(next.id);
    document.getElementById(`tag-${next.id}`)?.focus();
  };

  const rope = `M ${size.pad / 2},${size.top} Q ${width / 2},${size.top + size.sag * 2} ${width - size.pad / 2},${size.top}`;

  return (
    <div className="app">
      <header className="hero">
        <h1>小念家的漫画书</h1>
        <p>小念、爸爸、妈妈一起编的故事，按发生的日子挂在绳子上</p>
      </header>

      <section className={`line${size === COMPACT ? " compact" : ""}${edges.left ? " more-left" : ""}${edges.right ? " more-right" : ""}`} aria-label="故事时间绳">
        <div className="line-scroll" ref={scroller} onScroll={updateEdges}>
          <div className="line-track" style={{ width, height: size.rowH }} onMouseLeave={() => setPeek(null)}>
            <svg className="rope" width={width} height={size.top + size.sag + 20} aria-hidden="true">
              <path d={rope} />
            </svg>
            <span className="pole" style={{ left: size.pad / 2 - 9, height: size.rowH - 24 }} aria-hidden="true" />
            <span className="pole" style={{ left: width - size.pad / 2 - 9, height: size.rowH - 24 }} aria-hidden="true" />
            <div role="listbox" aria-label={open ? `${open} 年的故事，从早到晚` : "每一年"} aria-orientation="horizontal" onKeyDown={onKey}>
              {items.map((it) => {
                if (it.kind === "flag") {
                  return (
                    <button key={`f${it.year}`} className="year-flag" aria-expanded="true" aria-label={`收起 ${it.year} 年`}
                      style={{ left: it.x - size.flagW / 2, top: size.top + it.y - 4, width: size.flagW }} onClick={() => toggle(it.year)}>
                      <span className="flag-year">{it.year}</span>
                      <span className="flag-fold">收起</span>
                    </button>
                  );
                }
                if (it.kind === "year") {
                  const last = it.stories[it.stories.length - 1];
                  return (
                    <button key={`y${it.year}`} className="tag year-card" aria-expanded="false"
                      aria-label={`${it.year} 年，${it.stories.length} 个故事，点开看`}
                      style={{ left: it.x - size.yearW / 2, top: size.top + it.y - 10, width: size.yearW }} onClick={() => toggle(it.year, it.stories)}>
                      <span className="peg" aria-hidden="true" />
                      <span className="card" style={{ background: it.color, ["--tilt" as string]: `${it.tilt}deg` }}>
                        <CoverView story={last} className="thumb" />
                        <span className="day">{it.year}</span>
                        <span className="name">{it.stories.length} 个故事</span>
                      </span>
                    </button>
                  );
                }
                return (
                  <button key={it.story.id} id={`tag-${it.story.id}`} role="option" aria-selected={it.story.id === picked}
                    tabIndex={it.story.id === picked ? 0 : -1}
                    className={it.story.id === (peek ?? picked) ? "tag on" : "tag"}
                    style={{ left: it.x - size.tagW / 2, top: size.top + it.y - 10, width: size.tagW }}
                    onMouseEnter={() => setPeek(it.story.id)} onFocus={() => setPicked(it.story.id)} onClick={() => setPicked(it.story.id)}>
                    <span className="peg" aria-hidden="true" />
                    <span className="card" style={{ background: it.color, ["--tilt" as string]: `${it.tilt}deg` }}>
                      <span className="day">{monthDay(it.story.when.date)}</span>
                      {it.story.when.label && <span className="label">{it.story.when.label}</span>}
                      <span className="name">{it.story.title}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <p className="line-hint">点年份卡展开那一年 · 点小旗收起</p>
      </section>

      {shown && (
        <article className="preview" key={shown.id} aria-live="polite">
          <a className="preview-cover" href={`#/read/${shown.id}/0`} aria-label={`翻开《${shown.title}》`}>
            <CoverView story={shown} className="" />
          </a>
          <div className="preview-info">
            <p className="when">
              {fullDate(shown.when.date)}
              {shown.when.label && <span className="chip">{shown.when.label}</span>}
              <span className="ago">{ago(shown.when.date, new Date())}</span>
            </p>
            <h2>{shown.title}</h2>
            <p>{shown.blurb}</p>
            <p className="by">{creditLine(shown)} · {shown.pages.length} 页</p>
            <a className="btn" href={`#/read/${shown.id}/0`}>翻开看</a>
          </div>
        </article>
      )}

      <section className="cast-strip">
        <h2>认识角色</h2>
        <div className="cast-links">
          {CHARACTER_IDS.map((id) => (
            <a key={id} className="btn ghost" href={`#/cast/${id}`}>{CAST[id].name}</a>
          ))}
        </div>
      </section>
    </div>
  );
}
