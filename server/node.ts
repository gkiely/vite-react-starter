import http from 'node:http';
import { Post } from './schemas';
export const posts: Post[] = [
  { id: '1', title: 'Good Morning' },
  { id: '2', title: 'Good Aternoon' },
  { id: '3', title: 'Good Evening' },
  { id: '4', title: 'Good Night' },
];

http
  .createServer((req, res) => {
    if (req.url === '/api/posts') {
      res.writeHead(200, {
        'Content-Type': 'application/json',
      });
      if (posts[0]) posts[0].title = 'sup';
      res.write(JSON.stringify(posts));
    } else {
      res.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      res.write('Hello, World!\n');
    }
    res.end();
  })
  .listen(process.env.port ?? 8080); // 4. Tells the server what port to be on

// eslint-disable-next-line no-console
console.log('Server started: http://localhost:8080');
