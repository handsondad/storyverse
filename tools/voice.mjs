// 用 edge-tts 给故事配音：每句旁白和台词一个 mp3，放在 public/voice/<故事>/<页>-<格>-<beat>.mp3，
// 指纹和时长写进 src/story/voice-manifest.ts。只配新的和改过的句子，可以随时中断再续。
//   npm run voice                  全部故事
//   npm run voice -- wrong-museum  只配这几本
// 需要：python -m pip install edge-tts，以及 PATH 里的 ffmpeg / ffprobe；生成时要联网。
// 这里只放合成的声音；孩子自己录的声音放 private/，不走这个工具。
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { lineHash, storyScript } from "../src/story/script.ts";
import { VOICE_CLIPS } from "../src/story/voice-manifest.ts";
import { STORIES } from "../src/stories/index.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = join(root, "src/story/voice-manifest.ts");
const voiceDir = join(root, "public/voice");
const parallel = 4;

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"] });
    let out = "";
    let err = "";
    child.stdout.on("data", (chunk) => { out += chunk; });
    child.stderr.on("data", (chunk) => { err += chunk; });
    child.on("error", reject);
    child.on("close", (code) => (code === 0 ? resolve(out) : reject(new Error(`${command} 退出码 ${code}: ${err.slice(-400)}`))));
  });
}

const clips = { ...VOICE_CLIPS };

function save() {
  const sorted = Object.fromEntries(Object.entries(clips).sort(([a], [b]) => a.localeCompare(b)));
  const body = Object.entries(sorted).map(([k, v]) => `  ${JSON.stringify(k)}: { hash: "${v.hash}", seconds: ${v.seconds} },`).join("\n");
  writeFileSync(manifestPath, [
    "// npm run voice 生成，别手改。key 对应 public/voice/<key>.mp3",
    `export const VOICE_CLIPS: Readonly<Record<string, { readonly hash: string; readonly seconds: number }>> = {${body ? `\n${body}\n` : ""}};`,
    "",
  ].join("\n"));
}

const only = new Set(process.argv.slice(2).filter((a) => !a.startsWith("-")));
const wanted = new Map(STORIES.flatMap((s) => storyScript(s)).filter((l) => l.voice).map((l) => [l.key, l]));

// 删掉没人念的旧音频：句子删了、故事删了
for (const key of Object.keys(clips)) if (!wanted.has(key)) delete clips[key];
function sweep(dir) {
  if (!existsSync(dir)) return;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) sweep(p);
    else if (e.name.endsWith(".mp3") && !wanted.has(relative(voiceDir, p).replace(/\\/g, "/").replace(/\.mp3$/, ""))) rmSync(p);
  }
}
sweep(voiceDir);

const todo = [...wanted.values()].filter((l) => {
  if (only.size && !only.has(l.key.split("/")[0])) return false;
  return clips[l.key]?.hash !== lineHash(l) || !existsSync(join(voiceDir, `${l.key}.mp3`));
});
console.log(`需要配音 ${todo.length} 句（一共 ${wanted.size} 句）`);

const scratch = join(tmpdir(), "storyverse-voice");
mkdirSync(scratch, { recursive: true });

async function make(line) {
  const raw = join(scratch, `${line.key.replace(/\//g, "_")}.raw.mp3`);
  const out = join(voiceDir, `${line.key}.mp3`);
  mkdirSync(dirname(out), { recursive: true });
  for (let attempt = 1; ; attempt += 1) {
    try {
      const pitch = line.voice.pitch ? [`--pitch=${line.voice.pitch}`] : [];
      await run("python", ["-m", "edge_tts", "--voice", line.voice.voice, `--rate=${line.voice.rate}`, ...pitch, "--text", line.text, "--write-media", raw]);
      break;
    } catch (error) {
      if (attempt >= 4) throw error;
      await new Promise((r) => setTimeout(r, 2000 * attempt));
    }
  }
  await run("ffmpeg", ["-y", "-v", "error", "-i", raw, "-ac", "1", "-ar", "24000", "-b:a", "32k", out]);
  rmSync(raw, { force: true });
  const seconds = Number((await run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", out])).trim());
  clips[line.key] = { hash: lineHash(line), seconds: Math.round(seconds * 100) / 100 };
}

let done = 0;
let failed = 0;
const queue = [...todo];
await Promise.all(Array.from({ length: parallel }, async () => {
  for (let line = queue.shift(); line; line = queue.shift()) {
    try {
      await make(line);
      // 中途存一下，断了好续；Windows 上编辑器偶尔会锁住文件，存不上就等最后一起存
      try { save(); } catch { /* 最后还会再存 */ }
      done += 1;
      if (done % 10 === 0 || done === todo.length) console.log(`${done}/${todo.length}`);
    } catch (error) {
      failed += 1;
      console.error(`✖ ${line.key}: ${error.message}`);
    }
  }
}));
for (let attempt = 1; ; attempt += 1) {
  try {
    save();
    break;
  } catch (error) {
    if (attempt >= 5) throw error;
    await new Promise((r) => setTimeout(r, 500 * attempt));
  }
}
console.log(failed ? `完成 ${done} 句，失败 ${failed} 句，再跑一次会只补失败的` : `全部完成：${done} 句`);
process.exitCode = failed ? 1 : 0;
