import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('<App />', () => {
  test('renders Generate Data button', () => {
    render(<App />);
    const button = screen.getByText(/Generate Data/i);
    expect(button).toBeInTheDocument();
  });

  test('generates data after clicking the Generate Data button', async () => {
    render(<App />);
    const button = screen.getByText(/Generate Data/i);
    fireEvent.click(button);

    // You can add more specific assertions here if you have specific data structures to test
    const titlesButton = await screen.findByText(/Show Titles/i);
    const creditsButton = await screen.findByText(/Show Credits/i);

    expect(titlesButton).toBeInTheDocument();
    expect(creditsButton).toBeInTheDocument();
  });

  test('switches view between titles and credits', async () => {
    render(<App />);
    const button = screen.getByText(/Generate Data/i);
    fireEvent.click(button);

    const titlesButton = await screen.findByText(/Show Titles/i);
    const creditsButton = await screen.findByText(/Show Credits/i);

    // Default view should be titles
    let dataView = screen.getByText(/"id": 1/i);
    expect(dataView).toBeInTheDocument();

    // Switch to credits view
    fireEvent.click(creditsButton);
    dataView = screen.getByText(/"title_id": 1/i);
    expect(dataView).toBeInTheDocument();

    // Switch back to titles view
    fireEvent.click(titlesButton);
    dataView = screen.getByText(/"id": 1/i);
    expect(dataView).toBeInTheDocument();
  });

  // Testing CSV download might be a bit tricky because it involves file downloads.
  // This is more suited for end-to-end tests. But for the sake of this example, let's just ensure the button is there after generating data.
  test('renders Save as CSV button after generating data', async () => {
    render(<App />);
    const button = screen.getByText(/Generate Data/i);
    fireEvent.click(button);

    const csvButton = await screen.findByText(/Save titles as CSV/i);
    expect(csvButton).toBeInTheDocument();
  });
});
