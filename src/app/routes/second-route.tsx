/* c8 ignore start */
import { Post } from 'server/schemas';
import { prefixedEnum } from 'utils';
import { createRoute, createRenderer } from 'utils/routing';
import { initialState } from './store';

export type State = {
  count: number;
  posts: Post[];
  error: string;
};

const render = createRenderer<State>((state) => {
  return {
    sections: [],
    components: [
      {
        id: 'Header',
        component: 'Header',
        title: 'Hello Vite + React!',
        body: [
          { text: 'Update ' },
          { code: 'App.tsx' },
          { text: ' and save to test HMR updates.' },
        ],
        buttons: [
          {
            id: 'Button-count-add',
            text: `count is: ${state.count}`,
            action: {
              type: countActions.add,
              payload: {
                amount: 2,
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
    ],
  };
});

const countActions = prefixedEnum('count/', ['add']);
export type CountActionTypes = typeof countActions[keyof typeof countActions];
export type CountActions = {
  type: typeof countActions.add;
};

export const client = createRoute(() => {
  const store = initialState;

  return render(store);
});

/* c8 ignore stop */
