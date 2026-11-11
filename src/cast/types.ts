/**
 * 角色 = 一套身体尺寸 + 一套长相。所有人共用同一副骨架（rig.ts），只是参数不同。
 * 尺寸单位和舞台一样，脚底在 y = 0，往上是负数。
 */

export type BodySpec = {
  /** 脸的横、竖半径。Q 版：小孩头大，大人头小一点 */
  readonly headRx: number;
  readonly headRy: number;
  readonly neck: number;
  /** 肩膀到胯的长度 */
  readonly torso: number;
  /** 肩宽、胯宽的一半 */
  readonly shoulder: number;
  readonly hip: number;
  readonly upperArm: number;
  readonly foreArm: number;
  readonly thigh: number;
  readonly shin: number;
  /** 胳膊、腿的粗细 */
  readonly limb: number;
  readonly hand: number;
};

/** receding：头顶光光的，只剩两鬓和后脑勺一圈 */
export type HairStyle = "spiky" | "short" | "bob" | "receding";

export type Look = {
  readonly skin: string;
  readonly hair: string;
  readonly hairStyle: HairStyle;
  /** 眼睛大小，1 是小孩的大眼睛 */
  readonly eyeScale: number;
  readonly top: { readonly color: string; readonly sleeve: "short" | "long"; readonly collar: "round" | "shirt" | "none" };
  readonly bottom: { readonly kind: "shorts" | "pants" | "skirt"; readonly color: string };
  readonly shoes: string;
  readonly socks?: string;
  readonly glasses?: string;
  /** 发卡之类的小点缀 */
  readonly accent?: string;
  /** 胡子的颜色 */
  readonly mustache?: string;
  /** 眼角、额头的皱纹 */
  readonly wrinkles?: boolean;
  /** 护士帽的颜色（一般由 outfit 给） */
  readonly cap?: string;
  /** 尖尖的生日帽的颜色（由 actor.hat 给） */
  readonly partyHat?: string;
  /** 脸颊红晕的浓淡 0～1 */
  readonly blush: number;
};

export type CharacterSpec = {
  readonly id: string;
  readonly name: string;
  /** 他 / 她 */
  readonly pronoun: string;
  readonly age: string;
  readonly about: string;
  /** edge-tts 的声音 */
  readonly voice: string;
  readonly body: BodySpec;
  readonly look: Look;
  /** 气泡底色，让孩子一眼看出是谁在说话 */
  readonly bubble: string;
};
