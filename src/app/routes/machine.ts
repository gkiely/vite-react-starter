import {
  createMachine,
  assign,
  interpret,
  DoneInvokeEvent,
  Actor,
  spawn,
  AnyInterpreter,
} from 'xstate';
import { Post, postsSchema } from 'server/schemas';
import { CLIENT, DEV } from 'utils/constants';
import { assertType, delay, pick } from 'utils';

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
      type: 'xstate.update';
      state: {
        context: Context;
      };
    };

/* c8 ignore start */
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

export const matches = (state: string, service: AnyInterpreter): boolean => {
  return Object.values(service.state.children).some((child) => {
    assertType<AnyInterpreter>(child);
    const prefix = state.replace(/\.[^.]+$/, '');
    const postfix = state.replace(/^.+\./, '');
    if (!child.state) return false;
    if (child.state.matches(state)) return true;
    return child.children?.size && child.state.toStrings().includes(prefix)
      ? matches(postfix, child)
      : child.state.matches(state);
  });
};

const postsMachine = createMachine<Pick<Context, 'posts'>, Event>({
  predictableActionArguments: true,
  context: {
    posts: [],
  },
  initial: 'loading',
  states: {
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

// const countMachine = createMachine({
//   context: {
//     count: 0,
//   },
// });

const homeMachine = createMachine<Context & { actors: Actor<Context, Event>[] }, Event>({
  id: 'home',
  type: 'parallel',
  predictableActionArguments: true,
  context: {
    actors: [],
    count: 0,
    posts: [],
  },
  states: {
    /// TODO
    // posts: spawnMachine(postsMachine),
    posts: {
      entry: [
        assign({
          actors: () => [spawn(postsMachine, { sync: true })],
        }),
      ],
      exit: (context) => {
        context.actors.forEach((actor) => {
          actor.stop?.();
        });
      },
      on: {
        '*': {
          actions: [
            (context, event) => {
              context.actors.forEach((actor) => {
                actor?.send(event);
              });
            },
          ],
        },
        'xstate.update': {
          actions: [assign((_, event) => pick(event.state.context, 'posts'))],
        },
      },
    },
    count: {
      on: {
        'count.update': {
          actions: [
            assign({
              count: (context, event) => context.count + event.payload.count,
            }),
          ],
        },
      },
    },
  },
});

const routerMachine = createMachine<Context & { actors: Actor<Context, Event>[] }, Event>({
  initial: '/',
  predictableActionArguments: true,
  context: {
    actors: [],
    count: 0,
    posts: [],
  },
  states: {
    /// TODO
    // '/': spawnMachine(homeMachine),
    '/': {
      entry: assign({
        actors: () => [spawn(homeMachine, { sync: true })],
      }),
      exit: (context) => {
        context.actors.forEach((actor) => actor.stop?.() as unknown);
      },
      on: {
        '*': {
          actions: (context, event) => {
            context.actors.forEach((actor) => {
              actor?.send(event);
            });
          },
        },
        'xstate.update': {
          actions: [assign((_, event) => pick(event.state.context, 'posts', 'count'))],
        },
      },
    },
  },
});

const service = interpret(routerMachine);

if (CLIENT) {
  // @ts-expect-error - debugging
  window.service = service;
}

export default service;
/* c8 ignore stop */
