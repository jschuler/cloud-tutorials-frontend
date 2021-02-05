import React, { Suspense, lazy, useContext } from "react";
import { withRouter } from "react-router-dom";

import {
  Button,
  StackItem,
  Stack,
  Title,
  Spinner,
} from "@patternfly/react-core";
import { Main } from "@redhat-cloud-services/frontend-components/Main";
import {
  PageHeader,
  PageHeaderTitle,
} from "@redhat-cloud-services/frontend-components/PageHeader";
import { AppDrawerContext } from "../../AppDrawerContext";

// const OpenshiftStreams = lazy(() => import("mkUiFrontend/OpenshiftStreams"));
const AppOne = lazy(() => import("app2/AppOne"));
const AppTwo = lazy(() => import("app2/AppTwo"));
const AppThree = lazy(() => import("app2/AppThree"));

const Integr8ly = () => {
  const { setDrawerOpen, setDrawerContent, setDrawerTitle } = useContext(AppDrawerContext);

  const handleClick = (appTitle, content) => {
    const contentWithSuspense = (
      <Suspense fallback={<Spinner />}>{content}</Suspense>
    );
    setDrawerContent(contentWithSuspense);
    setDrawerTitle(appTitle);
    setDrawerOpen(true);
  };

  return (
    <React.Fragment>
      <PageHeader>
        <PageHeaderTitle title="Sample Insights App" />
        <p>Pretend this is Integr8ly</p>
      </PageHeader>
      <Main>
        <Stack hasGutter>
          <StackItem>
            <Title headingLevel="h2" size="3xl">
              {" "}
              MK{" "}
            </Title>
            <Button variant="primary" onClick={() => handleClick("App One", <AppOne />)}>
              {" "}
              Bring up App One{" "}
            </Button>
            <Button variant="primary" onClick={() => handleClick("App Two", <AppTwo />)}>
              {" "}
              Bring up App Two{" "}
            </Button>
            <Button variant="primary" onClick={() => handleClick("App Three", <AppThree />)}>
              {" "}
              Bring up App Three{" "}
            </Button>
          </StackItem>
        </Stack>
      </Main>
    </React.Fragment>
  );
};

export default withRouter(Integr8ly);
