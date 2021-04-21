import React from "react";
import {
  PageSection,
  Button,
  Wizard,
  WizardStep,
  TextContent,
  Text,
  TextList,
  TextListItem,
} from "@patternfly/react-core";
import {
  QuickStart,
  QuickStartTaskStatus,
  QuickStartTaskReview,
  QuickStartTask,
  QuickStartContextValues,
  QuickStartContext,
  getQuickStartStatus
} from "@cloudmosaic/quickstarts";
import { useHistory, useParams, useLocation } from "react-router-dom";
import { TaskReview } from "./TaskReview";
// import FormRenderer from "@data-driven-forms/react-form-renderer/form-renderer";
// import componentTypes from "@data-driven-forms/react-form-renderer/component-types";
// import FormTemplate from "@data-driven-forms/pf4-component-mapper/form-template";
// import TextField from "@data-driven-forms/pf4-component-mapper/text-field";
import { FormMapper } from "./FormMapper";
import "./asciidoctor-skins/adoc-github.css";
import "./Tasks.css";
import { TasksContext } from "./Tasks";

declare const QUICKSTARTS_BASE: string;
declare const TUTORIALS_BASE: string;

export const Task = () => {
  const { tutorial, steps } = React.useContext(TasksContext);
  const history = useHistory();
  const location = useLocation();
  const locationChunks = location.pathname.split("/");
  const parentPath = locationChunks
    .slice(0, locationChunks.length - 1)
    .join("/");
  const tasksPath = locationChunks
    .slice(0, locationChunks.length - 1)
    .join("/");
  // @ts-ignore
  const { name: taskName, task: taskNumber } = useParams();
  const {
    activeQuickStartID = '',
    allQuickStartStates = {},
    activeQuickStartState = {},
    setQuickStartTaskStatus,
    setActiveQuickStart,
    setQuickStartTaskNumber,
    nextStep,
    previousStep,
    allQuickStarts
  } = React.useContext<QuickStartContextValues>(QuickStartContext);
  const status = getQuickStartStatus(allQuickStartStates, activeQuickStartID);
  React.useEffect(() => {
    setQuickStartTaskNumber && setQuickStartTaskNumber(taskName, Number.parseInt(taskNumber) - 1);
  }, [taskNumber])
  const handleClose = () => {
    setActiveQuickStart && setActiveQuickStart(taskName);
    history.push('/');
  };
  const handleNext = ({ id, name }: WizardStep) => {
    if (allQuickStarts) {
      const qs = allQuickStarts.find(qs => qs.metadata.name === taskName);
      if (qs) {
        nextStep && nextStep(qs?.spec?.tasks?.length || 0);
      }
    }
    history.push(`${tasksPath}/${id}`);
  };
  const handleBack = ({ id, name }: WizardStep) => {
    if (allQuickStarts) {
      const qs = allQuickStarts.find(qs => qs.metadata.name === taskName);
      if (qs) {
        previousStep && previousStep();
      }
    }
    history.push(`${tasksPath}/${id}`);
  };
  const handleGoToStep = ({ id, name }: WizardStep) => {
    history.push(`${tasksPath}/${id}`);
  };

  const activeStatus = Number.parseInt(taskNumber) === steps.length ? true : activeQuickStartState[`taskStatus${activeQuickStartState.taskNumber}`] === 'Success';
  
  if (!steps[Number.parseInt(taskNumber) - 1].enableNext) {
    steps[Number.parseInt(taskNumber) - 1].enableNext = activeStatus;
  }

  return tutorial && steps.length ? (
    <Wizard
      steps={steps}
      onClose={handleClose}
      onNext={handleNext}
      onBack={handleBack}
      onGoToStep={handleGoToStep}
      className="tut-tasks"
      startAtStep={Number.parseInt(taskNumber)}
    />
  ) : null;
};
