import React from 'react';
import { createGlobalStyle } from 'styled-components';
import { Router } from './Router';

const GlobalStyle = createGlobalStyle`
  html, body, #root {
    background: #131516;
    color: #d8d4cf;
    font-family: system-ui, sans-serif;
  }
`;
export const Entry = () => (
  <>
    <GlobalStyle />
    <Router />
  </>
);
