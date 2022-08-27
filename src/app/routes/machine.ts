import {
  createMachine,
  assign,
  interpret,
  DoneInvokeEvent,
  Actor,
  spawn,
  AnyInterpreter,
  AnyStateMachine,
} from 'xstate';
import { Post, postsSchema } from 'server/schemas';
import { CLIENT, DEV } from 'utils/constants';
import { assertType, delay, pick } from 'utils';

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

///// Helper functions /////
const spawnMachine = <Machine extends AnyStateMachine>(machine: Machine) => {
  return {
    entry: [
      assign<{ actors: Actor[] }>({
        actors: (context) => [...context.actors, spawn(machine, { sync: true })] as Actor[],
      }),
    ],
    exit: (context: { actors: Actor[] }) => {
      context.actors.forEach((actor) => actor.stop?.() as unknown);
    },
  };
};

const sync = <C extends Context, E extends Event>(...keys: (keyof Context)[]) => ({
  '*': {
    actions: (context: { actors: Actor[] }, event: E) => {
      context.actors.forEach((actor) => {
        assertType<AnyInterpreter>(actor);
        const { nextEvents } = actor.state;
        if (nextEvents.includes(event.type) || nextEvents.includes('*')) {
          actor.send(event);
        }
      });
    },
  },
  'xstate.update': {
    actions: assign<C, E>((_, event) => {
      assertType<Extract<E, { type: 'xstate.update' }>>(event);
      return pick(event.state.context, ...keys) as C;
    }),
  },
});

export const matches = (state: string, service: AnyInterpreter): boolean => {
  return Object.values(service.state.children).some((child) => {
    assertType<AnyInterpreter>(child);
    if (!child.state) return false;
    if (child.state.matches(state)) return true;

    const prefix = state.replace(/\.[^.]+$/, '');
    const postfix = state.replace(/^.+\./, '');
    return child.children?.size && child.state.toStrings().includes(prefix)
      ? matches(postfix, child)
      : child.state.matches(state);
  });
};
///// End of helper functions /////

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

const routerMachine = createMachine<Context & { actors: Actor[] }, Event>({
  id: 'router',
  initial: '/',
  predictableActionArguments: true,
  context: {
    actors: [],
    count: 0,
    posts: [],
  },
  on: sync('count', 'posts'),
  states: {
    '/': spawnMachine(homeMachine),
  },
});

const service = interpret(routerMachine);

if (CLIENT) {
  // @ts-expect-error - debugging
  window.service = service;
}

export default service;
/* c8 ignore stop */
