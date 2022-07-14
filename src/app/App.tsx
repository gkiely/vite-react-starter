import logo from 'img/logo.svg';
import * as styles from './App.css';
import Button from './components/Button';
import type { Post } from 'server/schemas';
import routes from './routes';

function App() {
  const [route, update] = routes.client['/']();
  // const [count, setCount] = useState(0);
  // @ts-expect-error - temporary until routes are set up
  const posts = route.components[1].props.posts as Post[];
  // @ts-expect-error - temporary until routes are set up
  const error = route.components[1].props.error as string;

  // @ts-expect-error - temporary until routes are set up
  // eslint-disable-next-line
  const button = route.components[0].items[0] as any;

  // @ts-expect-error - temporary until routes are set up
  // eslint-disable-next-line
  const count = route.components[0].items[0].props.text as string;

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <img src={logo} className={styles.logo} alt="logo" />
        <p>Hello Vite + React!</p>
        <p>
          <Button
            type="button"
            // eslint-disable-next-line
            onClick={() => update(button.update)}
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
      {error && <p>{error}</p>}
      {posts.map(post => (
        <div key={post.id}>
          <h1>{post.title}</h1>
        </div>
      ))}
    </div>
  );
}

export default App;
