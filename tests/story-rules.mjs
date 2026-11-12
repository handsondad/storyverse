// 故事内容检查：版式格数、气泡字数、角色是否存在、气泡有没有挡脸、字体缺不缺字。
// 用法：
//   npm run check
//   npm run check -- glowing-boots
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { CHARACTER_IDS, CREATOR_IDS, OUTFIT_IDS } from "../src/cast/characters.ts";
import { storyIssues } from "../src/engine/compose.ts";
import { textWidth } from "../src/engine/text.ts";
import { lineHash, storyScript } from "../src/story/script.ts";
import { VOICE_CLIPS } from "../src/story/voice-manifest.ts";
import { CHARS_FILE, needsStoryFont } from "../tools/font/subset.mjs";
import { EXPRESSIONS, PLACES, POSES, SHOTS, THINGS, TIMES, WEATHERS } from "../src/story/vocab.ts";
import { SEATS } from "../src/cast/chair.ts";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const storiesDir = join(root, "src/stories");

const LIMITS = {
  title: 16,
  blurb: 40,
  caption: 28,
  bubble: 18,
  sfx: 8,
  bubblesPerPanel: 4,
  actorsPerPanel: 4,
  /** 一大家人围在一起这种远景，最多挤这么多 */
  actorsPerWidePanel: 7,
};

const chars = (text) => [...text].length;

