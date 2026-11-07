import { CAST, CHARACTER_IDS, type CharacterId } from "../cast/characters.ts";
import { CastSheet } from "../render/CastSheet.tsx";

export function CastPage({ id }: { id: CharacterId }) {
  return (
    <div className="app">
      <div className="topbar">
        <a className="btn ghost" href="#/">← 书架</a>
        <h1>认识角色</h1>
        <nav className="tabs" aria-label="角色">
          {CHARACTER_IDS.map((c) => (
            <a key={c} className="btn ghost" href={`#/cast/${c}`} aria-current={c === id ? "page" : undefined}>{CAST[c].name}</a>
          ))}
        </nav>
      </div>
      <CastSheet key={id} id={id} />
    </div>
  );
}
