import React, { useState, useEffect, FunctionComponent } from "react";
import {
  QuickStart,
  QuickStartContext,
  QuickStartDrawer as QuickStartDrawerLib,
  useValuesForQuickStartContext,
} from "@cloudmosaic/quickstarts";

declare const QUICKSTARTS_BASE: string;

export interface QuickStartDrawerProps extends React.HTMLProps<HTMLDivElement> {
  basePath?: string;
  tutorial: QuickStart;
}

const QuickStartDrawer: FunctionComponent<QuickStartDrawerProps> = ({
  children,
  basePath,
  tutorial,
  ...props
}) => {
  const [activeQuickStartID, setActiveQuickStartID] = React.useState("");
  const [allQuickStartStates, setAllQuickStartStates] = React.useState({});
  const [allQuickStarts, setAllQuickStarts] = useState<QuickStart[]>([
    tutorial,
  ]);

  const valuesForQuickstartContext = useValuesForQuickStartContext({
    activeQuickStartID,
    setActiveQuickStartID,
    allQuickStartStates,
    setAllQuickStartStates,
    allQuickStarts,
  });
  return (
    <QuickStartContext.Provider value={valuesForQuickstartContext}>
      <QuickStartDrawerLib {...props}>{children}</QuickStartDrawerLib>
    </QuickStartContext.Provider>
  );
};

export default QuickStartDrawer;
