import React from 'react';
import { render, screen } from '@testing-library/react';
import { HomeRoute } from '../HomeRoute';

describe('HomeRoute', () => {
  test('to render "Home"', async () => {
    render(<HomeRoute />);
    screen.getByText(/Home/);
  });
});
