/* c8 ignore start */
import { Store } from 'server/schemas';
import { createRenderer } from 'utils/routing';

export const render = createRenderer<Store>(() => {
  return {
    title: 'Pizza',
    components: [
      {
        id: 'header',
        component: 'Header',
        buttons: [],
        title: 'Pizza',
        links: [
          {
            id: '/',
            to: '/',
            text: 'Back to home',
          },
        ],
      },
    ],
  };
});

/* c8 ignore stop */
