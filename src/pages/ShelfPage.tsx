import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { CAST, CHARACTER_IDS } from "../cast/characters.ts";
import { CoverView } from "../render/PageView.tsx";
import { creditLine } from "../story/script.ts";
import { STORIES } from "../stories/index.ts";
import { ago, fullDate, layoutLine, LINE, monthDay } from "./timeline.ts";

export function ShelfPage() {
  const scroller = useRef<HTMLDivElement>(null);
  const [room, setRoom] = useState(0);
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    // 少给两个像素，免得小数取整后多出一条滚动条
    const ro = new ResizeObserver(() => setRoom(Math.max(0, el.clientWidth - 2)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const { items, width } = useMemo(() => layoutLine(STORIES, room), [room]);
  const tags = items.filter((it) => it.kind === "story");
  const latest = tags[tags.length - 1]?.story.id;
  const [picked, setPicked] = useState(latest);
  const [peek, setPeek] = useState<string | null>(null);
  const shown = tags.find((t) => t.story.id === (peek ?? picked))?.story;

  // 绳子比屏幕长时，先让人看到最近的故事
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [width]);

  const onKey = (e: KeyboardEvent) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    const i = tags.findIndex((t) => t.story.id === picked);
    const next = tags[i + (e.key === "ArrowLeft" ? -1 : 1)];
    if (!next) return;
    e.preventDefault();
    setPicked(next.story.id);
    document.getElementById(`tag-${next.story.id}`)?.focus();
  };

  const rope = `M ${LINE.pad / 2},${LINE.top} Q ${width / 2},${LINE.top + LINE.sag * 2} ${width - LINE.pad / 2},${LINE.top}`;

  return (
    <div className="app">
      <header className="hero">
        <h1>小念家的漫画书</h1>
        <p>小念、爸爸、妈妈一起编的故事，按发生的日子挂在绳子上</p>
      </header>

      <section className="line" aria-label="故事时间绳">
        <div className="line-scroll" ref={scroller}>
          <div className="line-track" style={{ width }} onMouseLeave={() => setPeek(null)}>
            <svg className="rope" width={width} height={LINE.top + LINE.sag + 20} aria-hidden="true">
              <path d={rope} />
            </svg>
            <span className="pole" style={{ left: LINE.pad / 2 - 9 }} aria-hidden="true" />
            <span className="pole" style={{ left: width - LINE.pad / 2 - 9 }} aria-hidden="true" />
            <div role="listbox" aria-label="按时间排的故事" aria-orientation="horizontal" onKeyDown={onKey}>
              {items.map((it) => it.kind === "year" ? (
                <span key={`y${it.year}`} className="year-flag" style={{ left: it.x - LINE.yearW / 2, top: LINE.top + it.y - 4, width: LINE.yearW }} aria-hidden="true">
                  {it.year}
                </span>
              ) : (
                <button key={it.story.id} id={`tag-${it.story.id}`} role="option" aria-selected={it.story.id === picked}
                  tabIndex={it.story.id === picked ? 0 : -1}
                  className={it.story.id === (peek ?? picked) ? "tag on" : "tag"}
                  style={{ left: it.x - LINE.tagW / 2, top: LINE.top + it.y - 10, width: LINE.tagW }}
                  onMouseEnter={() => setPeek(it.story.id)} onFocus={() => setPicked(it.story.id)} onClick={() => setPicked(it.story.id)}>
                  <span className="peg" aria-hidden="true" />
                  <span className="card" style={{ background: it.color, ["--tilt" as string]: `${it.tilt}deg` }}>
                    <span className="day">{monthDay(it.story.when.date)}</span>
                    {it.story.when.label && <span className="label">{it.story.when.label}</span>}
                    <span className="name">{it.story.title}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <p className="line-hint">← 更早 · 指一指或点一点绳子上的故事 · 最近 →</p>
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
