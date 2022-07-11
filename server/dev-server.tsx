import type { Hono } from 'hono';
import React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import routes from '../src/app/routes';

const App = () => {
  const r = routes['/']();
  return <>{JSON.stringify(r)}</>;
};

export default (app: Hono) => {
  app.get('/api/routes', c => {
    const s = ReactDOMServer.renderToString(<App />);
    const json = JSON.parse(s.replace(/&quot;/g, '"'));
    return c.json(json);
  });
};
