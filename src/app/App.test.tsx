import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import { posts } from '../../server/worker';
import { mockRequestOnce } from './utils/test-utils';
import { BrowserRouter } from 'react-router-dom';
import { PropsWithChildren } from 'react';
import { app } from 'routes/server';

const wrapper = ({ children }: PropsWithChildren) => <BrowserRouter>{children}</BrowserRouter>;

describe('App', () => {
  it('should render', () => {
    render(<App />, { wrapper });
    expect(screen.getByText('Hello Vite + React!')).toBeInTheDocument();
  });

  it('should count', async () => {
    render(<App />, { wrapper });
    const button = screen.getByRole('button', { name: 'count is: 0' });
    fireEvent.click(button);
    await screen.findByText('count is: 1');
    expect(screen.getByText('count is: 1')).toBeInTheDocument();
  });

  it('should render posts', async () => {
    mockRequestOnce('/api/posts', posts);
    render(<App />, { wrapper });
    await screen.findByText('Good Morning');
    expect(screen.getByText('Good Morning')).toBeInTheDocument();
  });

  it('should fail gracefully if no posts are returned', () => {
    mockRequestOnce('/api/posts');
    render(<App />, { wrapper });
    expect(screen.getByText('Hello Vite + React!')).toBeInTheDocument();
  });

  it('should show an error if the network request fails', async () => {
    vi.spyOn(app, 'request').mockImplementationOnce((path) => {
      return Promise.reject(new Error('Network error'));
    });

    render(<App />, { wrapper });
    await screen.findByText('Could not load posts');
    expect(screen.getByText('Could not load posts')).toBeInTheDocument();
  });
});
