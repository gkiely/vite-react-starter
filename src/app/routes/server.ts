import { partialStore, Store } from 'server/schemas';
// import { omit } from 'utils';
import { delay, omit } from 'utils';

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
/* c8 ignore start */
export const app = new Hono();
app.post('/api/store', bodyParse(), (c) => {
  const { req } = c;
  const storeUpdate = partialStore.parse(req.parsedBody) as Partial<Store>;
  store = {
    ...store,
    ...storeUpdate,
  };
  return c.json(store);
});

app.post('/api/store/count', bodyParse(), async (c) => {
  const { req } = c;
  const storeUpdate = partialStore.parse(req.parsedBody) as Partial<Store>;

  await delay(0);
  // await delay(150);

  if (storeUpdate.count !== undefined) {
    store.count += storeUpdate.count;
  }
  store = {
    ...store,
    ...omit(storeUpdate, 'count'),
  };
  return c.json(store);
});

// Keep this route fast as it's queried on every render
app.get('/api/store', (c) => c.json(store));
/* c8 ignore stop */
