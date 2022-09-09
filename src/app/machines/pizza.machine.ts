import { Actor, assign, createMachine, StateTransition } from 'xstate';
import { modalMachine } from './machines';
import { spawnMachine, sync } from '../machines/machine-utils';

/* c8 ignore start */
export type ListItem = {
  text: string;
  price: number;
  checked?: boolean;
  id: string;
};

const createListItem = ({
  text,
  price,
  checked = false,
}: Pick<ListItem, 'text' | 'price' | 'checked'>): ListItem => ({
  id: text.toLowerCase().replace(/\s/, ''),
  text,
  price,
  checked,
});

export type RouteContext = {
  items: ListItem[];
  price: number;
};

type Context = RouteContext & {
  actors: Actor[];
};

type Events =
  | {
      type: 'change';
      payload: string;
    }
  | {
      type: 'select';
    };

// const selectAllMachine = createMachine({
//   context: {
//     price: 0,
//     items: [],
//   },
//   states: {
//     checked: {
//       entry: ['uncheckAll', 'setPrice'],
//       on: {
//         toggle: 'unchecked',
//       },
//     },
//     unchecked: {
//       entry: ['checkAll', 'setPrice'],
//       on: {
//         toggle: 'checked',
//       },
//     },
//   }
// });

/*
// TODO: see if there is a way to do this
// Re-use a machine and assign actions to it
// Might even be able to infer the partial config
selectAll: spawnMachine(toggleMachine, {
  active: {
    entry: ['uncheckAll', 'setPrice']
  },
  inactive: {
    entry: ['checkAll', 'setPrice']
  },
})
*/

// pizza machine
const pizzaRoute = createMachine<Context, Events>(
  {
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
    on: {
      ...sync(),
      change: {
        actions: ['checkToggle', 'setPrice'],
      },
    },
    states: {
      modal: spawnMachine(modalMachine),
      selectAll: {
        initial: 'unselected',
        states: {
          unselected: {
            entry: ['uncheckAll', 'setPrice'],
            on: {
              select: 'selected',
            },
          },
          selected: {
            entry: ['checkAll', 'setPrice'],
            on: {
              select: 'unselected',
            },
          },
        },
      },
    },
  },
  {
    actions: {
      checkToggle: assign((context, e) => {
        if (e.type !== 'change') return context;
        return {
          items: context.items.map((item) =>
            item.id === e.payload ? { ...item, checked: !item.checked } : item
          ),
        };
      }),
      checkAll: assign((context) => ({
        items: context.items.map((item) => ({
          ...item,
          checked: true,
        })),
      })),
      uncheckAll: assign((context) => ({
        items: context.items.map((item) => ({
          ...item,
          checked: false,
        })),
      })),
      setPrice: assign((context) => ({
        price: Number(
          context.items
            .filter((o) => o.checked)
            .map((o) => o.price)
            .reduce((a, b) => a + b, 0)
            .toFixed(2)
        ),
      })),
    },
  }
);

type TransitionData = NonNullable<ReturnType<typeof pizzaRoute.machine.getTransitionData>>;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type MachineEvents = TransitionData extends StateTransition<infer _, infer I> ? I : never;

export default pizzaRoute;
/* c8 ignore stop */
