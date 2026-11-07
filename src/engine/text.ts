/**
 * 量字和折行。不依赖浏览器：中文、全角标点按 1 个字宽，英文数字按半个字宽估。
 * 站酷快乐体的中文是等宽的，这样估出来和实际画出来基本一致。
 */

const NO_LINE_START = "，。！？、：；）》」』】”’…—～,.!?:;)";
const NO_LINE_END = "（《「『【“‘(";

export function charWidth(ch: string): number {
  const code = ch.codePointAt(0) ?? 0;
  if (code < 0x80) return ch === " " ? 0.3 : 0.56;
  if (code >= 0x1f000) return 1.15;
  return 1;
}

export function textWidth(text: string, size: number): number {
  let w = 0;
  for (const ch of text) w += charWidth(ch);
  return w * size;
}

/**
 * 按最大宽度折行，标点不放在行首。
 * maxWidth 是像素；返回每一行的文字。尽量让每行一样长（4 个字 + 1 个字 不如 3 + 2 好看）。
 */
export function wrap(text: string, size: number, maxWidth: number): string[] {
  const total = textWidth(text, size);
  if (total <= maxWidth) return [text];
  const lines = Math.ceil(total / maxWidth);
  const target = Math.min(maxWidth, total / lines + size * 0.5);
  const out: string[] = [];
  let line = "";
  let w = 0;
  const chars = [...text];
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const cw = charWidth(ch) * size;
    if (line && w + cw > target && !NO_LINE_START.includes(ch) && !NO_LINE_END.includes(chars[i - 1])) {
      out.push(line);
      line = "";
      w = 0;
    }
    line += ch;
    w += cw;
  }
  if (line) out.push(line);
  return out;
}

export function blockSize(lines: readonly string[], size: number, lineHeight = 1.28): { w: number; h: number } {
  return {
    w: Math.max(...lines.map((l) => textWidth(l, size))),
    h: lines.length * size * lineHeight,
  };
}
