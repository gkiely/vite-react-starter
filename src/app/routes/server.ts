import { Hono } from 'hono';
import { bodyParse } from 'hono/body-parse';
import { partialStore, Post, Store } from 'server/schemas';
import { AtLeastOne } from 'utils/types';
import { delay } from 'utils';

export const initialState: Store = {
  count: 0,
  posts: [],
  error: '',
  loading: '',
};

// export type APIAction = {
//   path: '/api/store' | `/api/${keyof Store}`;
//   loading?: AtLeastOne<Store>;
//   options?: {
//     method: 'GET' | 'POST' | 'PUT' | 'DELETE';
//     body?: AtLeastOne<Store>;
//     params?: {
//       id?: string | undefined;
//     };
//   };
// };

export type APIAction =
  | {
      path: '/api/count';
      loading?: AtLeastOne<Store>;
      options: {
        method: 'POST';
        body: { count: number };
      };
    }
  | {
      path: '/api/post';
      loading?: AtLeastOne<Store>;
      options: {
        method: 'POST';
        body: { post: Pick<Post, 'title'> };
      };
    }
  | {
      path: '/api/post';
      loading?: AtLeastOne<Store>;
      options: {
        method: 'DELETE';
        body: { id: string };
      };
    };

export const store: Store = {
  ...initialState,
  posts: [
    { id: '1', title: 'Good Morning' },
    { id: '2', title: 'Good Aternoon' },
    { id: '3', title: 'Good Evening' },
    { id: '4', title: 'Good Night' },
  ],
};
/* c8 ignore start */
export const app = new Hono();

app.post('/api/posts', bodyParse(), (c) => {
  const { req } = c;
  const storeUpdate = partialStore.parse(req.parsedBody) as Partial<Store>;
  const postsUpdate = storeUpdate.posts ?? [];
  store.posts = [...store.posts, ...postsUpdate];
  return c.json(store);
});

app.delete('/api/posts', bodyParse(), (c) => {
  const { req } = c;
  const body = partialStore.parse(req.parsedBody) as Partial<Store>;
  const postToDelete = (body.posts ?? [])[0];
  if (!postToDelete) return c.json(store);
  store.posts = store.posts.filter((post) => post.id !== postToDelete.id);
  return c.json(store);
});

app.post('/api/count', bodyParse(), async (c) => {
  const { req } = c;
  const storeUpdate = partialStore.parse(req.parsedBody) as Partial<Store>;
  await delay(0); // Testing

  if (storeUpdate.count !== undefined) {
    store.count += storeUpdate.count;
  }
  return c.json(store);
});

// Keep this route fast as it's queried on every render
app.get('/api/store', (c) => c.json(store));
/* c8 ignore stop */
