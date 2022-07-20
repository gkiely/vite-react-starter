/* c8 ignore start */
import { Dispatch, useEffect, useState } from 'react';
import { Post, postsSchema } from 'server/schemas';
import useSWR from 'swr/immutable';
import { prefixedEnum, assertType } from 'utils';
import { SERVER_HOST } from 'utils/constants';
import {
  Action,
  combineReducers,
  createClientRoute,
  createReducer,
  createRenderer,
  createSend,
  createServerRoute,
} from 'utils/routing';

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

export const client = createClientRoute((prevState) => {
  const [state, setState] = useState<State>(initialState);
  const send = createSend(setState, () => state);

  console.log(prevState);

  return [render(state), send, state];
});

/* c8 ignore stop */
