import type { Hono } from 'hono';
import routes from '../src/app/routes';

export default (app: Hono) => {
  app.get('/api/routes', async c => {
    const json = await routes['/']();
    return c.json(json);
  });
};
