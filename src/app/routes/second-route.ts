/* c8 ignore start */
import { Store } from 'server/schemas';
import { createRenderer } from 'utils/routing';

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
      items: state.posts,
      error: state.error,
      loading: state.loading,
    },
  ];
});
/* c8 ignore stop */
