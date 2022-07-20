import { Hono } from 'hono';
// import { render, queries } from '@testing-library/react';
// import type { PropsWithChildren } from 'react';

export const mockFetch = (app: Hono) =>
  vi
    .spyOn(global, 'fetch')
    .mockImplementation((path) => app.request(`http://localhost${path.toString()}`));

export const mockFetchOnce = (app: Hono) =>
  vi
    .spyOn(global, 'fetch')
    .mockImplementationOnce((path) => app.request(`http://localhost${path.toString()}`));

export const mockRequest = (path: string, payload: unknown) => {
  const app = new Hono();
  app.get(path, (c) => c.json(payload));
  return vi
    .spyOn(global, 'fetch')
    .mockImplementationOnce((path) => app.request(`http://localhost${path.toString()}`));
};

export const mockRequestOnce = (path: string, payload?: unknown) => {
  const app = new Hono();
  app.get(path, (c) => c.json(payload));

  return vi
    .spyOn(global, 'fetch')
    .mockImplementationOnce((path) => app.request(`http://localhost${path.toString()}`));
};

// type Params = Parameters<typeof render>;
// type Props = PropsWithChildren;

// const Providers = ({ children }: Props) => {
//   return (

//     { children }
//   );
// };

// export const renderWithProviders = (
//   ui: Params[0],
//   options?: Params[1]
// ): ReturnType<typeof render> => render(ui, { wrapper: Providers, queries, ...options });
