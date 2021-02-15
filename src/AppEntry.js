import React, { useState } from "react";
import PropTypes from "prop-types";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux";
import I18nProvider from "./components/i18nProvider/i18nProvider";
import App from "./App";
import { KeycloakInstance } from "keycloak-js";
import { AuthContext } from "./pages/tutorial/task/AuthContext";
import {
  getKeycloakInstance,
  getKeyCloakToken,
} from "./pages/tutorial/task/keycloakAuth";
import { InsightsContext } from "./pages/tutorial/task/insights";
import { AppDrawerContext } from "./AppDrawerContext";
import { FederatedModuleProvider } from "./pages/tutorial/task/FederatedModule";

window.OPENSHIFT_CONFIG = {
  mockData: {},
};

const AppWithKeycloak = () => {
  React.useEffect(() => {
    const loadToken = async () => {
      const keycloadConfig = {
        authServerUrl:
          "https://keycloak-edge-redhat-rhoam-user-sso.apps.mas-sso-stage.1gzl.s1.devshift.org/auth",
        clientId: "strimzi-ui",
        realm: "mas-sso-staging",
      };
      const keycloak = await getKeycloakInstance({
        url: keycloadConfig.authServerUrl,
        clientId: keycloadConfig.clientId,
        realm: keycloadConfig.realm,
      });
      setKeycloak(keycloak);
      setLoadingKeycloak(false);
    };
    loadToken();
  }, []);

  const [keycloak, setKeycloak] = useState(undefined);
  const [loadingKeycloak, setLoadingKeycloak] = useState(true);

  if (loadingKeycloak || keycloak === undefined) {
    return <div>Loading</div>;
  }

  const getToken = () => {
    return getKeyCloakToken();
  };

  // "/mosaic/cloud-tutorials"
  // const baseName = window.location.pathname; // getBaseName(window.location.pathname);
  const baseName = "https://prod.foo.redhat.com:1337/beta/application-services/openshift-streams/";
  
  return (
    <InsightsContext.Provider value={window["insights"]}>
      <Router basename={baseName}>
      {/* <App /> */}
      <AuthContext.Provider
        value={{
          getToken,
        }}
      >
        <App />
      </AuthContext.Provider>
      </Router>
    </InsightsContext.Provider>
  );
};

const AppEntry = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [drawerContent, setDrawerContent] = React.useState(null);
  const [drawerTitle, setDrawerTitle] = React.useState("");
  return (
    <I18nProvider locale="en">
      <Provider store={store}>
          <FederatedModuleProvider>
            <AppDrawerContext.Provider
              value={{
                drawerOpen,
                setDrawerOpen,
                drawerContent,
                setDrawerContent,
                drawerTitle,
                setDrawerTitle,
              }}
            >
              <AppWithKeycloak />
            </AppDrawerContext.Provider>
          </FederatedModuleProvider>
      </Provider>
    </I18nProvider>
  );
};

AppEntry.propTypes = {
  logger: PropTypes.func,
};

export default AppEntry;
