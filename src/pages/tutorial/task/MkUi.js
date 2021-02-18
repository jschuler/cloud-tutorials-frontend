import React from "react";
import { AuthContext } from "../../../AuthContext";
const AppMk = React.lazy(() => import("mkUiFrontend/OpenshiftStreams"));

export const MkUi = () => {
    const authContext = React.useContext(AuthContext);
    console.log(`MkUi: ${authContext.token}`)
    const mkProps = {
        getUsername: () => { return Promise.resolve({
          user: 'User'
        }) },
        getToken: () => { return Promise.resolve(authContext.token)},
        onConnectToInstance: () => { return true; },
        getConnectToInstancePath: () => { return true; },
        addAlert: () => { return true; },
        basePath: 'https://api.stage.openshift.com'
      };

    return (
        <AppMk {...mkProps} />
    );
}