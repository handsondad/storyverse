/**
 * 把一页故事数据算成完整的几何：每格在页面上的位置、镜头、角色站位、气泡和旁白的位置。
 * 画图组件和检查器都用它，所以检查器能报出"气泡挡脸""放不下"这类问题。
 */
import type { CharacterId } from "../cast/characters.ts";
import type { Page, Panel, Story } from "../story/types.ts";
import type { Shot } from "../story/vocab.ts";
import { placeBubbles, placeCaptions, type BubbleBox, type CaptionBox, type Face } from "./bubbles.ts";
import { frame } from "./camera.ts";
import { layoutPage, overlaps, PAGE, panelCount, type Rect } from "./layout.ts";
import { placeActors, propBox, type Box, type PlacedActor } from "./stage.ts";
import { textWidth } from "./text.ts";

const SFX_SPOTS: readonly (readonly [number, number])[] = [
  [0.78, 0.22], [0.8, 0.1], [0.22, 0.22], [0.5, 0.12], [0.8, 0.5], [0.2, 0.5], [0.78, 0.85], [0.22, 0.85], [0.5, 0.9],
];

export type Sfx = { readonly text: string; readonly x: number; readonly y: number; readonly size: number; readonly color: string; readonly angle: number };

export type PanelBubble = BubbleBox & { readonly kind: "speech" | "thought" | "shout" | "whisper"; readonly speaker: CharacterId; readonly beat: number };

export type PanelLayout = {
  readonly rect: Rect;
  /** 舞台上被框进来的那一块 */
  readonly camera: Rect;
  /** 页面单位 / 舞台单位 */
  readonly scale: number;
  readonly shot: Shot;
  readonly actors: readonly PlacedActor[];
  readonly bubbles: readonly PanelBubble[];
  readonly captions: readonly (CaptionBox & { readonly beat: number })[];
  readonly sfx: readonly (Sfx & { readonly beat: number })[];
  readonly issues: readonly string[];
};

export function toPage(l: Pick<PanelLayout, "rect" | "camera" | "scale">, x: number, y: number): [number, number] {
  return [l.rect.x + (x - l.camera.x) * l.scale, l.rect.y + (y - l.camera.y) * l.scale];
}

/** 头整个在镜头里；中景、远景还要身子左右都在 */
function inFrame(a: PlacedActor, cam: Rect, body: boolean): boolean {
  const h = a.head;
  const headIn = h.cx - h.rx >= cam.x && h.cx + h.rx <= cam.x + cam.w && h.top >= cam.y && h.cy + h.ry <= cam.y + cam.h;
  return headIn && (!body || (a.box.minX >= cam.x - 10 && a.box.maxX <= cam.x + cam.w + 10));
}

/** 头和身子（不算胳膊腿），舞台坐标；道具藏在这后面就看不见了 */
function coreBoxes(a: PlacedActor): Box[] {
  const h = a.head;
  return [{ minX: h.cx - h.rx, maxX: h.cx + h.rx, minY: h.top, maxY: h.cy + h.ry }, a.torso];
}

function boxOverlap(a: Box, b: Box): number {
  const w = Math.min(a.maxX, b.maxX) - Math.max(a.minX, b.minX);
  const h = Math.min(a.maxY, b.maxY) - Math.max(a.minY, b.minY);
  return w > 0 && h > 0 ? w * h : 0;
}

/** 相邻两个人的头不能叠在一起，收拢到这里就停 */
function tooClose(actors: readonly PlacedActor[]): boolean {
  const sorted = [...actors].sort((a, b) => a.x - b.x);
  return sorted.some((a, i) => i > 0 && a.head.cx - sorted[i - 1].head.cx < (a.head.rx + sorted[i - 1].head.rx) * 1.25);
}

