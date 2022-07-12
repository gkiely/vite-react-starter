import app, { posts } from 'server/worker';
import { mockFetchOnce } from 'utils/test-utils';
import routes from './';

test('/server', async () => {
  mockFetchOnce(app);
  const data = await routes['/server']();
  // @ts-expect-error - temporary until I fix the type
  expect(data.components[1].props.posts).toMatchObject(posts);
});
