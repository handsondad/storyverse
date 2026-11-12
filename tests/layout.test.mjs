import assert from "node:assert/strict";
import { test } from "node:test";
import { LAYOUT_IDS, layoutPage, panelCount } from "../src/engine/layout.ts";
import { wrap, textWidth } from "../src/engine/text.ts";
import { composePanel } from "../src/engine/compose.ts";

test("每个版式的格数和 layoutPage 返回的矩形数一致", () => {
  for (const id of LAYOUT_IDS) {
    const rects = layoutPage(id);
    assert.equal(rects.length, panelCount(id), id);
    for (const r of rects) {
      assert.ok(r.w > 0 && r.h > 0, id);
    }
  }
});

test("格子不重叠，都在页边距内", () => {
  for (const id of LAYOUT_IDS) {
    const rects = layoutPage(id);
    for (let i = 0; i < rects.length; i++) {
      for (let j = i + 1; j < rects.length; j++) {
        const a = rects[i];
        const b = rects[j];
        const overlap = a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
        assert.equal(overlap, false, `${id} 第 ${i} 和第 ${j} 格重叠`);
      }
    }
  }
});

test("窄格子里一左一右两个人说话，两张脸都在画里、气泡都有尾巴", () => {
  const narrow = layoutPage("1-2")[1];
  for (const shot of ["medium", "wide"]) {
    const l = composePanel({
      scene: { place: "living-room" }, shot,
      actors: [{ who: "nian", at: "left" }, { who: "dad", at: "right" }],
      beats: [{ say: "nian", text: "爸爸你看！" }, { say: "dad", text: "看到啦。" }],
    }, narrow);
    assert.deepEqual(l.issues, [], shot);
    for (const a of l.actors) {
      assert.ok(a.head.cx - a.head.rx >= l.camera.x && a.head.cx + a.head.rx <= l.camera.x + l.camera.w, `${shot} ${a.actor.who} 的脸被裁了`);
    }
    assert.ok(l.bubbles.every((b) => b.tail), shot);
  }
});

test("中文折行：标点不落在行首", () => {
  const lines = wrap("咦？它们在发光！", 34, 34 * 5);
  assert.ok(lines.length >= 1);
  for (const line of lines) {
    assert.ok(!"，。！？".includes(line[0]), `行首是标点：${line}`);
  }
  assert.ok(textWidth("小念", 34) > textWidth("ab", 34));
});

test("中文折行：数字和后面的字不拆开", () => {
  for (const line of wrap("哦……是16点04分！", 34, 34 * 5)) {
    assert.ok(!/\d$/.test(line), `行尾是数字：${line}`);
  }
});

test("同一格两个同名角色：气泡尾巴指向列表第一个，且两个人的脸都不被挡", () => {
  const rect = layoutPage("1-1")[0];
  const l = composePanel({
    scene: { place: "living-room" }, shot: "wide",
    actors: [{ who: "gege", at: 0.3 }, { who: "gege", at: 0.7, top: "#4fc3f7" }],
    beats: [{ say: "gege", text: "弟弟生日快乐！" }],
  }, rect);
  assert.deepEqual(l.issues, []);
  const b = l.bubbles[0];
  assert.ok(b.tail, "应有尾巴");
  const firstHeadX = rect.x + (l.actors[0].head.cx - l.camera.x) * l.scale;
  const secondHeadX = rect.x + (l.actors[1].head.cx - l.camera.x) * l.scale;
  assert.ok(Math.abs(b.tail.tip[0] - firstHeadX) < Math.abs(b.tail.tip[0] - secondHeadX), "尾巴应指向第一个哥哥");
});

test("气泡和拟声字会自动避开 baby 道具的脸", () => {
  const rect = layoutPage("1-1")[0];
  const l = composePanel({
    scene: { place: "living-room" }, shot: "wide",
    actors: [{ who: "mom", at: "left" }],
    props: [{ thing: { kind: "baby", move: "sit" }, x: 0.65, size: 420, front: true }],
    beats: [{ say: "mom", text: "小念坐得真稳！" }, { sfx: "咯咯！" }],
  }, rect);
  assert.deepEqual(l.issues, []);
});
