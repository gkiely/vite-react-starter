import { createMachine, Actor } from 'xstate';
import { spawnMachine, sync } from './machine-utils';
import { Events, countMachine } from './machines';
import type { Store } from './router.machine';

/* c8 ignore start */
export const secondMachine = createMachine<Pick<Store, 'count'> & { actors: Actor[] }, Events>({
  id: '/second',
  type: 'parallel',
  predictableActionArguments: true,
  context: {
    actors: [],
    count: 0,
  },
  on: sync('count'),
  states: {
    count: spawnMachine(countMachine),
  },
});

export default secondMachine;
/* c8 ignore stop */
