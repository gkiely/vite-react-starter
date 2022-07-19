import { createElement } from 'react';
import { useLocation } from 'react-router-dom';
import * as styles from './App.css';
import { useRoute } from 'routes/routes';
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
