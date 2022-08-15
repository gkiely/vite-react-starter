import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import * as styles from './App.css';
import { Path, renderers } from 'routes/routes';
import { assertType } from 'utils';
import { renderComponent, renderLayout, RouteConfig } from 'utils/routing';
import service from 'routes/machine';
import { Helmet, HelmetProvider } from 'react-helmet-async';

/* c8 ignore start */
const Route = ({ path }: { path: Path }) => {
  const render = renderers[path];
  const [route, setRoute] = useState<RouteConfig>(render(service.state.context));

  if (import.meta.env.DEV && window.location.search.includes('debug')) {
    // eslint-disable-next-line no-console
    console.log(route, service.state.context, service.state.value);
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    service.send('render', { payload: { path } });
  }, [path]);

  useEffect(() => {
    const sub = service.subscribe((state) => {
      setRoute(render(state.context));
    });
    return () => sub.unsubscribe();
  }, [render]);

  return (
    <>
      <Helmet>
        <title>{route.title}</title>
      </Helmet>
      <div className={styles.app}>
        {'sections' in route
          ? renderLayout(route.sections, route.components)
          : route.components.map((props) => renderComponent(props))}
      </div>
    </>
  );
};
/* c8 ignore stop */

function App() {
  const [location] = useLocation();
  assertType<Path>(location);

  if (!service.initialized) {
    service.start();
  }

  // Render the route
  return (
    <HelmetProvider>
      <Route key={location} path={location} />
    </HelmetProvider>
  );
}

export default App;
