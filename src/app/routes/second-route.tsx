/* c8 ignore start */
import { Post } from 'server/schemas';
import { prefixedEnum } from 'utils';
import { Action, createClientRoute, createRenderer } from 'utils/routing';
import { useStore } from './store';

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

export const client = createClientRoute((prevState, prevPath) => {
  const store = useStore();

  const send = (action: Action<CountActionTypes>) => {
    // @ts-expect-error - testing
    // eslint-disable-next-line
    if (store[action.type]) {
      // @ts-expect-error - testing
      // eslint-disable-next-line
      store[action.type](action.payload);
    }
  };

  return [render(store), send];
});

/* c8 ignore stop */
