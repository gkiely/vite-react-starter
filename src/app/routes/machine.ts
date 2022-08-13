import { createMachine, assign, interpret, DoneInvokeEvent } from 'xstate';
import { Post } from 'server/schemas';
import { CLIENT } from 'utils/constants';
import { assertType, delay } from 'utils';

type Context = {
  error: string;
  loading: string;
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
      type: 'error';
    }
  | {
      type: 'success';
    }
  | {
      type: 'clear';
    };

const fetchPosts = async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');
  const json = await res.json();
  assertType<Post[]>(json);
  await delay(300);
  return json.slice(0, 5);
};

/* c8 ignore start */
export const machine = createMachine<Context, Event>({
  initial: 'setup',
  predictableActionArguments: true,
  context: {
    error: '',
    loading: '',
    count: 0,
    posts: [],
  },
  on: {
    'count.update': {
      actions: assign({
        count: (context, event) => context.count + event.payload.count,
      }),
    },
  },
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
    setup: {
      entry: [
        assign({
          loading: 'Loading posts...',
        }),
      ],
      exit: [
        assign({
          loading: '',
        }),
      ],
      invoke: {
        id: 'fetchPosts',
        src: fetchPosts,
        onDone: {
          target: 'idle',
          actions: assign<Context, DoneInvokeEvent<Post[]>>({
            posts: (context, event) => [...context.posts, ...event.data],
          }),
        },
        onError: {
          target: 'idle',
          actions: assign<Context, DoneInvokeEvent<Post[]>>({
            error: 'Error loading posts',
          }),
        },
      },
    },
    loading: {
      on: {
        error: 'error',
        success: 'idle',
      },
    },
    error: {
      on: {
        clear: 'idle',
      },
    },
  },
});

const service = interpret(machine);
service.start();

if (CLIENT) {
  // @ts-expect-error - debugging
  window.service = service;
}

export default service;
/* c8 ignore stop */
