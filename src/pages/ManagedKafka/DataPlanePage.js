import React  from 'react';
const MkDataPlaneCreateTopic = React.lazy(() => import("strimziUi/Panels/CreateTopic.patternfly"));
const MkDataPlaneTopics = React.lazy(() => import("strimziUi/Panels/Topics.patternfly"));
import { CompleteTaskModal, IncompleteTaskModal } from "../tutorial/task/closeDialog";
import { AppDrawerContext } from "../../AppDrawerContext";

export const DataPlanePage = (props) => {

  const { quickstartId } = props;

  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const [qsState, setQsState] = React.useState("Unknown");

  const drawerContext = React.useContext(AppDrawerContext);

  const onConfirm = () => {
    setShowConfirmDialog(false);
    drawerContext.setDrawerOpen(false);
  };

  const onClose = () => {
    setShowConfirmDialog(false);
  }

  const onQuickstartClose = () => {
    setShowConfirmDialog(true);
  };

  const onQuickstartChange = (value) => {
    let status = "Unknown";
    if (value[quickstartId].status === "Complete") {
      status = "Success";
      let i = 0;
      let key = `taskStatus${i}`;
      while (value[quickstartId][key]) {
        if (value[quickstartId][key] === "Failed") {
          status = "Failed";
          break;
        }
        i += 1;
        key = `taskStatus${i}`;
      }
    }
    setQsState(status)
  };

  const [showCreateTopic, setShowCreateTopic] = React.useState(false);

  const [topics, setTopics] = React.useState([]);

  const onCreateTopic = () => {
    setShowCreateTopic(true);
  }

  const onCloseCreateTopic = () => {
    console.log("on close");
    setShowCreateTopic(false);
  }

  const onSaveTopic = (topic) => {
    setTopics(topics.concat([topic]));
  }

  const MkDataPlaneProps = {
    getApiOpenshiftComToken: () => Promise.resolve('token'),
    getToken: () => Promise.resolve('token'),
    id: "test",
    // apiBasePath: 'https://api.stage.openshift.com/api/managed-services-strimzi-ui/v1',
    apiBasePath: 'http://localhost:9080',
    // apiBasePath: 'http://strimzi.admin.hostname.com',
    onCloseCreateTopic,
    onCreateTopic,
    onQuickstartChange,
    onQuickstartClose,
    ...props
  };

  const getDialog = () => {
    if (qsState !== "Success") {
      return <IncompleteTaskModal onConfirm={onConfirm} onClose={onClose} />;
    } else {
      return <CompleteTaskModal onConfirm={onConfirm} onClose={onClose} />;
    }
  }

  const getUi = () => {
    if (showCreateTopic) {
      return <MkDataPlaneCreateTopic {...MkDataPlaneProps} onSaveTopic={onSaveTopic} />;
    } else {
      return <MkDataPlaneTopics {...MkDataPlaneProps} topics={topics} />;
    }
  }

  return (
    <>
      {getUi()}
      {showConfirmDialog ? getDialog() : <></>}
    </>
  );
}
