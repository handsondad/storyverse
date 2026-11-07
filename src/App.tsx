import { useEffect, useState } from "react";
import { isCharacterId, type CharacterId } from "./cast/characters.ts";
import { CastPage } from "./pages/CastPage.tsx";
import { ReadPage } from "./pages/ReadPage.tsx";
import { ShelfPage } from "./pages/ShelfPage.tsx";
import { storyById } from "./stories/index.ts";

type Route =
  | { page: "shelf" }
  | { page: "cast"; id: CharacterId }
  | { page: "read"; id: string; n: number };

function parseRoute(hash: string): Route {
  const [, page, param, extra] = hash.replace(/^#/, "").split("/");
  if (page === "cast") return { page: "cast", id: param && isCharacterId(param) ? param : "nian" };
  if (page === "read" && param && storyById(param)) {
    const n = Number(extra);
    return { page: "read", id: param, n: Number.isFinite(n) ? n : 0 };
  }
  return { page: "shelf" };
}

export default function App() {
  const [route, setRoute] = useState(() => parseRoute(window.location.hash));
  useEffect(() => {
    const onHash = () => setRoute(parseRoute(window.location.hash));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  useEffect(() => { window.scrollTo(0, 0); }, [route]);

  if (route.page === "cast") return <CastPage id={route.id} />;
  if (route.page === "read") {
    const story = storyById(route.id);
    if (story) return <ReadPage story={story} page={route.n} />;
  }
  return <ShelfPage />;
}
