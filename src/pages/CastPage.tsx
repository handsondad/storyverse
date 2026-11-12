import { useEffect, useState } from "react";
import { CAST, CHARACTER_IDS, type CharacterId } from "../cast/characters.ts";
import { CastSheet } from "../render/CastSheet.tsx";

export function CastPage({ id }: { id: CharacterId }) {
  const [narrow, setNarrow] = useState(() => !document.body.classList.contains("snap") && window.matchMedia("(max-width: 640px)").matches);
  useEffect(() => {
    if (document.body.classList.contains("snap")) return;
    const mq = window.matchMedia("(max-width: 640px)");
    const onChange = () => setNarrow(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

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
      <CastSheet key={id} id={id} cols={narrow ? 3 : 7} />
    </div>
  );
}
