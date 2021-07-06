import React, { useState, useEffect, FunctionComponent } from "react";
import {
  QuickStart,
  QuickStartContext,
  QuickStartDrawer as QuickStartDrawerLib,
  QuickStartPanelContent,
  useValuesForQuickStartContext,
  AllQuickStartStates,
  QuickStartStatus,
  useLocalStorage
} from "@patternfly/quickstarts";
import { QuitModal, ExitTutorialModal } from "./QuitModal";
import QuickStartDrawer from "./QuickStartDrawer";

declare const QUICKSTARTS_BASE: string;
declare const APP_BASE: string;

export interface DrawerContextProps extends React.HTMLProps<HTMLDivElement> {
  basePath?: string;
  tutorial: QuickStart;
  search?: string;
  onConfirm?: any;
  tutorialId: string;
  tutorialPath: string;
}

const DrawerContext: FunctionComponent<DrawerContextProps> = ({
  children,
  basePath,
  tutorial,
  search,
  onConfirm,
  tutorialId,
  tutorialPath,
  ...props
}) => {
  const params = new URLSearchParams(search || location.search);
  if (tutorialPath?.startsWith("/")) {
    tutorialPath = tutorialPath.substring(1);
  }
  const [tutorialPathState, setTutorialPathState] =
    React.useState(tutorialPath);
//   const [activeQuickStartID, setActiveQuickStartID] =
//     React.useState(tutorialId);
//   const [allQuickStartStates, setAllQuickStartStates] =
//     React.useState<AllQuickStartStates>({
//       [tutorialId]: {
//         status: QuickStartStatus.NOT_STARTED,
//         taskNumber: -1,
//       },
//     });
  const [allQuickStarts, setAllQuickStarts] = useState<QuickStart[]>([
    tutorial,
  ]);
  const [activeQuickStartID, setActiveQuickStartID] = useLocalStorage(
    "tutorialQuickstartId",
    tutorialId
  );
  const [allQuickStartStates, setAllQuickStartStates] = useLocalStorage(
    "tutorialQuickstarts",
    {
        [tutorialId]: {
            "status":"Not started",
            "taskNumber":-1
        }
    }
  );
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const handleModalToggle = () => {
    setIsModalOpen(false);
  };
  const handleModalConfirm = () => {
    window.location.assign(`${APP_BASE}/${tutorialPathState}`);
  };

  const checkState = (state: any) => {
    if (!state()) {
      setIsModalOpen(true);
      return;
    }
    setActiveQuickStartID(state());
  };

//   const valuesForQuickstartContext = useValuesForQuickStartContext({
//     activeQuickStartID,
//     setActiveQuickStartID: checkState,
//     allQuickStartStates,
//     setAllQuickStartStates,
//     allQuickStarts,
//   });
  const valuesForQuickstartContext = useValuesForQuickStartContext({
    allQuickStarts,
    activeQuickStartID,
    setActiveQuickStartID,
    allQuickStartStates,
    setAllQuickStartStates
  });

  return (
    <QuickStartContext.Provider value={valuesForQuickstartContext}>
      <QuickStartDrawer setIsModalOpen={setIsModalOpen}>
          {children}
      </QuickStartDrawer>
      <QuitModal
            isOpen={isModalOpen}
            onClose={handleModalToggle}
            onConfirm={onConfirm || handleModalConfirm}
        />
    </QuickStartContext.Provider>
  );
};

export default DrawerContext;
