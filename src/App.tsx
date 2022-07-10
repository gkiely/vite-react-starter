import { useEffect, useState } from 'react';
import logo from './logo.svg';
import * as styles from './App.css';
import Button from './components/Button';
import { Post, postsSchema } from '../server/worker';

const fetchPosts = async (s: string): Promise<Post[]> => {
  try {
    const response = await fetch(s);
    const data = await response.json();
    return postsSchema.parse(data);
  } catch {
    return [];
  }
};

function App() {
  const [count, setCount] = useState(0);
  const [posts, setPosts] = useState<Post[]>([]);
  useEffect(() => {
    fetchPosts('/api/posts').then(setPosts);
  }, []);

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
      {posts.map(post => (
        <div key={post.id}>
          <h1>{post.title}</h1>
        </div>
      ))}
    </div>
  );
}

export default App;
