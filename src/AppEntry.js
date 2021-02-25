import React from "react";
import PropTypes from "prop-types";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux";
import I18nProvider from "./components/i18nProvider/i18nProvider";
import App from "./App";
import { AppDrawerContext } from "./AppDrawerContext";

window.OPENSHIFT_CONFIG = {
  mockData: {},
};

const AppEntry = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [drawerContent, setDrawerContent] = React.useState(null);
  const [drawerTitle, setDrawerTitle] = React.useState("");
  const [fullScreen, setFullScreen] = React.useState(false);
  const toggleFullScreen = (event, disable) => {
    const isFullScreen = disable !== undefined ? disable : !fullScreen;
    setFullScreen(isFullScreen);
    if (isFullScreen) {
      document.querySelector(".pf-c-page__sidebar").style.display = "none";
      document.querySelector(".pf-c-page__header").style.display = "none";
      document.querySelector(
        ".pf-c-drawer__body .pf-c-page__main"
      ).style.overflow = "hidden";
    } else {
      document.querySelector(".pf-c-page__sidebar").style.display = "block";
      document.querySelector(".pf-c-page__header").style.display = "block";
      document.querySelector(
        ".pf-c-drawer__body .pf-c-page__main"
      ).style.overflow = "auto";
    }
  };
  
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
              setDrawerTitle,
              fullScreen,
              setFullScreen: toggleFullScreen
            }}
          >
            <App />
          </AppDrawerContext.Provider>
        </Router>
      </Provider>
    </I18nProvider>
  );
};

AppEntry.propTypes = {
  logger: PropTypes.func,
};

export default AppEntry;
