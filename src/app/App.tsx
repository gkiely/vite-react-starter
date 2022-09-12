import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import * as styles from './App.css';
import { paths, Path } from './routes/paths';
import { RouteContext, renderers } from './routes/routes';
import { assertType } from './utils';
import { renderComponent, renderLayout, RouteConfig } from './utils/routing';
import service from './machines/router.machine';
import { matches } from './machines/machine-utils';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import type { AnyInterpreter } from 'xstate';

/* c8 ignore start */
const Route = ({ path }: { path: Path }) => {
  const render = renderers[path];

  const routeService = service.getSnapshot().children[path];
  if (routeService) {
    assertType<AnyInterpreter>(routeService);
  }

  const snapshot = service.getSnapshot();
  const routeSnapshot = routeService?.getSnapshot() ?? {};
  assertType<{ context: RouteContext }>(routeSnapshot);
  const [route, setRoute] = useState<RouteConfig>(
    render(snapshot.context, snapshot, routeSnapshot.context)
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    service.send('route', { payload: path });
  }, [path]);

  useEffect(() => {
    const sub = service.subscribe((state) => {
      const routeState = {
        ...state,
        matches: (state: string) => matches(state, service),
      } as typeof state;

      const routeService = state.children[path];
      assertType<AnyInterpreter>(routeService);
      const routeSnapshot = routeService?.getSnapshot() ?? {};
      assertType<RouteContext>(routeSnapshot.context);
      setRoute(render(state.context, routeState, routeSnapshot.context));
    });
    return () => {
      sub.unsubscribe();
    };
  }, [render, path]);

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
      <Route key={location} path={paths.includes(location) ? location : '/404'} />
    </HelmetProvider>
  );
}
/* c8 ignore stop */
export default App;
