import { Actor, createMachine } from 'xstate';
import { modalMachine, Event } from './machines';
import { spawnMachine, sync } from '../machines/machine-utils';

// pizza machine
const pizzaRoute = createMachine<{ actors: Actor[] }, Event>({
  id: 'pizza',
  type: 'parallel',
  predictableActionArguments: true,
  context: {
    actors: [],
  },
  on: sync(),
  states: {
    modal: spawnMachine(modalMachine),
  },
});

export default pizzaRoute;
