import { useEffect } from 'react';
import { partialStore, Store, storeSchema } from 'server/schemas';
import { assertType, delay, omit } from 'utils';
import { RouteConfig, SetState } from 'utils/routing';
import { SERVER_HOST } from 'utils/constants';
import { useLocation } from 'react-router-dom';
import routes, { Path, renderers } from 'routes/routes';
import { app, APIAction } from 'routes/server';

/* c8 ignore start */
// Until exact types are supported: https://github.com/microsoft/TypeScript/issues/12936
// We parse objects sent from the route and throw a runtime error
const partialParse = (store: Partial<Store>) => {
  return partialStore.parse(store) as Partial<Store>;
};

const getStore = async () => {
  const response = await app.request(`${SERVER_HOST}/api/store`);
  const data = await response.json();
  const store = storeSchema.parse(data);
  return store;
};

const actions: string[] = [];

const useRoute = (setRoute: SetState<RouteConfig>) => {
  const location = useLocation();
  assertType<Path>(location.pathname);
  const path = location.pathname;
  const render = renderers[location.pathname];

  if (!Object.keys(routes).includes(path)) {
    throw new Error(`No routes found for path: ${path}`);
  }

  const send = async (action: APIAction) => {
    // Action already in progress
    if (actions.includes(JSON.stringify(action))) return;
    actions.push(JSON.stringify(action));

    let controller: AbortController | undefined;
    try {
      // Early rendering of the loading state
      if (action.loading) {
        // Show loading state after 10ms to avoid flicker when the response is fast
        controller = new AbortController();
        const p = delay(10, controller.signal);
        p.then(async () => {
          controller = undefined;
          if (!action.loading) return;
          const store = await getStore();
          const parsedStore = partialParse(action.loading);

          setRoute(
            render({
              ...store,
              ...parsedStore,
            })
          );
        }).catch(() => {});
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
      controller?.abort();
      if (!response.ok) throw new Error(response.statusText);
      const data = await response.json();
      const store = storeSchema.parse(data);
      setRoute(render(store));
    } catch (err) {
      throw new Error(err as string);
    } finally {
      controller?.abort();
      actions.shift();
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
