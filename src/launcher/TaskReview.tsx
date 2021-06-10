import * as React from "react";
import cx from "classnames";
import { Alert, Radio } from "@patternfly/react-core";
import {
  QuickStart,
  QuickStartTaskStatus,
  QuickStartTaskReview,
  QuickStartTask,
  QuickStartContextValues,
  QuickStartContext,
} from "@patternfly/quickstarts";

type TaskReviewProps = {
  review: QuickStartTaskReview;
  taskStatus: QuickStartTaskStatus;
  onTaskReview: (status: QuickStartTaskStatus) => void;
};

const getAlertVariant = (status: any) => {
  switch (status) {
    case QuickStartTaskStatus.SUCCESS:
      return "success";
    case QuickStartTaskStatus.FAILED:
      return "danger";
    default:
      return "info";
  }
};

export const TaskReview: React.FC<TaskReviewProps> = ({
  review,
  taskStatus,
  onTaskReview,
}) => {
  const { setQuickStartTaskStatus } = React.useContext<QuickStartContextValues>(
    QuickStartContext
  );

  const { instructions, failedTaskHelp: taskHelp } = review;

  const [
    taskStatusState,
    setTaskStatusState,
  ] = React.useState<QuickStartTaskStatus>(QuickStartTaskStatus.INIT);

  const alertClassNames = cx("co-quick-start-task-review", {
    "co-quick-start-task-review--success":
      taskStatus === QuickStartTaskStatus.SUCCESS,
    "co-quick-start-task-review--failed":
      taskStatus === QuickStartTaskStatus.FAILED,
  });

  const title = <span className={alertClassNames}>Check your work</span>;

  const onTaskReviewChange = (status: QuickStartTaskStatus) => {
    setTaskStatusState(status);
    setQuickStartTaskStatus && setQuickStartTaskStatus(status);
    onTaskReview(status);
  };

  return (
    <Alert variant={getAlertVariant(taskStatusState)} title={title} isInline>
      <div dangerouslySetInnerHTML={{ __html: instructions || "" }} />
      <span className="co-quick-start-task-review__actions">
        <Radio
          id="review-success"
          name="review-success"
          label="Yes"
          className="co-quick-start-task-review__radio"
          isChecked={taskStatusState === QuickStartTaskStatus.SUCCESS}
          onChange={() => onTaskReviewChange(QuickStartTaskStatus.SUCCESS)}
        />
        <Radio
          id="review-failed"
          name="review-failed"
          label="No"
          className="co-quick-start-task-review__radio"
          isChecked={taskStatusState === QuickStartTaskStatus.FAILED}
          onChange={() => onTaskReviewChange(QuickStartTaskStatus.FAILED)}
        />
      </span>
      {taskStatus === QuickStartTaskStatus.FAILED && taskHelp && (
        <div dangerouslySetInnerHTML={{ __html: taskHelp }} />
      )}
    </Alert>
  );
};
