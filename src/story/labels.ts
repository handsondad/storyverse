import type { Expression, Place, Pose, Shot } from "./vocab.ts";

export const EXPRESSION_LABELS: Record<Expression, string> = {
  neutral: "平常", happy: "开心", laugh: "大笑", surprised: "吃惊", sad: "难过", cry: "哭",
  angry: "生气", scared: "害怕", thinking: "想事情", confused: "疑惑", shy: "害羞", sleepy: "困了", proud: "得意",
};

export const POSE_LABELS: Record<Pose, string> = {
  stand: "站", wave: "挥手", point: "指", cheer: "欢呼", jump: "跳", think: "托下巴", walk: "走",
  run: "跑", sit: "坐", crouch: "蹲", shrug: "摊手", hug: "抱", hold: "捧着",
};

export const PLACE_LABELS: Record<Place, string> = {
  "living-room": "客厅", park: "公园", bedroom: "卧室", museum: "美术馆", subway: "地铁", plain: "纯色", burst: "放射线",
};

export const SHOT_LABELS: Record<Shot, string> = { wide: "远景", medium: "中景", close: "特写" };
