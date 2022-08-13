import { Store } from 'server/schemas';
import { toEnum } from 'utils';
import { createRenderer } from 'utils/routing';

import * as home from './home';
import * as second from './second-route';
import * as third from './third-route';

export type Path = '' | '/' | '/second' | '/third';

type Renderers<T = ReturnType<typeof createRenderer<Store>>> = {
  [k in Path]: T;
};

/// TODO add array routing support: ['', '/']: client
// In order to render the initial state based on the route
export const renderers: Renderers = {
  '': home.render,
  '/': home.render,
  '/second': second.render,
  '/third': third.render,
};

/* c8 ignore start */
export const paths = toEnum(Object.keys(renderers));

/* c8 ignore stop */
