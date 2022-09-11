import { assertType } from 'utils';
import { Actor, assign, createMachine } from 'xstate';
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
  cartItems: ListItem[];
  price: number;
  cartPrice: number;
};

type Context = RouteContext & {
  actors: Actor[];
};

export type Events =
  | {
      type: 'change';
      payload: string;
    }
  | {
      type: 'select';
    }
  | {
      type: 'confirm';
    }
  | {
      type: 'cancel';
    }
  | {
      type: 'modal.open';
    }
  | {
      type: 'modal.close';
    }
  | {
      type: 'modal.confirm';
    };

export const listMachine = createMachine<Omit<RouteContext, 'price'>, Events>(
  {
    id: 'list',
    initial: 'unselected',
    predictableActionArguments: true,
    context: {
      cartPrice: 0,
      cartItems: [],
    },
    states: {
      unselected: {
        always: [
          {
            cond: (context) => context.cartItems.every((item) => item.checked),
            target: 'selected',
          },
        ],
        on: {
          change: {
            actions: ['check', 'setPrice'],
          },
          select: {
            target: 'selected',
            actions: ['checkAll', 'setPrice'],
          },
        },
      },
      selected: {
        on: {
          change: {
            target: 'unselected',
            actions: ['check', 'setPrice'],
          },
          select: {
            target: 'unselected',
            actions: ['uncheckAll', 'setPrice'],
          },
        },
      },
    },
  },
  {
    actions: {
      check: assign((context, e) => {
        assertType<Extract<Events, { type: 'change' }>>(e);
        return {
          cartItems: context.cartItems.map((item) =>
            item.id === e.payload ? { ...item, checked: !item.checked } : item
          ),
        };
      }),
      checkAll: assign((context) => ({
        cartItems: context.cartItems.map((item) => ({
          ...item,
          checked: true,
        })),
      })),
      uncheckAll: assign((context) => ({
        cartItems: context.cartItems.map((item) => ({
          ...item,
          checked: false,
        })),
      })),
      setPrice: assign((context) => ({
        cartPrice: Number(
          context.cartItems
            .filter((o) => o.checked)
            .map((o) => o.price)
            .reduce((a, b) => a + b, 0)
            .toFixed(2)
        ),
      })),
    },
  }
);

export const modalMachine = createMachine<Context & { items: ListItem[] }, Events>({
  id: 'modal',
  initial: 'closed',
  predictableActionArguments: true,
  context: {
    actors: [],
    price: 0,
    cartPrice: 0,
    cartItems: [],
    items: [],
  },
  on: sync('cartPrice', 'cartItems'),
  states: {
    closed: {
      on: {
        'modal.open': 'open',
      },
    },
    open: {
      ...spawnMachine(listMachine),
      on: {
        'modal.close': {
          target: 'closed',
          actions: [
            assign((context) => ({
              cartItems: context.items,
              cartPrice: context.price,
            })),
          ],
        },
        'modal.confirm': {
          target: 'closed',
          actions: [
            assign((context) => ({
              items: context.cartItems,
              price: context.cartPrice,
            })),
          ],
        },
      },
    },
  },
});

const getCartItems = () => {
  return [
    createListItem({ text: 'Cheese', price: 0.99 }),
    createListItem({ text: 'Meat', price: 1.29 }),
    createListItem({ text: 'Bacon', price: 0.5 }),
    createListItem({ text: 'Spinach', price: 0.99 }),
  ];
};

// pizza machine
const pizzaRoute = createMachine<Context, Events>({
  id: '/pizza',
  type: 'parallel',
  predictableActionArguments: true,
  context: {
    actors: [],
    price: 0,
    cartPrice: 0,
    cartItems: getCartItems(),
  },
  on: {
    ...sync('price', 'cartPrice', 'cartItems'),
  },
  states: {
    modal: spawnMachine(modalMachine),
  },
});

export default pizzaRoute;
/* c8 ignore stop */
