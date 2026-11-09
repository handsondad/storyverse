/**
 * 首页的时间绳：故事按发生的日子从左往右挂在一根晾衣绳上，跨年的地方挂一面年份小旗。
 * 绳子是一条二次贝塞尔曲线，两头高、中间垂下去；挂件的高度跟着绳子走。
 */
import type { Story } from "../story/types.ts";

export const LINE = {
  tagW: 168,
  yearW: 60,
  gap: 26,
  /** 两头留给立杆 */
  pad: 64,
  /** 绳子中间垂下多少 */
  sag: 36,
  /** 绳子两头的高度 */
  top: 28,
} as const;

export type LineItem =
  | { readonly kind: "year"; readonly year: number; readonly x: number; readonly y: number }
  | { readonly kind: "story"; readonly story: Story; readonly x: number; readonly y: number; readonly tilt: number; readonly color: string };

const TILTS = [-3, 2.5, -1.5, 3, -2.5, 1.5];
const COLORS = ["#ffe3c2", "#d9ecff", "#dff5e8", "#ffe0ea", "#efe4ff", "#fff2b8"];

export const byDate = (a: Story, b: Story) => a.when.date.localeCompare(b.when.date) || a.id.localeCompare(b.id);

/** 绳子在横坐标 x 处垂下多少（0 是两头的高度） */
export function sagAt(x: number, width: number): number {
  const t = Math.min(1, Math.max(0, (x - LINE.pad / 2) / (width - LINE.pad)));
  return 4 * LINE.sag * t * (1 - t);
}

/** minWidth：框比挂件宽时，把绳子拉满，多出来的地方平均分到挂件之间 */
export function layoutLine(stories: readonly Story[], minWidth = 0): { items: LineItem[]; width: number } {
  const sorted = [...stories].sort(byDate);
  const slots: ({ kind: "year"; year: number } | { kind: "story"; story: Story })[] = [];
  let year = NaN;
  for (const story of sorted) {
    const y = Number(story.when.date.slice(0, 4));
    if (y !== year) slots.push({ kind: "year", year: (year = y) });
    slots.push({ kind: "story", story });
  }
  const widthOf = (s: (typeof slots)[number]) => (s.kind === "year" ? LINE.yearW : LINE.tagW);
  const content = slots.reduce((sum, s) => sum + widthOf(s), 0) + LINE.gap * Math.max(0, slots.length - 1);
  const extra = Math.max(0, minWidth - content - LINE.pad * 2) / (slots.length + 1);
  const gap = LINE.gap + extra;
  const width = content + LINE.pad * 2 + extra * (slots.length + 1);

  let left = LINE.pad + extra;
  let n = 0;
  const items = slots.map((s): LineItem => {
    const x = left + widthOf(s) / 2;
    left += widthOf(s) + gap;
    const y = sagAt(x, width);
    if (s.kind === "year") return { kind: "year", year: s.year, x, y };
    const i = n++;
    return { kind: "story", story: s.story, x, y, tilt: TILTS[i % TILTS.length], color: COLORS[i % COLORS.length] };
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
