import React, { useState, useEffect, FunctionComponent } from "react";
import {
  QuickStartContext,
  QuickStartDrawer as QuickStartDrawerLib,
  useLocalStorage,
  useValuesForQuickStartContext,
} from "@cloudmosaic/quickstarts";
import "@patternfly/patternfly/patternfly.min.css";
import "@patternfly/react-catalog-view-extension/dist/css/react-catalog-view-extension.css";
import "@cloudmosaic/quickstarts/dist/quickstarts.css";

declare const QUICKSTARTS_BASE: string;

export interface QuickStartDrawerProps
  extends React.HTMLProps<HTMLDivElement> {
  basePath?: string;
}

const QuickStartDrawer: FunctionComponent<QuickStartDrawerProps> = ({
  children,
  basePath,
  ...props
}) => {
  React.useEffect(() => {
    fetch(`${QUICKSTARTS_BASE}/add-healthchecks-quickstart.json`)
      .then((res) => res.json())
      .then((json) => {
        setAllQuickStarts([json]);
        setAllQuickStartsLoaded(true);
      });
  }, []);

  const [activeQuickStartID, setActiveQuickStartID] = React.useState("");
  const [allQuickStartStates, setAllQuickStartStates] = React.useState({});

  const [allQuickStartsLoaded, setAllQuickStartsLoaded] = useState<boolean>(
    false
  );
  const [allQuickStarts, setAllQuickStarts] = useState<any[]>([]);

  const valuesForQuickstartContext = useValuesForQuickStartContext({
    activeQuickStartID,
    setActiveQuickStartID,
    allQuickStartStates,
    setAllQuickStartStates,
    allQuickStarts,
  });
  if (allQuickStartsLoaded) {
    return (
      <QuickStartContext.Provider value={valuesForQuickstartContext}>
        <QuickStartDrawerLib {...props}>{children}</QuickStartDrawerLib>
      </QuickStartContext.Provider>
    );
  } else {
    return <></>;
  }
};

export default QuickStartDrawer;
