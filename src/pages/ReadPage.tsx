import { CoverView, creditLine, PageView } from "../render/PageView.tsx";
import type { Story } from "../story/types.ts";

type Props = {
  story: Story;
  /** 0 = 封面，1…n = 页码 */
  page: number;
};

export function ReadPage({ story, page }: Props) {
  const total = story.pages.length;
  const at = Math.max(0, Math.min(page, total));
  const prev = at > 0 ? `#/read/${story.id}/${at - 1}` : null;
  const next = at < total ? `#/read/${story.id}/${at + 1}` : null;

  return (
    <div className="app">
      <div className="topbar">
        <a className="btn ghost" href="#/">← 书架</a>
        <h1>{story.title}</h1>
        <span className="meta no-snap">{creditLine(story)}</span>
      </div>

      <div className="reader">
        {at === 0 ? <CoverView story={story} snap /> : <PageView story={story} n={at} />}

        {at === total ? (
          <div className="the-end no-snap">
            <h2>讲完啦</h2>
            <p>{creditLine(story)}</p>
            {story.credits.note && <p>{story.credits.note}</p>}
            <p style={{ marginTop: 16 }}>
              <a className="btn" href="#/">回书架</a>
            </p>
          </div>
        ) : (
          <div className="pager no-snap">
            {prev ? <a className="btn ghost" href={prev}>上一页</a> : <button className="btn ghost" disabled>上一页</button>}
            <span className="count">{at === 0 ? "封面" : `${at} / ${total}`}</span>
            {next ? <a className="btn" href={next}>{at === 0 ? "开始看" : "下一页"}</a> : <button className="btn" disabled>下一页</button>}
          </div>
        )}
      </div>
    </div>
  );
}
