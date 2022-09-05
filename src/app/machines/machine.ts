import { createMachine, assign, interpret, DoneInvokeEvent, Actor, AnyStateMachine } from 'xstate';
import { Post, postsSchema } from 'server/schemas';
import { CLIENT, DEV } from 'utils/constants';
import { delay } from 'utils';
import { paths, Path } from '../routes/paths';
import { spawnMachine, sync } from './machine-utils';

/* c8 ignore start */
export type Context = {
  count: number;
  posts: Post[];
};

export type Event =
  | {
      type: 'count.update';
      payload: { count: number };
    }
  | {
      type: 'post.create';
      payload: { title: string };
    }
  | {
      type: 'post.delete';
      payload: { id: string };
    }
  | {
      type: 'update';
      payload: Context;
    }
  | {
      type: 'route';
      payload: Path;
    }
  | {
      type: 'xstate.update';
      state: {
        context: Context;
        machine: AnyStateMachine;
        event: {
          type: Exclude<Event['type'], 'xstate.update'>;
          payload?: Context | Partial<Context>;
        };
      };
    };

const fetchPosts = async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');
  const json = await res.json<{ id: number; title: string }[]>();
  const posts = postsSchema.parse(
    json
      .map((post) => ({
        id: `${post.id}`,
        title: post.title,
      }))
      .slice(0, 5)
  );
  if (DEV) {
    await delay(1000);
  }
  return posts;
};

const postsMachine = createMachine<Pick<Context, 'posts'>, Event>({
  id: 'posts',
  predictableActionArguments: true,
  context: {
    posts: [],
  },
  initial: 'initial',
  states: {
    initial: {
      always: [
        {
          target: 'loading',
          cond: (context) => context.posts.length === 0,
        },
        {
          target: 'idle',
        },
      ],
    },
    idle: {
      on: {
        'post.create': {
          actions: [
            assign({
              posts: (context, event) => [
                ...context.posts,
                {
                  id: `${context.posts.length + 1}`,
                  title: event.payload.title,
                },
              ],
            }),
          ],
        },
        'post.delete': {
          actions: assign({
            posts: (context, event) => context.posts.filter(({ id }) => id !== event.payload.id),
          }),
        },
      },
    },
    loading: {
      invoke: {
        src: () => fetchPosts(),
        onDone: [
          {
            target: 'idle',
            actions: [
              assign((context, event: DoneInvokeEvent<Post[]>) => ({
                posts: [...context.posts, ...event.data],
              })),
            ],
          },
        ],
        onError: 'error',
      },
    },
    error: {},
  },
});

const countMachine = createMachine<Pick<Context, 'count'>, Event>({
  id: 'count',
  predictableActionArguments: true,
  context: {
    count: 0,
  },
  on: {
    'count.update': {
      actions: [
        assign({
          count: (context, event) => context.count + event.payload.count,
        }),
      ],
    },
  },
});

const homeMachine = createMachine<Context & { actors: Actor[] }, Event>({
  id: 'home',
  type: 'parallel',
  predictableActionArguments: true,
  context: {
    actors: [],
    count: 0,
    posts: [],
  },
  on: sync('count', 'posts'),
  states: {
    posts: spawnMachine(postsMachine),
    count: spawnMachine(countMachine),
  },
});

const secondMachine = createMachine<Omit<Context, 'posts'> & { actors: Actor[] }, Event>({
  id: 'second',
  type: 'parallel',
  predictableActionArguments: true,
  context: {
    actors: [],
    count: 0,
  },
  on: sync('count'),
  states: {
    count: spawnMachine(countMachine),
  },
});

const routerMachine = createMachine<Context & { actors: Actor[] }, Event>({
  id: 'router',
  initial: paths.includes(window.location.pathname as Path) ? window.location.pathname : '/404',
  predictableActionArguments: true,
  context: {
    actors: [],
    count: 0,
    posts: [],
  },
  on: {
    ...sync('count', 'posts'),
    // Handle route state
    // Listens for a call to route and moves to target provided by payload
    route: paths.map((path) => ({
      target: path,
      cond: (_, event, parent) => {
        if (path === event.payload && path === parent.state.value) return false;
        return event.payload === path;
      },
    })),
  },
  states: {
    '/': spawnMachine(homeMachine),
    '/second': spawnMachine(secondMachine),
    '/third': {},
    '/404': {},
  },
});

const service = interpret(routerMachine);

if (CLIENT) {
  // @ts-expect-error - debugging
  window.service = service;
}

export default service;
/* c8 ignore stop */
