// import EventEmitter from 'events';d
import { useEffect, useState } from 'react';
import { Post, postsSchema } from 'server/worker';

type RouteConfig = {
  components: Record<string, unknown>[];
  sections: string[];
};

const createRoute = (config: () => RouteConfig) => {
  return config;
};

const fetchPosts = async (s: string): Promise<Post[]> => {
  // console.log('fetching posts');
  try {
    const response = await fetch(s);
    const data = await response.json();
    return postsSchema.parse(data);
  } catch {
    throw new Error('Failed to fetch posts');
  }
};

const route = createRoute(() => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState('');
  useEffect(() => {
    fetchPosts('/api/posts')
      .then(setPosts)
      .catch(() => setError('Could not load posts'));
  }, []);

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
          error,
          posts,
        },
      },
    ],
  };
});

export default {
  '/': route,
};
