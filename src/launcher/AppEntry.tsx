import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
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
      <Route exact path="/tutorial/quarkus-kafka">
        <App>
          <Tutorial path="quarkus.quickstart.json" />
        </App>
      </Route>
      <Route exact path="/tutorial/quarkus-kafka/tasks">
        <App>
          <Tasks tutorialPath="/tutorial/quarkus-kafka" path="quarkus.quickstart.json" />
        </App>
      </Route>
    </Router>
)};

export default AppEntry;
