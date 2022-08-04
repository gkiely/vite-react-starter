import { Hono } from 'hono';
import { parseBody, partialStore, requests, Store } from 'server/schemas';
// import { delay } from 'utils';
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
  posts: [
    { id: '1', title: 'Good Morning' },
    { id: '2', title: 'Good Aternoon' },
    { id: '3', title: 'Good Evening' },
    { id: '4', title: 'Good Night' },
  ],
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

// Keep this route fast as it's queried on every render
app.get('/api/store', (c) => c.json(store));
/* c8 ignore stop */
