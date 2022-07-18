import { createElement } from 'react';
import { useLocation } from 'react-router-dom';
import * as styles from './App.css';
import { useRoute } from './routes';
import * as Components from './components';
import RouteContext from './RouteContext';
import { assertType } from 'utils';
import { Intersect } from 'utils/types';

function App() {
  const location = useLocation();
  const [route, send] = useRoute(location.pathname);

  // console.log(route);

  return (
    <RouteContext send={send}>
      <div className={styles.app}>
        {route.components.map(props => {
          const Component = Components[props.component];
          // Apply id to key
          if (props.id) {
            assertType<{ key: string }>(props);
            props.key = props.id;
          }

          // Convert union types to intersection types
          // to allow for creating elements dynamically
          assertType<Intersect<typeof props>>(props);
          assertType<Intersect<typeof Component>>(Component);
          return createElement(Component, props);
        })}
      </div>
    </RouteContext>
  );
}

export default App;
