/* c8 ignore start */
import { Hono } from 'hono';
import { prettyJSON } from 'hono/pretty-json';
// import routes from 'routes/routes';
import { Post, postSchema } from './schemas';
// import { renderToStaticMarkup } from 'react-dom/server';
// import * as components from '../src/app/components';
// import { Props as HeaderProps } from '../src/app/components/Header/Header';

const app = new Hono();
export const posts: Post[] = [
  { id: '1', title: 'Good Morning' },
  { id: '2', title: 'Good Aternoon' },
  { id: '3', title: 'Good Evening' },
  { id: '4', title: 'Good Night' },
];

// app.get('/', async (c) => {
//   const json = await routes['/']();
//   const html = renderToStaticMarkup(components.Header(json[0] as HeaderProps));
//   // return c.json(json);
//   console.log(html);
//   return c.html(html);
// });

app.get('/api/posts', prettyJSON(), (c) => c.json(posts));

app.get('/api/post/:id', async (c) => {
  const id = c.req.param('id');
  const post = posts.find((p) => p.id === id);
  if (!post) {
    return c.notFound();
  }
  return c.json<Post>(post);
});

app.delete('/api/post/:id', async (c) => {
  const id = c.req.param('id');
  const post = posts.find((p) => p.id === id);
  if (!post) {
    return c.notFound();
  }
  posts.splice(posts.indexOf(post), 1);
  return c.json(post);
});

app.post('/api/post', async (c) => {
  try {
    const { req } = c;
    const post = postSchema.parse(await req.parseBody());
    posts.push(post);
    return c.json<Post[]>(posts);
  } catch (err) {
    return c.json(err, 400);
  }
});

export default app;
/* c8 ignore stop */
