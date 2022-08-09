import { Store, storeSchema } from 'server/schemas';
import { DEV, SERVER_HOST } from 'utils/constants';
import { initialState } from 'routes/server';
import { createRenderer, createRoute, renderIf } from 'utils/routing';
import { app } from './server';
import { Props as HeaderProps } from 'components/Header/Header';
import { assertType } from 'utils';
type Button = HeaderProps['buttons'][number];

/* c8 ignore start */
export const render = createRenderer<Store>((state) => {
  return [
    {
      id: 'Header',
      component: 'Header',
      title: 'Home route',
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
            error: {
              error: 'Error adding count',
            },
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
            path: '/api/count',
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
            path: '/api/post',
            options: {
              method: 'POST',
              body: {
                title: 'New Post',
              },
            },
          },
        },
        ...renderIf<Button>(state.posts.length > 0, {
          id: 'Button-post-remove',
          text: 'remove',
          action: {
            path: '/api/post',
            options: {
              method: 'DELETE',
              body: {
                id: state.posts[state.posts.length - 1]?.id ?? '',
              },
            },
          },
        }),
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

export const route = createRoute(() => {
  return [
    render({
      ...initialState,
      loading: 'Loading posts...',
    }),
    async () => {
      try {
        const response = await app.request(`${SERVER_HOST}/api/store`);
        const data = await response.json();
        const store = storeSchema.parse(data);
        return render(store);
      } catch (e) {
        assertType<Error>(e);
        if (DEV) {
          throw new Error(e.message);
        }
        return render({
          ...initialState,
          error: 'Could not load posts',
        });
      }
    },
  ];
});

/* c8 ignore stop */
