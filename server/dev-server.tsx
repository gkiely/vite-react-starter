import type { Hono } from 'hono';
import routes from '../src/app/routes';

const server = (app: Hono) => {
  app.get('/server', async c => {
    try {
      const json = await routes.server['/']();
      return c.json(json);
    } catch {
      return c.text('Error rendering routes', 400);
    }
  });
};

export default server;
