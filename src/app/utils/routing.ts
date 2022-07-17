import { Dispatch, SetStateAction, useMemo } from 'react';
import { assertType } from 'utils';
import type * as Components from '../components';

type ComponentName = keyof typeof Components;

export type Action<T = string, P = unknown> = {
  type: T;
  payload?: P;
};

type Base<P> = {
  id?: string;
  props: P;
  update?: Record<string, unknown>;
  action?: Action;
  send?: Dispatch<Action<string, unknown>>;
};

export type Element<P = Record<string, unknown>> = Base<P> & {
  element: string;
};
export type Component<P = Record<string, unknown>> = Base<P> & {
  component: ComponentName;
};

type RouteConfig = Readonly<{
  components: Component[];
  sections: string[];
}>;

type SetState<S> = Dispatch<SetStateAction<S>>;
type UpdateAction<S> = Partial<S> | ((prevState: Readonly<S>) => Partial<S>);
/* c8 ignore start */
export const createClientRoute = <S, U = string>(
  fn: () => readonly [RouteConfig, Dispatch<Action<U>>, Dispatch<UpdateAction<S>>]
) => fn;
export const createServerRoute = (fn: () => RouteConfig | Promise<RouteConfig>) => fn;
export const createRenderer = <S>(render: (state: Readonly<S>) => RouteConfig) => render;
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

export const createSend =
  <S, A>(setState: SetState<S>, reducer: (state: S, action: A) => S) =>
  (action: A) =>
    setState(state => reducer(state, action));

export const createReducer = <S, A>(fn: (state: Readonly<S>, action: Readonly<Action<A>>) => S) =>
  fn;
/* c8 ignore stop */
