export type Task<TParams = undefined, TResult = boolean> = {
  execute: (params?: TParams) => Promise<TResult>;
};
