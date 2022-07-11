import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import { posts } from '../../server/worker';
import { mockRequestOnce } from './utils/test-utils';

describe('App', () => {
  it('should render', async () => {
    render(<App />);
    expect(screen.getByText('Hello Vite + React!')).toBeInTheDocument();
  });
  it('should count', () => {
    render(<App />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(screen.getByText('count is: 1')).toBeInTheDocument();
  });
  it('should render posts', async () => {
    mockRequestOnce('/api/posts', posts);
    render(<App />);
    await screen.findByText('Good Morning');
    expect(screen.getByText('Good Morning')).toBeInTheDocument();
  });

  it('should fail gracefully if no posts are returned', () => {
    mockRequestOnce('/api/posts', null);
    render(<App />);
    expect(screen.getByText('Hello Vite + React!')).toBeInTheDocument();
  });
  it('should show an error if the network request fails', async () => {
    mockRequestOnce('/api/posts', null);
    render(<App />);
    await screen.findByText('Could not load posts');
    expect(screen.getByText('Could not load posts')).toBeInTheDocument();
  });
});
