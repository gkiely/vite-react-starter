/* c8 ignore start */
import { Post, postsSchema } from 'server/schemas';
import { prefixedEnum } from 'utils';
import { CLIENT_HOST } from 'utils/constants';
import create from 'zustand';
import { State } from './routes';

export const initialState: State = {
  count: 0,
  posts: [],
  error: '',
  loading: '',
};

export const postActions = prefixedEnum('post/', ['add', 'remove']);
export type PostActionTypes = typeof postActions[keyof typeof postActions];
export type PostActions =
  | {
      type: typeof postActions.add;
      payload: Post;
    }
  | {
      type: typeof postActions.remove;
    };

export const countActions = prefixedEnum('count/', ['add']);
export type CountActionTypes = typeof countActions[keyof typeof countActions];
export type CountActions = {
  type: typeof countActions.add;
};

export type Actions = CountActionTypes | PostActionTypes;

export const useStore = create<State>((set) => ({
  ...initialState,
  'posts/get': async () => {
    set({ loading: 'Loading posts...' });
    try {
      const data = await fetch(CLIENT_HOST + '/api/posts').then((r) => r.json());
      const posts = postsSchema.parse(data);
      set({ posts, loading: '' });
    } catch (err) {
      set({ error: 'Could not load posts', loading: '' });
    }
  },
  'post/add': async (post: Post) => {
    try {
      const response = await fetch('/api/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
      });
      if (!response.ok) throw new Error(response.statusText);
      set((state) => ({ loading: '', posts: [...state.posts, post] }));
    } catch (err) {
      set({ error: 'Error adding a post' });
    }
  },
  'post/remove': async ({ id }: { id: Post['id'] }) => {
    try {
      const response = await fetch(`/api/post/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error(response.statusText);
      set((state) => ({
        loading: '',
        posts: state.posts.filter((p) => p.id !== id),
      }));
    } catch (err) {
      set({ error: 'Error removing a post' });
    }
  },
  'count/add': ({ amount = 1 }) => set((state) => ({ ...state, count: state.count + amount })),
}));

/* c8 ignore stop */
