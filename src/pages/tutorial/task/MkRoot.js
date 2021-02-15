import React from "react";
import { FederatedModule } from "./FederatedModule";
import { InsightsContext } from './insights';

export const MkUi = () => {
const insights = useContext(InsightsContext);
  const addAlert = (message, variant) => {
    console.log(`alert: ${variant} - ${message}`);
  };
  const getUsername = () => insights.chrome.auth.getUser().then(user => user.identity.user.username);
  const osStreams = (
    <FederatedModule
      scope="mkUiFrontend"
      module="./OpenshiftStreams"
      render={(OpenshiftStreamsFederated) => {
        return (
          <OpenshiftStreamsFederated
            getToken={() =>
              "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6IC…fFwvHGw0kZ5xKh54tJjiq571GM6SjUhiH9BsLxTp_vTvvX19E"
            }
            getUsername={() => "jschuler_kafka_devexp"}
            // onConnectToInstance={onConnectInstance}
            // getConnectToInstancePath={getConnectToInstancePath}
            addAlert={addAlert}
            // basePath={config?.controlPlane.serviceApiBasePath}
          />
        );
      }}
    />
  );
  return osStreams;
};

export const MkRoot = () => {
  const osStreams = (
    <FederatedModule
      scope="openshiftStreams"
      module="./RootApp"
      render={(RootAppFederated) => {
        return <RootAppFederated />;
      }}
    />
  );

  return osStreams;
};
