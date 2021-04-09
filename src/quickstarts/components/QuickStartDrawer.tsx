import React, { useState, useEffect, FunctionComponent } from "react";
import {
  QuickStart,
  QuickStartContext,
  QuickStartDrawer as QuickStartDrawerLib,
  useValuesForQuickStartContext,
  AllQuickStartStates,
  QuickStartStatus
} from "@cloudmosaic/quickstarts";
import { QuitModal } from './QuitModal';

declare const QUICKSTARTS_BASE: string;
declare const APP_BASE: string;

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
  const params = new URLSearchParams(location.search);
  const tutorialId = params.get('tutorialid') || '';
  let tutorialPath = params.get('tutorialpath');
  if (tutorialPath?.startsWith('/')) {
    tutorialPath = tutorialPath.substring(1);
  }
  debugger;
  const [activeQuickStartID, setActiveQuickStartID] = React.useState(tutorialId);
  const [allQuickStartStates, setAllQuickStartStates] = React.useState<AllQuickStartStates>({
    [tutorialId]: {
      status: QuickStartStatus.NOT_STARTED,
      taskNumber: -1
    }
  });
  const [allQuickStarts, setAllQuickStarts] = useState<QuickStart[]>([
    tutorial,
  ]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const handleModalToggle = () => {
    setIsModalOpen(false);
  }
  const handleModalConfirm = () => {
    window.location.assign(`${APP_BASE}/${tutorialPath}`);
  }
  const checkState = (state: any) => {
    if (!state()) {
      setIsModalOpen(true);
      return;
    }
    setActiveQuickStartID(state());
  }

  const valuesForQuickstartContext = useValuesForQuickStartContext({
    activeQuickStartID,
    setActiveQuickStartID: checkState,
    allQuickStartStates,
    setAllQuickStartStates,
    allQuickStarts
  });
  return (
    <QuickStartContext.Provider value={valuesForQuickstartContext}>
      <QuickStartDrawerLib {...props}>
        {children}
        <QuitModal isOpen={isModalOpen} onClose={handleModalToggle} onConfirm={handleModalConfirm} />
      </QuickStartDrawerLib>
    </QuickStartContext.Provider>
  );
};

export default QuickStartDrawer;
