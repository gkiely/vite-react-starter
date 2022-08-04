import { Store } from 'server/schemas';
import { toEnum } from 'utils';
import { createRoute, createRenderer } from 'utils/routing';

import * as home from './home';
import * as second from './second-route';

export type Path = '' | '/' | '/second' | '/third';

type Renderers<T = ReturnType<typeof createRenderer<Store>>> = {
  [k in Path]: T;
};

type Routes = {
  [k in Path]: ReturnType<typeof createRoute>;
};

/// TODO add array routing support: ['', '/']: client
// In order to render the initial state based on the route
export const renderers: Renderers = {
  '': home.render,
  '/': home.render,
  '/second': second.render,
  '/third': second.render,
};

const routes: Routes = {
  '': home.route,
  '/': home.route,
  '/second': second.route,
  '/third': second.route,
};

/* c8 ignore start */
export const paths = toEnum(Object.keys(routes));

export default routes;
/* c8 ignore stop */
