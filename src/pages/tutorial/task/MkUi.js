import React from "react";
import { AuthContext } from "../../../AuthContext";
const AppMk = React.lazy(() => import("mkUiFrontend/OpenshiftStreams"));

export const MkUi = () => {
    const authContext = React.useContext(AuthContext);
    const mkProps = {
        getUsername: () => { return Promise.resolve({
          user: 'User'
        }) },
        getToken: authContext.getToken,
        onConnectToInstance: () => { return true; },
        getConnectToInstancePath: () => { return true; },
        addAlert: () => { return true; },
        basePath: 'https://api.stage.openshift.com'
      };

    return (
        <AppMk {...mkProps} />
    );
}