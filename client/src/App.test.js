import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const text = screen.getByText(/Here you go with Zoover/i);
  expect(text).toBeInTheDocument();
});
