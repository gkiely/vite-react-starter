import { Hono } from 'hono';
import { parseBody, partialStore, requests, Store } from 'server/schemas';
import { delay } from 'utils';
import { TEST } from 'utils/constants';
import { z } from 'zod';

/* c8 ignore start */
export const initialState: Store = {
  count: 0,
  posts: [],
  error: '',
  loading: '',
};

const actionSchema = z.union([
  z.object({
    path: z.literal('/api/count'),
    loading: partialStore.optional(),
    error: partialStore.optional(),
    options: z.object({
      method: z.literal('POST'),
      body: requests['/api/count'].POST,
    }),
  }),
  z.object({
    path: z.literal('/api/post'),
    loading: partialStore.optional(),
    error: partialStore.optional(),
    options: z.object({
      method: z.literal('POST'),
      body: requests['/api/post'].POST,
    }),
  }),
  z.object({
    path: z.literal('/api/post'),
    loading: partialStore.optional(),
    error: partialStore.optional(),
    options: z.object({
      method: z.literal('DELETE'),
      body: requests['/api/post'].DELETE,
    }),
  }),
]);

export type APIAction = z.infer<typeof actionSchema>;

export const store: Store = {
  ...initialState,
  posts: TEST
    ? [
        { id: '1', title: 'Good Morning' },
        { id: '2', title: 'Good Afternoon' },
        { id: '3', title: 'Good Evening' },
        { id: '4', title: 'Good Night' },
      ]
    : [],
};
/* c8 ignore start */
export const app = new Hono();
type APIPath = keyof typeof requests;

app.post<APIPath>('/api/count', async (c) => {
  const { req } = c;
  const body = await parseBody(req, requests['/api/count'].POST);
  store.count += body.count;

  // Testing
  // return c.notFound();
  return c.json(store);
});

app.post<APIPath>('/api/post', async (c) => {
  const { req } = c;
  const body = await parseBody(req, requests['/api/post'].POST);
  const post = {
    id: `post-${store.posts.length + 1}`,
    title: body.title,
  };
  store.posts = [...store.posts, post];
  return c.json(store);
});

app.delete<APIPath>('/api/post', async (c) => {
  const { req } = c;
  const body = await parseBody(req, requests['/api/post'].DELETE);
  store.posts = store.posts.filter((p) => p.id !== body.id);
  return c.json(store);
});

const init = async () => {
  await delay(0); // Without delay, React will incorrectly show sync store updates in strict mode
  store.loading = 'Loading posts...';
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');
  await delay(1000);
  const posts: Store['posts'] = await res.json();
  store.posts = store.posts.concat(
    posts
      .map((post) => {
        return {
          id: String(post.id),
          title: post.title.slice(0, 20),
        };
      })
      .slice(0, 5)
  );

  // Unique posts
  store.posts = [...new Map(store.posts.map((p) => [p.id, p])).values()];
  store.loading = '';
};

// Keep this route fast as it's queried on every render
app.get('/api/store', async (c) => {
  if (TEST) return c.json(store);
  if (store.posts.length === 0) {
    await init();
  }
  return c.json(store);
});
/* c8 ignore stop */
