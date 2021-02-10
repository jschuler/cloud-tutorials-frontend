import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux';
import I18nProvider from './components/i18nProvider/i18nProvider';
import App from './App';
import { AppDrawerContext } from "./AppDrawerContext";

window.OPENSHIFT_CONFIG = {
  mockData: {}
};

const AppEntry = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [drawerContent, setDrawerContent] = React.useState(null);
  const [drawerTitle, setDrawerTitle] = React.useState('');
  return (
    <I18nProvider locale="en">
      <Provider store={store}>
        <Router basename="/mosaic/cloud-tutorials">
          <AppDrawerContext.Provider
            value={{
              drawerOpen,
              setDrawerOpen,
              drawerContent,
              setDrawerContent,
              drawerTitle,
              setDrawerTitle
            }}
          >
            <App />
          </AppDrawerContext.Provider>
        </Router>
      </Provider>
    </I18nProvider>
)};

AppEntry.propTypes = {
  logger: PropTypes.func,
};

export default AppEntry;
