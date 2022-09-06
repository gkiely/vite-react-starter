/* c8 ignore start */
import { Store } from 'server/schemas';
import { createRenderer } from 'utils/routing';

export const render = createRenderer<Store>((_store, state) => {
  return {
    title: 'Pizza',
    components: [
      {
        id: 'Pizza',
        component: 'Pizza',
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
      // TODO:
      // renderIf should accept either a component or a generic element
      // component containing both an id and component
      // renderIf<Props>(state.matches('modal.open'), {
      //  id: 'Modal',
      // })
      ...(state.matches('modal.open')
        ? [
            {
              id: 'Modal',
              component: 'PizzaModal',
              cancel: {
                text: 'Cancel',
                action: {
                  type: 'modal.close',
                },
              },
              confirm: {
                text: 'Confirm',
                action: {
                  type: 'modal.close',
                },
              },
            } as const,
          ]
        : []),
    ],
  };
});

/* c8 ignore stop */
