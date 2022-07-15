import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Post, postsSchema } from 'server/schemas';
import { assertType } from 'utils';
import { DEV_SERVER, SERVER_HOST } from 'utils/constants';

type RouteConfig = {
  components: Record<string, unknown>[];
  sections: string[];
};

type SetState<S> = Dispatch<SetStateAction<S>>;
type UpdateAction<S> = S | ((prevState: S) => Partial<S>);
const createClientRoute = <S>(fn: () => [RouteConfig, Dispatch<UpdateAction<S>>, SetState<S>]) =>
  fn;
const createServerRoute = (fn: () => RouteConfig | Promise<RouteConfig>) => fn;
const createRender = <S>(fn: (state: S) => RouteConfig) => fn;
const createUpdate = <S>(setState: SetState<S>) => {
  return (arg: UpdateAction<S>) => {
    if (typeof arg === 'function') {
      assertType<(prevState: S) => Partial<S>>(arg);
      return setState(s => ({
        ...s,
        ...arg(s),
      }));
    }
    return setState(s => ({
      ...s,
      ...arg,
    }));
  };
};

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

const render = createRender<State>(state => {
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
