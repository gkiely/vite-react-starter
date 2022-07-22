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

export const partialStore = storeSchema.partial().strict();

export type Store = z.infer<typeof storeSchema>;
/* c8 ignore stop */
