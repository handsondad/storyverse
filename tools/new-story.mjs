// 新建一个故事目录骨架。
// 用法：npm run story:new -- my-story-id
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const id = process.argv[2];

if (!id || !/^[a-z][a-z0-9-]*$/.test(id)) {
  console.error("用法：npm run story:new -- <id>（小写字母、数字、短横线）");
  process.exit(1);
}

const dir = join(root, "src/stories", id);
if (existsSync(dir)) {
  console.error(`已存在：src/stories/${id}`);
  process.exit(1);
}

mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, "ideas.md"), `# ${id}

## 和孩子聊到的点子

- 

## 决定下来的事

- 主角：
- 去哪儿：
- 遇到什么：
- 结局：
`);

writeFileSync(join(dir, "story.ts"), `import type { Story } from "../../story/types.ts";

const story: Story = {
  id: "${id}",
  title: "新故事",
  blurb: "一句话介绍。",
  // 故事发生的那天（编出来的故事写第一次讲它的那天），首页时间绳按这个排
  when: { date: "${new Date().toISOString().slice(0, 10)}", label: "" },
  credits: {
    by: ["nian", "dad"],
  },
  cover: {
    scene: { place: "park", time: "day" },
    actors: [
      { who: "nian", at: "center", pose: "wave", face: "happy" },
    ],
  },
  pages: [
    {
      layout: "1",
      panels: [
        {
          scene: { place: "living-room", time: "day" },
          shot: "medium",
          actors: [
            { who: "nian", at: "center", pose: "stand", face: "happy" },
          ],
          beats: [
            { caption: "故事从这里开始。" },
            { say: "nian", text: "你好！" },
          ],
        },
      ],
    },
  ],
};

export default story;
`);

const indexPath = join(root, "src/stories/index.ts");
let index = (await import("node:fs")).readFileSync(indexPath, "utf8");
if (!index.includes(`./${id}/story.ts`)) {
  const importName = id.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  index = index.replace(
    /import type \{ Story \} from "\.\.\/story\/types\.ts";(\r?\n)/,
    (_m, eol) => `import type { Story } from "../story/types.ts";${eol}import ${importName} from "./${id}/story.ts";${eol}`,
  );
  index = index.replace(
    /export const STORIES: readonly Story\[\] = \[([^\]]*)\]/,
    (_m, list) => {
      const items = list.trim() ? list.trim().replace(/,?$/, ",") + ` ${importName}` : importName;
      return `export const STORIES: readonly Story[] = [${items}]`;
    },
  );
  writeFileSync(indexPath, index);
}

console.log(`已创建 src/stories/${id}/`);
console.log("下一步：改 story.ts → npm run check -- " + id + " → npm run snapshot -- " + id);
