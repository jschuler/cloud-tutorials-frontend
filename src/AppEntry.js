import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux';
import I18nProvider from './components/i18nProvider/i18nProvider';
import App from './App';

window.OPENSHIFT_CONFIG = {
  mockData: {}
};

const AppEntry = () => (
  <I18nProvider locale="en">
    <Provider store={store}>
      <Router basename="/mosaic/cloud-tutorials">
        <App />
      </Router>
    </Provider>
  </I18nProvider>
);

AppEntry.propTypes = {
  logger: PropTypes.func,
};

export default AppEntry;
