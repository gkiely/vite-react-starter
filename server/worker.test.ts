import app, { posts, postsSchema } from './worker';

test('GET /api/posts', async () => {
  const res = await app.request('http://localhost/api/posts');
  const data = await res.json();
  expect(res.status).toBe(200);
  expect(postsSchema.parse(data)).toEqual(posts);
  expect(data).toEqual(posts);
});

test('GET /api/post/:id', async () => {
  const res = await app.request('http://localhost/api/post/1');
  const data = await res.json();
  expect(res.status).toBe(200);
  expect(data).toEqual(posts[0]);
});

test('GET:404 /api/post/:id', async () => {
  const res = await app.request('http://localhost/api/post/x');
  expect(res.status).toBe(404);
});

test('POST /api/post/:id', async () => {
  const res = await app.request('http://localhost/api/post/1', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: 'Good Night',
    }),
  });
  const data = await res.json();
  expect(res.status).toBe(200);
  expect(data).toEqual(posts);
});

test('POST:400 /api/post/:id', async () => {
  const res = await app.request('http://localhost/api/post/1', {
    method: 'POST',
  });
  expect(res.status).toBe(400);
});
