import { createMachine, assign, interpret, DoneInvokeEvent, EventObject } from 'xstate';
import { Post, postsSchema } from 'server/schemas';
import { CLIENT } from 'utils/constants';
import { assertType, delay } from 'utils';
import { Path } from './routes';

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
      type: 'route';
      payload: { path: Path };
    };

function assertEventType<TE extends EventObject, TType extends TE['type']>(
  event: TE,
  eventType: TType
): asserts event is TE & { type: TType } {
  if (event.type !== eventType) {
    throw new Error(`Invalid event: expected "${eventType}", got "${event.type}"`);
  }
}

/* c8 ignore start */
const fetchPosts = async (path: Path) => {
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
  await delay(300);
  return posts;
};

export const storeMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QEEAOqAEBbAhgYwAsBLAOzADoiIAbMAYlQHtYAXcvAJzBxbEVCawiLIoxL8QAD0QAWAOwA2cgAYAjHIAcAZh0BODYtW6ANCACeiVTJnl9MhQFYFCubuUKATOoC+302kxcQlIKKloGZjYIMFpeCUFhUXEkKVk5B1sHBy15Lw1lGQ8nUwsEAFotZXIHeVVs5V10rTkrX390bHxiMnJYMBYAV1Q6CDFQkgA3RgBrCgAzfsIABUj4FISRMQlpBC11cg99OsVGjV0FGRLEDwUq5XvFQsaPBt02kADO4J6+weGwDgcRgccioag8ObArDkBYsZareLMRJbFI7C7kZzKLIOF4tVRac5XBC6VQYjwyLQaVR5HQaazvT5Bbr0PCMAYkNhDCA8PjrJGbZKgHYeEUHGQFEkU3Q4ikKIllIpyA51fKqDQaFy6ckKXx+EAkRjRNYoDpMkKUGi8gT8pLbRBaUUOM7KAn4uSVZxy8yWLHkamy926NwOTQM01dc2-IaIoQCu0IeREjxyKpB-QKLQOAqqe72MOBCNkGPIwWpBAeLTynMeaq1TMVzPqxq67xAA */
  createMachine<Context, Event>({
    context: { error: '', loading: '', count: 0, posts: [] },
    predictableActionArguments: true,
    id: 'store',
    initial: 'idle',
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
          route: {
            target: 'route',
          },
        },
      },
      // route: {
      //   states: {
      //     '/:number': {
      //       // Invoke fetch with number of posts
      //       // req.params.number
      //       // invoke: { src: () => fetchPosts(req.params.number) }
      //     },
      //   }
      // },
      route: {
        always: {
          target: 'idle',
          cond: (context) => context.posts.length > 0,
        },
        entry: assign({
          loading: 'Loading posts...',
        }),
        exit: assign({
          loading: '',
        }),
        invoke: {
          src: (context, event) => {
            assertEventType(event, 'route');
            return context.posts.length > 0
              ? Promise.resolve(context.posts)
              : fetchPosts(event.payload.path);
          },
          id: 'fetchPosts',
          onDone: [
            {
              actions: assign<Context, DoneInvokeEvent<Post[]>>({
                posts: (context, event) => [...context.posts, ...event.data],
              }),
              target: 'idle',
            },
          ],
          onError: [
            {
              actions: assign<Context, DoneInvokeEvent<Post[]>>({
                error: 'Error loading posts',
              }),
              target: 'idle',
            },
          ],
        },
      },
    },
  });

const service = interpret(storeMachine);

if (CLIENT) {
  // @ts-expect-error - debugging
  window.service = service;
}

export default service;
/* c8 ignore stop */
