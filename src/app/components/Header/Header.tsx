import logo from 'img/logo.svg';
import * as styles from './Header.css';
import Button from 'elements/Button/Button';

type Props = {
  count: number;
};

export default ({ count }: Props) => {
  return (
    <header className={styles.header}>
      <img src={logo} className={styles.logo} alt="logo" />
      <p>Hello Vite + React!</p>
      <p>
        <Button
          type="button"
          onClick={() => {
            // eslint-disable-next-line
            // send(button.action);
          }}
        >
          {count}
        </Button>
      </p>
      <p>
        <Button type="button">Add a post</Button>
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
  );
};
