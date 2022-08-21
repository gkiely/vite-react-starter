import { Store } from 'server/schemas';
import { createRenderer, renderIf } from 'utils/routing';
import { Props as HeaderProps } from 'components/Header/Header';
type Button = HeaderProps['buttons'][number];

/* c8 ignore start */
export const render = createRenderer<Store>((store, state) => {
  return {
    title: 'Home route',
    components: [
      {
        id: 'Header',
        component: 'Header',
        title: 'Home route',
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
          ...renderIf<Button>(state.matches('posts.idle'), {
            id: 'Button-post-add',
            text: 'Add a post',
            action: {
              type: 'post.create',
              payload: { title: 'New post' },
            },
          }),
          ...renderIf<Button>(store.posts.length > 0, {
            id: 'Button-post-remove',
            text: 'remove',
            action: {
              type: 'post.delete',
              payload: { id: store.posts[store.posts.length - 1]?.id ?? '' },
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
        items: store.posts,
        error: state.matches('posts.error') ? 'Error loading posts' : '',
        loading: state.matches('posts.loading') ? 'Loading posts...' : '',
      },
    ],
  };
});

/* c8 ignore stop */
