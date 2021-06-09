export type ActionType<M, N> = N extends string ? `${N}/${M & string}` : M
export type ActionModuleType<M, N> = N extends string ? `${N}/${keyof M & string}` : keyof M
