import app from 'server/worker';
import { mockFetchOnce } from 'utils/test-utils';
import routes, { reducer } from './routes';

test('/server', async () => {
  mockFetchOnce(app);
  const data = await routes.server['/']();
  expect(data.components).toEqual(expect.any(Array));
  expect(data.sections).toEqual(expect.any(Array));
});

test('reducer: add', () => {
  const state = {
    count: 0,
    posts: [],
    error: '',
  };
  const action = {
    type: 'count/add',
  } as const;
  const newState = reducer(state, action);
  expect(newState).toMatchObject({
    count: 1,
  });
});
