import { Actor, createMachine, StateTransition } from 'xstate';
import { modalMachine } from './machines';
import { spawnMachine, sync } from '../machines/machine-utils';

export type ListItem = {
  text: string;
  price: number;
  checked?: boolean;
};

const createListItem = ({ text, price, checked = false }: ListItem) => ({
  text,
  price,
  checked,
});

export type RouteContext = {
  actors: Actor[];
  items: ListItem[];
  price: number;
};

// action: {
//   type: 'price.set',
//   payload:
//     store.price && store.price > 0
//       ? 0
//       : items.map((o) => o.price).reduce((a, b) => a + b, 0),
// },

type Events = {
  type: 'change';
};

// pizza machine
const pizzaRoute = createMachine<RouteContext, Events>({
  id: '/pizza',
  type: 'parallel',
  predictableActionArguments: true,
  context: {
    actors: [],
    price: 0,
    items: [
      createListItem({ text: 'Cheese', price: 0.99 }),
      createListItem({ text: 'Meat', price: 1.29 }),
      createListItem({ text: 'Bacon', price: 0.5 }),
      createListItem({ text: 'Spinach', price: 0.99 }),
    ],
  },
  on: sync(),
  states: {
    modal: spawnMachine(modalMachine),
    selectAll: {
      initial: 'unchecked',
      states: {
        unchecked: {
          entry: [() => console.log('unchecked')],
          on: {
            change: 'checked',
          },
        },
        checked: {
          entry: [() => console.log('checked')],
          on: {
            change: 'unchecked',
          },
        },
      },
    },
  },
});

type TransitionData = NonNullable<ReturnType<typeof pizzaRoute.machine.getTransitionData>>;
type MachineEvents = TransitionData extends StateTransition<infer _, infer I> ? I : never;

export default pizzaRoute;
