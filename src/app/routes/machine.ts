import {
  createMachine,
  assign,
  interpret,
  DoneInvokeEvent,
  StateNodeConfig,
  EventObject,
  Actor,
  spawn,
  AnyInterpreter,
  sendParent,
} from 'xstate';
import { Post, postsSchema } from 'server/schemas';
import { CLIENT, DEV } from 'utils/constants';
import { assertType, delay } from 'utils';

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
    await delay(300);
  }
  return posts;
};

type States = {
  states: {
    idle: object;
    loading: object;
    error: object;
  };
};

const sendUpdate = <C, E extends EventObject>(fn?: (context: C) => Partial<C>) =>
  sendParent<C, E>((context) => ({
    type: 'update',
    payload: fn ? fn(context) : context,
  }));

const postsMachine = createMachine<Pick<Context, 'posts'>, Event>({
  predictableActionArguments: true,
  context: {
    posts: [],
  },
  initial: 'loading',
  states: {
    loading: {
      on: {
        'post.create': {
          target: 'success',
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
            sendUpdate(),
          ],
        },
        'post.delete': {
          actions: assign({
            posts: (context, event) => context.posts.filter(({ id }) => id !== event.payload.id),
          }),
        },
      },
    },
    success: {},
    error: {},
  },
});

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
      entry: assign({
        actors: () => [spawn(postsMachine)],
      }),
      exit: (context) => {
        context.actors.forEach((actor) => {
          actor.stop?.();
        });
      },
      on: {
        '*': {
          actions: (context, event) => {
            context.actors.forEach((actor) => {
              actor?.send(event);
            });
          },
        },
        update: {
          actions: [
            assign((context, event) => ({
              ...context,
              ...event.payload,
            })),
            sendUpdate(),
          ],
        },
      },
    },
    count: {},
    idle: {},
    loading: {},
  },
});

export const matches = (state: string, service: AnyInterpreter): boolean => {
  return Object.values(service.state.children).some((child) => {
    assertType<AnyInterpreter>(child);
    const prefix = state.replace(/\.[^.]+$/, '');
    const postfix = state.replace(/^.+\./, '');
    return child.children.size && child.state.toStrings().includes(prefix)
      ? matches(postfix, child)
      : child.state.matches(state);
  });
};

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
        actors: () => [spawn(homeMachine)],
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
        update: {
          actions: [
            assign((context, event) => ({
              ...context,
              ...event.payload,
            })),
          ],
        },
      },
    },
  },
});

const serviceNew = interpret(routerMachine);
serviceNew.start();
serviceNew.send({
  type: 'post.create',
  payload: {
    title: 'hi',
  },
});

serviceNew.subscribe((state) => {
  // eslint-disable-next-line no-console
  console.log('posts:', state.context.posts);
});

// eslint-disable-next-line no-console
console.log(matches('posts.success', serviceNew));

const posts: StateNodeConfig<Context, States, Event> = {
  id: 'posts',
  initial: 'loading',
  states: {
    idle: {
      on: {
        'post.create': {
          actions: assign({
            posts: (context, event) => [
              ...context.posts,
              {
                id: `${context.posts.length + 1}`,
                title: event.payload.title,
              },
            ],
          }),
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
            actions: assign<Context, DoneInvokeEvent<Post[]>>({
              posts: (context, event) => [...context.posts, ...event.data],
            }),
            target: 'idle',
          },
        ],
        onError: 'error',
      },
    },
    error: {},
  },
};

export const machine = createMachine<Context, Event>({
  context: { count: 0, posts: [] },
  predictableActionArguments: true,
  id: 'store',
  initial: 'posts',
  type: 'parallel',
  states: {
    idle: {
      on: {
        'count.update': {
          actions: assign({
            count: (context, event) => context.count + event.payload.count,
          }),
        },
      },
    },
    posts,
  },
});

const service = interpret(machine);

if (CLIENT) {
  // @ts-expect-error - debugging
  window.service = service;
}

export default service;
/* c8 ignore stop */
