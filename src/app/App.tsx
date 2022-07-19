import { createElement, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import * as styles from './App.css';
import { Path, States, useRoute } from 'routes/routes';
import * as Components from './components';
import RouteContext from './RouteContext';
import { assertType } from 'utils';
import { Intersect } from 'utils/types';

function App() {
  const location = useLocation();
  assertType<Path>(location.pathname);
  const prevState = useRef<States>();
  const prevPath = useRef(location.pathname);
  const [route, send, state] = useRoute(location.pathname, prevState.current, prevPath.current);

  // Store the last state and path so new routes have access to it
  prevState.current = state;
  prevPath.current = location.pathname;

  return (
    <RouteContext send={send}>
      <div className={styles.app}>
        {route.components.map(props => {
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
}

export default App;
