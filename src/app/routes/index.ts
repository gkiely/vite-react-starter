import { useEffect, useState } from 'react';
import { Post, postsSchema } from 'server/schemas';
import { DEV_SERVER, SERVER_HOST } from 'utils/constants';

type RouteConfig = {
  components: Record<string, unknown>[];
  sections: string[];
};

const createRoute = (
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
  count: number;
  posts: Post[];
  error: string;
};

const initialState: Required<State> = {
  count: 0,
  posts: [],
  error: '',
};

const render = (state: State = initialState): RouteConfig => {
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
              payload: {
                count: state.count + 1,
              },
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

const client = createRoute(() => {
  const [state, setState] = useState<Required<State>>(initialState);

  useEffect(() => {
    fetchPosts('/api/posts')
      .then(posts => setState(s => ({ ...s, posts })))
      .catch(() => setState(s => ({ ...s, error: 'Could not load posts' })));
  }, []);

  // const update = (arg: SetStateAction<Partial<State>>) => {
  //   if (typeof arg === 'function') {
  //     return setState(s => ({ ...s, ...arg }));
  //   }
  //   return setState({
  //     ...state,
  //     ...arg,
  //   });
  // };

  return [render(state), setState];
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

export default {
  '/': client,
  '/server': server,
};
