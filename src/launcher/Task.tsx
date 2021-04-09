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
  const handleClose = () => history.push(parentPath);
  const handleNext = ({ id, name }: WizardStep) => {
    history.push(`${tasksPath}/${id}`);
  };
  const handleBack = ({ id, name }: WizardStep) => {
    history.push(`${tasksPath}/${id}`);
  };
  const handleGoToStep = ({ id, name }: WizardStep) => {
    history.push(`${tasksPath}/${id}`);
  };

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
