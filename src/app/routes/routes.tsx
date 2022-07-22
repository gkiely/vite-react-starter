import { createRoute } from 'utils/routing';

import { client, render } from './home';
import { client as secondRouteClient, render as secondRouteRender } from './second-route';

export type Path = '' | '/' | '/second';

type Renderers = {
  [k in Path]: typeof render | typeof secondRouteRender;
};

type Routes = {
  [k in Path]: ReturnType<typeof createRoute>;
};

/// TODO add array routing support: ['', '/']: client
// In order to render the initial state based on the route
export const renderers: Renderers = {
  '': render,
  '/': render,
  '/second': secondRouteRender,
};

const routes: Routes = {
  '': client,
  '/': client,
  '/second': secondRouteClient,
};

export default routes;
/* c8 ignore stop */
