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

export type ComponentConfig = Props[keyof C];

export type RouteConfig = Readonly<ComponentConfig[]>;

export const useSend = () => useContext(RouteContext).send;

export const createRenderer = <S>(fn: (state: S) => RouteConfig) => fn;

export const createRoute = (
  fn: () =>
    | RouteConfig
    | Promise<RouteConfig>
    | [RouteConfig, () => Promise<RouteConfig>]
    | Promise<[RouteConfig, () => Promise<RouteConfig>]>
) => fn;

export type SetState<S> = Dispatch<SetStateAction<S>>;

export const renderIf = <T>(flag: boolean, data: T): [T] | [] => {
  return flag ? [data] : [];
};

export const expectType = <T>(data: T): T => data;

/* c8 ignore stop */
