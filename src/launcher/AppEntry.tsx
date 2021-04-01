import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import App from './App';
import { Catalog } from './Catalog';
import { Tutorial } from './Tutorial';
import { Tasks } from './Tasks';

const AppEntry = () => {
  return (
    <Router basename="/mosaic/cloud-tutorials">
      <Route exact path={['/', '/tutorials']}>
        <App>
          <Catalog />
        </App>
      </Route>
      <Route exact path="/tutorials/:name">
        <App>
          <Tutorial />
        </App>
      </Route>
      <Route exact path="/tutorials/:name/tasks">
        <App>
          <Tasks />
        </App>
      </Route>
    </Router>
)};

export default AppEntry;
