import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import App from './App';

describe('App', () => {
  it('should render', () => {
    const { asFragment } = render(<App />);
    expect(asFragment()).toMatchSnapshot();

    // expect(screen.getByText('Hello Vite + React!')).toBeInTheDocument();
    // const button = screen.getByRole('button');
    // fireEvent.click(button);
    // expect(screen.getByText('count is: 1')).toBeInTheDocument();
  });
});
