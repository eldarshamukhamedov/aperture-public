import React from 'react';
import { render, screen } from '@testing-library/react';
import { TestRoute } from '../TestRoute';

describe('TestRoute', () => {
  test('to render "Test"', async () => {
    render(<TestRoute />);
    screen.getByText(/Test/);
  });
  test('to render images', async () => {
    render(<TestRoute />);
    screen.getByAltText(/Test small asset/);
    screen.getByAltText(/Test large asset/);
  });
});
