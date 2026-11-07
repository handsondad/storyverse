import assert from "node:assert/strict";
import { test } from "node:test";
import { CAST, CHARACTER_IDS } from "../src/cast/characters.ts";
import { POSE_ANGLES } from "../src/cast/poses.ts";
import { solve } from "../src/cast/rig.ts";
import { POSES } from "../src/story/vocab.ts";

test("每个角色每种姿势的脚都踩在地面上，头在上面", () => {
  for (const id of CHARACTER_IDS) {
    const body = CAST[id].body;
    for (const pose of POSES) {
      const sk = solve(body, POSE_ANGLES[pose]);
      // 脚踝关节在地面以上；鞋子厚度会让 bounds.maxY 略大于 0
      assert.ok(sk.bounds.maxY <= body.limb + 2, `${id} ${pose} 脚离开地面：${sk.bounds.maxY}`);
      assert.ok(sk.legL.end[1] <= 2 && sk.legR.end[1] <= 2, `${id} ${pose} 脚踝应贴近地面`);
      assert.ok(sk.head.c[1] < 0, `${id} ${pose} 头不在上方`);
      assert.ok(sk.top < sk.head.c[1], `${id} ${pose} 头发应比头心更高`);
    }
  }
});

test("爸爸比小念高", () => {
  const kid = solve(CAST.nian.body, POSE_ANGLES.stand);
  const dad = solve(CAST.dad.body, POSE_ANGLES.stand);
  assert.ok(-dad.top > -kid.top);
});