/** 返回问题列表，空数组表示通过 */
export function checkStory(story) {
  const problems = [];
  const say = (where, text) => problems.push(`${story.id} ${where}：${text}`);

  if (!/^[a-z][a-z0-9-]*$/.test(story.id)) say("id", "只能用小写字母、数字和短横线，且以字母开头");
  if (chars(story.title) > LIMITS.title) say("书名", `超过 ${LIMITS.title} 个字`);
  if (chars(story.blurb) > LIMITS.blurb) say("简介", `超过 ${LIMITS.blurb} 个字`);
  const day = story.when?.date ?? "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || Number.isNaN(Date.parse(day))) say("时间", "when.date 要写故事发生的那天，格式 YYYY-MM-DD");
  if (story.when?.label && chars(story.when.label) > 8) say("时间", "when.label 不超过 8 个字");
  if (!story.credits?.by?.length) say("署名", "credits.by 至少要有一个角色（nian / dad / mom）");
  for (const id of story.credits?.by ?? []) {
    if (!CREATOR_IDS.includes(id)) say("署名", `credits.by 里不能写「${id}」，只能是小念、爸爸、妈妈`);
  }
  if (!story.pages?.length) say("全书", "至少要有一页");

  const checkPanel = (panel, where) => {
    if (!PLACES.includes(panel.scene.place)) say(where, `没有地点 ${panel.scene.place}`);
    if (panel.scene.time && !TIMES.includes(panel.scene.time)) say(where, `没有时间 ${panel.scene.time}`);
    if (panel.scene.weather && !WEATHERS.includes(panel.scene.weather)) say(where, `没有天气 ${panel.scene.weather}`);
    if (panel.shot && !SHOTS.includes(panel.shot)) say(where, `没有景别 ${panel.shot}`);
    if (panel.scene.sign && !["hospital", "street"].includes(panel.scene.place)) say(where, "sign 只给 hospital、street 用");
    if (panel.scene.sign && chars(panel.scene.sign) > 4) say(where, "sign 不超过 4 个字");
    const table = panel.scene.table;
    if (table && !(table.from >= 0 && table.to <= 1 && table.from < table.to)) say(where, "table 的 from、to 要在 0～1，而且 from < to");
    if (panel.actors.length === 0 && !(panel.props?.length)) say(where, "格子里至少要有一个角色或道具");
    const maxActors = panel.shot === "wide" ? LIMITS.actorsPerWidePanel : LIMITS.actorsPerPanel;
    if (panel.actors.length > maxActors) say(where, `角色超过 ${maxActors} 个${panel.shot === "wide" ? "" : `（远景 shot: "wide" 最多 ${LIMITS.actorsPerWidePanel} 个）`}`);

    const seen = new Set();
    for (const a of panel.actors) {
      if (!CHARACTER_IDS.includes(a.who)) say(where, `没有角色 ${a.who}`);
      if (seen.has(a.who) && !["ayi", "shushu", "gege", "jiejie"].includes(a.who)) say(where, `${a.who} 出现了两次`);
      if (a.top && !/^#[0-9a-f]{6}$/i.test(a.top)) say(where, `top 要写 #rrggbb 颜色`);
      seen.add(a.who);
      if (a.pose && !POSES.includes(a.pose)) say(where, `没有姿势 ${a.pose}`);
      if (a.face && !EXPRESSIONS.includes(a.face)) say(where, `没有表情 ${a.face}`);
      if (typeof a.at === "number" && (a.at < 0 || a.at > 1)) say(where, `站位 ${a.at} 应在 0～1`);
      if (a.seat && !SEATS.includes(a.seat)) say(where, `没有椅子 ${a.seat}`);
      if (a.outfit && !OUTFIT_IDS.includes(a.outfit)) say(where, `没有这身衣服 ${a.outfit}（有：${OUTFIT_IDS.join("、")}）`);
      if (a.hat && a.hat !== "party") say(where, `${a.who} 的 hat 只能是 party`);
      if (a.tip !== undefined && !a.seat) say(where, `${a.who} 写了 tip 就要写 seat：是椅子在翘`);
      if (a.tip !== undefined && (a.tip < 0 || a.tip > 90)) say(where, `tip ${a.tip} 应在 0～90 度`);
    }
    for (const p of panel.props ?? []) {
      if (!p.emoji === !p.thing) say(where, "道具的 emoji 和 thing 只写一个");
      if (p.thing && !THINGS.includes(p.thing.kind)) say(where, `没有能画的东西 ${p.thing.kind}`);
      if (p.thing?.puff !== undefined && (p.thing.puff < 0 || p.thing.puff > 1)) say(where, `puff ${p.thing.puff} 应在 0～1`);
      if (p.thing?.label && chars(p.thing.label) > 8) say(where, "thing.label 不超过 8 个字");
      if ((p.thing?.diaper || p.thing?.navel) && p.thing.kind !== "baby") say(where, "diaper、navel 只给 baby 用");
      if (p.thing?.diaper && !["high", "low", "airy"].includes(p.thing.diaper)) say(where, `没有这种纸尿裤 ${p.thing.diaper}`);
      if (p.thing?.navel && !["stump", "sore", "healed"].includes(p.thing.navel)) say(where, `navel 只能是 stump / sore / healed`);
      if (p.thing?.navel && !p.thing.diaper) say(where, "襁褓里看不见肚脐：写 navel 就要写 diaper");
      if ((p.thing?.kick || p.thing?.ball) && p.thing.kind !== "baby") say(where, "kick、ball 只给 baby 用（单独一个球用 kind: \"ball\"）");
      if (p.thing?.kick && !["up", "left", "right", "grab", "toes"].includes(p.thing.kick)) say(where, "kick 只能是 up / left / right / grab / toes");
      if (p.thing?.ball && !["up", "left", "right"].includes(p.thing.kick)) say(where, "写 ball 就要写 kick: up / left / right：球顶在蹬起来的脚丫上");
      if (p.thing?.giggle && !p.thing.kick && !p.thing.move) say(where, "giggle 只给写了 kick、crawl / sit 的宝宝用");
      if ((p.thing?.tub || p.thing?.splash) && !(p.thing.kind === "baby" && p.thing.move === "sit")) say(where, "tub、splash 只给 sit 的宝宝用");
      if (p.thing?.hand && !(p.thing.kind === "baby" && p.thing.move === "sit")) say(where, "hand 只给 sit 的宝宝用");
      if (p.thing?.hand && !["red", "bandage"].includes(p.thing.hand)) say(where, "hand 只能是 red / bandage");
      if (p.thing?.ride && !(p.thing.kind === "baby" && p.thing.move === "sit")) say(where, "ride 只给 sit 的宝宝用");
      if (p.thing?.ride && p.thing.tub) say(where, "ride 和 tub 不能一起写");
      if (p.thing?.splash && !p.thing.tub) say(where, "splash 是在澡盆里拍水：写 splash 就要写 tub");
      if (p.thing?.giggle && p.thing.kick === "toes") say(where, "啃脚丫时嘴被挡住了，不用写 giggle");
      if ((p.thing?.move || p.thing?.cry || p.thing?.flip) && p.thing.kind !== "baby") say(where, "move、cry、flip 只给 baby 用");
      if (p.thing?.move && !["crawl", "sit"].includes(p.thing.move)) say(where, "move 只能是 crawl / sit");
      if (p.thing?.move && (p.thing.kick || p.thing.diaper || p.thing.ball)) say(where, "move 和 kick / diaper / ball 只写一个：一个宝宝一个姿势");
      if (p.thing?.cry && !p.thing.move) say(where, "cry 只给 crawl / sit 的宝宝用");
      if ((p.thing?.hair || p.thing?.hat) && !(p.thing.kind === "baby" && p.thing.move)) say(where, "hair、hat 只给 crawl / sit 的宝宝用");
      if (p.thing?.hair && !["fuzz", "bald"].includes(p.thing.hair)) say(where, "hair 只能是 fuzz / bald");
      if (p.thing?.hat && !["party", "big"].includes(p.thing.hat)) say(where, "hat 只能是 party / big");
      if ((p.thing?.sick || p.thing?.patch || p.thing?.color || p.thing?.blow) && !(p.thing.kind === "baby" && p.thing.move)) say(where, "sick、patch、color、blow 只给 crawl / sit 的宝宝用");
      if (p.thing?.kind === "box" && !p.thing.label) say(where, "药盒要写 label：盒子上的药名");
      if (p.thing?.kick && (p.thing.diaper || p.thing.navel)) say(where, "侧面蹬腿的宝宝穿连体衣，不写 diaper、navel");
    }

    let bubbleCount = 0;
    for (const beat of panel.beats ?? []) {
      if ("caption" in beat) {
        if (chars(beat.caption) > LIMITS.caption) say(where, `旁白「${beat.caption}」超过 ${LIMITS.caption} 个字`);
      } else if ("say" in beat) {
        bubbleCount++;
        if (!CHARACTER_IDS.includes(beat.say)) say(where, `说话人 ${beat.say} 不存在`);
        if (chars(beat.text) > LIMITS.bubble) say(where, `气泡「${beat.text}」超过 ${LIMITS.bubble} 个字`);
        if (textWidth(beat.text, 34) > 34 * 11 * 2.2) say(where, `气泡「${beat.text}」太长，折行后会挡画面`);
      } else if ("sfx" in beat) {
        if (chars(beat.sfx) > LIMITS.sfx) say(where, `拟声「${beat.sfx}」超过 ${LIMITS.sfx} 个字`);
      } else {
        say(where, "有一个不认识的 beat");
      }
    }
    if (bubbleCount > LIMITS.bubblesPerPanel) say(where, `气泡超过 ${LIMITS.bubblesPerPanel} 个`);
  };

  checkPanel({ ...story.cover, beats: story.cover.beats ?? [] }, "封面");

  story.pages.forEach((page, pi) => {
    page.panels.forEach((panel, i) => checkPanel(panel, `第 ${pi + 1} 页第 ${i + 1} 格`));
  });

  const missing = [...new Set([...storyText(story)].filter((ch) => needsStoryFont(ch) && !fontChars.has(ch)))];
  if (missing.length) say("字体", `缺这些字：${missing.join("")}，跑 npm run font`);

  for (const msg of storyIssues(story)) problems.push(`${story.id} ${msg}`);
  return problems;
}

const fontChars = new Set(existsSync(CHARS_FILE) ? readFileSync(CHARS_FILE, "utf8") : "");

/** 故事里所有会画到页面上的字 */
function storyText(story) {
  const panels = [story.cover, ...story.pages.flatMap((p) => p.panels)];
  return [
    story.title, story.blurb, story.credits?.note ?? "", story.when?.label ?? "",
    ...panels.flatMap((p) => p.beats ?? []).map((b) => b.caption ?? b.text ?? b.sfx ?? ""),
    ...panels.flatMap((p) => p.props ?? []).map((p) => p.thing?.label ?? ""),
  ].join("");
}

async function loadStory(id) {
  const file = join(storiesDir, id, "story.ts");
  const mod = await import(pathToFileURL(file).href);
  return mod.default;
}

async function main() {
  const only = process.argv.slice(2).filter((a) => !a.startsWith("-"));
  const ids = only.length
    ? only
    : readdirSync(storiesDir, { withFileTypes: true }).filter((d) => d.isDirectory() && !d.name.startsWith(".")).map((d) => d.name);

  let failed = 0;
  let unvoiced = 0;
  for (const id of ids) {
    if (id === "index.ts") continue;
    try {
      const story = await loadStory(id);
      if (story.id !== id) {
        console.error(`✗ ${id}：目录名和 story.id（${story.id}）不一致`);
        failed++;
        continue;
      }
      unvoiced += storyScript(story).filter((l) => l.voice && VOICE_CLIPS[l.key]?.hash !== lineHash(l)).length;
      const problems = checkStory(story);
      if (problems.length) {
        console.error(`✗ ${id}`);
        for (const p of problems) console.error(`  - ${p}`);
        failed++;
      } else {
        console.log(`✓ ${id}`);
      }
    } catch (err) {
      console.error(`✗ ${id}：${err.message}`);
      failed++;
    }
  }
  // 没配音不算错：听故事时按字数停顿。要发布就跑一下
  if (unvoiced) console.log(`提示：${unvoiced} 句还没配音或改过字，跑 npm run voice`);
  if (failed) process.exit(1);
}

const entry = process.argv[1] && pathToFileURL(resolve(process.argv[1])).href;
if (entry === import.meta.url) main();
