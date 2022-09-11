/* c8 ignore start */
import { createRenderer } from 'utils/routing';

export const render = createRenderer((store, state) => {
  return {
    title: 'Second route',
    components: [
      {
        id: 'Header',
        component: 'Header',
        title: 'Second route',
        body: [{ text: '*Counts by 2' }],
        buttons: [
          {
            id: 'add',
            text: `count is: ${store.count}`,
            action: {
              type: 'count.update',
              payload: { count: 2 },
            },
          },
          {
            id: 'subtract',
            text: `Subtract count`,
            action: {
              type: 'count.update',
              payload: { count: -2 },
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
        error: state.matches('posts.error') ? 'Error loading posts' : '',
        loading: state.matches('posts.loading') ? 'Loading posts...' : '',
      },
    ],
  };
});
/* c8 ignore stop */
