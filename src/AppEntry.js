import React from "react";
import PropTypes from "prop-types";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { init } from "./store";
import App from "./App";
import { getBaseName } from "@redhat-cloud-services/frontend-components-utilities/helpers";
import { AppDrawerContext } from "./AppDrawerContext";

const AppEntry = ({ logger }) => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [drawerContent, setDrawerContent] = React.useState(null);
  const [drawerTitle, setDrawerTitle] = React.useState('');
  return (
    <Provider store={(logger ? init(logger) : init()).getStore()}>
      <Router basename={getBaseName(window.location.pathname)}>
        <AppDrawerContext.Provider
          value={{ drawerOpen, setDrawerOpen, drawerContent, setDrawerContent, drawerTitle, setDrawerTitle }}
        >
          <App />
        </AppDrawerContext.Provider>
      </Router>
    </Provider>
  );
};

AppEntry.propTypes = {
  logger: PropTypes.func,
};

export default AppEntry;
