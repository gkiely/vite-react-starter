import { Context } from 'hono';
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
} as const;

const requestTuple = [
  requests['/api/count'].POST,
  requests['/api/post'].POST,
  requests['/api/post'].DELETE,
] as const;

// Used for requestParse
export const requestSchema = z.union(requestTuple);

export const parseRequest = (request: z.infer<typeof requestSchema>) =>
  requestSchema.parse(request);

export const parseBody = async <T extends typeof requestTuple[number]>(
  req: Context['req'],
  schema: T
) => schema.parse(await req.parseBody()) as z.infer<T>;

// Until exact types are supported: https://github.com/microsoft/TypeScript/issues/12936
// We parse objects sent from the route and throw a runtime error
export const parsePartialStore = (store: z.infer<typeof partialStore>): Partial<Store> => {
  return partialStore.parse(store) as Partial<Store>;
};
/* c8 ignore stop */
