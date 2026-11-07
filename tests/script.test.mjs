import assert from "node:assert/strict";
import { test } from "node:test";
import { lineHash, storyScript } from "../src/story/script.ts";
import { STORIES } from "../src/stories/index.ts";

test("台词表：每个 beat 一句，key 不重复，拟声字不念", () => {
  for (const story of STORIES) {
    const lines = storyScript(story);
    const beats = story.pages.reduce((n, p) => n + p.panels.reduce((m, panel) => m + panel.beats.length, 0), 0);
    assert.equal(lines.length, beats + 1, story.id);
    assert.equal(new Set(lines.map((l) => l.key)).size, lines.length, story.id);
    for (const l of lines) assert.equal(l.voice === null, l.kind === "sfx", l.key);
  }
});

test("改一个字，配音指纹就变", () => {
  const [line] = storyScript(STORIES[0]);
  assert.notEqual(lineHash(line), lineHash({ ...line, text: `${line.text}！` }));
  assert.equal(lineHash(line), lineHash({ ...line }));
});
