/**
 * 一个故事 = 一份数据。agent 只写这份数据，画面由引擎按数据画出来。
 *
 * 舞台坐标：每一格里都是一个 1600×1000 的舞台，地面在 y = 880，角色脚踩地面。
 * 镜头（shot）决定这一格从舞台里框出哪一块，所以同一个站位，远景、中景、特写都能用。
 */
import type { SeatKind } from "../cast/chair.ts";
import type { CharacterId, CreatorId, OutfitId } from "../cast/characters.ts";
import type { LayoutId } from "../engine/layout.ts";
import type { BubbleKind, Expression, Place, Pose, Shot, Slot, ThingKind, TimeOfDay, Weather } from "./vocab.ts";

export type Actor = {
  readonly who: CharacterId;
  /** 站在哪儿：left / center / right，或 0～1 */
  readonly at: Slot | number;
  readonly pose?: Pose;
  readonly face?: Expression;
  /** 朝哪边，默认朝舞台中间 */
  readonly facing?: "left" | "right";
  /** 手里拿的东西，一个表情符号，比如 "☂️"；配 pose: "hold" 最自然 */
  readonly hold?: string;
  /** 坐在椅子上（配 pose: "sit" 或 "push"）：chair 大人的椅子，high-chair 小孩的高脚餐椅 */
  readonly seat?: SeatKind;
  /** 连人带椅子往后翘多少度：15～30 是前腿翘起来，80 左右是整个倒在地上 */
  readonly tip?: number;
  /** 换一身职业装，比如阿姨穿 nurse 就是护士 */
  readonly outfit?: OutfitId;
  /** 戴顶帽子：party 尖尖的生日帽 */
  readonly hat?: "party";
  /** pose: "sit" 时坐在道具上（三轮车座），不画小凳子 */
  readonly perch?: boolean;
  /** 换件上衣的颜色（#rrggbb）：两个哥哥这样的同一个角色一起出场时，分得出谁是谁 */
  readonly top?: string;
  /** 脚底离地多高（舞台单位）：站在蹦床这样的东西上 */
  readonly lift?: number;
};

