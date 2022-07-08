import { useState } from 'react';
import logo from './logo.svg';
import * as styles from './App.css';
import Button from './components/Button';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <img src={logo} className={styles.logo} alt="logo" />
        <p>Hello Vite + React!</p>
        <p>
          <Button type="button" onClick={() => setCount(count => count + 1)}>
            count is: {count}
          </Button>
        </p>
        <p>
          Update <code>App.tsx</code> and save to test HMR updates.
        </p>
        <p>
          <a
            className={styles.link}
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {' | '}
          <a
            className={styles.link}
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
      </header>
    </div>
  );
}

export default App;
