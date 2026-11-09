// 故事内容检查：版式格数、气泡字数、角色是否存在、气泡有没有挡脸、字体缺不缺字。
// 用法：
//   npm run check
//   npm run check -- glowing-boots
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { CHARACTER_IDS, CREATOR_IDS } from "../src/cast/characters.ts";
import { storyIssues } from "../src/engine/compose.ts";
import { textWidth } from "../src/engine/text.ts";
import { lineHash, storyScript } from "../src/story/script.ts";
import { VOICE_CLIPS } from "../src/story/voice-manifest.ts";
import { CHARS_FILE, needsStoryFont } from "../tools/font/subset.mjs";
import { EXPRESSIONS, PLACES, POSES, SHOTS, TIMES, WEATHERS } from "../src/story/vocab.ts";
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
    const table = panel.scene.table;
    if (table && !(table.from >= 0 && table.to <= 1 && table.from < table.to)) say(where, "table 的 from、to 要在 0～1，而且 from < to");
    if (panel.actors.length === 0 && !(panel.props?.length)) say(where, "格子里至少要有一个角色或道具");
    if (panel.actors.length > LIMITS.actorsPerPanel) say(where, `角色超过 ${LIMITS.actorsPerPanel} 个`);

    const seen = new Set();
    for (const a of panel.actors) {
      if (!CHARACTER_IDS.includes(a.who)) say(where, `没有角色 ${a.who}`);
      if (seen.has(a.who)) say(where, `${a.who} 出现了两次`);
      seen.add(a.who);
      if (a.pose && !POSES.includes(a.pose)) say(where, `没有姿势 ${a.pose}`);
      if (a.face && !EXPRESSIONS.includes(a.face)) say(where, `没有表情 ${a.face}`);
      if (typeof a.at === "number" && (a.at < 0 || a.at > 1)) say(where, `站位 ${a.at} 应在 0～1`);
      if (a.seat && !SEATS.includes(a.seat)) say(where, `没有椅子 ${a.seat}`);
      if (a.tip !== undefined && !a.seat) say(where, `${a.who} 写了 tip 就要写 seat：是椅子在翘`);
      if (a.tip !== undefined && (a.tip < 0 || a.tip > 90)) say(where, `tip ${a.tip} 应在 0～90 度`);
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
  const beats = [story.cover, ...story.pages.flatMap((p) => p.panels)].flatMap((p) => p.beats ?? []);
  return [
    story.title, story.blurb, story.credits?.note ?? "", story.when?.label ?? "",
    ...beats.map((b) => b.caption ?? b.text ?? b.sfx ?? ""),
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
