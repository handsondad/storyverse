/**
 * 版式：一页漫画分成几格。页面坐标是 1000×1400，格子按行排，每行再分几列。
 */

export type Rect = { readonly x: number; readonly y: number; readonly w: number; readonly h: number };

export const PAGE = { w: 1000, h: 1400, margin: 36, gutter: 22 } as const;

type Row = { readonly h: number; readonly cols: readonly number[] };

/** 版式名字里的数字是每行几格，从上往下读 */
export const LAYOUTS = {
  "1": [{ h: 1, cols: [1] }],
  "1-1": [{ h: 1, cols: [1] }, { h: 1, cols: [1] }],
  "1-1-1": [{ h: 1, cols: [1] }, { h: 1, cols: [1] }, { h: 1, cols: [1] }],
  "1-2": [{ h: 1.15, cols: [1] }, { h: 1, cols: [1, 1] }],
  "2-1": [{ h: 1, cols: [1, 1] }, { h: 1.15, cols: [1] }],
  "2-2": [{ h: 1, cols: [1, 1] }, { h: 1, cols: [1, 1] }],
  "1-2-1": [{ h: 1, cols: [1] }, { h: 1, cols: [1, 1] }, { h: 1, cols: [1] }],
  "2-1-2": [{ h: 1, cols: [1, 1] }, { h: 1, cols: [1] }, { h: 1, cols: [1, 1] }],
  "1-3": [{ h: 1.4, cols: [1] }, { h: 1, cols: [1, 1, 1] }],
} as const satisfies Record<string, readonly Row[]>;

export type LayoutId = keyof typeof LAYOUTS;

export const LAYOUT_IDS = Object.keys(LAYOUTS) as LayoutId[];

export function panelCount(layout: LayoutId): number {
  return LAYOUTS[layout].reduce((n, row) => n + row.cols.length, 0);
}

/** 按阅读顺序（从上到下、从左到右）给出每一格在页面上的位置 */
export function layoutPage(layout: LayoutId, area: Rect = innerArea()): Rect[] {
  const rows: readonly Row[] = LAYOUTS[layout];
  const { gutter } = PAGE;
  const totalH = area.h - gutter * (rows.length - 1);
  const weightH = rows.reduce((s, r) => s + r.h, 0);
  const rects: Rect[] = [];
  let y = area.y;
  for (const row of rows) {
    const h = (totalH * row.h) / weightH;
    const totalW = area.w - gutter * (row.cols.length - 1);
    const weightW = row.cols.reduce((s, c) => s + c, 0);
    let x = area.x;
    for (const col of row.cols) {
      const w = (totalW * col) / weightW;
      rects.push({ x, y, w, h });
      x += w + gutter;
    }
    y += h + gutter;
  }
  return rects;
}

export function innerArea(): Rect {
  const { w, h, margin } = PAGE;
  return { x: margin, y: margin, w: w - margin * 2, h: h - margin * 2 };
}

export function overlaps(a: Rect, b: Rect, pad = 0): boolean {
  return a.x - pad < b.x + b.w && b.x - pad < a.x + a.w && a.y - pad < b.y + b.h && b.y - pad < a.y + a.h;
}

export function inside(inner: Rect, outer: Rect, pad = 0): boolean {
  return inner.x >= outer.x + pad && inner.y >= outer.y + pad
    && inner.x + inner.w <= outer.x + outer.w - pad && inner.y + inner.h <= outer.y + outer.h - pad;
}
