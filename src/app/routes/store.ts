/* c8 ignore start */
import { Store } from 'server/schemas';
import { AtLeastOne } from 'utils/types';

export const initialState: Store = {
  count: 0,
  posts: [],
  error: '',
  loading: '',
};

export type APIAction = {
  path: '/api/store' | `/api/store/${keyof Store}` | `/api/store/${keyof Store}/:id`;
  loading?: AtLeastOne<Store>;
  append?: boolean;
  options?: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: AtLeastOne<Store>;
    params?: {
      id?: string | undefined;
    };
  };
};

/* c8 ignore stop */
