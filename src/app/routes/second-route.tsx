/* c8 ignore start */
import { Store, storeSchema } from 'server/schemas';
import { prefixedEnum } from 'utils';
import { SERVER_HOST } from 'utils/constants';
import { createRoute, createRenderer } from 'utils/routing';
import { app, initialState } from 'routes/server';

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
            path: '/api/count',
            loading: {
              loading: 'Adding...',
            },
            options: {
              method: 'POST',
              body: { count: 2 },
            },
          },
        },
      ],
      links: [
        {
          id: '/',
          to: '/',
          text: 'Home route',
        },
      ],
    },
    {
      id: 'List',
      component: 'List',
      items: state.posts,
      error: state.error,
      loading: '',
    },
  ];
});

const countActions = prefixedEnum('count/', ['add']);
export type CountActionTypes = typeof countActions[keyof typeof countActions];
export type CountActions = {
  type: typeof countActions.add;
};

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
