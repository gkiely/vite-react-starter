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
  actors: Actor[];
  items: ListItem[];
  price: number;
};

type Events =
  | {
      type: 'change';
      payload: string;
    }
  | {
      type: 'select';
    };

// pizza machine
const pizzaRoute = createMachine<RouteContext, Events>(
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
        actions: [
          assign((context, e) => ({
            items: context.items.map((item) =>
              item.id === e.payload ? { ...item, checked: !item.checked } : item
            ),
          })),
          'updatePrice',
        ],
      },
    },
    states: {
      modal: spawnMachine(modalMachine),
      selectAll: {
        initial: 'unselected',
        states: {
          unselected: {
            entry: [
              assign((context) => ({
                items: context.items.map((item) => ({
                  ...item,
                  checked: false,
                })),
              })),
              'updatePrice',
            ],
            on: {
              select: 'selected',
            },
          },
          selected: {
            entry: [
              assign((context) => ({
                items: context.items.map((item) => ({
                  ...item,
                  checked: true,
                })),
              })),
              'updatePrice',
            ],
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
      updatePrice: assign((context) => ({
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
