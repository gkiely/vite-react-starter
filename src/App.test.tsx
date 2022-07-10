import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import App from './App';
import { posts } from '../server/worker';
import { Hono } from 'hono';

describe('App', () => {
  it('should render', async () => {
    const app = new Hono();
    app.get('api/posts', c => c.json(posts));
    vi.spyOn(global, 'fetch').mockImplementationOnce(p => app.request(`http://localhost${p}`));
    render(<App />);
    await screen.findByText('Good Morning');
    expect(screen.getByText('Hello Vite + React!')).toBeInTheDocument();
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(screen.getByText('count is: 1')).toBeInTheDocument();
  });
  it('should fail gracefully if no posts are returned', () => {
    const app = new Hono();
    app.get('api/posts', c => c.json(null));
    vi.spyOn(global, 'fetch').mockImplementationOnce(p => app.request(`http://localhost${p}`));
    render(<App />);
    expect(screen.getByText('Hello Vite + React!')).toBeInTheDocument();
  });
  it.only('should show an error if the network request fails', async () => {
    const app = new Hono();
    app.get('', c => c.json(null));
    vi.spyOn(global, 'fetch').mockImplementationOnce(p => app.request(`http://localhost${p}`));
    render(<App />);
    await screen.findByText('Could not load posts');
    expect(screen.getByText('Could not load posts')).toBeInTheDocument();
  });
});
