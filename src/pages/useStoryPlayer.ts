import { useEffect, useMemo, useRef, useState } from "react";
import type { Reveal } from "../render/PageView.tsx";
import { estimateSeconds, lineHash, storyScript, type Line } from "../story/script.ts";
import type { Story } from "../story/types.ts";
import { VOICE_CLIPS } from "../story/voice-manifest.ts";

/** 配好了、而且和现在的台词对得上的配音文件；没有就按字数停 */
function clipUrl(line: Line | undefined): string | null {
  if (!line?.voice || VOICE_CLIPS[line.key]?.hash !== lineHash(line)) return null;
  return `voice/${line.key}.mp3`;
}

/**
 * 「听故事」：一句一句往外冒，有配音就放配音、念完再下一句，没配音按字数停一会儿；
 * 一页念完自动翻页，最后一页念完就停。
 */
export function useStoryPlayer(story: Story, at: number, next: string | null) {
  const script = useMemo(() => storyScript(story), [story]);
  const lines = useMemo(() => script.filter((l) => l.page === at), [script, at]);
  const [playing, setPlaying] = useState(false);
  // 步数和页码绑在一起：一换页就清零，翻回停过的那页也是整页都在
  const pageKey = `${story.id}/${at}`;
  const [pos, setPos] = useState({ key: pageKey, step: 0 });
  if (pos.key !== pageKey) setPos({ key: pageKey, step: 0 });
  const step = pos.key === pageKey ? pos.step : 0;
  // 念这句时先把下一句（翻页后的第一句也算）的配音拿下来，手机网慢时句子之间不卡
  const ahead = useRef<{ url: string; audio: HTMLAudioElement } | null>(null);

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
      const url = clipUrl(line);
      if (url) {
        audio = ahead.current?.url === url ? ahead.current.audio : new Audio(url);
        ahead.current = null;
        audio.onended = () => advance(gap);
        audio.onerror = () => advance(guess);
        audio.play().catch(() => advance(guess));
      } else {
        advance(guess);
      }
      const following = script.slice(script.indexOf(line) + 1).find((l) => clipUrl(l));
      const nextUrl = clipUrl(following);
      if (nextUrl && ahead.current?.url !== nextUrl) {
        const warm = new Audio(nextUrl);
        warm.preload = "auto";
        ahead.current = { url: nextUrl, audio: warm };
      }
    }
    return () => {
      cancelled = true;
      clearTimeout(timer);
      audio?.pause();
    };
  }, [playing, step, lines, script, next, pageKey]);

  const started = playing || step > 0;
  const current = lines[Math.min(step, lines.length - 1)];
  const reveal: Reveal | undefined = started && step < lines.length && current ? { panel: current.panel, beat: current.beat, speaking: playing } : undefined;

  const toggle = () => {
    if (!playing && step >= lines.length) setPos({ key: pageKey, step: 0 });
    setPlaying(!playing);
  };
  return { playing, toggle, reveal };
}
