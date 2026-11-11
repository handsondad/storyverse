import assert from "node:assert/strict";
import { test } from "node:test";
import { ago, COMPACT, layoutLine, LINE, sagAt, sizeFor } from "../src/pages/timeline.ts";
import { STORIES } from "../src/stories/index.ts";

const fake = (id, date) => ({ ...STORIES[0], id, when: { date } });
const STORIES3 = [fake("c", "2026-04-22"), fake("a", "2025-06-01"), fake("b", "2025-12-31")];
const names = (items) => items.map((it) => (it.kind === "story" ? it.story.id : `${it.kind}${it.year}`));

test("时间绳：每年收成一张年份卡，从早到晚", () => {
  const { items } = layoutLine(STORIES3, null);
  assert.deepEqual(names(items), ["year2025", "year2026"]);
  assert.deepEqual(items[0].stories.map((s) => s.id), ["a", "b"]);
});

test("点开一年：那年变成小旗，后面跟着那年的故事；挂件不重叠", () => {
  const { items, width } = layoutLine(STORIES3, 2025);
  assert.deepEqual(names(items), ["flag2025", "a", "b", "year2026"]);
  const w = (it) => (it.kind === "year" ? LINE.yearW : it.kind === "flag" ? LINE.flagW : LINE.tagW);
  for (let i = 1; i < items.length; i++) assert.ok(items[i].x - w(items[i]) / 2 >= items[i - 1].x + w(items[i - 1]) / 2);
  assert.ok(items[0].x - w(items[0]) / 2 >= LINE.pad - 0.01);
  assert.ok(items.at(-1).x + w(items.at(-1)) / 2 <= width - LINE.pad + 0.01);
});

test("框比挂件宽时绳子拉满，挂件整串居中", () => {
  const { items, width } = layoutLine(STORIES3, 2026, 1200);
  assert.equal(Math.round(width), 1200);
  const left = items[0].x - LINE.yearW / 2;
  const right = width - (items.at(-1).x + LINE.tagW / 2);
  assert.ok(Math.abs(left - right) < 0.01);
});

test("手机宽度用小一号的挂件", () => {
  assert.equal(sizeFor(390), COMPACT);
  assert.equal(sizeFor(1100), LINE);
  assert.equal(sizeFor(0), LINE);
});

test("绳子两头高、中间最低", () => {
  const w = 1000;
  assert.equal(sagAt(LINE.pad / 2, w), 0);
  assert.ok(Math.abs(sagAt(w / 2, w) - LINE.sag) < 0.01);
  assert.ok(sagAt(w * 0.25, w) < sagAt(w / 2, w));
});

test("离今天多久", () => {
  const today = new Date(2026, 10, 9);
  assert.equal(ago("2026-11-09", today), "就是今天");
  assert.equal(ago("2026-11-02", today), "7 天前");
  assert.equal(ago("2026-04-22", today), "6 个月前");
  assert.equal(ago("2025-06-01", today), "1 年零 5 个月前");
  assert.equal(ago("2024-11-09", today), "2 年前");
  assert.equal(ago("2026-12-01", today), "还没到那天");
});
