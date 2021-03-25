import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import App from './App';

const AppEntry = () => {
  return (
    <Router basename="/mosaic/cloud-tutorials">
      <Route exact path="/">
        <App />
      </Route>
    </Router>
)};

export default AppEntry;
