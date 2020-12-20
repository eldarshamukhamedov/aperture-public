import React from 'react';
import { BrowserRouter, Switch, Redirect, Route } from 'react-router-dom';

export const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route title="Home" exact path="/" component={() => <div>Home</div>} />
      <Redirect to="/" />
    </Switch>
  </BrowserRouter>
);
