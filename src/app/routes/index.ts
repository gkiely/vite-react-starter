import { useEffect, useState } from 'react';
import { Post, postsSchema } from 'server/schemas';
import { DEV_SERVER, SERVER_HOST } from 'utils/constants';

type RouteConfig = {
  components: Record<string, unknown>[];
  sections: string[];
};

const createClientRoute = (
  fn: () => [RouteConfig, React.Dispatch<React.SetStateAction<Required<State>>>]
) => fn;
const createServerRoute = (fn: () => RouteConfig | Promise<RouteConfig>) => fn;

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
  count?: number;
  posts: Post[];
  error?: string;
};

const render = (state: State = { count: 0, posts: [], error: '' }): RouteConfig => {
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
            text: `count is: ${state.count}`,
            action: {
              type: 'add',
              payload: {},
            },
          },
          {
            component: 'Button',
            text: 'Add a post',
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
};

const client = createClientRoute(() => {
  const [state, setState] = useState<Required<State>>({
    count: 0,
    error: '',
    posts: [],
  });

  useEffect(() => {
    fetchPosts('/api/posts')
      .then(posts => setState(s => ({ ...s, posts })))
      .catch(() => setState(s => ({ ...s, error: 'Failed to fetch posts' })));
  }, []);

  return [render(state), setState];
});

const server = createServerRoute(async () => {
  try {
    const posts = await fetchPosts(`${SERVER_HOST}/api/posts`);
    return render({ posts });
  } catch (e) {
    return render({ posts: [], error: 'Could not load posts' });
  }
});

export default {
  '/': client,
  '/server': server,
};
