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

const render = createRenderer<State>(state => {
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
          {
            id: 'Button-post-add',
            text: 'Add a post',
            action: {
              type: postActions.add,
              // Commenting this out and pressing the Add a post button will cause the app to crash
              payload: {
                id: `${state.posts.length}-added`,
                title: 'New Post',
              },
            },
          },
          {
            id: 'Button-post-remove',
            text: 'Remove a post',
            action: {
              type: postActions.remove,
            },
          },
        ],
        links: [
          {
            id: 'react',
            to: 'https://reactjs.org/',
            text: 'Learn React',
          },
          {
            id: 'vite',
            to: 'https://vitejs.dev/guide/features.html',
            text: 'Vite Docs',
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

/* c8 ignore start */
/// TODO: add typing for action.payload
// Either with zod or some other way
const postActions = prefixedEnum('posts/', ['add', 'remove']);
export type PostActions = typeof postActions[keyof typeof postActions];
type PostActionsConfig = {
  [postActions.add]: Post;
  [postActions.remove]: undefined;
};

export const postReducer = createReducer<State, PostActions>((state, action) => {
  switch (action.type) {
    case postActions.add:
      return {
        ...state,
        posts: [...state.posts, action.payload as Post],
      };
    case postActions.remove:
      return {
        ...state,
        posts: state.posts.slice(0, -1),
      };
    default:
      return state;
  }
}, Object.values(postActions));

const countActions = prefixedEnum('count/', ['add']);
export type CountActions = typeof countActions[keyof typeof countActions];
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

type Actions = CountActions & PostActions;
/* c8 ignore end */

const fetchPosts = async (s: string, signal?: AbortSignal): Promise<Post[]> => {
  try {
    const response = await fetch(s, signal ? { signal } : {});
    const data = await response.json();
    return postsSchema.parse(data);
  } catch {
    throw new Error('Could not load posts');
  }
};

const client = createClientRoute(() => {
  const [state, setState] = useState<State>(initialState);
  const reducers = combineReducers<State, Actions>(reducer, postReducer);
  const send = createSend(setState, reducers);
  const { data, error } = useSWR<Post[], Error>('/api/posts', fetchPosts);

  useEffect(() => {
    if (data) {
      setState(s => ({ ...s, posts: [...new Set([...s.posts, ...data])] }));
    } else if (error) {
      setState(s => ({ ...s, error: error.message }));
    }
  }, [data, error, setState]);

  return [render(state), send];
});

const server = createServerRoute(async () => {
  try {
    const posts = await fetchPosts(`${SERVER_HOST}/api/posts`);
    return render({
      ...initialState,
      posts,
    });
  } catch (e) {
    return render({
      ...initialState,
      error: 'Could not load posts',
    });
  }
});

/// TODO add array routing
const routes = {
  client: {
    '': client,
    '/': client,
  },
  server: {
    '/': server,
  },
};

/* c8 ignore start */
export const useRoute = (path: string) => {
  if (!Object.keys(routes.client).includes(path)) {
    throw new Error(`No routes found for path: ${path}`);
  }
  assertType<keyof typeof routes.client>(path);
  const [route, send] = routes.client[path]();
  assertType<Dispatch<Action<string, unknown>>>(send);
  return [route, send] as const;
};

export default routes;
/* c8 ignore stop */
