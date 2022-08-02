import { z } from 'zod';

/* c8 ignore start */
export const postSchema = z.object({
  id: z.string(),
  title: z.string(),
});

export type Post = z.infer<typeof postSchema>;
export const postsSchema = z.array(postSchema);

export const storeSchema = z.object({
  count: z.number(),
  posts: postsSchema,
  error: z.string(),
  loading: z.string(),
});

export const partialStore = storeSchema.partial();

export type Store = z.infer<typeof storeSchema>;

export const requests = {
  '/api/count': {
    POST: z.object({ count: z.number() }),
  },
  '/api/post': {
    POST: z.object({ title: z.string() }),
    DELETE: z.object({ id: z.string() }),
  },
};

// Used for requestParse
export const requestSchema = z.union([
  requests['/api/count'].POST,
  requests['/api/post'].POST,
  requests['/api/post'].DELETE,
]);

export const parseRequest = (request: z.infer<typeof requestSchema>) =>
  requestSchema.parse(request);

// Until exact types are supported: https://github.com/microsoft/TypeScript/issues/12936
// We parse objects sent from the route and throw a runtime error
export const parsePartialStore = (store: z.infer<typeof partialStore>) => {
  return partialStore.parse(store);
};
/* c8 ignore stop */
