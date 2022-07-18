import { createContext, Dispatch, PropsWithChildren } from 'react';
import type { Action } from 'utils/routing';
/* c8 ignore start */
export const RouteContext = createContext<{ send: Dispatch<Action> }>({
  send: () => {},
});

type Props<T> = PropsWithChildren & { send: T };

export default function Provider<T extends Dispatch<Action>>({ send, children }: Props<T>) {
  return <RouteContext.Provider value={{ send }}>{children}</RouteContext.Provider>;
}
/* c8 ignore end */