export function composePanel(panel: Panel, rect: Rect): PanelLayout {
  const issues: string[] = [];
  const speakers = panel.beats.flatMap((b) => ("say" in b ? [b.say] : []));
  const focusId = panel.focus ?? speakers[0] ?? panel.actors[0]?.who;
  const shot: Shot = panel.shot ?? (panel.actors.length ? "medium" : "wide");
  const shoot = (squeeze: number) => {
    const actors = placeActors(panel, squeeze);
    const focus = actors.find((a) => a.actor.who === focusId);
    const camera = frame({
      aspect: rect.w / rect.h, shot, actors, focus,
      props: (panel.props ?? []).map(propBox),
      bubbles: speakers.length > 0,
    });
    return { actors, camera };
  };
  // 特写只拍一个人，别人本来就在画外；中景、远景装不下时，这一格里让大家站近一点
  const fits = (s: { actors: PlacedActor[]; camera: Rect }) => shot === "close" || s.actors.every((a) => inFrame(a, s.camera, true));
  let staged = shoot(1);
  for (let k = 0.9; !fits(staged) && k > 0.35; k -= 0.05) {
    const next = shoot(k);
    if (tooClose(next.actors)) break;
    staged = next;
  }
  const { actors, camera } = staged;
  const scale = rect.w / camera.w;
  (panel.props ?? []).forEach((p) => {
    const pb = propBox(p);
    const area = (pb.maxX - pb.minX) * (pb.maxY - pb.minY);
    const hidden = Math.max(0, ...actors.flatMap((a) => coreBoxes(a).map((c) => boxOverlap(pb, c))));
    if (hidden > area * 0.4) issues.push(`道具 ${p.emoji} 被人挡住了一大半，挪一下 x 或 lift`);
  });
  const base = { rect, camera, scale };

  const faces = new Map<CharacterId, Face>();
  const bodies: Rect[] = [];
  for (const a of actors) {
    const [cx, cy] = toPage(base, a.head.cx, a.head.cy);
    const r = Math.max(a.head.rx, a.head.ry) * 1.08 * scale;
    const [, top] = toPage(base, 0, a.head.top);
    faces.set(a.actor.who, { cx, cy, r, top });
    const [x0, y0] = toPage(base, a.box.minX, Math.min(a.head.cy + a.head.ry, a.box.maxY));
    const [x1, y1] = toPage(base, a.box.maxX, a.box.maxY);
    bodies.push({ x: x0, y: y0, w: x1 - x0, h: y1 - y0 });
  }
  const visible = (f: Face) => f.cx > rect.x && f.cx < rect.x + rect.w && f.cy > rect.y && f.cy < rect.y + rect.h;

  const captionBeats = panel.beats.map((b, i) => ("caption" in b ? { text: b.caption, beat: i } : null)).filter((c) => c !== null);
  const captions = placeCaptions(captionBeats.map((c) => c.text), rect).map((c, i) => ({ ...c, beat: captionBeats[i].beat }));

  const sayBeats = panel.beats.map((b, i) => ("say" in b ? { ...b, beat: i } : null)).filter((b) => b !== null);
  for (const b of sayBeats) {
    const who = actors.find((a) => a.actor.who === b.say);
    if (!who) issues.push(`「${b.text}」是 ${b.say} 说的，但这一格里没有 ${b.say}（画外音的话气泡没有尾巴）`);
    else if (!inFrame(who, camera, false)) issues.push(`「${b.text}」是 ${b.say} 说的，可 ${b.say} 的脸被镜头裁掉了：换景别、让人站近一点，或换宽一点的格子`);
  }
  const placement = placeBubbles(
    sayBeats.map((b) => {
      const face = faces.get(b.say);
      return { text: b.text, kind: b.kind ?? "speech", speaker: face && visible(face) ? { face } : null };
    }),
    rect, [...faces.values()].filter(visible), bodies, captions,
  );
  issues.push(...placement.issues);
  const bubbles = placement.bubbles.map((bb, i) => ({ ...bb, kind: sayBeats[i].kind ?? "speech", speaker: sayBeats[i].say, beat: sayBeats[i].beat }));
  bubbles.forEach((bb, i) => {
    const face = faces.get(bb.speaker);
    if (face && visible(face) && !bb.tail) issues.push(`气泡「${sayBeats[i].text}」没有尾巴，看不出是谁说的`);
  });

  // 音效字没写位置就挑一个不压气泡、不压脸的角；写了位置但压住了就报出来
  const occupied: Rect[] = [...bubbles, ...captions, ...[...faces.values()].map((f) => ({ x: f.cx - f.r, y: f.cy - f.r, w: f.r * 2, h: f.r * 2 }))];
  const sfx = panel.beats.flatMap((b, i) => {
    if (!("sfx" in b)) return [];
    const size = Math.min(Math.min(rect.w, rect.h) * 0.16, (rect.w * 0.6) / textWidth(b.sfx, 1));
    const w = textWidth(b.sfx, size) + 16;
    const h = size * 1.1;
    const boxAt = ([fx, fy]: readonly [number, number]): Rect => ({
      x: Math.min(Math.max(rect.x + fx * rect.w - w / 2, rect.x + 8), rect.x + rect.w - w - 8),
      y: Math.min(Math.max(rect.y + fy * rect.h - h / 2, rect.y + 8), rect.y + rect.h - h - 8),
      w, h,
    });
    const clear = (r: Rect) => r.x >= rect.x && r.x + r.w <= rect.x + rect.w && r.y >= rect.y && r.y + r.h <= rect.y + rect.h && !occupied.some((o) => overlaps(r, o));
    const free = (r: Rect) => clear(r) && !bodies.some((o) => overlaps(r, o));
    const at = b.at ?? SFX_SPOTS.find((s) => free(boxAt(s))) ?? SFX_SPOTS.find((s) => clear(boxAt(s))) ?? SFX_SPOTS[0];
    const box = boxAt(at);
    if (!clear(box)) issues.push(`音效「${b.sfx}」压住了气泡、旁白或脸，换个 at、删几个字或换大一点的格子`);
    occupied.push(box);
    return [{ text: b.sfx, x: box.x + w / 2, y: box.y + h / 2, size, color: b.color ?? "#ffd166", angle: -8 + ((i * 7) % 16), beat: i }];
  });

  return { ...base, shot, actors, bubbles, captions, sfx, issues };
}

export function composePage(page: Page): PanelLayout[] {
  const rects = layoutPage(page.layout);
  return page.panels.slice(0, rects.length).map((panel, i) => composePanel(panel, rects[i]));
}

/** 封面：整页一个远景舞台，上面留出书名的地方 */
export const COVER_TITLE_H = 300;

export function composeCover(story: Story): PanelLayout {
  const rect = { x: 0, y: 0, w: PAGE.w, h: PAGE.h };
  const panel: Panel = { ...story.cover, shot: "wide", beats: [] };
  const actors = placeActors(panel);
  const camera = frame({ aspect: rect.w / rect.h, shot: "wide", actors, props: (panel.props ?? []).map(propBox), bubbles: true });
  return { rect, camera, scale: rect.w / camera.w, shot: "wide", actors, bubbles: [], captions: [], sfx: [], issues: [] };
}

/** 整本书的问题清单，检查器用 */
export function storyIssues(story: Story): string[] {
  const out: string[] = [];
  story.pages.forEach((page, p) => {
    const need = panelCount(page.layout);
    if (page.panels.length !== need) out.push(`第 ${p + 1} 页：版式 ${page.layout} 要 ${need} 格，写了 ${page.panels.length} 格`);
    composePage(page).forEach((l, i) => l.issues.forEach((msg) => out.push(`第 ${p + 1} 页第 ${i + 1} 格：${msg}`)));
  });
  return out;
}
