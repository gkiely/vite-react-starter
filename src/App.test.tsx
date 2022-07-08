import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import App from './App';
import { posts } from '../server/worker';

const mockFetchOnce = (path: string, payload: unknown) => {
  return vi.spyOn(global, 'fetch').mockImplementationOnce((req, res) => {
    if (req.toString().startsWith(path)) {
      return Promise.resolve(new Response(JSON.stringify(payload)));
    }
    return Promise.reject(new Response('404 Not Found'));
  });
};

describe('App', () => {
  it('should render', async () => {
    mockFetchOnce('/api/posts', posts);
    render(<App />);
    await waitFor(() => expect(screen.getByText('Good Morning')).toBeInTheDocument());
    expect(screen.getByText('Hello Vite + React!')).toBeInTheDocument();
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(screen.getByText('count is: 1')).toBeInTheDocument();
  });
  it('fail gracefully if no posts are returned', () => {
    mockFetchOnce('/api/posts', {});
    render(<App />);
    expect(screen.getByText('Hello Vite + React!')).toBeInTheDocument();
  });
});
