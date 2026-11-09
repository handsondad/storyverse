import assert from "node:assert/strict";
import { test } from "node:test";
import { SEATS, seating } from "../src/cast/chair.ts";
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

test("坐上椅子屁股贴着座面；往后翘、倒下去都不会钻到地板下面", () => {
  for (const id of CHARACTER_IDS) {
    const body = CAST[id].body;
    for (const pose of ["sit", "push"]) {
      const sk = solve(body, POSE_ANGLES[pose]);
      for (const kind of SEATS) {
        const flat = seating(body, sk, kind);
        assert.ok(Math.abs(flat.map(sk.pelvis)[1] + body.limb * 0.55 - flat.seat) < 0.01, `${id} ${pose} ${kind} 没坐在座面上`);
        for (const tip of [0, 15, 30, 60, 80, 90]) {
          const s = seating(body, sk, kind, tip);
          const head = s.map(sk.head.c);
          assert.ok(head[1] + Math.max(body.headRx, body.headRy) <= 0.5, `${id} ${pose} ${kind} tip ${tip} 头钻到地下了`);
          if (tip > 0 && tip < 60) assert.ok(head[0] < flat.map(sk.head.c)[0], `${id} ${pose} ${kind} tip ${tip} 应该往后仰`);
        }
      }
    }
  }
});

test("儿童餐椅比大人的椅子高", () => {
  const body = CAST.nian.body;
  const sk = solve(body, POSE_ANGLES.sit);
  assert.ok(seating(body, sk, "high-chair").seat < seating(body, sk, "chair").seat);
});

test("爸爸比小念高", () => {
  const kid = solve(CAST.nian.body, POSE_ANGLES.stand);
  const dad = solve(CAST.dad.body, POSE_ANGLES.stand);
  assert.ok(-dad.top > -kid.top);
});
