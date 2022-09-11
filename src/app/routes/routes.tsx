import * as home from './home.route';
import type { Path } from './paths';
import * as second from './second-route';
import * as third from './third-route';
import * as notFound from './notFound';
import * as pizza from './pizza.route';

/* c8 ignore start */

/// TODO add array routing support: ['', '/']: client
// In order to render the initial state based on the route
export const renderers = {
  '/': home.render,
  '/second': second.render,
  '/third': third.render,
  '/pizza': pizza.render,
  '/404': notFound.render,
};

// Intersection of all the route contexts
// https://stackoverflow.com/a/66445507/1845423
export type RouteContext = {
  [K in Path]: (x: Parameters<typeof renderers[K]>[2]) => void;
}[Path] extends (x: infer I) => void
  ? I
  : never;
/* c8 ignore stop */
