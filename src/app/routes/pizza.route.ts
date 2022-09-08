/* c8 ignore start */
import { RouteContext } from 'machines/pizza.machine';
import { createRenderer, renderComponentIf } from 'utils/routing';

export const render = createRenderer<RouteContext>((store, state, context) => {
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
            checked: state.matches('selectAll.checked'),
            price: 0,
            action: {
              type: 'change',
            },
          },
          ...context.items,
        ],
      }),
    ],
  };
});

/* c8 ignore stop */
