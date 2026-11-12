import type { Story } from "../story/types.ts";
import littleSofa from "./little-sofa/story.ts";
import littleGenius from "./little-genius/story.ts";
import bigGlasses from "./big-glasses/story.ts";
import littleCoder from "./little-coder/story.ts";
import littleDriver from "./little-driver/story.ts";
import balanceBoard from "./balance-board/story.ts";
import littleGuitar from "./little-guitar/story.ts";
import firstBirthday from "./first-birthday/story.ts";
import littleRider from "./little-rider/story.ts";
import hotWater from "./hot-water/story.ts";
import bathBasin from "./bath-basin/story.ts";
import crawlCourt from "./crawl-court/story.ts";
import vaccine from "./vaccine/story.ts";
import firstCold from "./first-cold/story.ts";
import laoyeBirthday from "./laoye-birthday/story.ts";
import bedEdge from "./bed-edge/story.ts";
import yummyToes from "./yummy-toes/story.ts";
import kickBall from "./kick-ball/story.ts";
import bellyButton from "./belly-button/story.ts";
import born from "./born/story.ts";
import latexPillow from "./latex-pillow/story.ts";
import glowingBoots from "./glowing-boots/story.ts";
import highChair from "./high-chair/story.ts";
import wrongMuseum from "./wrong-museum/story.ts";

/** 书架上的故事，按发布先后排 */
export const STORIES: readonly Story[] = [wrongMuseum, glowingBoots, highChair, latexPillow, born, bellyButton, kickBall, yummyToes, bedEdge, laoyeBirthday, firstCold, vaccine, crawlCourt, bathBasin, hotWater, littleRider, firstBirthday, littleGuitar, balanceBoard, littleDriver, littleCoder, bigGlasses, littleGenius, littleSofa];

export function storyById(id: string): Story | undefined {
  return STORIES.find((s) => s.id === id);
}
