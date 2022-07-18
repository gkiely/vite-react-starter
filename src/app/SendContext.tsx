import { createContext, Dispatch, PropsWithChildren } from 'react';
import type { Action, UpdateAction } from 'utils/routing';
/* c8 ignore start */
export const RouteContext = createContext<{
  send: Dispatch<Action>;
  update: Dispatch<UpdateAction<Record<string, unknown>>>;
}>({
  send: () => {},
  update: () => {},
});

type Props<T, U> = PropsWithChildren & {
  update: U;
  send: T;
};

export default function Provider<
  T extends Dispatch<Action>,
  U extends Dispatch<UpdateAction<Record<string, unknown>>>
>({ send, update, children }: Props<T, U>) {
  return <RouteContext.Provider value={{ send, update }}>{children}</RouteContext.Provider>;
}
/* c8 ignore end */
