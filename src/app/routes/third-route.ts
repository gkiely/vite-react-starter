/* c8 ignore start */
import { Store } from 'server/schemas';
import { createRenderer } from 'utils/routing';

export const render = createRenderer<Store>((state) => {
  return [
    {
      id: 'Header',
      component: 'Header',
      title: 'Third route',
      body: [{ text: 'Update ' }, { code: 'App.tsx' }, { text: ' and save to test HMR updates.' }],
      buttons: [
        {
          id: 'Button-count-add',
          text: `count is: ${state.count}`,
          action: {
            type: 'count.update',
            payload: { count: 10 },
          },
        },
      ],
      links: [
        {
          id: '/',
          to: '/second',
          text: 'Second route',
        },
      ],
    },
  ];
});

/* c8 ignore stop */
