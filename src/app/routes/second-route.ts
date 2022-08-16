/* c8 ignore start */
import { Store } from 'server/schemas';
import { createRenderer } from 'utils/routing';

export const render = createRenderer<Store>((store, state) => {
  return {
    title: 'Second route',
    components: [
      {
        id: 'Header',
        component: 'Header',
        title: 'Second route',
        body: [
          { text: 'Update ' },
          { code: 'App.tsx' },
          { text: ' and save to test HMR updates.' },
        ],
        buttons: [
          {
            id: 'Button-count-add',
            text: `count is: ${store.count}`,
            action: {
              type: 'count.update',
              payload: { count: 2 },
            },
          },
        ],
        links: [
          {
            id: '/',
            to: '/',
            text: 'Home route',
          },
          {
            id: '/third',
            to: '/third',
            text: 'Third route',
          },
        ],
      },
      {
        id: 'List',
        component: 'List',
        items: store.posts,
        error: store.error,
        loading: state.matches('loadingPosts') ? 'Loading posts...' : '',
      },
    ],
  };
});
/* c8 ignore stop */
