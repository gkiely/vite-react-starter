/* c8 ignore start */
import { RouteContext } from 'machines/pizza.machine';
import { createRenderer, renderComponentIf } from 'utils/routing';

const initialContext: RouteContext = {
  price: 0,
  items: [],
};

export const render = createRenderer<RouteContext>((_store, state, context = initialContext) => {
  return {
    title: 'Pizza',
    components: [
      {
        id: 'PizzaHeader',
        component: 'PizzaHeader',
        text: context.price > 0 ? `There will be an upcharge of $${context.price}` : '',
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
        text: `There will be an upcharge of $${context.price}`,
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
            id: 'SelectAll',
            text: 'Select all',
            checked: state.matches('selectAll.selected'),
            price: Number(
              context.items
                .map((o) => o.price)
                .reduce((a, b) => a + b, 0)
                .toFixed(2)
            ),
            action: {
              type: 'select',
            },
          },
          ...context.items.map(
            (item) =>
              ({
                ...item,
                action: {
                  type: 'change',
                  payload: item.id,
                },
              } as const)
          ),
        ],
      }),
    ],
  };
});

/* c8 ignore stop */
