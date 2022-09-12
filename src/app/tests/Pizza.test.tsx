import { fireEvent, render, screen } from '@testing-library/react';
import service from '../machines/router.machine';
import App from '../App';

beforeAll(() => {
  vi.stubGlobal('location', { pathname: '/pizza' });
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

test('able to open a pizza toppings modal', () => {
  render(<App />);
  openModal();
  expect(screen.getByText(/pizza toppings/i)).toBeInTheDocument();
});

test('after selecting a topping, the price updates', () => {
  render(<App />);
  openModal();
  const checkbox = screen.getByLabelText(/cheese/i);
  fireEvent.click(checkbox);
  expect(checkbox).toBeChecked();
  expect(screen.getAllByText('There will be an upcharge of $0.99')[0]).toBeInTheDocument();
});

test('after selecting all toppings, the price updates', () => {
  render(<App />);
  openModal();
  const checkbox = screen.getByLabelText(/Select all/i);
  fireEvent.click(checkbox);
  expect(screen.getAllByText('There will be an upcharge of $3.77')[0]).toBeInTheDocument();
});

test('after unselecting all topppings, the price updates', () => {
  render(<App />);
  openModal();
  const checkbox = screen.getByLabelText(/Select all/i);
  fireEvent.click(checkbox);
  fireEvent.click(checkbox);
  expect(screen.getByText('There will be an upcharge of $0')).toBeInTheDocument();
});

test('after clicking confirm, the price shows on the main page', () => {
  render(<App />);
  openModal();
  const checkbox = screen.getByLabelText(/cheese/i);
  fireEvent.click(checkbox);
  const button = screen.getByRole('button', { name: /confirm/i });
  fireEvent.click(button);
  expect(screen.getByText('There will be an upcharge of $0.99')).toBeInTheDocument();
});

test('after clicking cancel, the modal exits', () => {
  render(<App />);
  openModal();
  const checkbox = screen.getByLabelText(/cheese/i);
  fireEvent.click(checkbox);
  const button = screen.getByRole('button', { name: /cancel/i });
  fireEvent.click(button);
  expect(screen.queryByText('There will be an upcharge of $0.99')).not.toBeInTheDocument();
});

test('open, select all, cancel, open', () => {
  render(<App />);
  openModal();
  const checkbox = screen.getByLabelText(/select all/i);
  fireEvent.click(checkbox);
  const button = screen.getByRole('button', { name: /cancel/i });
  fireEvent.click(button);
  openModal();
  expect(screen.getByText('Cheese')).toBeInTheDocument();
});

test('select all checks all checkboxes', () => {
  render(<App />);
  openModal();
  const checkbox = screen.getByLabelText(/select all/i);
  fireEvent.click(checkbox);
  const cheese = screen.getByLabelText(/cheese/i);
  expect(cheese).toBeChecked();
  expect(checkbox).toBeChecked();
});
