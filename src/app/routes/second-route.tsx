/* c8 ignore start */
import { useEffect, useState } from 'react';
import { Post } from 'server/schemas';
import { prefixedEnum } from 'utils';
import { createClientRoute, createReducer, createRenderer, createSend } from 'utils/routing';

export type State = {
  count: number;
  posts: Post[];
  error: string;
};

const initialState: State = {
  count: 0,
  posts: [],
  error: '',
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
      },
    ],
  };
});

const countActions = prefixedEnum('count/', ['add']);
export type CountActionTypes = typeof countActions[keyof typeof countActions];
export type CountActions = {
  type: typeof countActions.add;
};
export const reducer = createReducer<State, CountActions>((state, action) => {
  switch (action.type) {
    case countActions.add:
      return {
        ...state,
        count: state.count + 1,
      };
    default:
      return state;
  }
}, Object.values(countActions));

export const client = createClientRoute((prevState, prevPath) => {
  const [state, setState] = useState<State>(initialState);
  const send = createSend(setState, reducer);

  useEffect(() => {
    if (prevState?.count) {
      setState((s) => ({ ...s, count: prevState.count }));
    }
  }, [prevState?.count]);

  return [render(state), send, state];
});

/* c8 ignore stop */
