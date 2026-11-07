import assert from "node:assert/strict";
import { test } from "node:test";
import { STORIES } from "../src/stories/index.ts";
import { checkStory } from "./story-rules.mjs";

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
