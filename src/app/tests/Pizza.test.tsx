/* eslint-disable import/first */
vi.stubGlobal('location', { pathname: '/pizza' });

import { fireEvent, render, screen } from '@testing-library/react';
import service from '../machines/routerMachine';
import App from '../App';
// import { delay } from 'utils';

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