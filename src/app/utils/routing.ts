import { Dispatch, SetStateAction, useMemo } from 'react';
import { assertType } from 'utils';

export type Action<T = string, P = unknown> = {
  type: T;
  payload?: P;
};

type RouteConfig = Readonly<{
  components: Record<string, unknown>[];
  sections: string[];
}>;

type SetState<S> = Dispatch<SetStateAction<S>>;
type UpdateAction<S> = Partial<S> | ((prevState: Readonly<S>) => Partial<S>);
/* c8 ignore start */
export const createClientRoute = <S, U = string>(
  fn: () => readonly [RouteConfig, Dispatch<UpdateAction<S>>, Dispatch<Action<U>>]
) => fn;
export const createServerRoute = (fn: () => RouteConfig | Promise<RouteConfig>) => fn;
export const createRenderer = <S>(fn: (state: Readonly<S>) => RouteConfig) => fn;
export const createUpdate = <S>(setState: SetState<S>) =>
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useMemo(() => {
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
  }, [setState]);

export const createDispatch = <S, A>(
  setState: SetState<S>,
  reducer: (state: S, action: A) => S
) => {
  return (action: A) => setState(state => reducer(state, action));
};

export const createReducer = <S, A>(fn: (state: S, action: Action<A>) => S) => fn;
/* c8 ignore stop */
