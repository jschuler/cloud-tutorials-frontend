import React, { useState, useEffect, FunctionComponent } from "react";
import {
  QuickStart,
  QuickStartContext,
  QuickStartDrawer as QuickStartDrawerLib,
  QuickStartPanelContent,
  useValuesForQuickStartContext,
  AllQuickStartStates,
  QuickStartStatus,
} from "@patternfly/quickstarts";
import { QuitModal, ExitTutorialModal } from "./QuitModal";

declare const QUICKSTARTS_BASE: string;
declare const APP_BASE: string;

export interface QuickStartDrawerProps extends React.HTMLProps<HTMLDivElement> {
  // basePath?: string;
  // tutorial: QuickStart;
  // search?: string;
  // onConfirm?: any;
  // tutorialId: string;
  // tutorialPath: string;
  setIsModalOpen: any;
}

const QuickStartDrawer: FunctionComponent<QuickStartDrawerProps> = ({
  children,
  // basePath,
  // tutorial,
  // search,
  // onConfirm,
  // tutorialId,
  // tutorialPath,
  setIsModalOpen,
  ...props
}) => {
  // const params = new URLSearchParams(search || location.search);
  // if (tutorialPath?.startsWith("/")) {
  //   tutorialPath = tutorialPath.substring(1);
  // }
  // const [tutorialPathState, setTutorialPathState] =
  //   React.useState(tutorialPath);
  // const [activeQuickStartID, setActiveQuickStartID] =
  //   React.useState(tutorialId);
  // const [allQuickStartStates, setAllQuickStartStates] =
  //   React.useState<AllQuickStartStates>({
  //     [tutorialId]: {
  //       status: QuickStartStatus.NOT_STARTED,
  //       taskNumber: -1,
  //     },
  //   });
  // const [allQuickStarts, setAllQuickStarts] = useState<QuickStart[]>([
  //   tutorial,
  // ]);
  // const [isModalOpen, setIsModalOpen] = React.useState(false);
  // const handleModalToggle = () => {
  //   setIsModalOpen(false);
  // };
  // const handleModalConfirm = () => {
  //   window.location.assign(`${APP_BASE}/${tutorialPathState}`);
  // };

  // const checkState = (state: any) => {
  //   if (!state()) {
  //     setIsModalOpen(true);
  //     return;
  //   }
  //   setActiveQuickStartID(state());
  // };

  // const onSetAllQuickStartStates = (fnc: any) => {
  //   debugger;
  //   const asd = allQuickStartStates;
  //   return fnc(allQuickStartStates);
  //   setAllQuickStartStates({
  //     [tutorialId]: {
  //       status: QuickStartStatus.NOT_STARTED,
  //       taskNumber: -1,
  //     },
  //   })
  // };
  // debugger;
  // const valuesForQuickstartContext = useValuesForQuickStartContext({
  //   activeQuickStartID,
  //   setActiveQuickStartID: checkState,
  //   allQuickStartStates,
  //   setAllQuickStartStates: onSetAllQuickStartStates,
  //   allQuickStarts,
  // });

  // return (
  //   <QuickStartPanelContent
  //     quickStarts={allQuickStarts}
  //     activeQuickStartID={activeQuickStartID}
  //     handleClose={() => {}}
  //   />
  // );

  const onCloseInProgress = () => {
    console.log('in progress');
    setIsModalOpen(true);
  };

  const onCloseNotInProgress = () => {
    console.log('not in progress');
    setIsModalOpen(true);
  };

  return (
    <QuickStartDrawerLib
      fullWidth
      onCloseInProgress={onCloseInProgress}
      onCloseNotInProgress={onCloseNotInProgress}
      {...props}
    >
      {children}
    </QuickStartDrawerLib>
  );
};

export default QuickStartDrawer;
