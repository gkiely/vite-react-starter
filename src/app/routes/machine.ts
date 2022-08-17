import { createMachine, assign, interpret, DoneInvokeEvent, StateNodeConfig } from 'xstate';
import { Post, postsSchema } from 'server/schemas';
import { CLIENT, DEV } from 'utils/constants';
import { delay } from 'utils';
import { Path } from './routes';

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
      type: 'render';
      payload: { path: Path };
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

const postsNode: StateNodeConfig<Context, States, Event> = {
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

export const machine =
  /** @xstate-layout N4IgpgJg5mDOIC5SwC4HsBOYB0AHNqs2ANmgIYQCWAdlAMQRrU40BuaA1jqpjvoSXJVaCNmgDGZFJSYBtAAwBdRKH6VpTFSAAeiAEx6AnNj3yArAEYAzHoAch+fMOmzAGhABPRIYBsAXz93Hiw8AhQiUgoaejAMDEw8YikAM0wAW2xgvjCIoWjRanZJDWoFZSQQNRKtXQQ9K3lsABZbHytbawMzAHYfdy8EC0MLZp8zMz0mye6HM1s9AKD0EP5w7Fj4jDotKplqGsQ2puxDJotTH0MZib1+-QtG33Gmtvt5bscrRZAsunE0ACu1BQ2ABuAgUjAOwI6j2BwQVjOzQePiaVnGFnGejcnkQAFo9KjsFZzvZLt1EVZDIYvoEfsswHRVthxFhIdDYLDNBVanoHidutYfHYzFYSR07ggCUSSXZfFdKdTaUteEywtgIGBiGAUFCKrtuaBat1jj4fPILD4PoSrXpurZJdLjrKyQq0UqAnTqGhNfAKllsJQINqOVz9jz9E1Jed5N8A6tclFaKHqhGEPJJb44wzQgJYADxOI4H7VDDU0bEE1DLZsBbWmYrhYHt1xtGnM1qdWPlbqdjbNneLm1htMCm4WmzO2bmZhfIpiKrH1cXU5ycxqK5vJbGKzf26fGcmPDTp8ZNJZNa44LWL6rZWmizAOsEfwxWpS1HU1uidOxT0QY7WsT0-CAA */
  createMachine<Context, Event>({
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
      posts: postsNode,
    },
  });

const service = interpret(machine);

if (CLIENT) {
  // @ts-expect-error - debugging
  window.service = service;
}

export default service;
/* c8 ignore stop */
