import { createMachine, interpret, Actor } from 'xstate';
import { CLIENT } from 'utils/constants';
import { paths, Path } from '../routes/paths';
import { spawnMachine, sync } from './machine-utils';
import pizzaMachine from './pizza.machine';
import homeMachine from './home.machine';
import secondMachine from './second.machine';
import type { GetEvents } from 'utils/types';
import { Post } from 'server/schemas';

export type Events =
  | GetEvents<typeof homeMachine>
  | GetEvents<typeof secondMachine>
  | GetEvents<typeof pizzaMachine>;

// Global store context
export type Context = {
  count: number;
  posts: Post[];
};

/* c8 ignore start */
export const routerMachine = createMachine<Context & { actors: Actor[] }, Events>({
  id: 'router',
  initial: paths.includes(window.location.pathname as Path) ? window.location.pathname : '/404',
  predictableActionArguments: true,
  context: {
    actors: [],
    count: 0,
    posts: [],
  },
  on: {
    ...sync('count', 'posts'),
    // Handle route state
    // Listens for a call to route and moves to target provided by payload
    route: paths.map((path) => ({
      target: path,
      cond: (_, event, parent) => {
        if (path === event.payload && path === parent.state.value) return false;
        return event.payload === path;
      },
    })),
  },
  states: {
    '/': spawnMachine(homeMachine),
    '/second': spawnMachine(secondMachine),
    '/pizza': spawnMachine(pizzaMachine),
    // Testing
    // '/': {},
    // '/second': {},
    // '/pizza': {},
    '/third': {},
    '/404': {},
  },
});

const service = interpret(routerMachine);

if (CLIENT) {
  // @ts-expect-error - debugging
  window.service = service;
}

export default service;
/* c8 ignore stop */
