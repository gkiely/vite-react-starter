import { Hono } from 'hono';
import devServer from './dev-server';

test('GET /api/routes', async () => {
  const app = new Hono();
  devServer(app);
  const res = await app.request('http://localhost/routes');
  const data = await res.json();
  expect(res.status).toBe(200);
  expect(data).toMatchObject({
    components: expect.any(Array),
    sections: expect.any(Array),
  });
});
