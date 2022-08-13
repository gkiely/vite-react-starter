import { createMachine, assign, interpret } from 'xstate';
import { Post } from 'server/schemas';
import { CLIENT } from 'utils/constants';

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

export const machine = createMachine<Context, Event>({
  initial: 'idle',
  predictableActionArguments: true,
  context: {
    error: '',
    loading: '',
    count: 0,
    posts: [],
  },
  states: {
    idle: {
      on: {
        'count.update': {
          target: 'idle',
          actions: assign({
            count: (context, event) => context.count + event.payload.count,
          }),
        },
        'post.create': {
          target: 'idle',
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
          target: 'idle',
          actions: assign({
            posts: (context, event) => context.posts.filter(({ id }) => id !== event.payload.id),
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
