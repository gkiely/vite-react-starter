import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import App from './App';
import { posts } from '../server/worker';

const mockFetchOnce = (path: string, payload: unknown) => {
  return vi.spyOn(global, 'fetch').mockImplementationOnce((req, _res) => {
    if (!path || !req.toString().startsWith(path)) {
      return Promise.reject(new Response('404 Not Found'));
    }
    return Promise.resolve(new Response(JSON.stringify(payload)));
  });
};

describe('App', () => {
  it('should render', async () => {
    mockFetchOnce('/api/posts', posts);
    render(<App />);
    await screen.findByText('Good Morning');
    expect(screen.getByText('Hello Vite + React!')).toBeInTheDocument();
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(screen.getByText('count is: 1')).toBeInTheDocument();
  });
  it('should fail gracefully if no posts are returned', () => {
    mockFetchOnce('/api/posts', null);
    render(<App />);
    expect(screen.getByText('Hello Vite + React!')).toBeInTheDocument();
  });
  it('should show an error if the network request fails', async () => {
    mockFetchOnce('', null);
    render(<App />);
    await screen.findByText('Could not load posts');
    expect(screen.getByText('Could not load posts')).toBeInTheDocument();
  });
});
