import {
  createMachine,
  interpret,
  Actor,
  EventFrom,
  AnyStateMachine,
  TransitionConfigOrTarget,
} from 'xstate';
import { CLIENT, TEST } from 'utils/constants';
import { paths, Path } from '../routes/paths';
import { spawnMachine, sync } from './machine-utils';
import pizzaMachine from './pizza.machine';
import homeMachine from './home.machine';
import secondMachine from './second.machine';
import { Post } from 'server/schemas';

/* c8 ignore start */
// Global store
export type Store = {
  count: number;
  posts: Post[];
};

type Context = Store & { actors: Actor[] };

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
        context: Store;
        machine: AnyStateMachine;
        event: {
          type: Exclude<Events['type'], 'xstate.update'>;
          payload?: Store | Partial<Store>;
        };
      };
    };

// Listens for a call to route and moves to target provided by payload
const onRoute: TransitionConfigOrTarget<Context, RouteEvent> = paths.map((path) => ({
  target: path,
  cond: (_, event, parent) => {
    if (path === event.payload && path === parent.state.value) return false;
    return event.payload === path;
  },
}));

const path = typeof window !== 'undefined' ? window.location.pathname : '/';

export const routerMachine = createMachine<Context, Events>({
  id: 'router',
  initial: paths.includes(path as Path) ? path : '/404',
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

if (CLIENT && !TEST) {
  // @ts-expect-error - debugging
  window.service = service;
}

export default service;
/* c8 ignore stop */
