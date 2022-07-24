import { createRoute } from 'utils/routing';

import * as home from './home';
import * as second from './second-route';

export type Path = '' | '/' | '/second';

type Renderers = {
  [k in Path]: typeof home.render | typeof second.render;
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
};

const routes: Routes = {
  '': home.route,
  '/': home.route,
  '/second': second.route,
};

export default routes;
/* c8 ignore stop */
