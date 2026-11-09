import type { Story } from "../story/types.ts";
import glowingBoots from "./glowing-boots/story.ts";
import highChair from "./high-chair/story.ts";
import wrongMuseum from "./wrong-museum/story.ts";

/** 书架上的故事，按发布先后排 */
export const STORIES: readonly Story[] = [wrongMuseum, glowingBoots, highChair];

export function storyById(id: string): Story | undefined {
  return STORIES.find((s) => s.id === id);
}
