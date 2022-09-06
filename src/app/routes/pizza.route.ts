/* c8 ignore start */
import { Store } from 'server/schemas';
import { createRenderer } from 'utils/routing';

export const render = createRenderer<Store>((store, state) => {
  return {
    title: 'Pizza',
    components: [
      {
        id: 'Pizza',
        component: 'Pizza',
        button: {
          text: 'SELECT TOPPINGS',
          action: {
            type: 'modal.open',
          },
        },
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
