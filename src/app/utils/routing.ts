/* c8 ignore start */
import { Dispatch, SetStateAction } from 'react';
import service from 'routes/machine';
import type * as Components from '../components';

type C = typeof Components;

type Props = {
  [K in keyof C]: { component: K; id: string } & Parameters<C[K]>[number];
};

export type ComponentConfig = Props[keyof C];

export type RouteConfig = Readonly<ComponentConfig[]>;

export const useSend = () => service.send;

export const createRenderer = <S>(fn: (state: S) => RouteConfig) => fn;

export type SetState<S> = Dispatch<SetStateAction<S>>;

export const renderIf = <T>(flag: boolean, data: T): [T] | [] => {
  return flag ? [data] : [];
};

export const expectType = <T>(data: T): T => data;

/* c8 ignore stop */
