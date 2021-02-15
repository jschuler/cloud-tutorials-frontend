/* eslint-disable camelcase */
/* eslint-disable no-undef */
import React, { useContext } from "react";
// import { Loading } from "../Loading/Loading";
// import { ConfigContext } from "@app/Config/Config";

const Loading = () => <div>Loading</div>;

const FederatedModuleContext = React.createContext({});

export const FederatedModuleProvider = ({ children }) => {
  //   const config = useContext(ConfigContext);

  //   if (config === undefined) {
  //     return <Loading />;
  //   }

  const federatedModules = {
    mkUiFrontend: {
      entryPoint: "remoteEntry.js",
      basePath: "http://localhost:9000/",
    },
    strimziUi: {
      basePath: "http://localhost:8080/",
      entryPoint: "remoteEntry.js",
    },
    guides: {
      basePath: "http://localhost:9001/",
      entryPoint: "remoteEntry.js",
    },
    app2: {
      basePath: "http://localhost:3002/",
      entryPoint: "remoteEntry.js",
    },
    openshiftStreams: {
      basePath: "https://localhost:8002/",
      entryPoint: "beta/apps/application-services/remoteEntry.js",
    },
  };

  return (
    <FederatedModuleContext.Provider value={federatedModules}>
      {children}
    </FederatedModuleContext.Provider>
  );
};

function useFederatedModule(module) {
  const context = React.useContext(FederatedModuleContext);
  return `${context[module].basePath}${context[module].entryPoint}`;
}

function loadComponent(scope, module) {
  return async () => {
    // Initializes the share scope. This fills it with known provided modules from this build and all remotes
    await __webpack_init_sharing__("default");
    const container = window[scope]; // or get the container somewhere else
    // Initialize the container, it may provide shared modules
    await container.init(__webpack_share_scopes__.default);
    const factory = await window[scope].get(module);
    const Module = factory();
    console.log(`${Module} loaded ${module} from ${scope}`);
    return Module;
  };
}

const useDynamicScript = ({ url }) => {
  const [ready, setReady] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    if (!url) {
      return;
    }

    const element = document.createElement("script");

    element.src = url;
    element.type = "text/javascript";
    element.async = true;

    setReady(false);
    setFailed(false);

    element.onload = () => {
      console.log(`Dynamic federated module Loaded: ${url}`);
      setReady(true);
    };

    element.onerror = () => {
      console.error(`Dynamic federated module Error: ${url}`);
      setReady(false);
      setFailed(true);
    };

    document.head.appendChild(element);

    return () => {
      console.log(`Dynamic federated module Removed: ${url}`);
      document.head.removeChild(element);
    };
  }, [url]);

  return {
    ready,
    failed,
  };
};

export const FederatedModule = ({ scope, module, render, fallback }) => {
  const url = useFederatedModule(scope);
  const { ready, failed } = useDynamicScript({ url });

  if (!ready || failed) {
    if (failed && fallback) {
      return fallback;
    }
    return null;
  }

  const Component = React.lazy(loadComponent(scope, module));

  return (
    <React.Suspense fallback={<Loading />}>{render(Component)}</React.Suspense>
  );
};