/** 表情符号里没有的东西，由引擎画出来 */
export type Thing = {
  /** pillow 乳胶枕；baby 小宝宝；band 宝宝手腕上的腕带（特写）；ball 红黄蓝三色小球；clipper 理发的电推子；box 药盒（label 写药名）；tub 空的大澡盆（大号洗脸盆）；steam 往上冒的热气；photo 妈妈小时候的老照片（发黄，小女孩骑在摩托车上）；board 拱形的大木板（平衡板），见 shape；trike 农用三轮车（车头朝右，后面一个斗）；screen 爸爸的电脑显示器，屏幕上一行行彩色代码；glasses 摘下来放着的一副眼镜（正面）；trampoline 小孩的圆蹦床；pad 小天才学习机，屏幕上是儿歌列表，每首歌后面一个小图片；sofa 小孩的单人小沙发（空的，人坐上去用演员的 seat: "sofa"）；highchair 宝宝的木头高脚餐椅（带小餐盘、保护带、垫子），宝宝坐上去写 rider；cushion 从餐椅上扯下来的垫子 */
  readonly kind: ThingKind;
  /** 枕头鼓起来多少：0 扁扁的，1 是它本来该有的样子 */
  readonly puff?: number;
  /** 枕头还装在密封袋里 */
  readonly sealed?: boolean;
  /** 枕头袋子上的小标签，或者腕带上写的字 */
  readonly label?: string;
  /**
   * 写了就画成光着身子、只穿纸尿裤躺着的宝宝（从上往下看，头朝左），不写是襁褓。
   * high 纸尿裤捂到肚脐上面；low 边在肚脐下面；airy 透气款，边往下折，带小透气孔
   */
  readonly diaper?: "high" | "low" | "airy";
  /** 宝宝的肚脐：stump 脐带还没掉；sore 周围红了一圈；healed 长好了。high 纸尿裤会盖住 */
  readonly navel?: "stump" | "sore" | "healed";
  /**
   * 写了就画成侧面：宝宝穿着连体衣仰面躺在爬行垫上，两条小腿举起来蹬（头朝左）。
   * up 脚丫朝上；left / right 脚丫往一边转，连着几格换着写就像在来回蹬；
   * grab 两只小手抱着举起来的小脚丫；toes 把脚趾头塞进嘴里
   */
  readonly kick?: "up" | "left" | "right" | "grab" | "toes";
  /** 蹬腿的宝宝脚丫上顶着小球（跟着 kick 转） */
  readonly ball?: boolean;
  /** 宝宝张嘴咯咯笑：侧面躺着的（toes 时嘴被脚丫挡住，不用写）和 crawl / sit 的都行 */
  readonly giggle?: boolean;
  /**
   * 穿连体衣的宝宝侧面：crawl 四肢着地往左爬；sit 坐着，脸朝右，两腿往前伸；stand 站着，脸朝右，两手张开保持平衡。
   * sit 把 lift 抬到大人胸口、配大人的 hug 姿势，就是被抱在怀里
   */
  readonly move?: "crawl" | "sit" | "stand";
  /** crawl / sit 的宝宝哇哇大哭：眼睛挤成一条缝、流眼泪，坐着时一只手捂着头 */
  readonly cry?: boolean;
  /** 宝宝左右翻过来 */
  readonly flip?: boolean;
  /** crawl / sit 的宝宝的头发：fuzz 毛茸茸一层；bald 刚理的小光头，亮亮的。不写是一小撮 */
  readonly hair?: "fuzz" | "bald";
  /** crawl / sit 的宝宝戴顶帽子：party 尖尖的生日帽；big 大大的生日帽（小念自己过生日戴的）；grad 方方的博士帽 */
  readonly hat?: "party" | "big" | "grad";
  /** 宝宝戴着大人的大眼镜（侧面一只大圆镜片，镜腿挂到耳朵） */
  readonly specs?: boolean;
  /** pad 学习机上小手指着第几首歌（0～5，从上往下），那一行亮起来 */
  readonly pick?: number;
  /** stand 的宝宝踮着脚、两只小手举高往前够 */
  readonly reach?: boolean;
  /** crawl / sit 的宝宝嘟着小嘴吹气（吹蜡烛），嘴前面有几道风 */
  readonly blow?: boolean;
  /** crawl / sit 的宝宝生病了：小脸烧得红红的，眼睛没精神 */
  readonly sick?: boolean;
  /** crawl / sit 的宝宝额头上贴着退烧贴 */
  readonly patch?: boolean;
  /** crawl / sit 的宝宝连体衣的颜色，默认黄色（小念）；别人家的宝宝换个颜色，免得像小念 */
  readonly color?: string;
  /** sit 的宝宝光着身子坐在装了水的大澡盆里（盆挡住肚子以下） */
  readonly tub?: boolean;
  /** 澡盆里的宝宝举着小手拍水，水花四溅 */
  readonly splash?: boolean;
  /** sit 的宝宝往前伸的那只小手：red 红红的（烫着了，不画伤口）；bandage 包着纱布。哭的时候也伸着这只手 */
  readonly hand?: "red" | "bandage";
  /** sit 的宝宝骑在自己的大汽车（扭扭车）上，车头朝右，小手扶方向盘、一只脚踩在地上蹬 */
  readonly ride?: boolean;
  /**
   * board 大木板（拱形平衡板）怎么放：rock 弧面朝下放，能前后摇（跷跷板、站上去摇）；
   * arch 弧面朝上，像座小拱桥；slide 一头立起来当滑滑梯（左边高，右头着地，大人站左边扶着）
   */
  readonly shape?: "rock" | "arch" | "slide";
  /** rock 的木板歪多少度：正数右头往下，负数左头往下（-20～20） */
  readonly tilt?: number;
  /** highchair 的保护带：torn 扯断了，两头耷拉着 */
  readonly strap?: "torn";
  /** highchair / cushion 的垫子：torn 扯烂了露出棉花；patched 缝补过；gone（只给 highchair）垫子没了 */
  readonly cushion?: "torn" | "patched" | "gone";
  /** highchair 的钉子都震出来了，椅子腿直晃 */
  readonly nails?: boolean;
  /** highchair 用绳子绑过 */
  readonly rope?: boolean;
  /** 木板上的宝宝（crawl / sit / stand 的 baby），跟着木板的弧度歪；三轮车驾驶座、高脚餐椅上的宝宝（sit） */
  readonly rider?: Thing;
  /** 三轮车后斗里装的东西：grass 一大堆喂牛的草 */
  readonly load?: "grass";
  /** 宝宝在木板上哪儿：-1 左头，0 正中间，1 右头 */
  readonly spot?: number;
  /** 宝宝在木板上再往后仰多少度（负数往后躺：-70 躺平，-10 坐起来，做仰卧起坐） */
  readonly lean?: number;
};

