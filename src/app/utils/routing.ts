import { Dispatch, SetStateAction, useContext } from 'react';
import { Path, States } from 'routes/routes';
import { assertType } from 'utils';
import type * as Components from '../components';
import { RouteContext } from '../RouteContext';

type C = typeof Components;

type Props = {
  [K in keyof C]: { component: K; id: string } & Parameters<C[K]>[number];
};

export type Action<A = string, P = unknown> = {
  type: A;
  payload?: P;
};

type ComponentConfig = Props[keyof C];

type RouteConfig = {
  sections: string[];
  components: ComponentConfig[];
};

export const useSend = () => useContext(RouteContext).send;

export const createRenderer = <S>(fn: (state: S) => RouteConfig) => fn;

export const createReducer = <S, A extends Action>(
  fn: (state: Readonly<S>, action: Readonly<A>) => S,
  actions?: A['type'][]
) => {
  return (state: Readonly<S>, action: Readonly<A>) => {
    if (!actions || actions.length === 0 || actions.includes(action.type)) {
      return fn(state, action);
    }
    return state;
  };
};

export const createClientRoute = <U = string>(
  fn: (prevState?: States, prevPath?: Path) => readonly [RouteConfig, Dispatch<Action<U>>]
) => fn;

export const createServerRoute = (fn: () => RouteConfig | Promise<RouteConfig>) => fn;

type Reducer<S, A> = (state: Readonly<S>, action: Readonly<Action<A, unknown>>) => S;
export const combineReducers = <S, A>(...reducers: Reducer<S, A>[]) => {
  return (state: S, action: Action<A>) => {
    return reducers.reduce((curr, acc) => acc(curr, action), state);
  };
};

export type SetState<S> = Dispatch<SetStateAction<S>>;

const asyncRun = async (fn: () => Promise<void>) => await fn();
export const createSend =
  <S, A>(
    setState: SetState<S>,
    reducer: (state: S, action: A) => S,
    effects?: ReturnType<typeof createEffects>
  ) =>
  (action: A) => {
    if (effects) {
      void asyncRun(async () => {
        assertType<Action<never, unknown>>(action);
        assertType<SetState<unknown>>(setState);
        await effects(action, setState);
      });
    }
    return setState((state) => reducer(state, action));
  };

export const createEffects = <S, A extends Action<never, unknown>>(
  fn: (action: A, setState: SetState<S>) => Promise<void>
) => fn;
/* c8 ignore stop */
