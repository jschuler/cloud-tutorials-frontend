import React from "react";
import PropTypes from "prop-types";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux";
import I18nProvider from "./components/i18nProvider/i18nProvider";
import App from "./App";
import { AppDrawerContext } from "./AppDrawerContext";
import { getKeycloakInstance, getKeyCloakToken } from "./keycloakAuth";
import { AuthContext } from "./AuthContext";

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
      // const keycloadConfig = {
      //   realm: "redhat-external",
      //   authServerUrl: "https://sso.redhat.com/auth/",
      //   clientId: "strimzi-ui",
      //   "ssl-required": "all",
      //   resource: "cloud-services",
      //   "public-client": true,
      //   "confidential-port": 0,
      // };
      const keycloak = await getKeycloakInstance({
        url: keycloadConfig.authServerUrl,
        clientId: keycloadConfig.clientId,
        realm: keycloadConfig.realm,
      });
      setKeycloak(keycloak);
      setLoadingKeycloak(false);
      const token = await getKeyCloakToken();
      // console.log(`token: ${token}`);
      setToken(token);
    };
    loadToken();
  }, []);

  // React.useEffect(() => {
  //   getKeyCloakToken().then((token) => {
  //     console.log(token);
  //     setLoadingKeycloak(false);
  //   });
  // }, [keycloak]);

  const [token, setToken] = React.useState('');
  const [keycloak, setKeycloak] = React.useState(undefined);
  const [loadingKeycloak, setLoadingKeycloak] = React.useState(true);

  if (!token || loadingKeycloak || keycloak === undefined) {
    return <div>Loading</div>;
  }

  const getToken = () => {
    return getKeyCloakToken();
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        getToken: () => Promise.resolve(token),
      }}
    >
      <App />
    </AuthContext.Provider>
  );
};

const AppEntry = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [drawerContent, setDrawerContent] = React.useState(null);
  const [drawerTitle, setDrawerTitle] = React.useState("");
  return (
    <I18nProvider locale="en">
      <Provider store={store}>
        <Router basename="/application-services/cloud-tutorials">
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
        </Router>
      </Provider>
    </I18nProvider>
  );
};

AppEntry.propTypes = {
  logger: PropTypes.func,
};

export default AppEntry;
