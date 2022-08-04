import { useEffect } from 'react';
import { parsePartialStore, storeSchema, parseRequest } from 'server/schemas';
import { assertType, delay, omit } from 'utils';
import { RouteConfig, SetState } from 'utils/routing';
import { CLIENT, SERVER_HOST, TEST } from 'utils/constants';
import { useLocation } from 'wouter';
import routes, { Path, renderers } from 'routes/routes';
import { app, APIAction } from 'routes/server';

/* c8 ignore start */
const getStore = async () => {
  const response = await app.request(`${SERVER_HOST}/api/store`);
  const data = await response.json();
  const store = storeSchema.parse(data);
  return store;
};

const actions: string[] = [];

type Options = {
  headers: Record<string, string>;
  body?: string;
  method?: string;
};

const useRoute = (setRoute: SetState<RouteConfig>) => {
  const [location] = useLocation();
  assertType<Path>(location);
  const path = location;
  const render = renderers[path];

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
          const parsedStore = parsePartialStore(action.loading);

          setRoute(
            render({
              ...store,
              ...parsedStore,
            })
          );
        }).catch(() => {});
      }

      // delay required for testing
      if (CLIENT && TEST) await delay(0);

      const parsedBody = action.options?.body ? parseRequest(action.options?.body) : undefined;
      const body = parsedBody ? JSON.stringify(parsedBody) : undefined;
      const options: Options = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        ...(action.options ? omit(action.options, 'body') : {}),
        ...(body ? { body } : {}),
      };

      // Client routing
      // Calling the route directly saves 1ms per interaction by avoiding JSON parse/stringify
      if (CLIENT) {
        const route = app.router.match(options.method ?? 'GET', `${action.path}`);
        const result = route?.handlers
          ? await Promise.all(
              route.handlers.map((fn) =>
                fn(
                  {
                    json: (o) => o as unknown as Response,
                    // @ts-expect-error - this should be typed as request
                    req: {
                      parseBody: () => parsedBody as unknown as Promise<unknown>,
                    },
                  },
                  () => {}
                )
              )
            )
          : [];
        controller?.abort();
        const data = result.reduce((acc, cur) => ({ ...acc, ...cur }), {});
        const store = storeSchema.parse(data);
        setRoute(render(store));
      } else {
        // Server routing
        const response = await app.request(`${SERVER_HOST}${action.path}`, options);
        controller?.abort();
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        const store = storeSchema.parse(data);
        setRoute(render(store));
      }
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
