import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import * as styles from './App.css';
import { Path, renderers } from 'routes/routes';
import { assertType } from 'utils';
import { renderComponent, renderLayout, RouteConfig } from 'utils/routing';
import service, { matches } from 'routes/machine';
import { Helmet, HelmetProvider } from 'react-helmet-async';

// Clear console on hot-reload
/* c8 ignore start */
const Route = ({ path }: { path: Path }) => {
  const render = renderers[path];
  const [route, setRoute] = useState<RouteConfig>(render(service.state.context, service.state));

  // if (DEV) {
  //   // Debugging
  //   // eslint-disable-next-line no-console
  //   // console.log(route, service.state.context, service.state.value);
  //   // console.log(service.children);
  // }

  useEffect(() => {
    window.scrollTo(0, 0);
    service.send('route', { payload: path });
  }, [path]);

  useEffect(() => {
    const sub = service.subscribe((state) => {
      const routeState = {
        ...state,
        matches: (path: string) => matches(path, service),
      } as typeof state;
      setRoute(render(state.context, routeState));
    });
    return () => {
      sub.unsubscribe();
    };
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
/* c8 ignore stop */
export default App;
