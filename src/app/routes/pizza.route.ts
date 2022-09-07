/* c8 ignore start */
import { Store } from 'server/schemas';
import { createRenderer, renderComponentIf } from 'utils/routing';

type ListItem = {
  text: string;
  price: number;
};
const createListItem = ({ text, price }: ListItem) => ({
  text,
  price,
  checked: false,
  actions: {
    change: {
      type: 'list.change',
      payload: text.toLowerCase().replace(/\s/, ''),
    },
    add: {
      type: 'price.add',
      payload: price,
    },
    subtract: {
      type: 'price.subtract',
      payload: price,
    },
  },
});

export const render = createRenderer<Store>((store, state) => {
  const items = [
    createListItem({ text: 'Cheese', price: 0.99 }),
    createListItem({ text: 'Meat', price: 1.29 }),
    createListItem({ text: 'Bacon', price: 0.5 }),
    createListItem({ text: 'Spinach', price: 0.99 }),
  ];
  return {
    title: 'Pizza',
    components: [
      {
        id: 'PizzaHeader',
        component: 'PizzaHeader',
        button: {
          text: 'Select toppings',
          action: {
            type: 'modal.open',
          },
        },
        links: [
          {
            id: 'home',
            to: '/',
            text: 'Home route',
          },
        ],
      },
      renderComponentIf(state.matches('modal.open'), {
        id: 'Modal',
        component: 'PizzaModal',
        text: 'There will be an upcharge of $0.00',
        buttons: [
          {
            text: 'Confirm',
            action: {
              type: 'modal.close',
            },
          },
          {
            text: 'Cancel',
            action: {
              type: 'modal.close',
            },
          },
        ],
        items: [
          {
            text: 'Select all',
            checked: false,
            action: {
              type: 'price.set',
              payload:
                store.price && store.price > 0
                  ? 0
                  : items.map((o) => o.price).reduce((a, b) => a + b, 0),
            },
          },
          ...items,
        ],
      }),
    ],
  };
});

/* c8 ignore stop */
