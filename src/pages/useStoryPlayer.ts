import { useEffect, useMemo, useState } from "react";
import type { Reveal } from "../render/PageView.tsx";
import { estimateSeconds, lineHash, storyScript } from "../story/script.ts";
import type { Story } from "../story/types.ts";
import { VOICE_CLIPS } from "../story/voice-manifest.ts";

/**
 * 「听故事」：一句一句往外冒，有配音就放配音、念完再下一句，没配音按字数停一会儿；
 * 一页念完自动翻页，最后一页念完就停。
 */
export function useStoryPlayer(story: Story, at: number, next: string | null) {
  const lines = useMemo(() => storyScript(story).filter((l) => l.page === at), [story, at]);
  const [playing, setPlaying] = useState(false);
  // 步数和页码绑在一起，翻页后自然从头念
  const [pos, setPos] = useState({ key: "", step: 0 });
  const pageKey = `${story.id}/${at}`;
  const step = pos.key === pageKey ? pos.step : 0;

  useEffect(() => {
    if (!playing) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let audio: HTMLAudioElement | null = null;
    const later = (ms: number, then: () => void) => { timer = setTimeout(() => { if (!cancelled) then(); }, ms); };
    const advance = (ms: number) => later(ms, () => setPos({ key: pageKey, step: step + 1 }));

    if (step >= lines.length) {
      later(900, () => { if (next) location.hash = next; else setPlaying(false); });
    } else {
      const line = lines[step];
      const gap = lines[step + 1]?.panel === line.panel ? 350 : 700;
      const guess = estimateSeconds(line) * 1000 + gap;
      const clip = VOICE_CLIPS[line.key];
      if (line.voice && clip?.hash === lineHash(line)) {
        audio = new Audio(`voice/${line.key}.mp3`);
        audio.onended = () => advance(gap);
        audio.onerror = () => advance(guess);
        audio.play().catch(() => advance(guess));
      } else {
        advance(guess);
      }
    }
    return () => {
      cancelled = true;
      clearTimeout(timer);
      audio?.pause();
    };
  }, [playing, step, lines, next, pageKey]);

  const started = playing || step > 0;
  const current = lines[Math.min(step, lines.length - 1)];
  const reveal: Reveal | undefined = started && step < lines.length && current ? { panel: current.panel, beat: current.beat, speaking: playing } : undefined;

  const toggle = () => {
    if (!playing && step >= lines.length) setPos({ key: pageKey, step: 0 });
    setPlaying(!playing);
  };
  return { playing, toggle, reveal };
}
