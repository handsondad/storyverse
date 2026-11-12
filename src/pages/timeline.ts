/**
 * 首页的时间绳：每一年收成一张年份卡（那年最新一本的封面 + 几个故事），点开一年，那一年的故事
 * 按日子从左往右夹在绳子上，年份卡变成开头的一面小旗。一次只开一年。
 * 绳子是一条二次贝塞尔曲线，两头高、中间垂下去；挂件的高度跟着绳子走。
 * 绳子比屏幕长就左右滑（滚动条藏起来）。和《小念的成长时光轴》首页是同一根绳子。
 */
import type { Story } from "../story/types.ts";

export type LineSize = {
  readonly tagW: number;
  readonly yearW: number;
  readonly flagW: number;
  readonly gap: number;
  /** 两头留给立杆 */
  readonly pad: number;
  /** 绳子中间垂下多少 */
  readonly sag: number;
  /** 绳子两头的高度 */
  readonly top: number;
  /** 整根绳子连挂件有多高 */
  readonly rowH: number;
};

export const LINE: LineSize = { tagW: 168, yearW: 150, flagW: 84, gap: 26, pad: 64, sag: 36, top: 28, rowH: 314 };
/** 手机上挂件小一号 */
export const COMPACT: LineSize = { tagW: 132, yearW: 124, flagW: 72, gap: 14, pad: 40, sag: 24, top: 24, rowH: 274 };
export const sizeFor = (room: number): LineSize => (room > 0 && room < 560 ? COMPACT : LINE);

type Look = { readonly x: number; readonly y: number; readonly tilt: number; readonly color: string };
export type LineItem =
  | ({ readonly kind: "year"; readonly year: number; readonly stories: readonly Story[] } & Look)
  | { readonly kind: "flag"; readonly year: number; readonly x: number; readonly y: number }
  | ({ readonly kind: "story"; readonly story: Story } & Look);

const TILTS = [-3, 2.5, -1.5, 3, -2.5, 1.5];
const COLORS = ["#ffe3c2", "#d9ecff", "#dff5e8", "#ffe0ea", "#efe4ff", "#fff2b8"];

export const byDate = (a: Story, b: Story) => a.when.date.localeCompare(b.when.date) || a.id.localeCompare(b.id);
export const yearOf = (s: Story) => Number(s.when.date.slice(0, 4));

/** 绳子在横坐标 x 处垂下多少（0 是两头的高度） */
export function sagAt(x: number, width: number, size: LineSize = LINE): number {
  const t = Math.min(1, Math.max(0, (x - size.pad / 2) / (width - size.pad)));
  return 4 * size.sag * t * (1 - t);
}

/** 每一年的故事，从早到晚 */
export function byYear(stories: readonly Story[]): Map<number, Story[]> {
  const years = new Map<number, Story[]>();
  for (const s of [...stories].sort(byDate)) years.set(yearOf(s), [...(years.get(yearOf(s)) ?? []), s]);
  return years;
}

/**
 * open：展开的那一年（null 全收着）。room：框有多宽；框比挂件宽时绳子拉满，
 * 挂件之间稍微松一点，整串居中，不会散得太开。
 */
export function layoutLine(stories: readonly Story[], open: number | null, room = 0, size: LineSize = LINE): { items: LineItem[]; width: number } {
  type Slot = { kind: "year"; year: number; stories: Story[] } | { kind: "flag"; year: number } | { kind: "story"; story: Story };
  const slots: Slot[] = [];
  for (const [year, list] of byYear(stories)) {
    if (year === open) slots.push({ kind: "flag", year }, ...list.map((story) => ({ kind: "story" as const, story })));
    else slots.push({ kind: "year", year, stories: list });
  }
  const widthOf = (s: Slot) => (s.kind === "year" ? size.yearW : s.kind === "flag" ? size.flagW : size.tagW);
  const content = slots.reduce((sum, s) => sum + widthOf(s), 0) + size.gap * Math.max(0, slots.length - 1);
  const width = Math.max(room, content + size.pad * 2);
  const free = width - size.pad * 2 - content;
  const extra = Math.min(free / (slots.length + 1), size.tagW / 2);

  let left = size.pad + (free - extra * Math.max(0, slots.length - 1)) / 2;
  let n = 0;
  const items = slots.map((s): LineItem => {
    const x = left + widthOf(s) / 2;
    left += widthOf(s) + size.gap + extra;
    const y = sagAt(x, width, size);
    if (s.kind === "flag") return { kind: "flag", year: s.year, x, y };
    const i = n++;
    const look = { x, y, tilt: TILTS[i % TILTS.length], color: COLORS[i % COLORS.length] };
    return s.kind === "year" ? { kind: "year", year: s.year, stories: s.stories, ...look } : { kind: "story", story: s.story, ...look };
  });
  return { items, width };
}

/** 「2025年6月1日」 */
export function fullDate(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return `${y}年${m}月${d}日`;
}

/** 「6月1日」 */
export function monthDay(date: string): string {
  const [, m, d] = date.split("-").map(Number);
  return `${m}月${d}日`;
}

/** 离今天多久：「今天」「3 天前」「5 个月前」「1 年零 5 个月前」 */
export function ago(date: string, today: Date): string {
  const [y, m, d] = date.split("-").map(Number);
  const days = Math.floor((Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) - Date.UTC(y, m - 1, d)) / 86400000);
  if (days < 0) return "还没到那天";
  if (days === 0) return "就是今天";
  if (days < 31) return `${days} 天前`;
  let months = (today.getFullYear() - y) * 12 + (today.getMonth() - (m - 1));
  if (today.getDate() < d) months -= 1;
  months = Math.max(1, months);
  if (months < 12) return `${months} 个月前`;
  const years = Math.floor(months / 12);
  const rest = months % 12;
  return rest ? `${years} 年零 ${rest} 个月前` : `${years} 年前`;
}
