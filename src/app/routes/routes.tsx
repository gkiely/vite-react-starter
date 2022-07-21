import { Dispatch } from 'react';
import { Post, postsSchema } from 'server/schemas';
// import useSWR from 'swr/immutable';
import { assertType } from 'utils';
import { SERVER_HOST } from 'utils/constants';
import { client as secondRouteClient, State as SecondRouteState } from './second-route';

import { Actions, countActions, initialState, postActions, useStore } from './store';
import { Action, createClientRoute, createRenderer, createServerRoute } from 'utils/routing';

export type State = {
  count: number;
  posts: Post[];
  error: string;
  loading: string;
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
              path: '/count',
              method: 'POST',
              payload: { count: state.count + 1 },
              type: countActions.add,
            },
          },
          {
            id: 'Button-post-add',
            text: 'Add a post',
            action: {
              type: postActions.add,
              payload: {
                id: `${state.posts.length}-added`,
                title: 'New Post',
              },
            },
          },
          ...(state.posts.length > 0
            ? [
                {
                  id: 'Button-post-remove',
                  text: 'Remove a post',
                  action: {
                    type: postActions.remove,
                    payload: {
                      id: state.posts[state.posts.length - 1]?.id,
                    },
                  },
                },
              ]
            : []),
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
    ],
  };
});

/* c8 ignore start */
/// TODO: add typing for action.payload
// Either with zod or some other way
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
  const store = useStore();
  if (store.posts.length === 0 && !store.loading && !store.error) {
    // @ts-expect-error - testing
    // eslint-disable-next-line
    store[postActions.getAll]();
  }

  const send = (action: Action<Actions>) => {
    assertType<keyof typeof store>(action.type);
    if (store[action.type]) {
      // @ts-expect-error - testing
      // eslint-disable-next-line
      store[action.type](action.payload);
    }
  };
  return [render(store), send];
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
export type States = State | SecondRouteState;
export type Path = '' | '/' | '/second';
type ServerPath = Extract<Path, '/'>;

type Routes = {
  client: {
    [k in Path]: typeof client | typeof secondRouteClient;
  };
  server: {
    [k in ServerPath]: typeof server;
  };
};

const routes: Routes = {
  client: {
    '': client,
    '/': client,
    '/second': secondRouteClient,
  },
  server: {
    '/': server,
  },
};

export const useRoute = (path: Path, prevState?: States, prevPath?: Path) => {
  if (!Object.keys(routes.client).includes(path)) {
    throw new Error(`No routes found for path: ${path}`);
  }
  const [route, send] = routes.client[path](prevState, prevPath);
  assertType<Dispatch<Action<string, unknown>>>(send);
  return [route, send] as const;
};

export default routes;
/* c8 ignore stop */
