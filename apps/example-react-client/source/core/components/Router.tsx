import React from 'react';
import { BrowserRouter, Switch, Redirect, Route } from 'react-router-dom';
import { TestRoute } from 'test/components/TestRoute';

export const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route title="Test" exact path="/" component={TestRoute} />
      <Redirect to="/" />
    </Switch>
  </BrowserRouter>
);
