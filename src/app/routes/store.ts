/* c8 ignore start */
import { Post } from 'server/schemas';
import { prefixedEnum } from 'utils';
import { State } from './routes';

export const initialState: State = {
  count: 0,
  posts: [],
  error: '',
  loading: '',
};

export const postActions = {
  ...prefixedEnum('post/', ['add', 'remove']),
  getAll: 'posts/get',
};
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

/* c8 ignore stop */
