import { z } from 'zod';

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
export type Store = z.infer<typeof storeSchema>;
