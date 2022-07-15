import { useState } from 'react';
import { Post, postsSchema } from 'server/schemas';
import { useAsyncEffect } from 'utils';
import { SERVER_HOST } from 'utils/constants';
import {
  createClientRoute,
  createDispatch,
  createReducer,
  createRenderer,
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
        component: 'Header',
        props: {
          title: 'Hello Vite + React',
          body: 'Update App.tsx and save to test HMR updates.',
        },
        items: [
          {
            component: 'Button',
            props: {
              text: `count is: ${state.count}`,
            },
            update: {
              count: state.count + 1,
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
          {
            to: 'https://reactjs.org/',
            text: 'Learn React',
          },
          {
            to: 'https://vitejs.dev/guide/features.html',
            text: 'Vite Docs',
          },
        ],
      },
      {
        component: 'Posts',
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
  }
});

const client = createClientRoute(() => {
  const [state, setState] = useState<State>(initialState);
  const update = createUpdate(setState);
  const dispatch = createDispatch(setState, reducer);

  useAsyncEffect(async () => {
    try {
      const posts = await fetchPosts('/api/posts');
      update({ posts });
    } catch {
      update({ error: 'Could not load posts' });
    }
  }, [update]);

  return [render(state), update, dispatch];
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
export const useRoute = (path: keyof typeof routes.client) => routes.client[path]();
export const useRouteReducer = (path: keyof typeof routes.client) => {
  const [route, , dispatch] = routes.client[path]();
  return [route, dispatch] as const;
};

export default routes;
/* c8 ignore stop */
