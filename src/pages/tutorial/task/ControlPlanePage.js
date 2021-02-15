import React, {useContext} from 'react';
import {useHistory} from 'react-router';
import {InsightsContext} from "./insights";
import {FederatedModule} from "./FederatedModule";

export const ControlPlanePage = () => {

  const insights = useContext(InsightsContext);

  const history = useHistory();

  const onConnectInstance = async (event) => {
    if (event.id === undefined) {
      throw new Error();
    }
    history.push(`/openshift-streams/kafkas/${event.id}`);
  };

  const getConnectToInstancePath = (event) => {
    if (event.id === undefined) {
      throw new Error();
    }
    return history.createHref({pathname: `/openshift-streams/kafkas/${event.id}`});
  }

  const addAlert = (message, variant) => {
    console.log(`alert: ${variant} - ${message}`);
  };

  const getUsername = () => insights.chrome.auth.getUser().then(user => user.identity.user.username);

  const asd = {
    token: insights.chrome.auth.getToken(),
    getUsername: getUsername()
  };
  console.log(asd);

  const osStreams = (
    <FederatedModule
      scope="mkUiFrontend"
      module="./OpenshiftStreams"
      render={(OpenshiftStreamsFederated) => {
        return (
          <OpenshiftStreamsFederated
            getToken={insights.chrome.auth.getToken}
            getUsername={getUsername}
            onConnectToInstance={onConnectInstance}
            getConnectToInstancePath={getConnectToInstancePath}
            addAlert={addAlert}
            basePath={'/mosaic/cloud-tutorials'}
          />
        );
      }}
    />
  );

  return osStreams;
};
