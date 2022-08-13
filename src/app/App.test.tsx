import { fireEvent, render, screen } from '@testing-library/react';
import service from 'routes/machine';
import { Post } from 'server/schemas';
import App from './App';

export const posts: Post[] = [
  { id: '1', title: 'Good Morning' },
  { id: '2', title: 'Good Aternoon' },
  { id: '3', title: 'Good Evening' },
  { id: '4', title: 'Good Night' },
];

afterEach(() => {
  if (service.initialized) {
    service.stop();
  }
});

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

  it('should render posts', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: () => Promise.resolve(posts),
    } as Response);
    render(<App />);
    await screen.findByText('Good Morning');
    expect(screen.getByText('Good Morning')).toBeInTheDocument();
  });

  it('should fail gracefully if no posts are returned', () => {
    render(<App />);
    expect(screen.getByText('Home route')).toBeInTheDocument();
  });

  it('should show an error if the network request fails', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'));
    render(<App />);
    await screen.findByText('Error loading posts');
    expect(screen.getByText('Error loading posts')).toBeInTheDocument();
  });
});
