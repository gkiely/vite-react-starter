import { createElement, useState } from 'react';
import { useLocation } from 'wouter';
import * as styles from './App.css';
import useRoute from 'utils/useRoute';
import { Path, renderers } from 'routes/routes';
import { store } from 'routes/server';
import * as Components from './components';
import RouteContext from './RouteContext';
import { assertType } from 'utils';
import { Intersect } from 'utils/types';
import { RouteConfig } from 'utils/routing';

/* c8 ignore start */
const Route = ({ path }: { path: Path }) => {
  const render = renderers[path];
  const [route, setRoute] = useState<RouteConfig>(render(store));
  const send = useRoute(setRoute);

  return (
    <RouteContext send={send}>
      <div className={styles.app}>
        {route.map((props) => {
          const Component = Components[props.component];
          if (props.id) {
            assertType<{ key: string }>(props);
            props.key = props.id;
          }

          // Convert union to intersection type for dynamic components
          assertType<Intersect<typeof props>>(props);
          assertType<Intersect<typeof Component>>(Component);
          return createElement(Component, props);
        })}
      </div>
    </RouteContext>
  );
};
/* c8 ignore stop */

function App() {
  const [location] = useLocation();
  assertType<Path>(location);

  // Render the route
  return <Route key={location} path={location} />;
}

export default App;
