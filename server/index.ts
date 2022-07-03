import { Hono } from 'hono';
import { prettyJSON } from 'hono/pretty-json';
import { bodyParse } from 'hono/body-parse';
import { z } from 'zod';

const postSchema = z.object({
  id: z.string(),
  title: z.string(),
});
type Post = z.infer<typeof postSchema>;

const app = new Hono();

app.get('/api/posts', prettyJSON(), c => {
  const posts = [
    { id: 1, title: 'Good Morning' },
    { id: 2, title: 'Good Aternoon' },
    { id: 3, title: 'Good Evening' },
    { id: 4, title: 'Good Night' },
  ];
  return c.json(posts);
});

app.get('/api/post/:id', async c => {
  return c.json({});
});

app.post('/api/post/:id', bodyParse(), async c => {
  try {
    const { req } = c;
    const id = req.param('id');
    const body = postSchema.parse(req.parsedBody);
    return c.json(body);
  } catch (err) {
    return c.json(err);
  }
});

export default app;
