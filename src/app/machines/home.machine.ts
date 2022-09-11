import { createMachine, Actor } from 'xstate';
import { spawnMachine, sync } from './machine-utils';
import { Events, countMachine, postsMachine } from './machines';
import type { Context } from './router.machine';

/* c8 ignore start */
export const homeMachine = createMachine<
  Pick<Context, 'count' | 'posts'> & { actors: Actor[] },
  Events
>({
  id: '/',
  type: 'parallel',
  predictableActionArguments: true,
  context: {
    actors: [],
    count: 0,
    posts: [],
  },
  on: sync('count', 'posts'),
  states: {
    posts: spawnMachine(postsMachine),
    count: spawnMachine(countMachine),
  },
});

export default homeMachine;
/* c8 ignore stop */
