import { Store, storeSchema } from 'server/schemas';
// import { delayMiddleware } from 'utils';

import { Hono } from 'hono';
import { bodyParse } from 'hono/body-parse';
import { initialState } from './store';

export let store: Store = {
  ...initialState,
  posts: [
    { id: '1', title: 'Good Morning' },
    { id: '2', title: 'Good Aternoon' },
    { id: '3', title: 'Good Evening' },
    { id: '4', title: 'Good Night' },
  ],
};

export const app = new Hono();
app.post('/api/store', bodyParse(), (c) => {
  const { req } = c;
  const storeUpdate = storeSchema.partial().parse(req.parsedBody) as Partial<Store>;
  store = {
    ...store,
    ...storeUpdate,
  };
  return c.json(store);
});

// Keep this route fast as it's queried on every render
app.get('/api/store', (c) => c.json(store));
