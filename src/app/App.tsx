import { createElement } from 'react';
import { useLocation } from 'react-router-dom';
import * as styles from './App.css';
import { useRoute } from './routes';
import * as Components from './components';
import RouteContext from './SendContext';

function App() {
  const location = useLocation();
  const [route, send, update] = useRoute(location.pathname);

  return (
    <RouteContext send={send} update={update}>
      <div className={styles.app}>
        {route.components.map(({ id, component, props }) => {
          // @ts-expect-error - disable typing until fixed
          return createElement(Components[component], {
            ...props,
            key: id,
          });
        })}
      </div>
    </RouteContext>
  );
}

export default App;
