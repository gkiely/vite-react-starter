import { Dispatch, useEffect, useRef } from 'react';
import { Store, storeSchema } from 'server/schemas';
import { assertType, delayMiddleware } from 'utils';
import { client as secondRouteClient, State as SecondRouteState } from './second-route';

import { Hono } from 'hono';
import { bodyParse } from 'hono/body-parse';

import { Actions, initialState, postActions } from './store';
import { Action, createRenderer, createRoute, RouteConfig, SetState } from 'utils/routing';
import { SERVER_HOST } from 'utils/constants';

export type State = Store;

let store: Store = {
  ...initialState,
  posts: [
    { id: '1', title: 'Good Morning' },
    { id: '2', title: 'Good Aternoon' },
    { id: '3', title: 'Good Evening' },
    { id: '4', title: 'Good Night' },
  ],
};

const app = new Hono();
app.post('/api/store', delayMiddleware(0), bodyParse(), (c) => {
  const { req } = c;
  // eslint-disable-next-line
  store = {
    ...store,
    ...JSON.parse(req.parsedBody as string),
  };

  return c.json(store);
});
app.get('/api/store', (c) => c.json(store));

// @ts-expect-error - testing
const render = createRenderer<Store>((state) => {
  return {
    sections: [],
    components: [
      {
        id: 'Header',
        component: 'Header',
        title: 'Hello Vite + React!',
        body: [
          { text: 'Update ' },
          { code: 'App.tsx' },
          { text: ' and save to test HMR updates.' },
        ],
        buttons: [
          {
            id: 'Button-count-add',
            text: `count is: ${state.count}`,
            action: {
              path: '/api/store',
              options: {
                method: 'POST',
                body: { count: state.count + 1 },
              },
            },
          },
          {
            id: 'Button-count-subtract',
            text: `Subtract count`,
            action: {
              path: '/api/store',
              options: {
                method: 'POST',
                body: { count: state.count - 1 },
              },
            },
          },
          {
            id: 'Button-post-add',
            text: 'Add a post',
            action: {
              type: postActions.add,
              payload: {
                id: `${state.posts.length}-added`,
                title: 'New Post',
              },
            },
          },
          ...(state.posts.length > 0
            ? [
                {
                  id: 'Button-post-remove',
                  text: 'Remove a post',
                  action: {
                    type: postActions.remove,
                    payload: {
                      id: state.posts[state.posts.length - 1]?.id,
                    },
                  },
                },
              ]
            : []),
        ],
        links: [
          {
            id: '/second',
            to: '/second',
            text: 'Second route',
          },
        ],
      },
      {
        id: 'List',
        component: 'List',
        items: state.posts,
        error: state.error,
        loading: state.loading,
      },
    ],
  };
});

const client = createRoute(async () => {
  try {
    const response = await app.request(`${SERVER_HOST}/api/store`);
    const data = await response.json();
    const state = storeSchema.parse(data);
    return render(state);
  } catch (e) {
    return render({
      ...initialState,
      error: 'Could not load posts',
    });
  }
});

/// TODO add array routing
export type States = Store | SecondRouteState;
export type Path = '' | '/' | '/second';

type Routes = {
  [k in Path]: Parameters<typeof createRoute>[number];
};

const routes: Routes = {
  '': client,
  '/': client,
  '/second': secondRouteClient,
};

/// TODO: move useRoute to utils/routing
export const useRoute = (path: Path, setRoute: SetState<RouteConfig>) => {
  // const [rendered, setRendered] = useReducer(() => true, false);
  if (!Object.keys(routes).includes(path)) {
    throw new Error(`No routes found for path: ${path}`);
  }
  const send = async (action: Action<Actions>) => {
    try {
      // @ts-expect-error - testing
      // eslint-disable-next-line
      const response = await app.request(action.path, {
        // @ts-expect-error - testing
        // eslint-disable-next-line
        ...action.options,
        // @ts-expect-error - testing
        // eslint-disable-next-line
        body: JSON.stringify(action.options.body),
      });
      if (!response.ok) throw new Error(response.statusText);
      const store = await response.json();
      // @ts-expect-error - testing
      // eslint-disable-next-line
      setRoute(render(store));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('Error:', err);
    }
  };

  const route = useRef(routes[path]());
  useEffect(() => {
    void Promise.resolve(route.current).then(setRoute);
  }, [setRoute]);

  assertType<Dispatch<Action<string, unknown>>>(send);
  return send;
};

export default routes;
/* c8 ignore stop */
