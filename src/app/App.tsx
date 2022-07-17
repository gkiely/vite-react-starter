import { createElement } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as styles from './App.css';
import { useRoute } from './routes';
// import { assertType } from 'utils';
import * as Components from './components';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [route, send] = useRoute(location.pathname);

  return (
    <div className={styles.app}>
      {route.components.map(({ id, component, props, update, action }) => {
        return createElement(Components[component], {
          ...props,
          key: id,
          update,
          action,
          // @ts-expect-error - needs typing
          send,
        });
      })}
    </div>
  );
}

export default App;
