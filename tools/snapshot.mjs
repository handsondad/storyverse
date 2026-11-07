// 把画面截成 PNG，放在 snapshots/ 下，给能看图的 agent 自查用。
//
//   npm run snapshot -- <故事id>            每一页 + 封面
//   npm run snapshot -- <故事id> 2 3        只截第 2、3 页（从 1 数）
//   npm run snapshot -- cast <角色id>       角色样张
//   npm run snapshot -- ... --width 1000    截图宽度（像素），默认 1000
//
// 会自己起一个 Vite 开发服务器；已经开着的话可以加 --url http://localhost:5173/ 直接用。
// 用本机的 Edge 或 Chrome（puppeteer-core 不自带浏览器）。
import { existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "snapshots");

const BROWSERS = [
  process.env.BROWSER_PATH,
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);

function parseArgs(argv) {
  const opts = { width: 1000, url: null, targets: [] };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--width") opts.width = Number(argv[++i]);
    else if (argv[i] === "--url") opts.url = argv[++i];
    else opts.targets.push(argv[i]);
  }
  return opts;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.targets.length === 0) {
    console.log("用法：npm run snapshot -- <故事id> [页码...] | cast <角色id>");
    process.exit(1);
  }
  const executablePath = BROWSERS.find((p) => existsSync(p));
  if (!executablePath) throw new Error("找不到 Edge 或 Chrome，可以用环境变量 BROWSER_PATH 指定");

  let server = null;
  let base = opts.url;
  if (!base) {
    const { createServer } = await import("vite");
    server = await createServer({ root, logLevel: "error", server: { port: 0 } });
    await server.listen();
    base = server.resolvedUrls.local[0];
  }

  const jobs = [];
  const [first, ...rest] = opts.targets;
  if (first === "cast") {
    for (const id of rest) jobs.push({ hash: `#/cast/${id}`, file: `cast-${id}.png` });
  } else {
    const count = rest.length ? null : await pageCount(executablePath, base, first);
    const pages = rest.length ? rest.map(Number) : Array.from({ length: count }, (_, i) => i + 1);
    if (!rest.length) jobs.push({ hash: `#/read/${first}/0`, file: `${first}-cover.png` });
    for (const n of pages) jobs.push({ hash: `#/read/${first}/${n}`, file: `${first}-p${n}.png` });
  }

  mkdirSync(outDir, { recursive: true });
  const browser = await puppeteer.launch({ executablePath, headless: true, args: ["--hide-scrollbars"] });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: opts.width, height: 800, deviceScaleFactor: 1 });
    const problems = [];
    page.on("pageerror", (err) => problems.push(err.message));
    page.on("console", (msg) => { if (msg.type() === "error") problems.push(msg.text()); });
    for (const job of jobs) {
      await page.goto(`${base}?snap${job.hash}`, { waitUntil: "networkidle0" });
      await page.evaluate(() => document.fonts.ready);
      const el = await page.waitForSelector("[data-snap]", { timeout: 15000 }).catch(() => {
        throw new Error(`${job.hash} 没有画出来${problems.length ? "：\n" + problems.join("\n") : ""}`);
      });
      const path = join(outDir, job.file);
      await el.screenshot({ path });
      console.log(`snapshots/${job.file}`);
    }
    if (problems.length) {
      console.error("页面报错：\n" + problems.join("\n"));
      process.exitCode = 1;
    }
  } finally {
    await browser.close();
    await server?.close();
  }
}

async function pageCount(executablePath, base, id) {
  const browser = await puppeteer.launch({ executablePath, headless: true });
  try {
    const page = await browser.newPage();
    await page.goto(`${base}?snap#/read/${id}/1`, { waitUntil: "networkidle0" });
    const n = await page.evaluate(() => Number(document.querySelector("[data-pages]")?.getAttribute("data-pages") ?? 0));
    if (!n) throw new Error(`找不到故事 ${id}，看看 src/stories/ 下的目录名`);
    return n;
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
