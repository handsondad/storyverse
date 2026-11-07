import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { STORIES } from "../src/stories/index.ts";
import { CHARS_FILE, collect } from "../tools/font/subset.mjs";
import { checkStory } from "./story-rules.mjs";

test("字体子集包含页面上用到的每个字（缺了跑 npm run font）", () => {
  const have = new Set(readFileSync(CHARS_FILE, "utf8"));
  const missing = [...collect()].filter((ch) => !have.has(ch));
  assert.equal(missing.join(""), "");
});

test("书架上每个故事都通过内容检查", () => {
  assert.ok(STORIES.length >= 1);
  for (const story of STORIES) {
    const problems = checkStory(story);
    assert.deepEqual(problems, [], problems.join("\n"));
  }
});

test("故事 id 互不重复", () => {
  const ids = STORIES.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length);
});
