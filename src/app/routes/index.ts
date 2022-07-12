import { useEffect, useState } from 'react';
import { Post, postsSchema } from 'server/schemas';
import { DEV, SERVER_HOST } from 'utils/constants';

type RouteConfig = {
  components: Record<string, unknown>[];
  sections: string[];
};

const createRoute = (fn: () => RouteConfig | Promise<RouteConfig>) => fn;

const fetchPosts = async (s: string): Promise<Post[]> => {
  try {
    const response = await fetch(s);
    const data = await response.json();
    return postsSchema.parse(data);
  } catch {
    throw new Error('Failed to fetch posts');
  }
};

const render = (posts: Post[], error = ''): RouteConfig => {
  return {
    sections: [],
    components: [
      {
        component: 'Header',
        props: {
          title: 'Hello Vite + React',
          body: 'Update App.tsx and save to test HMR updates.',
          links: [
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
      },
      {
        component: 'Posts',
        props: {
          posts,
          error,
          DEV,
        },
      },
    ],
  };
};

const serverRoute = createRoute(async () => {
  try {
    const posts = await fetchPosts(`${SERVER_HOST}/api/posts`);
    return render(posts);
  } catch (e) {
    return render([], 'Could not load posts');
  }
});

const clientRoute = createRoute(() => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState('');
  useEffect(() => {
    fetchPosts('/api/posts')
      .then(setPosts)
      .catch(() => setError('Could not load posts'));
  }, []);

  return render(posts, error);
});

export default {
  '/': clientRoute,
  '/routes': serverRoute,
};
