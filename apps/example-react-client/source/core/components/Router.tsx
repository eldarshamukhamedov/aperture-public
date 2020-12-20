import React from 'react';
import { BrowserRouter, Switch, Redirect, Route } from 'react-router-dom';
import { HomeRoute } from 'home/components/HomeRoute';

export const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route title="Home" exact path="/" component={HomeRoute} />
      <Redirect to="/" />
    </Switch>
  </BrowserRouter>
);
