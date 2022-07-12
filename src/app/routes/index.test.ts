import app, { posts } from 'server/worker';
import { mockFetchOnce } from 'utils/test-utils';
import routes from './';

test('/routes', async () => {
  mockFetchOnce(app);
  const data = await routes['/routes']();
  // @ts-expect-error - temporary until I fix the type
  expect(data.components[1].props.posts).toMatchObject(posts);
});
