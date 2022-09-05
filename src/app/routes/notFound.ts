/* c8 ignore start */
import { Store } from 'server/schemas';
import { createRenderer } from 'utils/routing';

export const render = createRenderer<Store>(() => {
  return {
    title: '404 not found',
    components: [
      {
        id: 'header',
        component: 'Header',
        buttons: [],
        title: '404 not found',
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
