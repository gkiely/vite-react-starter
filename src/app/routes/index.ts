import { useEffect, useState } from 'react';
import { Post, postsSchema } from 'server/schemas';
import { DEV_SERVER, SERVER_HOST } from 'utils/constants';
import { createClientRoute, createRenderer, createServerRoute, createUpdate } from 'utils/routing';

const fetchPosts = async (s: string): Promise<Post[]> => {
  try {
    const response = await fetch(s);
    const data = await response.json();
    return postsSchema.parse(data);
  } catch {
    throw new Error('Failed to fetch posts');
  }
};

type State = {
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
              payload: {
                count: state.count,
              },
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
          DEV_SERVER,
        },
      },
    ],
  };
});

const client = createClientRoute(() => {
  const [state, setState] = useState<State>(initialState);
  const update = createUpdate(setState);

  useEffect(() => {
    fetchPosts('/api/posts')
      .then(posts => setState(s => ({ ...s, posts })))
      .catch(() => setState(s => ({ ...s, error: 'Could not load posts' })));
  }, []);

  return [render(state), update, setState];
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

export const useRoute = (path: keyof typeof routes.client) => routes.client[path]();

export default routes;
