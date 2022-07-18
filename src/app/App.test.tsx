import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import { posts } from '../../server/worker';
import { mockRequestOnce } from './utils/test-utils';
import { BrowserRouter /* MemoryRouter */ } from 'react-router-dom';
import { SWRConfig } from 'swr';
import { PropsWithChildren } from 'react';

const wrapper = ({ children }: PropsWithChildren) => (
  <SWRConfig value={{ provider: () => new Map() }}>
    <BrowserRouter>{children}</BrowserRouter>
  </SWRConfig>
);
describe('App', () => {
  it('should render', () => {
    render(<App />, { wrapper });
    expect(screen.getByText('Hello Vite + React!')).toBeInTheDocument();
  });

  it('should count', () => {
    render(<App />, { wrapper });
    const button = screen.getByRole('button', { name: 'count is: 0' });
    fireEvent.click(button);
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
    mockRequestOnce('/api/posts');
    render(<App />, { wrapper });
    await screen.findByText('Could not load posts');
    expect(screen.getByText('Could not load posts')).toBeInTheDocument();
  });
});
