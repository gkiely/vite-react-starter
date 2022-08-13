/* c8 ignore start */
import { Hono } from 'hono';
import service from 'routes/machine';
import { renderers } from 'routes/routes';

const app = new Hono();

app.get('/', async (c) => {
  const json = renderers['/'](service.state.context);
  return c.json(json);
});

export default app;
/* c8 ignore stop */
