/**
 * 书架上展开的是哪一年、选中的是哪个故事。放在模块里，翻开一本书再回书架时还在；
 * 刷新页面才清空，回到默认（展开最新的一年）。
 */
export const shelfMemory: { open?: number | null; picked?: string } = {};
