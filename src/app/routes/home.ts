import { Store, storeSchema } from 'server/schemas';

import { SERVER_HOST } from 'utils/constants';
import { initialState } from './store';
import { createRenderer, createRoute } from 'utils/routing';
import { app } from './server';

export const render = createRenderer<Store>((state) => {
  return [
    {
      id: 'Header',
      component: 'Header',
      title: 'Hello Vite + React!',
      body: [{ text: 'Update ' }, { code: 'App.tsx' }, { text: ' and save to test HMR updates.' }],
      buttons: [
        {
          id: 'Button-count-add',
          text: `count is: ${state.count}`,
          action: {
            loading: {
              loading: 'Adding...',
            },
            path: '/api/store/count',
            options: {
              method: 'POST',
              body: { count: 1 },
            },
          },
        },
        {
          id: 'Button-count-subtract',
          text: `Subtract count`,
          action: {
            path: '/api/store/count',
            options: {
              method: 'POST',
              body: { count: -1 },
            },
          },
        },
        {
          id: 'Button-post-add',
          text: 'Add a post',
          action: {
            path: '/api/store',
            options: {
              method: 'POST',
              body: {
                posts: [...state.posts, { id: `${state.posts.length + 1}`, title: 'New Post' }],
              },
            },
          },
        },
        ...(state.posts.length > 0
          ? [
              {
                id: 'Button-post-remove',
                text: 'Remove a post',
                action: {
                  path: '/api/store',
                  options: {
                    method: 'POST',
                    body: {
                      posts: state.posts.slice(0, state.posts.length - 1),
                    },
                  },
                  // Proposed
                  // path: '/api/store/posts/:id',
                  // options: {
                  //   method: 'DELETE',
                  //   params: { id: state.posts.slice(-1)[0]?.id },
                  // },
                },
              } as const,
            ]
          : []),
      ],
      links: [
        {
          id: '/second',
          to: '/second',
          text: 'Second route',
        },
      ],
    },
    {
      id: 'List',
      component: 'List',
      items: state.posts,
      error: state.error,
      loading: state.loading,
    },
  ];
});

export const client = createRoute(async () => {
  try {
    const response = await app.request(`${SERVER_HOST}/api/store`);
    const data = await response.json();
    const store = storeSchema.parse(data);
    return render(store);
  } catch (e) {
    return render({
      ...initialState,
      error: 'Could not load posts',
    });
  }
});

/* c8 ignore stop */
