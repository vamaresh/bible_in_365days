import { render, screen } from '@testing-library/react';
import App from './App';

// Mock window.matchMedia to be undefined for testing
delete global.window.matchMedia;

// Mock window.navigator.standalone
global.navigator.standalone = false;

test('renders bible challenge app', () => {
  render(<App />);
  const loadingElement = screen.getByText(/Loading/i);
  expect(loadingElement).toBeInTheDocument();
});
