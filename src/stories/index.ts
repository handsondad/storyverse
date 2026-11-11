import type { Story } from "../story/types.ts";
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
export const STORIES: readonly Story[] = [wrongMuseum, glowingBoots, highChair, latexPillow, born, bellyButton, kickBall, yummyToes, bedEdge];

export function storyById(id: string): Story | undefined {
  return STORIES.find((s) => s.id === id);
}
