/* c8 ignore start */
import { Store, storeSchema } from 'server/schemas';
import { SERVER_HOST } from 'utils/constants';
import { createRoute, createRenderer } from 'utils/routing';
import { app, initialState } from 'routes/server';

export const render = createRenderer<Store>((state) => {
  return [
    {
      id: 'Header',
      component: 'Header',
      title: 'Second route',
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

export const route = createRoute(async () => {
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
