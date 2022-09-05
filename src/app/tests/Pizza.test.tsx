import { fireEvent, render, screen } from '@testing-library/react';
import service from '../machines/machine';
import App from '../App';

beforeAll(() => {
  vi.stubGlobal('location', { pathname: '/pizza' });
});

afterAll(() => {
  vi.stubGlobal('location', { pathname: '/' });
});

afterEach(() => {
  if (service.initialized) {
    service.stop();
  }
});

const openModal = () => {
  const button = screen.getByRole('button', { name: 'SELECT TOPPINGS' });
  fireEvent.click(button);
};

test('renders pizza', () => {
  render(<App />);
  expect(screen.getByText(/pizza/i)).toBeInTheDocument();
});

test('able to open a modal', () => {
  render(<App />);
  openModal();
  expect(screen.getByText('Pizza Toppings')).toBeInTheDocument();
});
test('after selecting a topping, the price updates', () => {
  render(<App />);
  openModal();
  const topping = screen.getByRole('label', { name: /cheese/i });
  fireEvent.click(topping);
  expect(screen.getByText('There will be an upcharge of $0.99')).toBeInTheDocument();
});
test('after selecting all toppings, the price updates', () => {
  render(<App />);
  openModal();
  const select = screen.getByRole('label', { name: /Select all/i });
  fireEvent.click(select);
  expect(screen.getByText('There will be an upcharge of $2.28')).toBeInTheDocument();
});
test('after unselecting all topppings, the price updates', () => {
  render(<App />);
  openModal();
  const select = screen.getByRole('label', { name: /Select all/i });
  fireEvent.click(select);
  fireEvent.click(select);
  expect(screen.getByText('There will be an upcharge of $0.00')).toBeInTheDocument();
});
test('after clicking confirm, the toppings show on the main page', () => {
  render(<App />);
  openModal();
  const topping = screen.getByRole('label', { name: /cheese/i });
  fireEvent.click(topping);
  const button = screen.getByRole('button', { name: /confirm/i });
  fireEvent.click(button);
  expect(screen.getByText('cheese was selected')).toBeInTheDocument();
});
test('after clicking cancel, the modal exits', () => {
  render(<App />);
  openModal();
  const button = screen.getByRole('button', { name: /cancel/i });
  fireEvent.click(button);
  expect(screen.queryByText('cheese was selected')).not.toBeInTheDocument();
});