/** 舞台上的道具：一个表情符号，或者一个画出来的东西（emoji 和 thing 写一个） */
export type Prop = {
  readonly emoji?: string;
  readonly thing?: Thing;
  /** 横向位置 0～1 */
  readonly x: number;
  /** 离地多高（舞台单位），默认 0 就是放在地上 */
  readonly lift?: number;
  /** 多大（舞台单位），默认 90 */
  readonly size?: number;
  /** 发光，用在有魔法的东西上 */
  readonly glow?: string;
  /** 画在人前面：拿在手里、抱在怀里的东西 */
  readonly front?: boolean;
};

/**
 * 一格里按顺序发生的事。翻页看时全都显示；动态漫画里一个一个出现，配音按这个顺序读。
 */
export type Beat =
  /** 旁白框，放在格子左上角 */
  | { readonly caption: string }
  /** 角色说话 */
  | { readonly say: CharacterId; readonly text: string; readonly kind?: BubbleKind }
  /** 拟声字：砰！哗啦！at 是在格子里的位置（0～1），默认右上 */
  | { readonly sfx: string; readonly at?: readonly [number, number]; readonly color?: string };

export type SceneSpec = {
  readonly place: Place;
  readonly time?: TimeOfDay;
  readonly weather?: Weather;
  /** plain / burst 用的底色 */
  readonly tint?: string;
  /** 一张饭桌，画在人前面；from / to 是左右两头的位置（0～1） */
  readonly table?: { readonly from: number; readonly to: number };
  /** 招牌上的字（≤4 个字）：hospital 是门上的牌子（默认「产房」），street 是中间那家店（默认「药店」） */
  readonly sign?: string;
};

export type Panel = {
  readonly scene: SceneSpec;
  readonly shot?: Shot;
  /** 特写对准谁；不写就对准第一个说话的人 */
  readonly focus?: CharacterId;
  readonly actors: readonly Actor[];
  readonly props?: readonly Prop[];
  readonly beats: readonly Beat[];
};

export type Page = {
  readonly layout: LayoutId;
  readonly panels: readonly Panel[];
};

export type Credits = {
  /**
   * 一起编故事的人：只能是小念 / 爸爸 / 妈妈。他们既是故事里的人，也是创作者。
   * 姥爷这样的角色可以出场，但不署名；不要写家里人的真名。
   */
  readonly by: readonly CreatorId[];
  readonly note?: string;
};

export type Story = {
  /** 和目录名一样，小写字母和短横线 */
  readonly id: string;
  readonly title: string;
  /** 一句话介绍，显示在书架上 */
  readonly blurb: string;
  /** 故事发生在哪天；编出来的故事写第一次讲它的那天。首页的时间绳按这个排 */
  readonly when: {
    /** YYYY-MM-DD */
    readonly date: string;
    /** 时间绳上日期下面的小标题：那天是什么日子，比如「六一儿童节」「小沙发」，≤8 个字 */
    readonly label: string;
  };
  readonly credits: Credits;
  /** 封面画面：一个舞台，只有画，没有气泡 */
  readonly cover: Omit<Panel, "beats" | "shot">;
  readonly pages: readonly Page[];
};
