import React, { useState, useEffect, FunctionComponent } from "react";
import {
  QuickStartContext,
  QuickStartDrawer as QuickStartDrawerLib,
  useLocalStorage,
  useValuesForQuickStartContext,
} from "@cloudmosaic/quickstarts";

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
    const queryParams = new URLSearchParams(window.location.search);
    const searchQuery = queryParams.get('quickstart');
    if (searchQuery) {
      fetch(`${QUICKSTARTS_BASE}/${searchQuery}.json`)
        .then((res) => res.json())
        .then((json) => {
          setAllQuickStarts([json]);
          setAllQuickStartsLoaded(true);
        });
    }
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
