import type { Dispatch, SetStateAction } from 'react';
import { assertType } from 'utils';

type RouteConfig = Readonly<{
  components: Record<string, unknown>[];
  sections: string[];
}>;

type SetState<S> = Dispatch<SetStateAction<S>>;
type UpdateAction<S> = Partial<S> | ((prevState: Readonly<S>) => Partial<S>);
/* c8 ignore start */
export const createClientRoute = <S>(
  fn: () => [RouteConfig, Dispatch<UpdateAction<S>>, SetState<S>]
) => fn;
export const createServerRoute = (fn: () => RouteConfig | Promise<RouteConfig>) => fn;
export const createRenderer = <S>(fn: (state: Readonly<S>) => RouteConfig) => fn;
export const createUpdate = <S>(setState: SetState<S>) => {
  return (arg: UpdateAction<S>) => {
    if (typeof arg === 'function') {
      assertType<(prevState: S) => Partial<S>>(arg);
      return setState(s => ({
        ...s,
        ...arg(s),
      }));
    }
    return setState(s => ({
      ...s,
      ...arg,
    }));
  };
};
/* c8 ignore stop */
