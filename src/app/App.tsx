import { createElement, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import * as styles from './App.css';
import routes, { Path, States, useRoute } from 'routes/routes';
import * as Components from './components';
import RouteContext from './RouteContext';
import { assertType } from 'utils';
import { Intersect } from 'utils/types';

const Route = () => {
  const location = useLocation();
  assertType<Path>(location.pathname);
  const prevState = useRef<States>();
  const prevPath = useRef(location.pathname);
  const [route, send, state] = useRoute(location.pathname, prevState.current, prevPath.current);
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

function App() {
  const location = useLocation();
  // assertType<Path>(location.pathname);
  const prevState = useRef<States>();
  const prevPath = useRef(location.pathname);

  // Get the route
  // const [route, send, state] = useRoute(location.pathname, prevState.current, prevPath.current);

  // console.log(location.pathname, R1());

  // Store the current state and path to give the next route access to them
  // prevState.current = state;
  // prevPath.current = location.pathname;

  // Render the route
  return (
    <>
      {Object.keys(routes.client)
        .filter((path) => path === location.pathname)
        .map((path) => (
          <Route key={path} />
        ))}
    </>
  );
  // <RouteContext send={send}>
  //   <div className={styles.app}>
  //     {route.components.map((props) => {
  //       const Component = Components[props.component];
  //       if (props.id) {
  //         assertType<{ key: string }>(props);
  //         props.key = props.id;
  //       }

  //       // Convert union to intersection type for dynamic components
  //       assertType<Intersect<typeof props>>(props);
  //       assertType<Intersect<typeof Component>>(Component);
  //       return createElement(Component, props);
  //     })}
  //   </div>
  // </RouteContext>
}

export default App;
