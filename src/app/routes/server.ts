import { Hono } from 'hono';
import { bodyParse } from 'hono/body-parse';
import { partialStore, requests, requestSchema, Store } from 'server/schemas';
import { delay } from 'utils';
import { z } from 'zod';

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
    options: z
      .object({
        method: z.literal('POST'),
        body: requests['/api/count'].POST,
      })
      .optional(),
  }),
  z.object({
    path: z.literal('/api/post'),
    loading: partialStore.optional(),
    options: z
      .object({
        method: z.literal('POST'),
        body: requests['/api/post'].POST,
      })
      .optional(),
  }),
  z.object({
    path: z.literal('/api/post'),
    loading: partialStore.optional(),
    options: z
      .object({
        method: z.literal('DELETE'),
        body: requests['/api/post'].DELETE,
      })
      .optional(),
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

app.post<APIPath>('/api/count', bodyParse(), async (c) => {
  const { req } = c;
  const storeUpdate = requestSchema.parse(req.parsedBody) as Partial<Store>;
  await delay(0); // Testing
  if (storeUpdate.count !== undefined) {
    store.count += storeUpdate.count;
  }
  return c.json(store);
});

app.post<APIPath>('/api/post', bodyParse(), (c) => {
  const { req } = c;
  const body = requests['/api/post'].POST.parse(req.parsedBody);
  const post = {
    id: `post-${store.posts.length + 1}`,
    title: body.title,
  };
  store.posts = [...store.posts, post];
  return c.json(store);
});

app.delete<APIPath>('/api/post', bodyParse(), (c) => {
  const { req } = c;
  const post = requests['/api/post'].DELETE.parse(req.parsedBody);
  store.posts = store.posts.filter((p) => p.id !== post.id);
  return c.json(store);
});

// Keep this route fast as it's queried on every render
app.get('/api/store', (c) => c.json(store));
/* c8 ignore stop */
