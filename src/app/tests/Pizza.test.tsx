import { fireEvent, render, screen } from '@testing-library/react';
import service from '../machines/routerMachine';
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
  const button = screen.getByRole('button', { name: /select toppings/i });
  fireEvent.click(button);
};

test('renders a select toppings button', () => {
  render(<App />);
  expect(screen.getByText(/select toppings/i)).toBeInTheDocument();
  expect(screen.queryByText(/confirm/i)).not.toBeInTheDocument();
});

test.todo('able to open a pizza toppings modal', () => {
  render(<App />);
  openModal();
  expect(screen.getByText(/pizza toppings/i)).toBeInTheDocument();
});

test.todo('after selecting a topping, the price updates', () => {
  render(<App />);
  openModal();
  const topping = screen.getByRole('label', { name: /cheese/i });
  fireEvent.click(topping);
  expect(screen.getByText('There will be an upcharge of $0.99')).toBeInTheDocument();
});
test.todo('after selecting all toppings, the price updates', () => {
  render(<App />);
  openModal();
  const select = screen.getByRole('label', { name: /Select all/i });
  fireEvent.click(select);
  expect(screen.getByText('There will be an upcharge of $2.28')).toBeInTheDocument();
});
test.todo('after unselecting all topppings, the price updates', () => {
  render(<App />);
  openModal();
  const select = screen.getByRole('label', { name: /Select all/i });
  fireEvent.click(select);
  fireEvent.click(select);
  expect(screen.getByText('There will be an upcharge of $0.00')).toBeInTheDocument();
});
test.todo('after clicking confirm, the toppings show on the main page', () => {
  render(<App />);
  openModal();
  const topping = screen.getByRole('label', { name: /cheese/i });
  fireEvent.click(topping);
  const button = screen.getByRole('button', { name: /confirm/i });
  fireEvent.click(button);
  expect(screen.getByText('cheese was selected')).toBeInTheDocument();
});
test.todo('after clicking cancel, the modal exits', () => {
  render(<App />);
  openModal();
  const button = screen.getByRole('button', { name: /cancel/i });
  fireEvent.click(button);
  expect(screen.queryByText('cheese was selected')).not.toBeInTheDocument();
});
