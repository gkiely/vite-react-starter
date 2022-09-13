import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { useLocation } from 'wouter';
import * as styles from './App.css';
import { paths, Path } from './routes/paths';
import { RouteContext, renderers } from './routes/routes';
import { assertType } from './utils';
import { renderComponent, renderLayout } from './utils/routing';
import service from './machines/router.machine';
import { matches } from './machines/machine-utils';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import type { AnyInterpreter } from 'xstate';
import { EmptyInterpreter } from 'types';

/* c8 ignore start */
const Route = ({ path }: { path: Path }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
    service.send('route', { payload: path });
  }, [path]);

  const emptySnapshot = {
    context: undefined,
    children: [],
  };

  const subscribe = useCallback((fn: () => void) => {
    const sub = service.subscribe(fn);
    return () => sub.unsubscribe();
  }, []);

  // State
  const state = useSyncExternalStore(subscribe, () => service.getSnapshot()) ?? emptySnapshot;
  const routeState = {
    ...state,
    matches: (state: string) => matches(state, service),
  } as typeof state;

  const snapshot = service.getSnapshot();
  const routeService = snapshot ? snapshot.children[path] : undefined;
  if (routeService) {
    assertType<AnyInterpreter | EmptyInterpreter>(routeService);
  }
  const routeSnapshot = routeService?.getSnapshot() ?? emptySnapshot;
  assertType<{ context: RouteContext }>(routeSnapshot);

  // Render
  const render = renderers[path];
  const route = render(state.context, routeState, routeSnapshot.context);

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
