import { Hono } from 'hono';

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

  const requestPath = path.includes('localhost') ? path : `http://localhost${path.toString()}`;

  return vi.spyOn(global, 'fetch').mockImplementationOnce((path) => app.request(requestPath));
};
