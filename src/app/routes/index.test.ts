import app from 'server/worker';
import { mockFetchOnce } from 'utils/test-utils';
import routes from './routes';

test('/server', async () => {
  mockFetchOnce(app);
  const data = await routes['/']();
  expect(data).toEqual(expect.any(Array));
  expect(data).toEqual(expect.any(Array));
});

test.todo('reducer: add', () => {
  // const state = {
  //   count: 0,
  //   posts: [],
  //   error: '',
  //   loading: '',
  // };
  // const action = {
  //   type: 'count/add',
  // } as const;
  // const newState = reducer(state, action);
  // expect(newState).toMatchObject({
  //   count: 1,
  // });
});
