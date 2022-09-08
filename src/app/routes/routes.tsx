// import { createRenderer } from 'utils/routing';

import * as home from './home';
import type { Path } from './paths';
import * as second from './second-route';
import * as third from './third-route';
import * as notFound from './notFound';
import * as pizza from './pizza.route';

/* c8 ignore start */
// type Renderers = {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   [k in Path]: typeof;
// };

/// TODO add array routing support: ['', '/']: client
// In order to render the initial state based on the route
export const renderers = {
  '/': home.render,
  '/second': second.render,
  '/third': third.render,
  '/pizza': pizza.render,
  '/404': notFound.render,
};

// Get an intersection of all the route contexts
// https://stackoverflow.com/a/66445507/1845423
export type Context = {
  [K in Path]: (x: Parameters<typeof renderers[K]>[2]) => void;
}[Path] extends (x: infer I) => void
  ? I
  : never;

/* c8 ignore stop */
