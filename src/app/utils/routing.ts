/* c8 ignore start */
import { Dispatch, SetStateAction, useContext } from 'react';
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

export type RouteConfig = {
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

export const createRoute = (fn: () => RouteConfig | Promise<RouteConfig>) => fn;

type Reducer<S, A> = (state: Readonly<S>, action: Readonly<Action<A, unknown>>) => S;
export const combineReducers = <S, A>(...reducers: Reducer<S, A>[]) => {
  return (state: S, action: Action<A>) => {
    return reducers.reduce((curr, acc) => acc(curr, action), state);
  };
};

export type SetState<S> = Dispatch<SetStateAction<S>>;
/* c8 ignore stop */
