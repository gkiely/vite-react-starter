import app, { posts } from 'server/worker';
import { mockFetchOnce } from 'utils/test-utils';
import routes, { reducer } from './';

test('/server', async () => {
  mockFetchOnce(app);
  const data = await routes.server['/']();
  // @ts-expect-error - temporary until I fix the type
  expect(data.components[1].props.posts).toMatchObject(posts);
});

test('reducer: add', () => {
  const state = {
    count: 0,
    posts: [],
  };
  const action = {
    type: 'add',
  } as const;
  const newState = reducer(state, action);
  expect(newState).toMatchObject({
    count: 1,
  });
});
