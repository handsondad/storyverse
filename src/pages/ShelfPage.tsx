import { CAST, CHARACTER_IDS } from "../cast/characters.ts";
import { CoverView } from "../render/PageView.tsx";
import { creditLine } from "../story/script.ts";
import { STORIES } from "../stories/index.ts";

export function ShelfPage() {
  return (
    <div className="app">
      <header className="hero">
        <h1>小念家的漫画书</h1>
        <p>和小念、爸爸、妈妈一起编故事，用代码画成漫画</p>
      </header>

      <section className="shelf" aria-label="书架">
        {STORIES.map((story) => (
          <a key={story.id} className="book" href={`#/read/${story.id}/0`}>
            <CoverView story={story} className="" />
            <div className="info">
              <h2>{story.title}</h2>
              <p>{story.blurb}</p>
              <p>{creditLine(story)}</p>
            </div>
          </a>
        ))}
      </section>

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
