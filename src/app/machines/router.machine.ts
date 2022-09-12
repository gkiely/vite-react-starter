import {
  createMachine,
  interpret,
  Actor,
  EventFrom,
  AnyStateMachine,
  TransitionConfigOrTarget,
} from 'xstate';
import { CLIENT } from 'utils/constants';
import { paths, Path } from '../routes/paths';
import { spawnMachine, sync } from './machine-utils';
import pizzaMachine from './pizza.machine';
import homeMachine from './home.machine';
import secondMachine from './second.machine';
import { Post } from 'server/schemas';

// Global store context
export type Context = {
  count: number;
  posts: Post[];
};

type RouteEvent = {
  type: 'route';
  payload: Path;
};

export type Events =
  | EventFrom<typeof homeMachine>
  | EventFrom<typeof secondMachine>
  | EventFrom<typeof pizzaMachine>
  | RouteEvent
  | {
      type: 'xstate.update';
      state: {
        context: Context;
        machine: AnyStateMachine;
        event: {
          type: Exclude<Events['type'], 'xstate.update'>;
          payload?: Context | Partial<Context>;
        };
      };
    };

// export type Store = {
//   count: number;
//   posts: Post[];
// };

// type RouteContext = {
// }

// Listens for a call to route and moves to target provided by payload
const onRoute: TransitionConfigOrTarget<Context & { actors: Actor[] }, RouteEvent> = paths.map(
  (path) => ({
    target: path,
    cond: (_, event, parent) => {
      if (path === event.payload && path === parent.state.value) return false;
      return event.payload === path;
    },
  })
);

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
    route: onRoute,
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
