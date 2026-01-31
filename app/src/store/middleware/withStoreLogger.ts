import type { StateCreator, StoreMutatorIdentifier } from 'zustand';

const isDev = typeof process !== 'undefined' ? process.env.NODE_ENV !== 'production' : true;

type LoggerMiddleware = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
>(config: StateCreator<T, Mps, Mcs>, storeName: string) => StateCreator<T, Mps, Mcs>;

export const withStoreLogger: LoggerMiddleware = (config, storeName) => (set, get, api) => {
  const loggerSet = (
    partial: Parameters<typeof set>[0],
    replace?: Parameters<typeof set>[1],
    action?: Parameters<typeof set>[2],
  ) => {
    if (isDev) {
      const actionLabel = typeof action === 'string' ? action : action ?? 'anonymous';
      const payload = typeof partial === 'function' ? '[function]' : partial;
      console.debug(`[${storeName}] action: ${actionLabel}`, payload);
    }
    set(partial, replace as Parameters<typeof set>[1], action);
  };

  return config(loggerSet as typeof set, get, api);
};
