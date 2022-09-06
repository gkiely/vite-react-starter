import { Store } from 'server/schemas';

import { createRenderer } from 'utils/routing';

import * as home from './home';
import { Path } from './paths';
import * as second from './second-route';
import * as third from './third-route';
import * as notFound from './notFound';
import * as pizza from './pizza.route';

/* c8 ignore start */
type Renderers<T = ReturnType<typeof createRenderer<Store>>> = {
  [k in Path]: T;
};

/// TODO add array routing support: ['', '/']: client
// In order to render the initial state based on the route
export const renderers: Renderers = {
  '/': home.render,
  '/second': second.render,
  '/third': third.render,
  '/pizza': pizza.render,
  '/404': notFound.render,
};

/* c8 ignore stop */
