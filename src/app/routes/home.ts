import { Store } from 'server/schemas';
import { createRenderer, renderIf } from 'utils/routing';
import { Props as HeaderProps } from 'components/Header/Header';
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
            type: 'count.update',
            payload: { count: 1 },
          },
        },
        {
          id: 'Button-count-subtract',
          text: `Subtract count`,
          action: {
            type: 'count.update',
            payload: { count: -1 },
          },
        },
        {
          id: 'Button-post-add',
          text: 'Add a post',
          action: {
            type: 'post.create',
            payload: { title: 'New post' },
          },
        },
        ...renderIf<Button>(state.posts.length > 0, {
          id: 'Button-post-remove',
          text: 'remove',
          action: {
            type: 'post.delete',
            payload: { id: state.posts[state.posts.length - 1]?.id ?? '' },
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

/* c8 ignore stop */
