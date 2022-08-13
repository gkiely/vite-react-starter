import { fireEvent, render, screen } from '@testing-library/react';
import { Post } from 'server/schemas';
import App from './App';
import { mockRequestOnce } from './utils/test-utils';
export const posts: Post[] = [
  { id: '1', title: 'Good Morning' },
  { id: '2', title: 'Good Aternoon' },
  { id: '3', title: 'Good Evening' },
  { id: '4', title: 'Good Night' },
];

describe('App', () => {
  it('should render', () => {
    render(<App />);
    expect(screen.getByText('Home route')).toBeInTheDocument();
  });

  it('should count', async () => {
    render(<App />);
    const button = screen.getByRole('button', { name: 'count is: 0' });
    fireEvent.click(button);
    await screen.findByText('count is: 1');
    expect(screen.getByText('count is: 1')).toBeInTheDocument();
  });

  it.todo('should render posts', async () => {
    mockRequestOnce('/api/posts', posts);
    render(<App />);
    await screen.findByText('Good Morning');
    expect(screen.getByText('Good Morning')).toBeInTheDocument();
  });

  it('should fail gracefully if no posts are returned', () => {
    mockRequestOnce('/api/posts');
    render(<App />);
    expect(screen.getByText('Home route')).toBeInTheDocument();
  });

  it.todo('should show an error if the network request fails', async () => {
    // vi.spyOn(app, 'request').mockImplementationOnce((_path) => {
    //   return Promise.reject(new Error('Network error'));
    // });

    render(<App />);
    await screen.findByText('Could not load posts');
    expect(screen.getByText('Could not load posts')).toBeInTheDocument();
  });
});
