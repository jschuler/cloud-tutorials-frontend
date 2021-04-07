import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import App from './App';
import { Catalog } from './Catalog';
import { Tutorial } from './Tutorial';
import { Tasks } from './Tasks';

const AppEntry = () => {
  return (
    <Router basename="/mosaic/cloud-tutorials">
      <Route exact path="/">
        <App>
          <Catalog />
        </App>
      </Route>
      <Route exact path="/:name">
        <App>
          <Tutorial />
        </App>
      </Route>
      <Route exact path="/:name/:task">
        <App>
          <Tasks />
        </App>
      </Route>
    </Router>
)};

export default AppEntry;
