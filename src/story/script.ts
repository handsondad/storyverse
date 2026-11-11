/**
 * 把一本故事摊成按顺序念的台词表。「听故事」播放器和配音工具（npm run voice）都用它，
 * 所以 key 和指纹两边一定对得上。
 */
import { CAST, type CharacterId } from "../cast/characters.ts";
import type { Story } from "./types.ts";

/** 旁白也只用家里人的声音：妈妈的声音放慢一点来讲 */
export const NARRATOR: CharacterId = "mom";

type Voice = { readonly voice: string; readonly rate: string; readonly pitch?: string };

export const VOICES: Record<CharacterId, Voice> = {
  nian: { voice: CAST.nian.voice, rate: "+0%" },
  dad: { voice: CAST.dad.voice, rate: "-5%" },
  mom: { voice: CAST.mom.voice, rate: "+0%" },
  // 中文里没有现成的老人声音：最低沉的男声放慢、压低一点
  laoye: { voice: CAST.laoye.voice, rate: "-15%", pitch: "-8Hz" },
  ayi: { voice: CAST.ayi.voice, rate: "+0%" },
  shushu: { voice: CAST.shushu.voice, rate: "+0%" },
};
const NARRATOR_RATE = "-12%";

export type Line = {
  /** `<故事>/<页>-<格>-<第几个 beat>`，封面是 `<故事>/0-title`；也是音频文件名 */
  readonly key: string;
  /** 0 = 封面 */
  readonly page: number;
  readonly panel: number;
  readonly beat: number;
  readonly kind: "title" | "caption" | "say" | "sfx";
  readonly text: string;
  /** 谁来念；拟声字不念 */
  readonly voice: Voice | null;
};

/** 「小念、爸爸和妈妈一起编的故事」 */
export function creditLine(story: Story): string {
  const names = story.credits.by.map((id) => CAST[id].name);
  if (names.length === 0) return story.credits.note ?? "";
  if (names.length === 1) return `${names[0]}编的故事`;
  if (names.length === 2) return `${names[0]}和${names[1]}一起编的故事`;
  return `${names.slice(0, -1).join("、")}和${names[names.length - 1]}一起编的故事`;
}

export function storyScript(story: Story): Line[] {
  const narrator = { voice: VOICES[NARRATOR].voice, rate: NARRATOR_RATE };
  const lines: Line[] = [
    { key: `${story.id}/0-title`, page: 0, panel: 0, beat: 0, kind: "title", text: `${story.title}。${creditLine(story)}。`, voice: narrator },
  ];
  story.pages.forEach((page, p) => {
    page.panels.forEach((panel, i) => {
      panel.beats.forEach((b, j) => {
        const at = { key: `${story.id}/${p + 1}-${i}-${j}`, page: p + 1, panel: i, beat: j };
        if ("caption" in b) lines.push({ ...at, kind: "caption", text: b.caption, voice: narrator });
        else if ("say" in b) lines.push({ ...at, kind: "say", text: b.text, voice: VOICES[b.say] });
        else lines.push({ ...at, kind: "sfx", text: b.sfx, voice: null });
      });
    });
  });
  return lines;
}

/** 同一个声音念同一句话，指纹就不变；改了字或换了声音，旧音频就过期。FNV-1a，浏览器和 Node 算出来一样 */
export function lineHash(line: Line): string {
  const pitch = line.voice?.pitch ? `|${line.voice.pitch}` : "";
  const s = `${line.voice?.voice}|${line.voice?.rate}${pitch}|${line.text}`;
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

/** 没有配音时每句停多久（秒）：按字数估 */
export function estimateSeconds(line: Line): number {
  if (line.kind === "sfx") return 0.8;
  return 0.8 + [...line.text].length * 0.2;
}
