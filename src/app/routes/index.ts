import { useState } from 'react';
import { Post, postsSchema } from 'server/schemas';
import { assertType, useAsyncEffect } from 'utils';
import { SERVER_HOST } from 'utils/constants';
import {
  createClientRoute,
  createReducer,
  createRenderer,
  createSend,
  createServerRoute,
  createUpdate,
} from 'utils/routing';

const fetchPosts = async (s: string): Promise<Post[]> => {
  try {
    const response = await fetch(s);
    const data = await response.json();
    return postsSchema.parse(data);
  } catch {
    throw new Error('Failed to fetch posts');
  }
};

export type State = {
  count: number;
  posts: Post[];
  error?: string;
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
        props: {
          title: 'Hello Vite + React!',
          body: [
            { text: 'Update ' },
            { code: 'App.tsx' },
            { text: ' and save to test HMR updates.' },
          ],
          count: state.count,
          buttons: [
            {
              component: 'Button',
              props: {
                text: `count is: ${state.count}`,
              },
              action: {
                type: 'add',
              },
            },
            {
              component: 'Button',
              props: {
                text: 'Add a post',
              },
              action: {
                type: 'post',
                payload: {
                  title: 'New Post',
                },
              },
            },
          ],
          links: [
            {
              element: 'Link',
              props: {
                to: 'https://reactjs.org/',
                text: 'Learn React',
              },
            },
            {
              element: 'Link',
              props: {
                to: 'https://vitejs.dev/guide/features.html',
                text: 'Vite Docs',
              },
            },
          ],
        },
      },
      {
        id: 'Posts',
        component: 'List',
        props: {
          posts: state.posts,
          error: state.error,
        },
      },
    ],
  };
});

type Actions = 'add';
export const reducer = createReducer<State, Actions>((state, action) => {
  switch (action.type) {
    case 'add':
      return {
        ...state,
        count: state.count + 1,
      };
    default:
      return state;
  }
});

const client = createClientRoute(() => {
  const [state, setState] = useState<State>(initialState);
  const update = createUpdate(setState);
  const send = createSend(setState, reducer);

  useAsyncEffect(async () => {
    update({ error: '' });
    try {
      const posts = await fetchPosts('/api/posts');
      update({ posts });
    } catch {
      update({ error: 'Could not load posts' });
    }
  }, [update]);

  return [render(state), send, update];
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

const routes = {
  client: {
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
  return routes.client[path]();
};
export const useRouteUpdate = (path: keyof typeof routes.client) => {
  const [route, , update] = routes.client[path]();
  return [route, update] as const;
};

export default routes;
/* c8 ignore stop */
