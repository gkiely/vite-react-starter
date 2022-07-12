import type { Hono } from 'hono';
import routes from '../src/app/routes';

export default (app: Hono) => {
  app.get('/routes', async c => {
    try {
      const json = await routes['/routes']();
      return c.json(json);
    } catch {
      return c.text('Error rendering routes', 400);
    }
  });
};
