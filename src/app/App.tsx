import { createElement, MutableRefObject, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import * as styles from './App.css';
import { Path, States, useRoute } from 'routes/routes';
import * as Components from './components';
import RouteContext from './RouteContext';
import { assertType } from 'utils';
import { Intersect } from 'utils/types';

type RouteProps = {
  prevState: MutableRefObject<States | undefined>;
  prevPath: MutableRefObject<Path>;
  prevShadow: {
    state: RouteProps['prevState'];
    path: RouteProps['prevPath'];
  };
};
/* c8 ignore start */
const Route = ({ prevState, prevPath, prevShadow }: RouteProps) => {
  const location = useLocation();
  assertType<Path>(location.pathname);
  const [route, send] = useRoute(location.pathname, prevState.current, prevPath.current);

  return (
    <RouteContext send={send}>
      <div className={styles.app}>
        {route.components.map((props) => {
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
  const location = useLocation();
  assertType<Path>(location.pathname);
  const prevState = useRef<States>();
  const prevPath = useRef(location.pathname);

  const prevShadow = {
    state: useRef<States>(),
    path: useRef<Path>(location.pathname),
  };

  // Render the route
  return (
    <Route
      key={location.pathname}
      prevState={prevState}
      prevPath={prevPath}
      prevShadow={prevShadow}
    />
  );
}

export default App;
