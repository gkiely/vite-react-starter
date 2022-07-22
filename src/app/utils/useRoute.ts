import { useEffect } from 'react';
import { Store, storeSchema } from 'server/schemas';
import { assertType, omit } from 'utils';

import { APIAction } from '../routes/store';
import { RouteConfig, SetState } from 'utils/routing';
import { SERVER_HOST } from 'utils/constants';
import { useLocation } from 'react-router-dom';
import routes, { Path, renderers } from 'routes/routes';
import { app } from 'routes/server';

// Until exact types are supported: https://github.com/microsoft/TypeScript/issues/12936
// We parse objects sent from the route and throw a runtime error
const partialParse = (store: Partial<Store>) => {
  return storeSchema.partial().strict().parse(store) as Partial<Store>;
};

/* c8 ignore start */
const useRoute = (setRoute: SetState<RouteConfig>) => {
  const location = useLocation();
  assertType<Path>(location.pathname);
  const path = location.pathname;
  const render = renderers[location.pathname];

  if (!Object.keys(routes).includes(path)) {
    throw new Error(`No routes found for path: ${path}`);
  }

  const send = async (action: APIAction) => {
    try {
      // Early rendering of the loading state
      if (action.loading) {
        const response = await app.request(`${SERVER_HOST}/api/store`);
        const data = await response.json();
        const store = storeSchema.parse(data);
        const parsedStore = partialParse(action.loading);
        setRoute(
          render({
            ...store,
            ...parsedStore,
          })
        );
      }

      const parsedBody = action.options?.body ? partialParse(action.options?.body) : undefined;
      const body = parsedBody ? JSON.stringify(parsedBody) : undefined;
      const options = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        ...(action.options ? omit(action.options, 'body') : {}),
        ...(body ? { body } : {}),
      };

      const response = await app.request(`${SERVER_HOST}${action.path}`, options);
      if (!response.ok) throw new Error(response.statusText);
      const data = await response.json();
      const store = storeSchema.parse(data);
      setRoute(render(store));
    } catch (err) {
      // eslint-disable-next-line no-console
      // console.error('Error:', err);
      throw new Error(err as string);
    }
  };

  // Re-render after initial loading is complete
  const route = routes[path]();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => void Promise.resolve(route).then(setRoute), [setRoute]);

  return send;
};
/* c8 ignore stop */

export default useRoute;
